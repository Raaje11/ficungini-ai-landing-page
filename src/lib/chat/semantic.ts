/**
 * Semantic matching and intent scoring, without a language model.
 *
 * A question is matched to what Fico knows by meaning rather than by exact
 * wording, using methods that are deterministic and inspectable:
 *   1. normalisation: lower-casing, light stemming, stop-word removal;
 *   2. a concept thesaurus (spec.semantic.concepts) that maps different words
 *      for the same idea, such as "cost", "price" and "how much", to one concept;
 *   3. typo repair against the vocabulary of what Fico knows;
 *   4. BM25 ranking of every topic, route and policy summary against the question,
 *      where a word nobody knows about lowers confidence instead of being ignored;
 *   5. a decision: answer when there is a clear winner, ask "did you mean" when two
 *      are close, and say nothing when confidence is low.
 * Every decision comes with its scores so it can be audited and recalibrated.
 */
import type { ChatSpec } from "./types";

export type DocKind = "knowledge" | "legal" | "route" | "site";

export interface Ranked {
  id: string;
  kind: DocKind;
  /** BM25 relevance, used to order candidates. */
  score: number;
  /** The share of the question's meaning this candidate accounts for, 0 to 1. Unknown words count against it. */
  coverage: number;
  /** How many distinct words or ideas of the question it matched. */
  matches: number;
  /** How many of those were the word itself, not just an idea it shares. */
  literal: number;
}

export type Decision =
  | { status: "answer"; top: Ranked; ranked: Ranked[] }
  | { status: "clarify"; options: Ranked[]; ranked: Ranked[] }
  | { status: "none"; ranked: Ranked[] };

interface Doc {
  id: string;
  kind: DocKind;
  tf: Map<string, number>;
  length: number;
  /** The words the document is about (its keywords), as opposed to words that merely occur in its answer. */
  about: Set<string>;
}

interface Index {
  docs: Doc[];
  idf: Map<string, number>;
  vocab: Set<string>;
  avgLength: number;
  /** surface form (stemmed words joined by a space) to concept */
  concepts: Map<string, string>;
  maxConceptWords: number;
}

const STOP = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "am", "do", "does", "did", "of", "to", "in", "on", "for", "and", "or", "my", "i", "me",
  "it", "its", "this", "that", "these", "those", "with", "at", "by", "as", "so", "if", "you", "your", "yours", "we", "our", "us", "can", "could", "would",
  "will", "shall", "should", "please", "like", "all", "also", "just", "then", "there", "here", "about", "some", "any", "from", "have", "has", "had", "get",
  "want", "need", "know", "let", "us", "kind", "sort", "really", "very", "much", "many", "more", "most", "other", "own", "same", "such", "than", "too",
  "into", "out", "up", "down", "over", "under", "again", "once", "what", "which", "who", "whom", "how", "when", "where", "why", "tell", "explain",
  "describe", "list", "show", "give", "say", "see", "look", "think",
  // describing words that carry no topic
  "small", "big", "large", "good", "great", "new", "old", "quick", "easy", "simple", "different", "main", "two", "three", "every", "each",
  "everything", "across", "between", "happen", "come", "live", "lives", "living", "thing", "things", "way", "bit", "lot", "etc", "yes", "no", "ok", "hello", "hi",
]);

/** A light stemmer: enough to treat "devices", "monitoring" and "monitored" alike. */
export function stem(raw: string): string {
  let w = raw.replace(/'s$/, "");
  if (w.length <= 3) return w;
  if (/ies$/.test(w) && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (/sses$/.test(w)) w = w.slice(0, -2);
  else if (/(ing|ed)$/.test(w) && w.length > 4) {
    w = w.replace(/(ing|ed)$/, "");
    if (/(.)\1$/.test(w)) w = w.slice(0, -1);
  } else if (/ly$/.test(w) && w.length > 5) w = w.slice(0, -2);
  else if (/(ch|sh|x|z|s)es$/.test(w)) w = w.slice(0, -2);
  else if (/s$/.test(w) && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
  // price, priced and pricing should agree, and so should hire, hired and hiring
  return w.length > 3 ? w.replace(/e$/, "") : w;
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'.\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.replace(/^[.\-']+|[.\-']+$/g, ""))
    .filter(Boolean);
}

function levenshtein(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Turns text into the things that are matched. Each word, or multi-word phrase for an
 * idea such as "how much", becomes one group of alternatives (its stem and its concept),
 * so a word is counted once however it is matched.
 */
function groupsOf(text: string, index: Pick<Index, "concepts" | "maxConceptWords">): string[][] {
  const raws = words(text);
  const stems = raws.map(stem);
  const groups: string[][] = [];
  for (let i = 0; i < stems.length; ) {
    let used = 1;
    let concept: string | undefined;
    for (let n = Math.min(index.maxConceptWords, stems.length - i); n >= 1; n--) {
      concept = index.concepts.get(stems.slice(i, i + n).join(" "));
      if (concept) {
        used = n;
        break;
      }
    }
    const alternatives: string[] = [];
    if (concept) alternatives.push(`c:${concept}`);
    // Stop words are checked as written: the stemmer drops a final "e", which would hide "have" or "live".
    if (used === 1 && !STOP.has(raws[i]) && !STOP.has(stems[i]) && stems[i].length > 1) alternatives.push(stems[i]);
    if (alternatives.length) groups.push(alternatives);
    i += used;
  }
  return groups;
}

/** Every token the text can match, for building documents. */
function tokenize(text: string, index: Pick<Index, "concepts" | "maxConceptWords">): string[] {
  return groupsOf(text, index).flat();
}

const cache = new WeakMap<ChatSpec, Index>();

function buildIndex(spec: ChatSpec): Index {
  const hit = cache.get(spec);
  if (hit) return hit;

  const concepts = new Map<string, string>();
  let maxConceptWords = 1;
  for (const [name, forms] of Object.entries(spec.semantic.concepts)) {
    for (const f of forms) {
      const key = words(f).map(stem).join(" ");
      if (!key) continue;
      concepts.set(key, name);
      maxConceptWords = Math.max(maxConceptWords, key.split(" ").length);
    }
  }
  const base = { concepts, maxConceptWords };

  // [text, weight]: the keywords say what a topic is about, so they count most; the answer adds context.
  const parts = (keywords: string[], id: string, answer: string): [string, number][] => [
    [`${keywords.join(" ")} ${id.replace(/_/g, " ")}`, 2],
    [answer.split(/\s+/).slice(0, 28).join(" "), 1],
    [answer.split(/\s+/).slice(28).join(" "), 0.4],
  ];
  const sources: { id: string; kind: DocKind; parts: [string, number][] }[] = [];
  for (const t of spec.knowledge.topics) sources.push({ id: t.id, kind: "knowledge", parts: parts(t.keywords, t.id, t.answer) });
  for (const t of spec.legal.topics) sources.push({ id: t.id, kind: "legal", parts: parts(t.keywords, t.id, t.answer) });
  for (const r of spec.route_catalog) sources.push({ id: r.id, kind: "route", parts: [[`${r.label} ${r.phrases.join(" ")}`, 2]] });

  const index = indexOf(base, sources, false);
  cache.set(spec, index);
  return index;
}

/** Builds the searchable index from documents made of weighted text parts. */
function indexOf(
  base: Pick<Index, "concepts" | "maxConceptWords">,
  sources: { id: string; kind: DocKind; parts: [string, number][] }[],
  aboutAll: boolean,
): Index {
  const docs: Doc[] = sources.map((src) => {
    const tf = new Map<string, number>();
    const about = new Set<string>();
    src.parts.forEach(([text, weight], i) => {
      for (const tok of tokenize(text, base)) {
        tf.set(tok, (tf.get(tok) ?? 0) + weight);
        if (i === 0 || aboutAll) about.add(tok);
      }
    });
    let length = 0;
    for (const v of tf.values()) length += v;
    return { id: src.id, kind: src.kind, tf, length, about };
  });

  const df = new Map<string, number>();
  for (const d of docs) for (const tok of d.tf.keys()) df.set(tok, (df.get(tok) ?? 0) + 1);
  const N = docs.length;
  const idf = new Map<string, number>();
  for (const [tok, n] of df) idf.set(tok, Math.log(1 + (N - n + 0.5) / (n + 0.5)));

  const index: Index = {
    docs,
    idf,
    vocab: new Set(df.keys()),
    avgLength: docs.reduce((s, d) => s + d.length, 0) / Math.max(1, docs.length),
    ...base,
  };
  return index;
}

const siteCache = new WeakMap<object, Index>();

/** A fact compiled from the website, see scripts/compile-context.mjs. */
export interface SiteFact {
  id: string;
  url: string;
  page: string;
  heading: string;
  /** The pieces of text in the order the page shows them. */
  parts: string[];
  text: string;
}

function siteIndex(spec: ChatSpec, facts: SiteFact[]): Index {
  const hit = siteCache.get(facts);
  if (hit) return hit;
  const { concepts, maxConceptWords } = buildIndex(spec);
  const sources = facts.map((f) => {
    const w = f.text.split(/\s+/);
    return {
      id: f.id,
      kind: "site" as const,
      parts: [
        [`${f.heading} ${f.page}`, 2],
        [w.slice(0, 40).join(" "), 1],
        [w.slice(40).join(" "), 0.6],
      ] as [string, number][],
    };
  });
  const index = indexOf({ concepts, maxConceptWords }, sources, true);
  siteCache.set(facts, index);
  return index;
}

/** Ranks the facts compiled from the website against a question. */
export function rankSite(spec: ChatSpec, facts: SiteFact[], query: string): Ranked[] {
  return rankIn(siteIndex(spec, facts), query, ["site"]);
}

/** The nearest known word for one that is not known, to repair a typo. */
function repair(token: string, index: Index): string {
  if (token.startsWith("c:") || index.vocab.has(token) || token.length < 5) return token;
  const limit = token.length > 7 ? 2 : 1;
  let best: { word: string; d: number } | null = null;
  let tie = false;
  for (const v of index.vocab) {
    if (v.startsWith("c:") || Math.abs(v.length - token.length) > limit) continue;
    const d = levenshtein(token, v, limit);
    if (d > limit) continue;
    if (!best || d < best.d) {
      best = { word: v, d };
      tie = false;
    } else if (d === best.d && v !== best.word) {
      tie = true;
    }
  }
  return best && !tie ? best.word : token;
}

const K1 = 1.2;
const B = 0.4;

/** Ranks everything Fico knows against a question. */
export function rank(spec: ChatSpec, query: string, kinds: DocKind[]): Ranked[] {
  return rankIn(buildIndex(spec), query, kinds);
}

function rankIn(index: Index, query: string, kinds: DocKind[]): Ranked[] {
  const groups = groupsOf(query, index)
    .map((g) => g.map((tok) => repair(tok, index)))
    .filter((g, i, all) => g.length > 0 && all.findIndex((o) => o.join("|") === g.join("|")) === i);
  if (!groups.length) return [];

  // A word nobody knows counts against the question: it is the part Fico cannot answer.
  const unknownIdf = Math.max(...index.idf.values()) * 1.5;
  const known = (g: string[]) => g.filter((tok) => index.idf.has(tok));
  const weight = (g: string[]) => (known(g).length ? Math.max(...known(g).map((tok) => index.idf.get(tok) as number)) : unknownIdf);
  const total = groups.reduce((s, g) => s + weight(g), 0);
  if (total <= 0) return [];

  const ranked: Ranked[] = [];
  for (const d of index.docs) {
    if (!kinds.includes(d.kind)) continue;
    let score = 0;
    let matched = 0;
    let matches = 0;
    let literal = 0;
    for (const g of groups) {
      // The best way this document matches the word, once.
      let best = 0;
      let bestIdf = 0;
      let bestTok = "";
      for (const tok of g) {
        const tf = d.tf.get(tok);
        if (!tf) continue;
        const idf = index.idf.get(tok) as number;
        const norm = tf + K1 * (1 - B + (B * d.length) / index.avgLength);
        const s = idf * ((tf * (K1 + 1)) / norm);
        if (s > best) {
          best = s;
          bestIdf = idf;
          bestTok = tok;
        }
      }
      score += best;
      if (best > 0) {
        matched += bestIdf;
        matches++;
        // Counts only when the word is what the topic is about, not just a word in its answer.
        if (!bestTok.startsWith("c:") && d.about.has(bestTok)) literal++;
      }
    }
    // A candidate that accounts for more of the question ranks above one that matches a single word strongly.
    const coverage = Math.min(1, matched / total);
    if (score > 0) ranked.push({ id: d.id, kind: d.kind, score: score * coverage, coverage, matches, literal });
  }
  return ranked.sort((a, b) => b.score - a.score);
}

/** What to do with a ranking: answer, ask which of two was meant, or leave it. */
export function decide(spec: ChatSpec, ranked: Ranked[]): Decision {
  const th = spec.semantic.thresholds;
  // Only candidates that account for enough of the question are considered at all.
  const credible = ranked.filter((r) => r.coverage >= th.min_coverage && r.matches >= th.min_matches && (r.literal >= 1 || r.matches >= 3));
  const [first, second] = credible;
  if (!first) return { status: "none", ranked };
  const margin = second ? (first.score - second.score) / first.score : 1;
  if (margin >= th.min_margin) return { status: "answer", top: first, ranked };
  const close = credible.filter((r) => r.score >= first.score * (1 - th.min_margin)).slice(0, 3);
  return close.length > 1 ? { status: "clarify", options: close, ranked } : { status: "answer", top: first, ranked };
}
