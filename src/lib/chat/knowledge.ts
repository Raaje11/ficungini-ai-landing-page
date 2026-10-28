/**
 * What Fico knows about Ficungini: the platform, solutions, pricing, company and
 * policies as published on the website. Every answer is a fixed summary written
 * in the spec, with a link to the page it comes from. Nothing is improvised: a
 * question that matches no topic is declined, and a question that touches a
 * subject the site does not document is declined even if it also resembles a
 * documented one.
 */
import type { ChatSpec } from "./types";
import { isQuestion } from "./smalltalk";
import { legalMatch, answerLegal, legalReplyFor, legalAllowed } from "./legal";
import { decide, rank } from "./semantic";
import type { Ranked } from "./semantic";
import { siteAnswer } from "./context";
import type { SiteAnswer } from "./context";

const clean = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'&.\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** The customer is asking to be told something, not describing a problem. */
const EXPLAIN_CUE =
  /\b(explain|tell me|describe|compare|difference|overview|know about|learn about|show me|i want to know|i would like to know|i need to know|can you explain|could you explain|information on|info on|details of|what are|what is|what's|whats|list|give me|which|why)\b/;

/** Something the website does not document. A question about these is declined. */
const NOT_DOCUMENTED = /\b(sso|saml|soc ?2|iso ?27001|hipaa|on prem\w*|self host\w*|mobile app|android|ios|iphone|slack|whatsapp|zapier|power bi|tableau|uptime|sla)\b/;

/** A problem being described, not something being asked about. */
const PROBLEM =
  /\b(not working|broken|faulty|stopped|failed|failure|error|isn't|isnt|won't|wont|can't log|cant log|cannot log|locked out|bug|crash\w*|keeps)\b/;
const ASKING = /^(what|whats|what's|how|which|can you explain|could you explain|tell me|explain|describe)\b/;

const STOP = new Set(["the", "and", "for", "are", "you", "your", "its", "does", "can", "what", "whats", "what's", "about", "tell", "explain", "describe", "know", "want", "please", "more", "info", "information", "details", "overview", "have", "has", "with", "this", "that", "from", "any", "some", "ficungini", "platform"]);

/** A keyword matches whole words, allowing a plural. */
const hasPhrase = (hay: string, phrase: string) => {
  const p = clean(phrase);
  return ` ${hay} `.includes(` ${p} `) || ` ${hay} `.includes(` ${p}s `) || ` ${hay} `.includes(` ${p}es `);
};

/** Words in the question that no keyword of the topic accounts for. */
function leftover(t: string, keywords: string[]): number {
  const covered = new Set(keywords.filter((k) => hasPhrase(t, k)).flatMap((k) => clean(k).split(" ")));
  return t.split(" ").filter((w) => w.length > 2 && !STOP.has(w) && ![...covered].some((c) => w === c || w === `${c}s`)).length;
}

/** A topic's answer with the link to where it comes from. */
function topicReply(spec: ChatSpec, id: string): string | null {
  const topic = spec.knowledge.topics.find((x) => x.id === id);
  if (!topic) return legalReplyFor(spec, id);
  return `${topic.answer}\n\nMore: [${topic.source.label}](${topic.source.path})`;
}

/** How Fico understood a question, kept so the team can see why it answered as it did. */
export interface IntentTrace {
  text: string;
  via: "phrase" | "semantic" | "route" | "site";
  decision: "answer" | "clarify" | "none" | "route";
  top: { id: string; kind: string; coverage: number }[];
}

export type Understood =
  | { kind: "answer"; reply: string; trace: IntentTrace }
  | { kind: "clarify"; options: { id: string; label: string; reply: string }[]; trace: IntentTrace }
  | null;

const label = (id: string) => id.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/** The wording of a question matched exactly against the keywords of each topic. */
function phraseBest(spec: ChatSpec, text: string): { score: number; id: string; reply: string } | null {
  const t = clean(text);
  const cue = isQuestion(text) || EXPLAIN_CUE.test(t) || /\bficungini\b|\bfico\b/.test(t);
  let best: { score: number; id: string; reply: string } | null = null;
  if (cue) {
    for (const topic of spec.knowledge.topics) {
      let score = topic.keywords.reduce((s, k) => (hasPhrase(t, k) ? s + k.split(" ").length : s), 0);
      if (topic.generic) score *= 0.4;
      // Words in the question that the topic says nothing about: it is not what was asked.
      if (leftover(t, topic.keywords) > 2) continue;
      if (score > 0 && (!best || score > best.score)) best = { score, id: topic.id, reply: topicReply(spec, topic.id) as string };
    }
  }
  return best;
}

/** A broader cue for the semantic path, where wording is not expected to match. */
const ASKING_ANYWHERE = /\b(what|which|how|why|where|who|explain|tell|describe|list|show|give|know|like)\b/;

/**
 * Understands a question about Ficungini: exact wording first, then by meaning.
 * Returns an answer, a "did you mean" with the candidates, or null when it is not
 * confident enough to say anything.
 */
export function understand(spec: ChatSpec, text: string): Understood {
  const t = clean(text);
  if (!t || t.length > 220) return null;
  if (NOT_DOCUMENTED.test(t)) return null;
  if (PROBLEM.test(t) && !ASKING.test(t)) return null;

  const exact = phraseBest(spec, text);
  const legal = legalMatch(spec, text);
  if (legal && (!exact || legal.score > exact.score)) {
    return { kind: "answer", reply: legal.reply, trace: { text, via: "phrase", decision: "answer", top: [{ id: "legal", kind: "legal", coverage: 1 }] } };
  }
  if (exact) {
    return { kind: "answer", reply: exact.reply, trace: { text, via: "phrase", decision: "answer", top: [{ id: exact.id, kind: "knowledge", coverage: 1 }] } };
  }

  // Not worded the way a topic expects: match by meaning.
  if (!(isQuestion(text) || ASKING_ANYWHERE.test(t) || EXPLAIN_CUE.test(t))) return answerLegalTrace(spec, text);
  const usable = rank(spec, text, ["knowledge", "legal"]).filter((r: Ranked) => {
    const topic = spec.knowledge.topics.find((x) => x.id === r.id);
    if (!topic) return legalAllowed(spec, r.id, text);
    return true;
  });
  // A broad overview should not beat a topic that is specifically about what was asked.
  const adjusted = usable
    .map((r) => ({ ...r, score: r.score * (spec.knowledge.topics.find((x) => x.id === r.id)?.generic ? 0.6 : 1) }))
    .sort((a, b) => b.score - a.score);
  const decision = decide(spec, adjusted);
  const top = decision.ranked.slice(0, 3).map((r) => ({ id: r.id, kind: r.kind, coverage: Math.round(r.coverage * 100) / 100 }));
  // The website's own text may cover the question better than a written topic does: prefer it when it
  // accounts for clearly more of what was asked, or when the topics could not agree.
  const site = siteAnswer(spec, text);
  const best = decision.status === "none" ? null : decision.ranked[0];
  const topCoverage = best?.coverage ?? 0;
  if (
    site &&
    (!best ||
      site.coverage >= topCoverage + 0.05 ||
      // Equally complete, but the site names more of the words that were asked.
      (site.coverage >= topCoverage && site.literal >= best.literal + 2) ||
      (decision.status === "clarify" && site.coverage >= 0.9))
  ) {
    return siteUnderstood(text, site);
  }
  if (decision.status === "answer") {
    const reply = topicReply(spec, decision.top.id);
    if (reply) return { kind: "answer", reply, trace: { text, via: "semantic", decision: "answer", top } };
  }
  if (decision.status === "clarify") {
    const options = decision.options
      .map((o) => ({ id: o.id, label: label(o.id), reply: topicReply(spec, o.id) as string }))
      .filter((o) => o.reply);
    if (options.length > 1) return { kind: "clarify", options, trace: { text, via: "semantic", decision: "clarify", top } };
  }
  return answerLegalTrace(spec, text);
}

function siteUnderstood(text: string, site: SiteAnswer): Understood {
  return {
    kind: "answer",
    reply: site.reply,
    trace: { text, via: "site", decision: "answer", top: site.ids.map((id) => ({ id, kind: "site", coverage: site.coverage })) },
  };
}

/** The general pointer to the policies, for a question that names them but matches no topic. */
function answerLegalTrace(spec: ChatSpec, text: string): Understood {
  const reply = answerLegal(spec, text);
  return reply ? { kind: "answer", reply, trace: { text, via: "phrase", decision: "answer", top: [{ id: "legal_general", kind: "legal", coverage: 1 }] } } : null;
}
