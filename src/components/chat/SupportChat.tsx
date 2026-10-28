"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FicoOrb from "@/components/chat/FicoOrb";
import ChatPanel from "@/components/chat/ChatPanel";
import { centreOf, findLink, hoverBeside, locateText, ring, ripple, sectionOf, wait, waitFor } from "@/components/chat/siteGuide";
import { onGoToSite, onOpenFico, onStartTour, orbLookAt } from "@/lib/chat/bridge";
import type { SiteDestination, TourStep } from "@/lib/chat/types";

/** What the orb is saying, and which way its bubble should open so it stays on screen. */
interface Bubble {
  text: string;
  /** "end": the bubble opens to the left of the orb (the orb is on the right of the screen). */
  side: "start" | "end";
  below: boolean;
  /** A greeting can be closed; what it says while showing someone around goes by itself. */
  dismissible?: boolean;
}

const HINT = "Hi, I'm Fico. Ask me to find anything on the site.";

export default function SupportChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [onCoral, setOnCoral] = useState(false);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  // Each trip gets a number; a newer trip, or opening the chat, ends the one in progress.
  const trip = useRef(0);

  // Invert the launcher (Alabaster sphere, coral eyes) while it sits over a coral section.
  useEffect(() => {
    const dock = dockRef.current;
    const btn = buttonRef.current;
    if (!dock || !btn) return;
    let frame = 0;

    const check = () => {
      frame = 0;
      const r = btn.getBoundingClientRect();
      const under = document
        .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .find((el) => !dock.contains(el));
      let bg: number[] | null = null;
      for (let el: Element | null = under ?? null; el; el = el.parentElement) {
        const m = getComputedStyle(el).backgroundColor.match(
          /rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+%?))?\)/,
        );
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
          bg = [Number(m[1]), Number(m[2]), Number(m[3])];
          break;
        }
      }
      // Electric Coral reads as a strong red channel over weaker green and blue.
      setOnCoral(!!bg && bg[0] > 200 && bg[1] < 140 && bg[0] - bg[2] > 80);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    schedule();
    const t = window.setTimeout(schedule, 600);
    // While the orb flies, the colour under it changes, so keep checking for a moment after each move.
    const iv = window.setInterval(schedule, 400);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(iv);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Opening the chat ends any trip, brings the orb home and clears what it was saying.
  const openChat = () => {
    trip.current++;
    const dock = dockRef.current;
    if (dock) {
      dock.style.transition = "none";
      dock.style.transform = "";
    }
    setBubble(null);
    setOpen(true);
  };

  // Other parts of the site (a Talk to sales button, say) can ask for the chat to open.
  useEffect(() => onOpenFico(openChat), []);

  // Once per visit, a short hello says what Fico can do, which is the thing people don't know to ask for.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("fico-hint") === "1";
    } catch {
      /* private mode: just show it */
    }
    if (seen) return;
    const show = window.setTimeout(() => {
      setBubble({ text: HINT, side: "end", below: false, dismissible: true });
      try {
        sessionStorage.setItem("fico-hint", "1");
      } catch {
        /* nothing to remember it in */
      }
    }, 6000);
    const hide = window.setTimeout(() => setBubble((b) => (b?.dismissible ? null : b)), 6000 + 9000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  /** What the orb uses to move: fly to a spot, come home, point at something, say a line beside it. */
  function kit(dock: HTMLDivElement) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth: ScrollBehavior = reduced ? "auto" : "smooth";
    const flight = reduced ? 0 : 900;
    const home = () => {
      const cs = getComputedStyle(dock);
      return {
        x: document.documentElement.clientWidth - parseFloat(cs.right) - dock.offsetWidth / 2,
        y: document.documentElement.clientHeight - parseFloat(cs.bottom) - dock.offsetHeight / 2,
      };
    };
    const say = (text: string, at?: { x: number; y: number }) => {
      const p = at ?? home();
      setBubble({ text, side: p.x < document.documentElement.clientWidth / 2 ? "start" : "end", below: p.y < 150 });
    };
    const flyTo = async (p: { x: number; y: number }) => {
      const h = home();
      dock.style.transition = flight ? `transform ${flight}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
      dock.style.transform = `translate(${p.x - h.x}px, ${p.y - h.y}px)`;
      await wait(flight);
    };
    const flyHome = async () => {
      dock.style.transition = flight ? `transform ${flight}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
      dock.style.transform = "";
      await wait(flight);
    };
    /** Hovers beside `el` and looks at it; `text` goes in the bubble, or nothing is said when it is left out. */
    const pointAt = async (el: Element, text?: string) => {
      const spot = hoverBeside(el, dock.offsetWidth);
      if (text) say(text, spot);
      await flyTo(spot);
      const c = centreOf(el);
      orbLookAt(c.x, c.y);
    };
    return { reduced, smooth, flight, home, say, flyTo, flyHome, pointAt };
  }

  async function showAround(dest: SiteDestination) {
    const dock = dockRef.current;
    if (!dock) return;
    const mine = ++trip.current;
    const alive = () => trip.current === mine;
    const { reduced, smooth, say, flyHome, pointAt } = kit(dock);

    setOpen(false);

    say(`Taking you to ${dest.label}…`);
    await wait(250);
    if (!alive()) return;

    // 1. If the page has a link to where it is going, the orb goes to it and clicks it, so the visitor can see where it is.
    const here = window.location.pathname.replace(/\/$/, "") || "/";
    const link = findLink(dest);
    if (link && (here !== dest.path || dest.hash)) {
      link.scrollIntoView({ behavior: smooth, block: "center" });
      await wait(reduced ? 0 : 650);
      if (!alive()) return;
      await pointAt(link, `Taking you to ${dest.label}…`);
      if (!alive()) return;
      await wait(260);
      const c = centreOf(link);
      ripple(c.x, c.y);
      ring(link);
      await wait(650);
      if (!alive()) return;
    }

    // 2. Go there. Client-side, so the conversation is kept.
    if (here !== dest.path) {
      router.push(dest.path + (dest.hash ?? ""));
      await waitFor(() => window.location.pathname.replace(/\/$/, "") === (dest.path === "/" ? "" : dest.path) || window.location.pathname === dest.path, 6000);
      if (!alive()) return;
    }

    // 3. Point out the place itself: the text it was asked to find, or its section, or the title of the page.
    const wanted = dest.find;
    const target =
      (wanted ? await waitFor(() => locateText(wanted), 3500) : null) ?? (await waitFor(() => sectionOf({ ...dest, find: undefined }), 6000));
    if (!alive()) return;
    if (!target) {
      say("You're on the right page.");
    } else {
      const exact = Boolean(wanted) && target !== document.querySelector("main h1, h1");
      target.scrollIntoView({ behavior: smooth, block: exact ? "center" : dest.hash ? "start" : "center" });
      await wait(reduced ? 0 : 800);
      if (!alive()) return;
      // Something it found by its text is pointed at directly; a section is pointed at by its heading.
      const heading = (!exact && dest.hash ? target.querySelector<HTMLElement>("h2, h1, h3") : null) ?? target;
      await pointAt(heading, `Here's ${dest.label}.`);
      if (!alive()) return;
      await wait(250);
      const c = centreOf(heading);
      ripple(c.x, c.y);
      ring(heading);
    }

    // 4. It waits a moment, then goes back to its corner.
    await wait(5200);
    if (!alive()) return;
    await flyHome();
    if (!alive()) return;
    say("Anything else you'd like to find?");
    await wait(3500);
    if (alive()) setBubble(null);
  }

  // Asked to be shown somewhere: the chat steps aside, the orb finds the link, flies to it, clicks it, and points out the page.
  useEffect(
    () =>
      onGoToSite((dest) => {
        void showAround(dest);
      }),
    // showAround only uses refs, state setters and the router, so the latest router is the one thing it needs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  // The guided tour: the orb takes the visitor page to page, Fico's explanation sits at the bottom, and the page
  // beneath it does not respond until the visitor presses Next, Dismiss or Ctrl+C.
  const [tour, setTour] = useState<{ label: string; text: string; index: number; total: number; moving: boolean } | null>(null);
  const touring = tour !== null;
  const nextRef = useRef<(() => void) | null>(null);

  function endTour(finished: boolean) {
    const mine = ++trip.current; // ends the walk in progress
    nextRef.current?.();
    nextRef.current = null;
    setTour(null);
    const dock = dockRef.current;
    if (dock) {
      dock.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
      dock.style.transform = "";
    }
    setBubble({ text: finished ? "That's the tour. Ask me anything else." : "Tour ended. Ask me anything.", side: "end", below: false, dismissible: true });
    window.setTimeout(() => setBubble((b) => (trip.current === mine && b?.dismissible ? null : b)), 4500);
  }

  async function runTour(steps: TourStep[]) {
    const dock = dockRef.current;
    if (!dock || !steps.length) return;
    const mine = ++trip.current;
    const alive = () => trip.current === mine;
    const { reduced, smooth, pointAt } = kit(dock);
    setOpen(false);
    setBubble(null);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setTour({ label: step.label, text: step.text, index: i, total: steps.length, moving: true });
      const here = window.location.pathname.replace(/\/$/, "") || "/";
      if (here !== step.path) {
        router.push(step.path + (step.hash ?? ""));
        await waitFor(() => (window.location.pathname.replace(/\/$/, "") || "/") === step.path, 6000);
        if (!alive()) return;
      }
      const target = await waitFor(() => sectionOf({ id: "", label: step.label, path: step.path, hash: step.hash, keywords: [] }), 6000);
      if (!alive()) return;
      if (target) {
        target.scrollIntoView({ behavior: smooth, block: step.hash ? "start" : "center" });
        await wait(reduced ? 0 : 800);
        if (!alive()) return;
        const heading = (step.hash ? target.querySelector<HTMLElement>("h2, h1, h3") : null) ?? target;
        await pointAt(heading);
        if (!alive()) return;
        ring(heading);
      }
      setTour((s) => (s ? { ...s, moving: false } : s));
      await new Promise<void>((resolve) => {
        nextRef.current = resolve;
      });
      nextRef.current = null;
      if (!alive()) return;
    }
    endTour(true);
  }

  useEffect(
    () =>
      onStartTour((steps) => {
        void runTour(steps);
      }),
    // runTour only uses refs, state setters and the router.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  // While it runs: the page cannot be scrolled, and the keyboard only does what the tour offers.
  useEffect(() => {
    if (!touring) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        endTour(false);
        return;
      }
      const inCaption = e.target instanceof Element && e.target.closest("[data-tour-caption]");
      if (!inCaption && e.key !== "Tab") e.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      root.style.overflow = before;
      window.removeEventListener("keydown", onKey, true);
    };
    // endTour only uses refs and state setters, so it is not a dependency.
  }, [touring]);

  // Escape minimizes the assistant.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const minimize = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      {/* The panel stays mounted while minimized so the conversation is kept. */}
      <div
        role="dialog"
        aria-label="Fico"
        aria-hidden={!open}
        inert={!open}
        className={`fico-chat fixed inset-0 z-[70] h-dvh w-full overflow-hidden bg-white transition-[opacity,transform] duration-[160ms] ease-out sm:inset-auto sm:bottom-6 sm:right-8 sm:h-[min(720px,calc(100dvh-3rem))] sm:w-[420px] sm:rounded-[2px] sm:border sm:border-(--oc-border) sm:shadow-[0_12px_48px_rgba(23,20,15,0.18)] ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ChatPanel onMinimize={minimize} open={open} />
      </div>

      {tour && (
        <>
          {/* Covers the page: nothing underneath can be clicked, hovered or touched while the tour runs. */}
          <div data-orb-ignore aria-hidden className="fixed inset-0 z-[80] cursor-default touch-none" />
          <div data-orb-ignore data-tour-caption className={`fico-chat pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-center px-4 pb-4 sm:pb-6`}>
            <div
              role="region"
              aria-live="polite"
              aria-label="Guided tour"
              className="pointer-events-auto w-full max-w-2xl rounded-[10px] border border-ink-200 bg-white p-4 shadow-[0_12px_48px_rgba(23,20,15,0.22)] sm:p-5"
            >
              <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-pantone-700">
                <span>{tour.label}</span>
                <span className="text-ink-500">
                  {tour.index + 1} of {tour.total}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-900">{tour.text}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="hidden text-xs text-ink-500 sm:block">Press Ctrl+C to end the tour</span>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => endTour(false)}
                    className="rounded-[4px] border border-ink-200 px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-pantone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    autoFocus
                    disabled={tour.moving}
                    onClick={() => nextRef.current?.()}
                    className="rounded-[4px] bg-pantone px-5 py-2 text-sm font-medium text-alabaster transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone disabled:opacity-50"
                  >
                    {tour.index + 1 === tour.total ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* The dock holds the orb and what it says, and is what flies across the page. */}
      <div
        ref={dockRef}
        data-orb-ignore
        className={`fixed bottom-6 right-6 z-[70] h-16 w-16 sm:right-8 ${open ? "pointer-events-none" : ""}`}
      >
        {bubble && !open && (
          <div
            role="status"
            className={`absolute w-max max-w-[15rem] rounded-[10px] border border-ink-200 bg-white px-3.5 py-2.5 text-sm leading-snug text-ink-900 shadow-[0_8px_28px_rgba(23,20,15,0.16)] ${
              bubble.below ? "top-full mt-3" : "bottom-full mb-3"
            } ${bubble.side === "end" ? "right-0" : "left-0"} ${bubble.dismissible ? "pr-8" : ""}`}
          >
            {bubble.text}
            {bubble.dismissible && (
              <button
                type="button"
                onClick={() => setBubble(null)}
                aria-label="Dismiss"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-base leading-none text-ink-500 transition-colors hover:bg-pantone-100 hover:text-pantone-700"
              >
                ×
              </button>
            )}
            {/* The tail points at the orb. */}
            <span
              aria-hidden
              className={`absolute block h-2.5 w-2.5 rotate-45 bg-white ${
                bubble.below ? "-top-[6px] border-l border-t" : "-bottom-[6px] border-b border-r"
              } border-ink-200 ${bubble.side === "end" ? "right-[26px]" : "left-[26px]"}`}
            />
          </div>
        )}
        <button
          ref={buttonRef}
          onClick={openChat}
          aria-label="Open support chat"
          aria-expanded={open}
          tabIndex={open ? -1 : 0}
          className={`group absolute inset-0 rounded-full transition-[transform,opacity] duration-300 ease-in-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pantone active:scale-95 ${
            open ? "pointer-events-none scale-0 opacity-0" : ""
          }`}
        >
          <FicoOrb inverted={onCoral} />
        </button>
      </div>
    </>
  );
}
