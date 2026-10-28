/**
 * The page-reading half of Fico showing someone around: finding a link on the page, working out
 * where the orb should hover next to something, and drawing the "click" and the highlight. These
 * touch the DOM only to read it and to add short-lived overlays that remove themselves; they never
 * change the page's own elements.
 */
import type { SiteDestination } from "@/lib/chat/types";

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Polls until `find` returns something, or gives up and returns null. */
export async function waitFor<T>(find: () => T | null | undefined | false, timeout = 5000, every = 80): Promise<T | null> {
  const end = Date.now() + timeout;
  for (;;) {
    const found = find();
    if (found) return found;
    if (Date.now() > end) return null;
    await wait(every);
  }
}

/** Rendered with a size, and not faded or hidden by it or anything around it. A closed menu's links are not visible. */
function isVisible(el: Element): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  for (let n: Element | null = el, i = 0; n && i < 10; n = n.parentElement, i++) {
    const cs = getComputedStyle(n);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05) return false;
  }
  return true;
}

const clean = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

/** A link on this page that goes where `dest` goes, preferring one already on screen. */
export function findLink(dest: SiteDestination): HTMLAnchorElement | null {
  const want = { path: clean(dest.path), hash: dest.hash ?? "" };
  const matches: HTMLAnchorElement[] = [];
  for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    if (a.closest('[role="dialog"]')) continue; // the chat's own links
    let u: URL;
    try {
      u = new URL(a.href, window.location.href);
    } catch {
      continue;
    }
    if (u.origin !== window.location.origin || clean(u.pathname) !== want.path || u.hash !== want.hash) continue;
    if (isVisible(a)) matches.push(a);
  }
  const onScreen = matches.find((a) => {
    const r = a.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight;
  });
  return onScreen ?? matches[0] ?? null;
}

/** The part of the destination page to point at: the section if it has one, otherwise the page's title. */
export function sectionOf(dest: SiteDestination): HTMLElement | null {
  if (dest.hash) return document.getElementById(dest.hash.slice(1));
  return document.querySelector<HTMLElement>("main h1, h1");
}

const squash = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * The element on this page whose text is `text`: a heading, a table cell, a line. Whole-text matches win over
 * ones that merely contain it, and what is hidden or belongs to the assistant itself is never picked.
 */
export function locateText(text: string): HTMLElement | null {
  const needle = squash(text).slice(0, 90);
  if (!needle) return null;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement?.closest('script, style, noscript, [role="dialog"], [data-orb-ignore]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  let partial: HTMLElement | null = null;
  let hiddenExact: HTMLElement | null = null;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = squash(n.textContent ?? "");
    if (!t) continue;
    const el = n.parentElement as HTMLElement;
    if (t === needle) {
      if (isVisible(el)) return el;
      hiddenExact ??= el;
    } else if (!partial && t.includes(needle) && isVisible(el)) {
      partial = el;
    }
  }
  const found = partial ?? hiddenExact;
  // Long text can be split across elements; try its opening.
  return found ?? (needle.length > 40 ? locateText(needle.slice(0, 40)) : null);
}

/** The centre of an element, in viewport coordinates. */
export function centreOf(el: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Where the orb should hover to point at something: beside it if there is room, above it if not. */
export function hoverBeside(el: Element, size = 64): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  const pad = size / 2 + 12;
  let x = r.left - size / 2 - 10;
  let y = r.top + r.height / 2;
  if (x < pad) {
    x = r.right + size / 2 + 10;
    if (x > w - pad) {
      x = r.left + r.width / 2;
      y = r.top - size / 2 - 8;
    }
  }
  return { x: Math.min(w - pad, Math.max(pad, x)), y: Math.min(h - pad, Math.max(pad, y)) };
}

function overlay(style: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const el = document.createElement("div");
  Object.assign(el.style, { position: "fixed", pointerEvents: "none", zIndex: "75" }, style);
  el.setAttribute("aria-hidden", "true");
  document.body.appendChild(el);
  return el;
}

/** A click: a ring that spreads from the point and fades. */
export function ripple(x: number, y: number): void {
  const el = overlay({
    left: `${x}px`,
    top: `${y}px`,
    width: "26px",
    height: "26px",
    borderRadius: "9999px",
    border: "2px solid var(--pantone)",
    background: "color-mix(in srgb, var(--pantone) 18%, transparent)",
    animation: "orb-ripple 700ms ease-out forwards",
  });
  window.setTimeout(() => el.remove(), 760);
}

/** A highlight around an element that pulses twice and then goes. It follows the element if the page scrolls. */
export function ring(el: Element): void {
  const box = overlay({
    border: "2px solid var(--pantone)",
    borderRadius: "8px",
    animation: "orb-pulse 1.3s ease-out 2",
  });
  const place = () => {
    const r = el.getBoundingClientRect();
    Object.assign(box.style, { left: `${r.left - 6}px`, top: `${r.top - 6}px`, width: `${r.width + 12}px`, height: `${r.height + 12}px` });
  };
  place();
  window.addEventListener("scroll", place, { passive: true });
  window.addEventListener("resize", place);
  window.setTimeout(() => {
    window.removeEventListener("scroll", place);
    window.removeEventListener("resize", place);
    box.remove();
  }, 2800);
}
