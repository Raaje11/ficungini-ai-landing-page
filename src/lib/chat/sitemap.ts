/**
 * "Find the pricing section", "where is the Platform page", "take me to the team": a request to be shown
 * somewhere on the site. It needs an explicit cue (find, show me, take me, where is, open, go to) and
 * a place the site map can name, so an ordinary question that happens to start with "where" is never
 * taken for one. The place is ranked against the site map with the same ranker as everything else,
 * so "pricing", "the pricing section" and "plans" all find the same place.
 */
import { siteFacts } from "./context";
import { rankSite } from "./semantic";
import type { SiteFact } from "./semantic";
import type { ChatSpec, SiteDestination } from "./types";

export type SiteMatch = { kind: "go"; dest: SiteDestination } | { kind: "choose"; options: SiteDestination[] };

/** The words that ask to be shown or taken somewhere. */
const CUE =
  /\b(find|wheres|where (?:is|are|can i find|do i find|would i find|can i see)|show me|show|take me|bring me|go to|open|navigate to|head to|jump to|scroll to|look for|link to|point me to|direct me to|i (?:want|would like|need) to (?:see|go to|open|visit)|visit|get me to|lead me to)\b/g;

/** Words around the place that say nothing about which place it is. */
const NOISE = new Set([
  "the", "a", "an", "me", "my", "to", "for", "of", "on", "in", "at", "page", "pages", "section", "site", "website", "web", "part", "area", "link", "please",
  "pls", "can", "could", "would", "you", "i", "want", "need", "like", "see", "there", "here", "your", "our", "is", "are", "it", "this", "that", "do", "some", "any",
  "something", "tab", "screen", "thing", "info", "information", "about",
]);

/**
 * To find something the site *says* (a heading, a plan, a line of text) the request has to be about where
 * something is, not what it is. "Show me how discovery works" is a question and is answered;
 * "where does it say how discovery works" is a request to be pointed at the text.
 */
const LOCATE =
  /\b(find|locate|wheres|where (?:is|are|can i find|do i find|does it say|is it|can i see|would i find)|take me to|bring me to|go to|point me to|scroll to|navigate to|jump to|look for|lead me to|direct me to)\b/g;

/**
 * How sure a match must be. A place is taken when it explains this much of what was asked for and clearly
 * beats the next; below `offer` the places that fit are offered to choose between instead.
 */
const NAV = { min_coverage: 0.75, min_margin: 0.25, offer_coverage: 0.6 };
const LOC = { min_coverage: 0.75, min_margin: 0.25, min_matches: 2 };

const plain = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** What is left of a request once the asking words and the filler are taken out: the thing itself. */
const subject = (t: string, cue: RegExp) =>
  t
    .replace(cue, " ")
    .split(" ")
    .filter((w) => w && !NOISE.has(w))
    .join(" ");

/** A name with its filler taken out, to compare with what was asked for: "the platform page" and "platform" are the same place. */
const core = (name: string) => subject(plain(name), /$^/g);

/** The site map as facts, so places are ranked the same way as everything else the site says. */
const placeFacts = new WeakMap<ChatSpec, SiteFact[]>();

function placesOf(spec: ChatSpec): SiteFact[] {
  let facts = placeFacts.get(spec);
  if (!facts) {
    facts = spec.site_map.map((d) => ({
      id: d.id,
      url: d.path + (d.hash ?? ""),
      page: d.label,
      heading: d.label,
      parts: d.keywords,
      text: d.keywords.join(" "),
    }));
    placeFacts.set(spec, facts);
  }
  return facts;
}

/** The place a message asks to be shown, or null when it is not such a request. */
export function findOnSite(spec: ChatSpec, text: string): SiteMatch | null {
  const t = plain(text);
  if (!t || t.split(" ").length > 14) return null;
  // "Where is your office" asks about the company, not for a page. Only the words page, section, link and the like mean the site.
  if (/\b(?:wheres|where (?:is|are))\b/.test(t) && /\b(?:your|you)\b/.test(t) && !/\b(?:page|section|tab|link|menu|button|site|website)\b/.test(t)) return null;
  return findPage(spec, t) ?? findContent(spec, t);
}

/** A page or section from the site map: "take me to the pricing section". */
function findPage(spec: ChatSpec, t: string): SiteMatch | null {
  CUE.lastIndex = 0;
  if (!CUE.test(t)) return null;
  const wanted = subject(t, CUE);
  if (!wanted) return null;

  // A place that goes by exactly this name is the one asked for, however many others share some of its words.
  const named = spec.site_map.filter((d) => [d.label, ...d.keywords].some((k) => core(k) === wanted));
  if (named.length === 1) return { kind: "go", dest: named[0] };

  const byId = new Map(spec.site_map.map((d) => [d.id, d]));
  const ranked = rankSite(spec, placesOf(spec), wanted).filter((r) => r.coverage >= NAV.offer_coverage);
  const [first, second] = ranked;
  if (!first) return null;

  const clear = first.coverage >= NAV.min_coverage && (!second || (first.score - second.score) / first.score >= NAV.min_margin);
  if (clear) return { kind: "go", dest: byId.get(first.id) as SiteDestination };

  const options = ranked
    .filter((r) => r.score >= first.score * (1 - NAV.min_margin))
    .slice(0, 3)
    .map((r) => byId.get(r.id) as SiteDestination);
  return options.length > 1 ? { kind: "choose", options } : first.coverage >= NAV.min_coverage ? { kind: "go", dest: options[0] } : null;
}

/** The piece of a fact that best matches what was asked for: the "Business" card, not just the heading above it. */
function pointOf(fact: SiteFact, wanted: string): string {
  const asked = new Set(wanted.split(" ").filter((w) => w.length > 2));
  let best = { text: fact.heading, hits: 0 };
  for (const part of fact.parts) {
    if (part.length < 3 || part.length > 90 || /\|\s*Ficungini\s*$/i.test(part)) continue;
    const hits = plain(part).split(" ").filter((w) => asked.has(w)).length;
    if (hits > best.hits || (hits === best.hits && hits > 0 && part.length < best.text.length)) best = { text: part, hits };
  }
  return best.text;
}

/** Where to take someone for a fact the site states: its page, and the text on it to point at. */
function destinationOf(fact: SiteFact, wanted: string): SiteDestination {
  // A fact headed with the page's own title has nothing more specific to point at than the page.
  const generic = /\|\s*Ficungini\s*$/i.test(fact.heading);
  const page = fact.page === "Home page" ? "the home page" : fact.page;
  const point = generic ? undefined : pointOf(fact, wanted);
  const [path, hash] = fact.url.split("#");
  return {
    id: `fact:${fact.id}`,
    label: point ? `“${point}” on ${page}` : page,
    path,
    hash: hash ? `#${hash}` : undefined,
    find: point,
    keywords: [],
  };
}

/**
 * Anything the site says: "where does it say how corrigenda are handled", "find the Business plan".
 * Ranked against the facts the site's own text is compiled into, so whatever is published can be pointed at.
 */
function findContent(spec: ChatSpec, t: string): SiteMatch | null {
  LOCATE.lastIndex = 0;
  // "Find out why..." is a question, not a place, and "where is my request" is about the visitor's own things, not the site.
  if (/\bfind out\b/.test(t) || /\b(my|our|mine)\b/.test(t) || !LOCATE.test(t)) return null;
  const wanted = subject(t, LOCATE);
  if (!wanted) return null;

  const ranked = rankSite(spec, siteFacts, wanted).filter((r) => r.coverage >= LOC.min_coverage && r.matches >= LOC.min_matches && r.literal >= 1);
  const [top] = ranked;
  if (!top) return null;
  const byId = new Map(siteFacts.map((f) => [f.id, f]));
  const first = byId.get(top.id) as SiteFact;

  // Two different pages that fit equally well: ask which. Several facts on one page: take the best.
  const rival = ranked.find((r) => byId.get(r.id)?.url !== first.url);
  if (rival && (top.score - rival.score) / top.score < LOC.min_margin) {
    return { kind: "choose", options: [destinationOf(first, wanted), destinationOf(byId.get(rival.id) as SiteFact, wanted)] };
  }
  return { kind: "go", dest: destinationOf(first, wanted) };
}
