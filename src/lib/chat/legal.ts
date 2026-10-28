/**
 * What Fico can say about the Privacy Policy and Terms of Use. Every answer is
 * a fixed summary of the published text, written in the spec with the section it
 * comes from, and always ends by pointing to the full document. Nothing here is
 * improvised, and nothing is legal advice.
 */
import type { ChatSpec } from "./types";
import { isQuestion } from "./smalltalk";

const clean = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'& ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Words that show the question is about our policies at all, so a topic can answer it. */
const POLICY_WORDS =
  /\b(privacy|terms of use|terms and conditions|terms|tou|policy|policies|personal data|personal information|data protection|legal|dpdp|gdpr|my data|your data|our data|my information|my details|my records|t&c)\b/;

/** Words that only point at the policies themselves, enough for the general pointer. */
const POLICY_ONLY = /\b(privacy|terms of use|terms and conditions|tou|policy|policies|legal|t&c)\b/;

const hasPhrase = (hay: string, phrase: string) => {
  const p = clean(phrase);
  return ` ${hay} `.includes(` ${p} `) || ` ${hay} `.includes(` ${p}s `);
};

/** The best matching policy summary for a question, with how well it matched. */
export function legalMatch(spec: ChatSpec, text: string): { score: number; reply: string } | null {
  const t = clean(text);
  if (!t || t.length > 200) return null;
  const legal = spec.legal;
  const policyWords = POLICY_WORDS.test(t);
  const question = isQuestion(text);

  let best: { score: number; topic: (typeof legal.topics)[number] } | null = null;
  for (const topic of legal.topics) {
    // A topic that stands on its own needs a question, a general one needs the policy to be named.
    if (!(policyWords || (topic.standalone && question))) continue;
    const score = topic.keywords.reduce((s, k) => (hasPhrase(t, k) ? s + k.split(" ").length : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, topic };
  }

  if (!best) return null;
  const src = legal.sources[best.topic.policy];
  const where = best.topic.section === "-" ? src.label : `${src.label}, section ${best.topic.section}`;
  return { score: best.score, reply: `${best.topic.answer}\n\n${legal.disclaimer} Full text: [${where}](${src.path})` };
}

/** Whether a policy topic may answer this question: it names the policies, or the topic stands on its own and this is a question. */
export function legalAllowed(spec: ChatSpec, id: string, text: string): boolean {
  const topic = spec.legal.topics.find((t) => t.id === id);
  if (!topic) return false;
  return POLICY_WORDS.test(clean(text)) || (topic.standalone && isQuestion(text));
}

/** The summary for a policy topic by id, with its disclaimer and link. */
export function legalReplyFor(spec: ChatSpec, id: string): string | null {
  const topic = spec.legal.topics.find((t) => t.id === id);
  if (!topic) return null;
  const src = spec.legal.sources[topic.policy];
  const where = topic.section === "-" ? src.label : `${src.label}, section ${topic.section}`;
  return `${topic.answer}

${spec.legal.disclaimer} Full text: [${where}](${src.path})`;
}

/** A summary of the policies for a question about them, or null when it is not one. */
export function answerLegal(spec: ChatSpec, text: string): string | null {
  const match = legalMatch(spec, text);
  if (match) return match.reply;
  return POLICY_ONLY.test(clean(text)) ? spec.legal.general : null;
}
