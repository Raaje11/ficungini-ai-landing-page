/**
 * Conversation state machine for the assistant. `reduce` is a pure
 * function: (session, event) -> next session. The one side effect, sending a
 * request to the backend, is returned as `session.effect` for the UI to run.
 */
import type { Answer, ChatSpec, FlowDef, FormField, SiteDestination, Step, StepType, TourStep } from "./types";
import {
  capitalize,
  displayAnswer,
  humanizeId,
  parseAnswer,
  routeIntent,
  unsureLike,
  unsureOption,
  validateProfile,
  validateValue,
} from "./engine";
import { boundaryReply, isOffTopic, isQuestion, offTopicReply, smallTalk } from "./smalltalk";
import { understand } from "./knowledge";
import type { IntentTrace, Understood } from "./knowledge";
import { decide, rank } from "./semantic";
import { findOnSite } from "./sitemap";
import type { SiteMatch } from "./sitemap";

/* ---------------------------------------------------------------- types --- */

export interface QuestionView {
  id: string;
  flowId: string | null;
  prompt: string;
  type: StepType;
  options?: { label: string; value: string }[];
  required: boolean;
  min?: number;
  max?: number;
  unit?: string;
  default?: number;
  format?: "email";
  unsure?: string;
  /** Form questions: what to ask for, and what is already known. */
  fields?: FormField[];
  values?: Record<string, string>;
  /** The customer answers by typing; no choices are shown (they still match what is typed). */
  typeOnly?: boolean;
  progress?: { current: number; total: number };
  prefill?: Answer;
}

type MsgBody =
  | { role: "user"; text: string }
  | { role: "assistant"; kind: "welcome"; text: string }
  | { role: "assistant"; kind: "text"; text: string; tone?: "info" | "warning" | "danger" }
  | { role: "assistant"; kind: "question"; question: QuestionView; answered?: boolean }
  | { role: "assistant"; kind: "review"; title: string; rows: { label: string; value: string }[]; note: string }
  | { role: "assistant"; kind: "status"; state: string; text: string; reference?: string; tone: "success" | "info" | "danger" };

export type Msg = MsgBody & { id: string };

export type SubmitKind = "demo" | "enquiry";

export interface SubmitPayload {
  kind: SubmitKind;
  contact: { name: string; email: string; phone?: string };
  consent: { given: true; timestamp: string };
  summary: Record<string, unknown>;
}

export interface SubmitEffect {
  type: "submit";
  payload: SubmitPayload;
}

export type SubmitResult =
  | { error: "network" }
  | { error?: undefined; httpStatus: number; body: { state?: unknown; message?: unknown; reference?: unknown } | null };

export type ChatEvent =
  | { type: "answer"; value: Answer }
  | { type: "profile"; values: Record<string, string> }
  | { type: "text"; text: string }
  | { type: "action"; id: string; label?: string }
  | { type: "back" }
  | { type: "restart" }
  | { type: "submit-result"; result: SubmitResult };

interface HistoryEntry {
  messages: Msg[];
  flowId: string | null;
  stepIndex: number;
}

interface Context {
  /** Questions Fico had no documented answer for; they go to the team with any request. */
  teamQuestions: string[];
  /** How recent questions were understood, with the scores, for the team and for tuning. */
  intentTrace: IntentTrace[];
  /** The candidates offered by a "did you mean", with the answer to give for each. */
  clarify: Record<string, string>;
  /** How many times the customer has been inappropriate, so Fico can be firmer if it continues. */
  boundaries: number;
  /** How many company questions have been answered, and whether the tour was offered already. */
  companyAsks: number;
  tourOffered: boolean;
  /** Steps of a flow that were answered before it started, so they are not asked again. */
  seeded: string[];
}

export interface Session {
  messages: Msg[];
  nextId: number;
  flowId: string | null;
  stepIndex: number;
  /** flow whose details are awaiting submission */
  submitFlow: string | null;
  forceAsk: boolean;
  answers: Record<string, Record<string, Answer>>;
  shared: Record<string, Answer>;
  history: HistoryEntry[];
  context: Context;
  consentAt: string | null;
  sending: boolean;
  effect?: SubmitEffect;
  /** Set when the visitor asked to be shown somewhere; the page takes them there. Cleared on the next event. */
  navigate?: SiteDestination;
  /** Set when the visitor agreed to the tour; the page runs it. Cleared on the next event. */
  tour?: TourStep[];
}

/* ------------------------------------------------------------ constants --- */

const ACTION_LABELS: Record<string, string> = {
  book_demo: "Book a demo",
  human_handoff: "Talk to a person",
  submit_request: "Submit request",
  edit_details: "Edit details",
  restart: "Start over",
};

/** Answers reused across flows so people are not asked twice. */
const SHARED_KEYS: Record<string, string> = {
  company: "company",
  name: "name",
  work_email: "work_email",
  phone: "phone",
};

const REVIEW_LABELS: Record<string, string> = {
  topic: "Topic",
  team_size: "Team size",
  company: "Company",
  name: "Name",
  work_email: "Email",
  phone: "Phone",
  preferred_window: "Preferred time",
  details: "Notes",
};

const DISPLAYED_STATES = new Set(["submitted_pending_review", "accepted", "scheduled", "resolved"]);

/* ---------------------------------------------------------- flow access --- */

function getFlow(spec: ChatSpec, id: string): FlowDef {
  if (id === "contact_request") {
    return {
      steps: [
        {
          id: "profile",
          question: "I'll take a few details so the team can get back to you. You only have to enter them once.",
          type: "form",
          required: true,
          fields: [
            { id: "name", label: "Your name", required: true },
            { id: "work_email", label: "Work email", format: "email", required: true },
            { id: "company", label: "Company or organisation", required: false },
            { id: "phone", label: "Phone (optional)", format: "phone", required: false },
          ],
        },
        {
          id: "details",
          question: "Is there anything the team should know, such as what you'd like to ask? (optional)",
          type: "text",
          required: false,
        },
      ],
      intro_variants: [
        "Of course. I'll take a few details so the team can get back to you. Nothing is sent until you've reviewed it.",
        "Happy to connect you with the team. A few details first, and you'll review everything before it goes.",
      ],
      submit_action: "create_enquiry",
      pending_message:
        "Your request is ready to submit. Nothing is sent until you submit it, and it is not a confirmed booking or appointment.",
    };
  }
  const flow = spec.flows[id] as FlowDef | undefined;
  if (!flow || !Array.isArray(flow.steps)) throw new Error(`Unknown flow: ${id}`);
  return flow;
}

function getSteps(spec: ChatSpec, id: string): Step[] {
  const flow = getFlow(spec, id);
  let steps: Step[] = flow.steps;
  if (flow.submit_action && !steps.some((s) => s.id === "consent")) {
    steps = [...steps, spec.flows.consent_step as Step];
  }
  return steps;
}

/* --------------------------------------------------------- draft helpers -- */

function clone(s: Session): Session {
  return {
    ...s,
    messages: [...s.messages],
    history: [...s.history],
    answers: { ...s.answers },
    shared: { ...s.shared },
    context: { ...s.context },
    effect: undefined,
    navigate: undefined,
    tour: undefined,
  };
}

function push(d: Session, body: MsgBody): void {
  d.messages.push({ ...body, id: `m${d.nextId++}` } as Msg);
}

function say(d: Session, text: string, tone?: "info" | "warning" | "danger"): void {
  push(d, { role: "assistant", kind: "text", text, tone });
}

function setAnswer(d: Session, flowId: string, stepId: string, value: Answer): void {
  d.answers[flowId] = { ...d.answers[flowId], [stepId]: value };
}

/** What Fico says it is doing while it works, chosen from what it is about to show. */
export function thinkingFor(spec: ChatSpec, upcoming: Msg[]): string[] {
  const t = spec.ui.thinking;
  const assistant = upcoming.filter((m) => m.role === "assistant");
  if (assistant.some((m) => m.kind === "text" && spec.engine.unanswered_responses.includes(m.text))) return t.unanswered;
  return t.default;
}

export function activeQuestion(s: Session): (QuestionView & { msgId: string }) | null {
  const last = s.messages[s.messages.length - 1];
  if (last && last.role === "assistant" && last.kind === "question" && !last.answered) {
    return { ...last.question, msgId: last.id };
  }
  return null;
}

/** Records every field of a form step, and remembers them for the rest of the conversation. */
function storeProfile(d: Session, flowId: string, step: Step, values: Record<string, string>): void {
  for (const f of step.fields ?? []) {
    setAnswer(d, flowId, f.id, values[f.id] ?? "");
    const key = SHARED_KEYS[f.id];
    if (key && values[f.id]) d.shared[key] = values[f.id];
  }
}

function presentQuestion(d: Session, q: QuestionView, record = true): void {
  push(d, { role: "assistant", kind: "question", question: q });
  if (record) {
    d.history.push({ messages: [...d.messages], flowId: d.flowId, stepIndex: d.stepIndex });
  }
}

function markAnswered(d: Session): void {
  const i = d.messages.length - 1;
  const last = d.messages[i];
  if (last && last.role === "assistant" && last.kind === "question") {
    d.messages[i] = { ...last, answered: true } as Msg;
  }
}

function choiceQuestion(
  id: string,
  prompt: string,
  options: { label: string; value: string }[],
): QuestionView {
  return { id, flowId: null, prompt, type: "select", options, required: true };
}

/** Says plainly that there is no answer, keeps the question for the team, and asks again where it left off. */
function declineToGuess(d: Session, spec: ChatSpec, text: string, q: (QuestionView & { msgId: string }) | null): void {
  const replies = spec.engine.unanswered_responses;
  say(d, replies[d.nextId % replies.length]);
  if (!d.context.teamQuestions.includes(text)) {
    d.context.teamQuestions = [...d.context.teamQuestions, text.slice(0, 300)].slice(-5);
  }
  if (q && q.flowId) {
    const { msgId: _id, ...same } = q;
    void _id;
    return presentQuestion(d, same, false);
  }
  presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
}

function noteIntent(d: Session, trace: IntentTrace): void {
  d.context.intentTrace = [...d.context.intentTrace, { ...trace, text: trace.text.slice(0, 200) }].slice(-8);
}

/** Two or more answers are about equally likely: ask which was meant instead of guessing. */
function askWhichMeant(d: Session, understood: Extract<Understood, { kind: "clarify" }>): void {
  d.context.clarify = Object.fromEntries(understood.options.map((o) => [`kb:${o.id}`, o.reply]));
  say(d, "I want to make sure I answer the right thing. Which of these do you mean?");
  presentQuestion(
    d,
    choiceQuestion("__clarify", "Which one is closest?", [
      ...understood.options.map((o) => ({ label: o.label, value: `kb:${o.id}` })),
      { label: "None of these", value: "__none" },
    ]),
  );
}

/** The opening prompt, varied when it has to be asked again. */
function entryPrompt(d: Session, spec: ChatSpec): string {
  const v = spec.flows.start.entry_variants;
  return v?.length ? v[d.nextId % v.length] : spec.flows.start.entry_message;
}

function startQuestion(spec: ChatSpec, prompt: string): QuestionView {
  const q = spec.flows.start.question;
  return { ...choiceQuestion(q.id, prompt, q.options), typeOnly: true };
}

function nextActionQuestion(prompt: string, actions: string[]): QuestionView {
  const ids = [...new Set([...actions, "restart"])];
  return choiceQuestion(
    "__next_action",
    prompt,
    ids.map((id) => ({ label: ACTION_LABELS[id] ?? humanizeId(id), value: id })),
  );
}

/** What the form should start with: this flow's answers, then what was shared earlier. */
function profileValues(d: Session, flowId: string, step: Step): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of step.fields ?? []) {
    const own = d.answers[flowId]?.[f.id];
    const shared = prefillFor(d, { id: f.id, question: "", type: "text" });
    const v = own ?? shared;
    out[f.id] = typeof v === "string" ? v : "";
  }
  return out;
}

function stepQuestion(d: Session, spec: ChatSpec, flowId: string, index: number): QuestionView {
  const steps = getSteps(spec, flowId);
  const step = steps[index];
  return {
    id: step.id,
    flowId,
    prompt: step.question,
    type: step.type,
    options: step.options?.map((o) => ({ label: o, value: o })),
    required: step.required ?? false,
    min: step.min,
    max: step.max,
    unit: step.unit,
    default: step.default,
    format: step.format,
    unsure: step.unsure_label,
    fields: step.fields,
    values: step.type === "form" ? profileValues(d, flowId, step) : undefined,
    progress: { current: index + 1, total: steps.length },
    prefill: d.answers[flowId]?.[step.id],
  };
}

/* ---------------------------------------------------------------- init ---- */

export function createSession(spec: ChatSpec): Session {
  const d: Session = {
    messages: [],
    nextId: 1,
    flowId: null,
    stepIndex: 0,
    submitFlow: null,
    forceAsk: false,
    answers: {},
    shared: {},
    history: [],
    context: { teamQuestions: [], intentTrace: [], clarify: {}, boundaries: 0, companyAsks: 0, tourOffered: false, seeded: [] },
    consentAt: null,
    sending: false,
  };
  push(d, { role: "assistant", kind: "welcome", text: spec.ui.welcome_message });
  presentQuestion(d, startQuestion(spec, spec.flows.start.entry_message));
  return d;
}

/* ------------------------------------------------------------- flows ------ */

function startFlow(d: Session, spec: ChatSpec, flowId: string, opts: { answers?: Record<string, Answer>; intro?: string } = {}): void {
  const flow = getFlow(spec, flowId);
  d.flowId = flowId;
  d.stepIndex = 0;
  d.forceAsk = false;
  d.consentAt = null;
  d.submitFlow = null;
  for (const [id, value] of Object.entries(opts.answers ?? {})) setAnswer(d, flowId, id, value);
  d.context.seeded = Object.keys(opts.answers ?? {});
  say(
    d,
    opts.intro ??
      (flow.intro_variants?.length
        ? flow.intro_variants[d.nextId % flow.intro_variants.length]
        : (flow.intro_message ?? `I'll collect a few details for the team. Nothing is sent until you review and submit it.`)),
  );
  advance(d, spec);
}

function prefillFor(d: Session, step: Step): Answer | undefined {
  const key = SHARED_KEYS[step.id];
  return key ? d.shared[key] : undefined;
}

/** Show the next question, reusing known details, or finish the flow. */
function advance(d: Session, spec: ChatSpec): void {
  const flowId = d.flowId as string;
  const steps = getSteps(spec, flowId);
  const reused: string[] = [];

  while (d.stepIndex < steps.length) {
    const step = steps[d.stepIndex];
    const known = d.answers[flowId]?.[step.id];
    // Answered before the flow began (a message sent with @contact): not asked again.
    if (!d.forceAsk && known !== undefined && d.context.seeded.includes(step.id)) {
      d.stepIndex++;
      continue;
    }
    if (step.type === "form" && known === undefined && !d.forceAsk) {
      const have = validateProfile(step.fields ?? [], profileValues(d, flowId, step));
      if (have.ok) {
        storeProfile(d, flowId, step, have.values);
        reused.push(`your details (${have.values.name ?? "name"}, ${have.values.work_email ?? "email"})`);
        d.stepIndex++;
        continue;
      }
    }
    if (!d.forceAsk && known === undefined && step.id !== "consent" && step.type !== "form") {
      const candidate = prefillFor(d, step);
      if (candidate !== undefined) {
        const checked = validateValue(step, candidate);
        if (checked.ok) {
          setAnswer(d, flowId, step.id, checked.value);
          reused.push(`${capitalize(humanizeId(step.id))}: ${displayAnswer(checked.value)}`);
          d.stepIndex++;
          continue;
        }
      }
    }
    break;
  }

  if (d.stepIndex >= steps.length) {
    completeFlow(d, spec);
    return;
  }

  if (reused.length) {
    say(d, `Using what you've already told me: ${reused.join("; ")}. You can review them before anything is submitted.`, "info");
  }

  presentQuestion(d, stepQuestion(d, spec, flowId, d.stepIndex));
}

function completeFlow(d: Session, spec: ChatSpec): void {
  const flowId = d.flowId as string;
  const flow = getFlow(spec, flowId);
  d.forceAsk = false;
  d.flowId = null;
  d.submitFlow = flowId;
  push(d, {
    role: "assistant",
    kind: "review",
    title: "Review your request",
    rows: reviewRows(d, spec, flowId),
    note: flow.pending_message ?? "This is a request for the team to review. It is not confirmed until the team responds.",
  });
  presentQuestion(d, nextActionQuestion("Ready to submit this request?", ["submit_request", "edit_details"]));
}

function reviewRows(d: Session, spec: ChatSpec, flowId: string): { label: string; value: string }[] {
  const answers = d.answers[flowId] ?? {};
  const rows = getSteps(spec, flowId)
    .filter((s) => s.id !== "consent")
    // A form step shows each detail it collected.
    .flatMap((s) =>
      s.type === "form"
        ? (s.fields ?? []).map((f) => ({ id: f.id, value: displayAnswer(answers[f.id]) }))
        : [{ id: s.id, value: displayAnswer(answers[s.id]) }],
    )
    .map((r) => ({ label: REVIEW_LABELS[r.id] ?? capitalize(humanizeId(r.id)), value: r.value }))
    .filter((r) => r.value !== "");
  if (d.consentAt) rows.push({ label: "Consent", value: `Given ${new Date(d.consentAt).toLocaleString("en-IN")}` });
  return rows;
}

/* ------------------------------------------------------------- actions ---- */

function runAction(d: Session, spec: ChatSpec, id: string): void {
  switch (id) {
    case "book_demo":
      return startFlow(d, spec, "book_demo");
    case "human_handoff":
      return startFlow(d, spec, "contact_request");
    case "submit_request":
      return submit(d);
    case "edit_details": {
      if (!d.submitFlow) return say(d, "There are no details to edit yet.", "warning");
      d.flowId = d.submitFlow;
      d.stepIndex = 0;
      d.forceAsk = true;
      d.consentAt = null;
      say(d, "Sure. Your earlier answers are filled in, so change only what you need.");
      return advance(d, spec);
    }
    case "restart":
      return;
    default:
      say(d, "That option isn't available.", "warning");
  }
}

function routeToFlow(d: Session, spec: ChatSpec, routeId: string): void {
  if (routeId === "human_handoff" || !spec.flows[routeId]) return runAction(d, spec, "human_handoff");
  startFlow(d, spec, routeId);
}

/* ------------------------------------------------------------ submission -- */

function submissionKind(flowId: string): SubmitKind {
  return flowId === "book_demo" ? "demo" : "enquiry";
}

export function buildPayload(d: Session): SubmitPayload | { error: string } {
  const flowId = d.submitFlow;
  if (!flowId) return { error: "There is nothing to submit yet." };
  const answers = d.answers[flowId] ?? {};
  const name = typeof answers.name === "string" ? answers.name : "";
  const email = typeof answers.work_email === "string" ? answers.work_email : "";
  if (!name || !email) return { error: "A name and work email are needed before submitting." };
  if (!d.consentAt) return { error: "Consent is needed before anything can be submitted." };
  const phone = typeof answers.phone === "string" && answers.phone ? answers.phone : undefined;

  return {
    kind: submissionKind(flowId),
    contact: { name, email, phone },
    consent: { given: true, timestamp: d.consentAt },
    summary: {
      request_type: flowId,
      answers,
      questions_for_team: d.context.teamQuestions,
      intent_trace: d.context.intentTrace,
      consent_timestamp: d.consentAt,
    },
  };
}

function submit(d: Session): void {
  if (d.sending) return;
  const payload = buildPayload(d);
  if ("error" in payload) {
    say(d, payload.error, "warning");
    presentQuestion(d, nextActionQuestion("What would you like to do?", ["edit_details"]));
    return;
  }
  d.sending = true;
  d.effect = { type: "submit", payload };
}

function handleSubmitResult(d: Session, spec: ChatSpec, result: SubmitResult): void {
  if (!d.sending) return;
  d.sending = false;
  const retry = () =>
    presentQuestion(d, nextActionQuestion("What would you like to do?", ["submit_request", "edit_details"]));

  if (result.error) {
    say(d, "I couldn't reach the server, so **nothing was submitted**. Please try again.", "danger");
    return retry();
  }

  const body = result.body ?? {};
  const state = typeof body.state === "string" ? body.state : "";
  const serverMessage = typeof body.message === "string" ? body.message : "";
  const ok = result.httpStatus >= 200 && result.httpStatus < 300;

  if (ok && DISPLAYED_STATES.has(state) && spec.submission_and_handoff.submission_states.includes(state)) {
    const reference = typeof body.reference === "string" ? body.reference : undefined;
    const text: Record<string, string> = {
      submitted_pending_review:
        "Your request was submitted and is waiting for review by the Ficungini team. It is not a confirmed booking or appointment.",
      accepted: "The Ficungini team has accepted your request.",
      scheduled: "The Ficungini team has scheduled your request.",
      resolved: "This request is marked as resolved.",
    };
    push(d, {
      role: "assistant",
      kind: "status",
      state,
      text: text[state],
      reference,
      tone: "success",
    });
    d.submitFlow = null;
    presentQuestion(d, startQuestion(spec, "Is there anything else I can help with?"));
    return;
  }

  if (state === "not_configured") {
    say(
      d,
      "Online submissions aren't switched on yet, so **nothing was sent**. You can use the Book a Demo form in the [pricing section](/#pricing) instead.",
      "warning",
    );
  } else if (state === "rejected") {
    say(d, `The request was rejected and **nothing was submitted**.${serverMessage ? ` ${serverMessage}` : ""}`, "danger");
  } else {
    say(
      d,
      `The server didn't confirm the request, so **nothing was submitted**.${serverMessage ? ` ${serverMessage}` : ""}`,
      "danger",
    );
  }
  retry();
}

/* ------------------------------------------------------------- answers ---- */

function displayFor(q: QuestionView, value: Answer): string {
  if (q.type === "number") {
    return value === "" ? "Skip" : `${value}${q.unit ? ` ${q.unit}` : ""}`;
  }
  if (q.type === "text") return value === "" ? "Skip" : String(value);
  const label = (v: string) => q.options?.find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(label).join(", ") : label(String(value));
}

function stepFor(spec: ChatSpec, q: QuestionView): Step | null {
  if (!q.flowId) return null;
  return getSteps(spec, q.flowId).find((s) => s.id === q.id) ?? null;
}

function applyAnswer(d: Session, spec: ChatSpec, q: QuestionView, value: Answer, shown?: string): void {
  markAnswered(d);
  push(d, { role: "user", text: shown ?? displayFor(q, value) });

  if (!q.flowId) {
    const v = String(value);
    if (q.id === spec.flows.start.question.id) {
      // A flow starts it; anything else is a question to answer from what the site says.
      if (v === "human_handoff" || spec.flows[v]) return routeToFlow(d, spec, v);
      return answerQuestion(d, spec, q.options?.find((o) => o.value === v)?.label ?? v);
    }
    if (q.id === "__clarify") {
      const reply = d.context.clarify[v];
      d.context.clarify = {};
      if (reply) {
        say(d, reply);
      } else {
        say(d, "No problem. Tell me in your own words what you'd like to know.");
      }
      return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
    }
    if (q.id === "__disambiguate") {
      if (v === "__none") {
        say(d, spec.engine.unknown_intent_response);
        return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
      }
      return routeToFlow(d, spec, v);
    }
    if (q.id === "__next_action") return runAction(d, spec, v);
    if (q.id === "__tour_offer") {
      const lines = v === "yes" ? spec.tour.accepted : spec.tour.declined;
      say(d, lines[d.nextId % lines.length]);
      if (v === "yes") d.tour = spec.tour.steps;
      return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
    }
    return;
  }

  const flowId = q.flowId;
  setAnswer(d, flowId, q.id, value);
  const key = SHARED_KEYS[q.id];
  if (key && value !== "") d.shared[key] = value;

  if (q.id === "consent") {
    if (value !== "Yes, I consent") {
      d.consentAt = null;
      d.flowId = null;
      d.submitFlow = flowId;
      say(d, "No problem. I won't submit anything.");
      return presentQuestion(d, nextActionQuestion("Would you like to change anything?", ["edit_details"]));
    }
    d.consentAt = NOW();
  }

  d.stepIndex++;
  advance(d, spec);
}

const NOW = () => new Date().toISOString();

/** Answers a question from what the site says, or declines. The question is already in the conversation. */
function answerQuestion(d: Session, spec: ChatSpec, text: string): void {
  const { chat, clarify, page, topic } = answerFor(d, spec, text);
  if (clarify) return askWhichMeant(d, clarify);
  if (chat) {
    say(d, chat);
    tourToPage(d, spec, text, page);
    if (offerTour(d, spec, text, topic)) return;
    return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
  }
  routeFreeText(d, spec, text);
}

/**
 * The written answer to a message: conversation ("hello", "thanks") first, then what the site documents.
 * `clarify` is set when two documented answers fit about equally.
 */
function answerFor(
  d: Session,
  spec: ChatSpec,
  text: string,
): { chat: string | null; clarify: Extract<Understood, { kind: "clarify" }> | null; page: SiteDestination | null; topic: string | null } {
  // The request to be shown around is not part of what is being asked about.
  const asked = WANTS_TOUR.test(text) ? text.replace(new RegExp(WANTS_TOUR.source, "gi"), " ").replace(/\s+/g, " ").trim() : text;
  const small = smallTalk(asked, d.nextId);
  const understood = small ? null : understand(spec, asked);
  if (understood) noteIntent(d, understood.trace);
  const clarify = understood?.kind === "clarify" ? understood : null;
  const answered = understood?.kind === "answer" ? understood : null;
  return {
    chat: small ?? answered?.reply ?? null,
    clarify,
    page: answered ? pageOfAnswer(spec, answered) : null,
    topic: answered?.trace.top[0]?.id ?? null,
  };
}

/** The page a documented answer comes from, as a place Fico can take the visitor. */
function pageOfAnswer(spec: ChatSpec, u: Extract<Understood, { kind: "answer" }>): SiteDestination | null {
  const top = u.trace.top[0];
  if (!top) return null;
  const topic = top.kind === "knowledge" ? spec.knowledge.topics.find((t) => t.id === top.id) : undefined;
  if (!topic) return null;
  const [path, hash] = topic.source.path.split("#");
  if (!path || (path === "/" && !hash)) return null;
  const at = hash ? `#${hash}` : undefined;
  return spec.site_map.find((s) => s.path === path && s.hash === at && !s.find) ?? { id: topic.id, label: topic.source.label, path, hash: at, keywords: [] };
}

/** "Show me around and explain…", "walk me through it": the visitor wants the answer and to be taken where it lives. */
const WANTS_TOUR =
  /\b(?:show|take|walk|guide|lead|bring)\s+(?:me\s+)?(?:around|through)\b|\b(?:can|could|will|would)\s+you\s+(?:go\s+|look\s+)?around\b|\bgive\s+me\s+a\s+(?:tour|walkthrough)\b|\btour\b/i;

const FULL_TOUR =
  /\b(?:full|complete|whole|company|site|website)\s+tour\b|\btour\s+of\s+(?:the\s+|your\s+|this\s+)?(?:company|site|website|ficungini)\b|\bwalk\s+me\s+through\s+(?:the\s+|your\s+)?(?:company|site|website|ficungini)\b|\bgive\s+me\s+a\s+tour\b/i;

/** Someone who keeps asking about the company is offered the whole picture, once. True if it was offered. */
function offerTour(d: Session, spec: ChatSpec, text: string, topic: string | null): boolean {
  if (!topic || !spec.tour.topics.includes(topic)) return false;
  d.context.companyAsks += 1;
  if (d.context.tourOffered || d.context.companyAsks < spec.tour.after_asks || WANTS_TOUR.test(text)) return false;
  d.context.tourOffered = true;
  say(d, spec.tour.offers[d.nextId % spec.tour.offers.length]);
  presentQuestion(
    d,
    choiceQuestion("__tour_offer", "Would you like the tour?", [
      { label: spec.tour.yes, value: "yes" },
      { label: spec.tour.no, value: "no" },
    ]),
  );
  return true;
}

/** After an answer: if the visitor asked to be shown around, the page it came from opens too. */
function tourToPage(d: Session, spec: ChatSpec, text: string, page: SiteDestination | null): void {
  if (page && WANTS_TOUR.test(text)) offerSite(d, spec, { kind: "go", dest: page });
}

/** Says where the visitor is being taken (and hands the page the destination), or which places fit. */
function offerSite(d: Session, spec: ChatSpec, site: SiteMatch): void {
  if (site.kind === "go") {
    const lines = spec.site_replies.go;
    say(d, lines[d.nextId % lines.length].replace("{label}", site.dest.label));
    d.navigate = site.dest;
    return;
  }
  say(
    d,
    spec.site_replies.choose
      .replace("{options}", site.options.map((o) => o.label).join(", "))
      .replace("{first}", site.options[0].label.replace(/^the /i, "")),
  );
}

/** Asks again whatever was being asked, or the opening prompt: a command answers and gets out of the way. */
function reask(d: Session, spec: ChatSpec, q: ReturnType<typeof activeQuestion>): void {
  if (q?.flowId) {
    const { msgId: _id, ...same } = q;
    void _id;
    return presentQuestion(d, same, false);
  }
  presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
}

/** The commands a visitor can type: each starts with @ and does one thing. */
const COMMAND = /^@(navigate|seek|contact)(?![a-z])[\s:,-]*([\s\S]*)$/i;

/**
 * Sends a message to the team as written. The visitor still gives a name and email, reviews it and
 * consents before anything leaves the chat: only the question of what to say is skipped.
 */
function startContact(d: Session, spec: ChatSpec, message: string): void {
  const note = message.slice(0, 1000);
  const shown = note.length > 140 ? `${note.slice(0, 137)}…` : note;
  startFlow(d, spec, "contact_request", {
    answers: { details: note },
    intro: `I'll send this to the team just as you wrote it: “${shown}”. A few details first, and you'll review everything before it goes.`,
  });
}

function runCommand(d: Session, spec: ChatSpec, name: "navigate" | "seek" | "contact", rest: string, raw: string): void {
  const q = activeQuestion(d);
  if (q) markAnswered(d);
  push(d, { role: "user", text: raw });

  if (name === "navigate") {
    if (!rest) {
      say(d, "Where would you like to go? Try “@navigate pricing”, “@navigate the platform page” or “@navigate the team”.");
      return reask(d, spec, q);
    }
    const site = findOnSite(spec, `take me to ${rest}`);
    if (!site) {
      say(d, "I couldn't find that on the site. Try the name of a page, such as Pricing, Platform or Company.");
      return reask(d, spec, q);
    }
    offerSite(d, spec, site);
    return reask(d, spec, q);
  }

  if (name === "seek") {
    if (!rest) {
      say(d, "What would you like to find out? Try “@seek is my data used to train AI models”.");
      return reask(d, spec, q);
    }
    // Only what is documented: no flows, no forms. If it isn't there, say so and keep the question for the team.
    const { chat, clarify } = answerFor(d, spec, rest);
    if (clarify) return askWhichMeant(d, clarify);
    if (chat) {
      say(d, chat);
      return reask(d, spec, q);
    }
    return declineToGuess(d, spec, rest, q);
  }

  // contact
  if (q?.flowId) {
    say(d, "You're partway through a form. Finish it first, or type \"start over\" and then @contact.");
    return reask(d, spec, q);
  }
  if (!rest) {
    say(d, "What would you like to tell the team? Type it and I'll send it along as you write it, once you've reviewed it.");
    return presentQuestion(d, { id: "__contact_message", flowId: null, prompt: "Your message for the team", type: "text", required: true });
  }
  startContact(d, spec, rest);
}

/* ---------------------------------------------------------- text input ---- */

/** Words that make a question a request to act (price it, book it, talk to someone) rather than to be told something. */
const ACTIONABLE = /\b(quote|demo|book|schedule|talk|speak|person|human|sales|contact|call|meet|enquir\w*|buy|purchase|sign ?up|help)\b/i;

function routeFreeText(d: Session, spec: ChatSpec, text: string): void {
  // A question about something with no documented answer is declined, not forced into a flow.
  if (isQuestion(text) && !ACTIONABLE.test(text)) return declineToGuess(d, spec, text, null);
  const r = routeIntent(spec, text);
  if (r.status === "matched") return routeToFlow(d, spec, r.route.id);
  if (r.status === "ambiguous") {
    say(d, "That could fit more than one topic. Which is closest?");
    return presentQuestion(
      d,
      choiceQuestion("__disambiguate", "Which topic is closest?", [
        ...r.candidates.map((c) => ({ label: c.label, value: c.id })),
        { label: "None of these", value: "__none" },
      ]),
    );
  }
  // Not worded like any route: match by meaning, and only act when it is clear.
  const byMeaning = decide(spec, rank(spec, text, ["route"]));
  noteIntent(d, {
    text,
    via: "route",
    decision: byMeaning.status === "answer" ? "route" : byMeaning.status,
    top: byMeaning.ranked.slice(0, 3).map((x) => ({ id: x.id, kind: x.kind, coverage: Math.round(x.coverage * 100) / 100 })),
  });
  if (byMeaning.status === "answer" && spec.flows[byMeaning.top.id]) return routeToFlow(d, spec, byMeaning.top.id);
  if (isQuestion(text)) return declineToGuess(d, spec, text, null);
  say(d, spec.engine.unknown_intent_response);
  presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
}

function handleText(d: Session, spec: ChatSpec, raw: string): void {
  const text = raw.trim();
  if (!text || d.sending) return;

  if (/^(restart|start over|reset|new conversation)$/i.test(text)) {
    Object.assign(d, createSession(spec));
    return;
  }
  if (/^(back|go back)$/i.test(text)) return goBack(d);

  const q = activeQuestion(d);

  // Flirting and inappropriate remarks: polite, professional, never played along with, firmer if repeated.
  if (q?.type !== "text") {
    const boundary = boundaryReply(text, d.context.boundaries);
    if (boundary) {
      if (q) markAnswered(d);
      push(d, { role: "user", text });
      d.context.boundaries += 1;
      say(d, boundary);
      return reask(d, spec, q);
    }
  }

  // "@navigate", "@seek" and "@contact": each does one thing, wherever the visitor is.
  const command = COMMAND.exec(text);
  if (command) return runCommand(d, spec, command[1].toLowerCase() as "navigate" | "seek" | "contact", command[2].trim(), text);

  // The message that "@contact" asked for, on its own line: it goes straight to the team's form.
  if (q?.id === "__contact_message") {
    markAnswered(d);
    push(d, { role: "user", text });
    return startContact(d, spec, text);
  }

  // "Give me a tour of the site": no need to be offered it.
  if (q?.type !== "text" && FULL_TOUR.test(text)) {
    if (q) markAnswered(d);
    push(d, { role: "user", text });
    d.context.tourOffered = true;
    say(d, spec.tour.accepted[d.nextId % spec.tour.accepted.length]);
    d.tour = spec.tour.steps;
    return reask(d, spec, q);
  }

  // "Find the pricing section", "take me to the team": Fico says so and the page takes the visitor there. A form in progress stays open.
  if (q?.type !== "text") {
    const site = findOnSite(spec, text);
    if (site) {
      if (q) markAnswered(d);
      push(d, { role: "user", text });
      offerSite(d, spec, site);
      return reask(d, spec, q);
    }
  }

  if (!q) {
    push(d, { role: "user", text });
    const { chat, clarify, page, topic } = answerFor(d, spec, text);
    if (clarify) return askWhichMeant(d, clarify);
    if (chat) {
      say(d, chat);
      tourToPage(d, spec, text, page);
      if (offerTour(d, spec, text, topic)) return;
      return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
    }
    if (isOffTopic(text)) {
      say(d, offTopicReply(d.nextId));
      return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
    }
    return routeFreeText(d, spec, text);
  }

  const step: Step = stepFor(spec, q) ?? {
    id: q.id,
    question: q.prompt,
    type: "select",
    required: true,
    options: q.options?.map((o) => o.label),
  };
  const parsed = parseAnswer(step, text);

  if (parsed.ok) {
    // Synthetic questions use values that differ from labels.
    let value = parsed.value;
    if (!q.flowId && typeof value === "string") {
      value = q.options?.find((o) => o.label === value)?.value ?? value;
    }
    return applyAnswer(d, spec, q, value, text);
  }

  // "Not sure" is a real answer. Use the question's own unsure option, or help them choose.
  if (q.flowId && unsureLike(text)) {
    const choice = q.type === "select" ? unsureOption(q.options?.map((o) => o.label)) : null;
    if (choice) return applyAnswer(d, spec, q, choice, text);
    markAnswered(d);
    push(d, { role: "user", text });
    say(d, spec.engine.unsure_hint);
    const { msgId: _unsureId, ...again } = q;
    void _unsureId;
    return presentQuestion(d, again, false);
  }

  const generic = !q.flowId;
  markAnswered(d);
  push(d, { role: "user", text });
  const { chat, clarify, page, topic } = answerFor(d, spec, text);
  if (clarify) return askWhichMeant(d, clarify);
  if (chat) {
    say(d, chat);
    tourToPage(d, spec, text, page);
    if (generic && offerTour(d, spec, text, topic)) return;
    if (generic && q.id === spec.flows.start.question.id) {
      return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
    }
    const { msgId: _chatId, ...same } = q;
    void _chatId;
    return presentQuestion(d, same, false);
  }
  if (generic && isOffTopic(text)) {
    say(d, offTopicReply(d.nextId));
    return presentQuestion(d, startQuestion(spec, entryPrompt(d, spec)));
  }
  if (generic) return routeFreeText(d, spec, text);
  // A question that has nothing to do with the work gets the same polite limit, and the flow carries on.
  if (isQuestion(text) && isOffTopic(text)) {
    say(d, offTopicReply(d.nextId));
    const { msgId: _offId, ...same } = q;
    void _offId;
    return presentQuestion(d, same, false);
  }
  if (isQuestion(text)) {
    const asked = routeIntent(spec, text);
    const wantsPerson = asked.status === "matched" && (asked.route.id === "human_handoff" || asked.route.id === "book_demo");
    if (!wantsPerson) return declineToGuess(d, spec, text, q);
  }

  const r = routeIntent(spec, text);
  if (r.status === "matched" && (r.route.id === "human_handoff" || r.route.id === "book_demo")) {
    return routeToFlow(d, spec, r.route.id);
  }
  const choosing = q.type === "select" || q.type === "multi_select";
  say(
    d,
    `${parsed.message} ${choosing ? "Please choose an option" : "Please try again"}, or type **back** or **start over**.`,
    "warning",
  );
  const { msgId: _msgId, ...again } = q;
  void _msgId;
  presentQuestion(d, again, false);
}

/* ---------------------------------------------------------------- back ---- */

function goBack(d: Session): void {
  if (d.sending || d.history.length < 2) return;
  d.history.pop(); // the question currently shown
  const prev = d.history[d.history.length - 1];
  d.messages = [...prev.messages];
  d.flowId = prev.flowId;
  d.stepIndex = prev.stepIndex;
  const i = d.messages.length - 1;
  const last = d.messages[i];
  if (last.role === "assistant" && last.kind === "question") {
    if (last.question.id === "consent") d.consentAt = null;
    // Show the answer that was given before, now that we are back on it.
    const { flowId, id } = last.question;
    const prefill = flowId ? d.answers[flowId]?.[id] : undefined;
    // A form shows the details given before.
    const values =
      flowId && last.question.fields
        ? Object.fromEntries(last.question.fields.map((f) => [f.id, String(d.answers[flowId]?.[f.id] ?? "")]))
        : last.question.values;
    d.messages[i] = { ...last, question: { ...last.question, prefill, values } } as Msg;
  }
}

/* -------------------------------------------------------------- reduce ---- */

export function reduce(session: Session, spec: ChatSpec, event: ChatEvent): Session {
  const d = clone(session);

  switch (event.type) {
    case "restart":
      return createSession(spec);

    case "back":
      goBack(d);
      return d;

    case "profile": {
      const q = activeQuestion(d);
      if (!q || d.sending || !q.flowId) return d;
      const step = stepFor(spec, q);
      if (!step || step.type !== "form") return d;
      const checked = validateProfile(step.fields ?? [], event.values);
      if (!checked.ok) return d;
      markAnswered(d);
      const v = checked.values;
      push(d, { role: "user", text: [v.name, v.company, v.work_email].filter(Boolean).join(" · ") });
      storeProfile(d, q.flowId, step, v);
      const first = (v.name ?? "").split(/\s+/)[0];
      say(d, first ? `Thanks, ${first}. I'll remember these, so you won't be asked again.` : "Thanks, I'll remember these.");
      d.stepIndex++;
      advance(d, spec);
      return d;
    }

    case "answer": {
      const q = activeQuestion(d);
      if (!q || d.sending) return d;
      const step = stepFor(spec, q);
      if (step) {
        const checked = validateValue(step, event.value);
        if (!checked.ok) return d;
        applyAnswer(d, spec, q, checked.value);
      } else {
        const v = typeof event.value === "string" ? event.value : null;
        if (v === null || !q.options?.some((o) => o.value === v)) return d;
        if (v === "restart" && q.id === "__next_action") return createSession(spec);
        applyAnswer(d, spec, q, v);
      }
      return d;
    }

    case "text":
      handleText(d, spec, event.text);
      return d;

    case "action": {
      if (d.sending) return d;
      if (event.id === "restart") return createSession(spec);
      if (activeQuestion(d)) markAnswered(d);
      push(d, { role: "user", text: event.label ?? ACTION_LABELS[event.id] ?? humanizeId(event.id) });
      runAction(d, spec, event.id);
      return d;
    }

    case "submit-result":
      handleSubmitResult(d, spec, event.result);
      return d;
  }
}
