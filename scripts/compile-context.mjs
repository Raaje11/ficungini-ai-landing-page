/**
 * Context compiler: turns what the website says into small facts Fico can answer from.
 *
 * It reads the visible text of the site's pages (headings, paragraphs, lists, product
 * specifications and the data behind them), drops styling and code strings, groups what
 * belongs together under its heading, and writes src/lib/chat/site-facts.json. Fico ranks those
 * facts against a question and answers from them, with a link to the page. Nothing is
 * generated: every answer is text that is published on the site.
 *
 * Run `bun run compile:context` after changing a page.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SRC = join(ROOT, "src");

/**
 * Components that render real site content on a page. Not listed on purpose:
 *  - Hero, Benchmarks, Testimonials, VideoReviews: sample workspace figures, scores and quotes
 *    that illustrate the product rather than state facts about it;
 *  - Navbar, Footer, Modals, FinalCta, StaticPageShell, LegalDocument: navigation, form labels
 *    and layout, or text that already comes from the policies.
 */
const COMPONENTS = ["WhyFicungini", "Challenges", "Pricing", "Faq", "PlatformExplorer"];
/** Pages whose text is covered by dedicated, reviewed summaries instead. */
const SKIP_PAGES = new Set(["privacy", "terms", "documentation/blogs/[slug]"]);

const TAILWIND =
  /^(?:(?:sm|md|lg|xl|2xl|hover|focus|focus-visible|group-hover|dark|active|disabled|first|last|odd|even|peer|aria|data)[\w-]*:)*!?-?(?:flex|grid|text|bg|border|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|p|m|w|h|min|max|gap|rounded|font|leading|tracking|items|justify|absolute|relative|fixed|sticky|inline|block|hidden|overflow|z|inset|top|left|right|bottom|shadow|opacity|transition|duration|ease|space|col|row|object|cursor|select|pointer|sr|underline|uppercase|lowercase|capitalize|whitespace|fill|stroke|from|to|via|ring|outline|divide|order|aspect|size|shrink|grow|basis|self|place|content|align|animate|backdrop|blur|tabular|truncate|antialiased|italic|mono|container|transform|translate|scale|rotate|origin|list|break|decoration|underline-offset|resize|appearance|will|snap|scroll|touch|accent|caret|isolate|sm|md|lg)(?:-|$|\/|\[)/;

const decode = (s) =>
  s
    .replace(/&apos;|&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

const clean = (s) => decode(s).replace(/\\n/g, " ").replace(/\\(["'`])/g, "$1").replace(/\s+/g, " ").trim();
const wordCount = (s) => s.split(" ").length;

/** True for text a visitor reads, false for class names, paths, colours, identifiers and code. */
function isProse(s) {
  if (s.length < 3 || !/[A-Za-z]/.test(s)) return false;
  if (/^(\/|#|https?:|mailto:|tel:|@\/|\.\/|\.\.\/)/.test(s)) return false;
  if (/[{}]|=>|;|<|>|\$\{|^use (client|server)$/.test(s)) return false;
  if (/^[\w-]+\/[\w.+-]+$/.test(s)) return false; // mime types and paths
  if (/\.(png|jpe?g|svg|webp|pdf|ico|css|json|mjs|tsx?)$/i.test(s)) return false;
  if (/^[a-z]+([A-Z][a-z]*)+$/.test(s) || /^[a-z]+(_[a-z0-9]+)+$/.test(s)) return false; // camelCase, snake_case ids
  const tokens = s.split(" ");
  const styled = tokens.filter((t) => TAILWIND.test(t) || /^\[.*\]$/.test(t)).length;
  if (styled > 0 && styled / tokens.length >= 0.4) return false;
  if (tokens.length === 1 && /^[a-z0-9-]+$/.test(s)) return false; // single lower-case token: a key or id
  return true;
}

/** Visible text in source order: string literals, then JSX text. */
function extract(source) {
  let src = source
    .replace(/^import[\s\S]*?;\s*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
  // Attributes that never hold visible words.
  src = src.replace(/\b(className|class|href|src|id|key|type|rel|target|style|role|name|htmlFor|viewBox|d|fill|stroke|width|height|sizes|loading|decoding|method|action|autoComplete|inputMode|slug|image|cadAccent|icon|accent)=("[^"]*"|\{[^{}]*\})/g, "");
  src = src.replace(/\b(className|href|src|slug|image|cadAccent|icon|accent|slug)\s*:\s*("[^"]*"|'[^']*'|`[^`]*`)/g, "");
  const found = [];
  const lit = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\$]|\\.)*)`/g;
  const jsx = />([^<>{}]+)</g;
  for (const m of src.matchAll(lit)) found.push({ at: m.index, text: clean(m[1] ?? m[2] ?? m[3] ?? "") });
  for (const m of src.matchAll(jsx)) found.push({ at: m.index + 1, text: clean(m[1]) });
  return found
    .sort((a, b) => a.at - b.at)
    .map((f) => f.text)
    .filter(isProse);
}

/** Groups items under the label that introduces them, capped so each fact stays focused. */
function group(items, attributes) {
  const long = (t) => wordCount(t) >= 6 || /[.!?]$/.test(t);
  const out = [];
  let cur = null;
  const flush = () => {
    if (cur && cur.parts.length) out.push(cur);
    cur = null;
  };
  for (const item of items) {
    const words = cur ? cur.parts.join(" ").split(" ").length : 0;
    // A label after prose starts a new group; so does a group that has grown too long.
    if (cur && ((!long(item) && !attributes.has(item) && cur.hasLong) || words + wordCount(item) > 120)) flush();
    if (!cur) cur = { heading: long(item) ? "" : item, parts: [], hasLong: false };
    cur.parts.push(item);
    if (long(item)) cur.hasLong = true;
  }
  flush();
  return out.map((g) => ({ heading: g.heading, parts: g.parts, text: g.parts.join(" ").trim() }));
}

function listFiles() {
  const files = [];
  const appDir = join(SRC, "app");
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (name === "api") continue;
        walk(p);
      } else if (name === "page.tsx") files.push(p);
    }
  };
  walk(appDir);
  for (const c of new Set(COMPONENTS)) {
    const p = join(SRC, "components", "landing", `${c}.tsx`);
    if (existsSync(p)) files.push(p);
  }
  return files;
}

function pageOf(file) {
  const rel = relative(SRC, file).replace(/\\/g, "/");
  if (rel.endsWith("PlatformExplorer.tsx")) return { url: "/platform#explorer", name: "Platform", slug: "platform-explorer" };
  if (!rel.startsWith("app/")) return { url: "/", name: "Home page", slug: `home-${rel.replace(/^components\/landing\//, "").replace(/\.tsx$/, "").toLowerCase()}` };
  const dir = rel.replace(/^app\//, "").replace(/\/?page\.tsx$/, "");
  const src = readFileSync(file, "utf8");
  const title = /title:\s*"([^"|]+?)\s*(?:\|[^"]*)?"/.exec(src)?.[1];
  return { url: dir ? `/${dir}` : "/", name: dir ? title ?? dir : "Home page", slug: dir || "home" };
}

export function compile() {
  const seen = new Set();
  const facts = [];
  const pages = listFiles()
    .map((file) => ({ page: pageOf(file), items: extract(readFileSync(file, "utf8")) }))
    .filter((p) => !SKIP_PAGES.has(p.page.slug));
  // Labels that repeat across the site (Accuracy, Operating Range, ...) describe the item above them.
  const counts = new Map();
  for (const { items } of pages) for (const i of items) if (wordCount(i) <= 4) counts.set(i, (counts.get(i) ?? 0) + 1);
  const attributes = new Set([...counts].filter(([, n]) => n >= 4).map(([k]) => k));
  for (const { page, items } of pages) {
    group(items, attributes).forEach((g, i) => {
      const key = g.text.toLowerCase();
      // The same sentence in the header, footer and page is kept once.
      if (seen.has(key) || wordCount(g.text) < 3) return;
      seen.add(key);
      facts.push({
        id: `${page.slug}.${String(i + 1).padStart(3, "0")}`,
        url: page.url,
        page: page.name,
        heading: g.heading,
        parts: g.parts,
        text: g.text,
      });
    });
  }
  return { facts };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = compile();
  writeFileSync(join(SRC, "lib/chat/site-facts.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(`Compiled ${out.facts.length} facts from the site.`);
}
