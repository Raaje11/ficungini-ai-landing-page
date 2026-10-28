/** Type-ahead phrases shown above the composer. Plain string matching, no model. */

const PHRASES = [
  "What does Ficungini do?",
  "What is a Go/No-Go recommendation?",
  "How is pricing calculated?",
  "How much does the Individual plan cost?",
  "What is in the Business plan?",
  "Is there a free analysis?",
  "What happens after my daily free analysis?",
  "Is my tender data secure?",
  "Is my data used to train AI models?",
  "What happens to my data when a tender closes?",
  "Can multiple people collaborate on a bid?",
  "Does it work for private and public tenders?",
  "How does the ERP integration work?",
  "How does tender discovery work?",
  "Can I opt out of discovery?",
  "How does it find disqualification clauses?",
  "Does it track corrigenda?",
  "Will a human review the results?",
  "Who owns my tender documents?",
  "Can I rely on the outputs?",
  "Tell me about the Privacy Policy",
  "Tell me about the Terms of Service",
  "Who built Ficungini?",
  "What are Bid Analysis and Craft Bid?",
  "Take me to pricing",
  "Where is the platform page?",
  "Show me the team",
  "Give me a tour of the site",
  "Book a demo",
  "Talk to a person",
  "Contact the team",
  "What can you do?",
  "Who are you?",
  "Start over",
];

/** The @ commands, in the order they are offered. Each does one thing; see the chat session. */
export const COMMANDS = ["@navigate", "@seek", "@contact"] as const;

/** The commands that complete what has been typed after an @, other than one already typed in full. */
export function commandSuggestions(draft: string): string[] {
  const d = draft.toLowerCase();
  if (!/^@[a-z]*$/.test(d)) return [];
  return COMMANDS.filter((c) => c.startsWith(d) && c !== d);
}

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** Up to `limit` phrases that match what the person has typed so far. */
export function suggest(query: string, extra: string[] = [], limit = 4): string[] {
  const q = clean(query);
  if (!q) return [];
  const tokens = q.split(" ");
  const seen = new Set<string>();
  const scored: { text: string; score: number }[] = [];

  [...extra, ...PHRASES].forEach((text, i) => {
    const c = clean(text);
    if (seen.has(c) || c === q) return;
    seen.add(c);
    const words = c.split(" ");
    const hits = tokens.every((t, n) =>
      n === tokens.length - 1 ? words.some((w) => w.startsWith(t)) : words.includes(t),
    );
    if (!hits) return;
    let score = 1;
    if (c.startsWith(q)) score += 4;
    else if (c.includes(q)) score += 2;
    if (i < extra.length) score += 1; // options for the current question come first
    scored.push({ text, score });
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.text);
}
