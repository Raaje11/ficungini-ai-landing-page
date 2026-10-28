import type { SiteDestination, TourStep } from "./types";

/**
 * Lets the chat and the rest of the page talk without owning each other. The chat launcher
 * (`SupportChat`) answers `openFico()`, `goToSite()` and `startTour()`.
 */
export const OPEN_FICO_EVENT = "ficungini:open-fico";

/** Asks the page to take the visitor somewhere: the orb flies to it, clicks, and points at it. */
export const GO_TO_SITE_EVENT = "ficungini:go-to-site";

export function goToSite(dest: SiteDestination): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SiteDestination>(GO_TO_SITE_EVENT, { detail: dest }));
}

export function onGoToSite(handler: (dest: SiteDestination) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<SiteDestination>).detail);
  window.addEventListener(GO_TO_SITE_EVENT, listener);
  return () => window.removeEventListener(GO_TO_SITE_EVENT, listener);
}

/** Tells the orb where to look, in viewport coordinates. */
export const ORB_LOOK_EVENT = "ficungini:orb-look";

export function orbLookAt(x: number, y: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<{ x: number; y: number }>(ORB_LOOK_EVENT, { detail: { x, y } }));
}

export function onOrbLook(handler: (x: number, y: number) => void): () => void {
  const listener = (e: Event) => {
    const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
    handler(x, y);
  };
  window.addEventListener(ORB_LOOK_EVENT, listener);
  return () => window.removeEventListener(ORB_LOOK_EVENT, listener);
}

/** Opens the chat. Safe to call on the server: it does nothing there. */
export function openFico(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_FICO_EVENT));
}

/** Listen for `openFico`. Returns the unsubscribe function. */
export function onOpenFico(handler: () => void): () => void {
  window.addEventListener(OPEN_FICO_EVENT, handler);
  return () => window.removeEventListener(OPEN_FICO_EVENT, handler);
}

/** Starts the guided tour of the company: the orb takes the visitor page to page, with Fico's explanation at the bottom. */
export const START_TOUR_EVENT = "ficungini:start-tour";

export function startTour(steps: TourStep[]): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<TourStep[]>(START_TOUR_EVENT, { detail: steps }));
}

export function onStartTour(handler: (steps: TourStep[]) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<TourStep[]>).detail);
  window.addEventListener(START_TOUR_EVENT, listener);
  return () => window.removeEventListener(START_TOUR_EVENT, listener);
}
