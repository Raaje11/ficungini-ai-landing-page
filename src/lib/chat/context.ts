/**
 * Answers from the website itself. The context compiler (scripts/compile-context.mjs) turns the
 * published pages into small facts; this ranks them against a question and replies with the
 * matching text and a link to the page. It is the last stop before Fico says she does not know,
 * so anything the site says can be answered even when no topic was written for it.
 */
import facts from "./site-facts.json" with { type: "json" };
import { rankSite } from "./semantic";
import type { SiteFact } from "./semantic";
import type { ChatSpec } from "./types";

const ALL = (facts as { facts: SiteFact[] }).facts;

/** How much of the question a fact must account for before it is used. */
const MIN_COVERAGE = 0.6;
const MAX_WORDS = 85;

const isProse = (s: string) => s.split(" ").length >= 6 || /[.!?]$/.test(s);

/** What to show for a fact: its heading and the prose under it, without the list of labels that follows. */
function readable(f: SiteFact): string {
  const prose = f.parts.filter(isProse);
  let shown: string[];
  if (!prose.length) shown = f.parts;
  else {
    // The heading, then the prose that follows it, stopping at the first label after the prose.
    const start = f.parts.findIndex(isProse);
    let end = start;
    while (end + 1 < f.parts.length && isProse(f.parts[end + 1])) end++;
    shown = [...(f.heading && f.parts[0] === f.heading ? [f.heading] : []), ...f.parts.slice(start, end + 1)];
  }
  const [head, ...rest] = shown;
  const body = f.heading && head === f.heading && rest.length ? `**${head}**: ${rest.join(" ")}` : shown.join(" ");
  const words = body.split(/\s+/);
  return words.length > MAX_WORDS ? `${words.slice(0, MAX_WORDS).join(" ")}…` : body;
}

export interface SiteAnswer {
  reply: string;
  ids: string[];
  /** Where the answer comes from. */
  url: string;
  coverage: number;
  /** How many of the question's own words the fact contains. */
  literal: number;
}

/** Pages about the company rather than the product. Written topics cover them, and a team page must never answer a question about the service. */
const ORGANISATION_PAGES = new Set(["/company"]);

/** The best answer the website gives to a question, or null when it does not cover it. */
export function siteAnswer(spec: ChatSpec, question: string, pool: SiteFact[] = ALL): SiteAnswer | null {
  const ranked = rankSite(spec, pool, question);
  const byId = new Map(pool.map((f) => [f.id, f]));
  const credible = ranked.filter((r) => r.coverage >= MIN_COVERAGE && r.matches >= 2 && r.literal >= 1 && !ORGANISATION_PAGES.has(byId.get(r.id)!.url));
  const top = credible[0];
  if (!top) return null;
  const first = byId.get(top.id) as SiteFact;
  // A second fact is added only when it is nearly as relevant and says something different.
  const second = credible.slice(1).find((r) => r.score >= top.score * 0.85 && byId.get(r.id)?.url === first.url);
  const used = [first, ...(second ? [byId.get(second.id) as SiteFact] : [])];
  const body = used.map(readable).join("\n\n");
  return {
    reply: `${body}\n\nMore: [${first.page}](${first.url})`,
    ids: used.map((f) => f.id),
    url: first.url,
    coverage: Math.round(top.coverage * 100) / 100,
    literal: top.literal,
  };
}

export const siteFactCount = ALL.length;
export { ALL as siteFacts };
