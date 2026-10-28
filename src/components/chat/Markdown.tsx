import type { ReactNode } from "react";

/** Just enough markdown for the spec's templates: **bold**, "- " lists, "1. " lists. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(\/[^)\s]*\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Links to our own pages open in a new tab, so the conversation stays where it is.
    const link = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/.exec(part);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="font-medium text-(--oc-brand) underline underline-offset-2">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] };

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let cur: Block | null = null;
  const close = () => {
    cur = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      close();
      continue;
    }
    const bullet = line.match(/^- (.*)$/);
    const num = line.match(/^\d+\.\s+(.*)$/);
    const kind = bullet ? "ul" : num ? "ol" : "p";
    const content = bullet?.[1] ?? num?.[1] ?? line;
    if (kind === "p") {
      if (cur && cur.type === "p") cur.lines.push(content);
      else {
        cur = { type: "p", lines: [content] };
        blocks.push(cur);
      }
    } else if (cur && cur.type === kind) {
      cur.items.push(content);
    } else {
      cur = { type: kind, items: [content] };
      blocks.push(cur);
    }
  }
  return blocks;
}

export default function Markdown({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {parse(text).map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i}>
              {b.lines.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {inline(l)}
                </span>
              ))}
            </p>
          );
        }
        const Tag = b.type;
        return (
          <Tag
            key={i}
            className={`space-y-1.5 pl-5 ${b.type === "ul" ? "list-disc" : "list-decimal"} marker:text-(--oc-muted)`}
          >
            {b.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
