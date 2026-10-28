/**
 * Deterministic rules for the Ficungini assistant. Pure functions only: no
 * network, no randomness, no LLM. Everything is driven by the spec object that
 * is passed in, so wording and routes stay configurable in the JSON.
 */
import type { Answer, ChatSpec, FormField, RouteDef, Step } from "./types";

/* ------------------------------------------------------------ text utils -- */

const ACRONYMS: Record<string, string> = {
  rfp: "RFP",
  rfq: "RFQ",
  erp: "ERP",
  gst: "GST",
  epc: "EPC",
  oem: "OEM",
};

const TYPOS: Record<string, string> = {
  pricng: "pricing",
  prise: "price",
  secuirty: "security",
  complience: "compliance",
  compliace: "compliance",
  eligibilty: "eligibility",
  corrigendam: "corrigendum",
  tendar: "tender",
  tenderr: "tender",
};

/** Lowercase, strip punctuation, keep tokens such as pm2.5, h2s and co2 intact. */
export function normalize(input: string): string {
  const t = input
    .toLowerCase()
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\.(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t
    .split(" ")
    .map((w) => TYPOS[w] ?? w)
    .join(" ");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsPhrase(normalizedText: string, normalizedPhrase: string): boolean {
  if (!normalizedPhrase) return false;
  return new RegExp(`(^| )${escapeRegExp(normalizedPhrase)}(s|es)?( |$)`).test(normalizedText);
}

export function humanizeId(id: string): string {
  return id
    .split("_")
    .filter(Boolean)
    .map((w) => ACRONYMS[w] ?? w)
    .join(" ");
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function displayAnswer(v: Answer | undefined): string {
  if (v === undefined) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!(key in vars)) throw new Error(`Template variable "${key}" has no value`);
    return vars[key];
  });
}


/* --------------------------------------------------------------- routing -- */

export type RouteResult =
  | { status: "matched"; route: RouteDef; score: number }
  | { status: "ambiguous"; candidates: RouteDef[] }
  | { status: "none" };

function scoreRoute(route: RouteDef, n: string): number {
  let score = 0;
  for (const phrase of route.phrases) {
    const p = normalize(phrase);
    if (n === p) score += 10;
    else if (containsPhrase(n, p)) score += 1 + p.split(" ").length;
  }
  return score;
}

/** Closeness of runner-up scores that counts as a tie; ties are never guessed. */
const TIE_RATIO = 0.75;

export function routeIntent(spec: ChatSpec, text: string): RouteResult {
  const n = normalize(text);
  if (!n) return { status: "none" };
  const scored = spec.route_catalog
    .map((route) => ({ route, score: scoreRoute(route, n) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length === 0) return { status: "none" };
  const top = scored[0].score;
  const close = scored.filter((s) => s.score >= top * TIE_RATIO);
  if (close.length > 1) {
    return { status: "ambiguous", candidates: close.slice(0, 3).map((s) => s.route) };
  }
  return { status: "matched", route: scored[0].route, score: top };
}

/* ------------------------------------------------------- answer parsing --- */

export type ParseResult =
  | { ok: true; value: Answer }
  | { ok: false; message: string };

type OptionMatch =
  | { kind: "match"; option: string }
  | { kind: "ambiguous"; options: string[] }
  | { kind: "none" };

export function matchOption(text: string, options: string[]): OptionMatch {
  const nt = normalize(text);
  if (!nt) return { kind: "none" };
  const exact = options.filter((o) => normalize(o) === nt);
  if (exact.length === 1) return { kind: "match", option: exact[0] };

  const loose = options.filter((o) => {
    const no = normalize(o);
    if (nt.length >= 3 && containsPhrase(no, nt)) return true;
    return no.length >= 3 && containsPhrase(nt, no);
  });
  if (loose.length === 1) return { kind: "match", option: loose[0] };
  if (loose.length > 1) return { kind: "ambiguous", options: loose };
  return { kind: "none" };
}

/** Stored answer for a number step the customer could not size. */
export const UNSURE = "unsure";
const UNSURE_RE = /\b(not sure|unsure|no idea|don'?t know|dont know|help|recommend|suggest|you decide)\b/i;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateValue(step: Step, value: unknown): ParseResult {
  switch (step.type) {
    case "select":
    case "review": {
      if (typeof value === "string" && step.options?.includes(value)) return { ok: true, value };
      return { ok: false, message: "Please choose one of the options." };
    }
    case "multi_select": {
      const arr = Array.isArray(value) ? value : null;
      if (!arr || arr.some((v) => typeof v !== "string" || !step.options?.includes(v))) {
        return { ok: false, message: "Please choose from the listed options." };
      }
      const unique = [...new Set(arr as string[])];
      if (step.required && unique.length === 0) {
        return { ok: false, message: "Please choose at least one option." };
      }
      return { ok: true, value: unique };
    }
    case "form":
      return { ok: false, message: "Please use the form above to share your details." };
    case "number": {
      if (value === "" && !step.required) return { ok: true, value: "" };
      if (step.unsure_label && value === UNSURE) return { ok: true, value: UNSURE };
      const n = typeof value === "number" ? value : Number.NaN;
      const wholeOnly = !step.id.startsWith("area");
      const min = step.min ?? Number.NEGATIVE_INFINITY;
      const max = step.max ?? Number.POSITIVE_INFINITY;
      const range =
        step.min !== undefined && step.max !== undefined
          ? ` between ${step.min} and ${step.max}`
          : step.min !== undefined
            ? ` of at least ${step.min}`
            : "";
      if (!Number.isFinite(n) || (wholeOnly && !Number.isInteger(n)) || n < min || n > max) {
        return {
          ok: false,
          message: `Please enter ${wholeOnly ? "a whole number" : "a number"}${range}.`,
        };
      }
      return { ok: true, value: n };
    }
    case "text": {
      const s = typeof value === "string" ? value.trim() : "";
      if (!s) {
        return step.required
          ? { ok: false, message: "This answer is required." }
          : { ok: true, value: "" };
      }
      if (s.length > 500) return { ok: false, message: "Please keep this under 500 characters." };
      if (step.format === "email" && (!EMAIL_RE.test(s) || s.length > 254)) {
        return { ok: false, message: "Please enter a valid email address, like name@company.com." };
      }
      if (step.id === "phone") {
        const digits = s.replace(/\D/g, "");
        if (!/^[+\d\s()-]+$/.test(s) || digits.length < 7 || digits.length > 15) {
          return { ok: false, message: "Please enter a valid phone number, or skip this." };
        }
      }
      return { ok: true, value: s };
    }
  }
}

export type ProfileCheck =
  | { ok: true; values: Record<string, string> }
  | { ok: false; errors: Record<string, string> };

/** Checks the details of a form step. Used by the form itself and again when the answer arrives. */
export function validateProfile(fields: FormField[], input: Record<string, unknown>): ProfileCheck {
  const values: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const raw = input[f.id];
    const v = typeof raw === "string" ? raw.trim() : "";
    values[f.id] = v;
    if (!v) {
      if (f.required) errors[f.id] = "This is required.";
      continue;
    }
    if (v.length > 200) errors[f.id] = "Please keep this under 200 characters.";
    else if (f.format === "email" && (!EMAIL_RE.test(v) || v.length > 254)) errors[f.id] = "Enter a valid email, like name@company.com.";
    else if (f.format === "phone") {
      const digits = v.replace(/\D/g, "");
      if (!/^[+\d\s()-]+$/.test(v) || digits.length < 7 || digits.length > 15) errors[f.id] = "Enter a valid phone number, or leave it blank.";
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}

/** Turn typed text into a value for a step, or explain why it cannot be used. */
export function parseAnswer(step: Step, text: string): ParseResult {
  const trimmed = text.trim();
  switch (step.type) {
    case "select":
    case "review": {
      const m = matchOption(trimmed, step.options ?? []);
      if (m.kind === "match") return { ok: true, value: m.option };
      if (m.kind === "ambiguous") {
        return {
          ok: false,
          message: `That could mean more than one option (${m.options.join("; ")}). Please pick one.`,
        };
      }
      return { ok: false, message: "I couldn't match that to one of the options." };
    }
    case "multi_select": {
      const options = step.options ?? [];
      const whole = matchOption(trimmed, options);
      if (whole.kind === "match") return validateValue(step, [whole.option]);
      const parts = trimmed
        .split(/[,;\n]|\sand\s/i)
        .map((p) => p.trim())
        .filter(Boolean);
      const picked: string[] = [];
      const unmatched: string[] = [];
      for (const p of parts) {
        const m = matchOption(p, options);
        if (m.kind === "match") picked.push(m.option);
        else unmatched.push(p);
      }
      if (picked.length === 0 || unmatched.length > 0) {
        return {
          ok: false,
          message: unmatched.length
            ? `I couldn't match: ${unmatched.join(", ")}.`
            : "I couldn't match that to any of the options.",
        };
      }
      return validateValue(step, picked);
    }
    case "form":
      return { ok: false, message: "Please use the form above to share your details." };
    case "number": {
      if (!trimmed && !step.required) return { ok: true, value: "" };
      if (step.unsure_label && UNSURE_RE.test(trimmed) && !/\d/.test(trimmed)) {
        return { ok: true, value: UNSURE };
      }
      const nums = trimmed.replace(/,/g, "").match(/\d+(\.\d+)?/g);
      if (!nums || nums.length !== 1) {
        return validateValue(step, Number.NaN);
      }
      return validateValue(step, Number(nums[0]));
    }
    case "text": {
      if (!step.required && /^skip$/i.test(trimmed)) return { ok: true, value: "" };
      return validateValue(step, trimmed);
    }
  }
}

/* ----------------------------------------------------- not-sure answers -- */

/** True when a message says the customer does not know ("not sure", "idk"). */
export function unsureLike(text: string): boolean {
  return /^(?:(?:i )?(?:am |m )?(?:not sure|unsure|dont know|do not know|no idea|idk|dunno|not certain)|(?:i )?(?:honestly )?(?:don't|dont|do not) know)(?: yet| really| what)?[.!? ]*$/i.test(
    text.trim().replace(/[’']/g, "'"),
  );
}

/** The option that stands for "I'm not sure" in a question, if it has one. */
export function unsureOption(options: string[] | undefined): string | null {
  if (!options) return null;
  for (const re of [/^unsure$/i, /not measured \/ unsure/i, /^not sure/i, /unsure$/i, /^other$/i]) {
    const hit = options.find((o) => re.test(o));
    if (hit) return hit;
  }
  return null;
}
