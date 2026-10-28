"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronLeft, RotateCcw, SendHorizontal } from "lucide-react";
import { chatSpec } from "@/lib/chat/spec";
import { activeQuestion, createSession, reduce, thinkingFor } from "@/lib/chat/session";
import type { ChatEvent, Msg } from "@/lib/chat/session";
import { submitRequest } from "@/lib/chat/submit";
import { goToSite, startTour } from "@/lib/chat/bridge";
import { commandSuggestions, suggest } from "@/lib/chat/suggestions";
import type { Answer } from "@/lib/chat/types";
import Markdown from "./Markdown";
import QuestionControls from "./QuestionControls";
import ThinkingLoader from "./ThinkingLoader";
import FicoCard from "./FicoCard";
import FicoOrb from "./FicoOrb";
import { ReviewCard, StatusCard } from "./cards";

const iconButton =
  "flex h-9 w-9 items-center justify-center rounded-[2px] text-ink-500 transition-colors duration-[160ms] ease-out hover:bg-ink-100 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone";

const linkButton =
  "inline-flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-xs text-(--oc-text-2) transition-colors duration-[160ms] ease-out hover:bg-(--oc-surface) hover:text-(--oc-text) focus-visible:outline-2 focus-visible:outline-(--oc-brand) disabled:opacity-40";

/** How long Fico "thinks" before a reply appears, so answers don't land instantly. */
const THINK_MS = 1000;
/** Replies that include a write-up take a little longer. */
const THINK_CARD_MS = 1500;
const CARD_KINDS = new Set(["review"]);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Words stream in at this pace, so a reply reads as being written rather than pasted. */
const streamMs = (text: string) => Math.min(1400, Math.max(300, text.split(/\s+/).length * 26));

/** The first two messages of a new conversation. */
const latestMessages = (s: ReturnType<typeof createSession>) => s.messages.slice(0, 2);

const bubble = "rounded-[2px] bg-(--oc-surface) px-3.5 py-2.5 text-sm leading-relaxed";

export default function ChatPanel({ onMinimize, open = true }: { onMinimize: () => void; open?: boolean }) {
  const [session, setSession] = useState(() => createSession(chatSpec));
  // The greeting is written out the first time the chat is opened, not while it is hidden.
  const [opened, setOpened] = useState(false);
  if (open && !opened) setOpened(true);
  const latest = useRef(session);
  const [draft, setDraft] = useState("");
  const [highlight, setHighlight] = useState(-1);
  const [showCard, setShowCard] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // While set, only this many messages are shown: the reply is held back for THINK_MS.
  const [hold, setHold] = useState<number | null>(null);
  // What Fico says it is doing, and when each new message appears, so a reply unfolds in order.
  const [phrases, setPhrases] = useState<string[]>(chatSpec.ui.thinking.default);
  const [plan, setPlan] = useState<Record<string, number>>(() => {
    // A short greeting first, then the question a beat later, as a person would.
    const [hello, ask] = latestMessages(createSession(chatSpec));
    return hello && ask ? { [hello.id]: 250, [ask.id]: 250 + 900 } : {};
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const apply = useCallback((event: ChatEvent) => {
    const next = reduce(latest.current, chatSpec, event);
    latest.current = next;
    setSession(next);
    return next;
  }, []);

  /** Run an event; if it asks to submit, call the backend and report only what it says. */
  const dispatch = useCallback(
    (event: ChatEvent) => {
      const before = latest.current.messages.length;
      const next = apply(event);
      if (event.type === "answer" || event.type === "text" || event.type === "action" || event.type === "profile") {
        // Show the person's own message now and hold Fico's reply back briefly.
        let shown = before;
        while (shown < next.messages.length && next.messages[shown].role === "user") shown++;
        if (shown < next.messages.length) {
          const fresh = next.messages.slice(shown);
          const heavy = fresh.some((m) => m.role === "assistant" && CARD_KINDS.has(m.kind));
          let at = 0;
          const schedule: Record<string, number> = {};
          for (const m of fresh) {
            if (m.role !== "assistant") continue;
            schedule[m.id] = at;
            at += m.kind === "text" ? streamMs(m.text) + 250 : m.kind === "question" ? streamMs(m.question.prompt) + 250 : 300;
          }
          setPlan(schedule);
          setPhrases(thinkingFor(chatSpec, fresh));
          setHold(shown);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setHold(null), heavy ? THINK_CARD_MS : THINK_MS);
        }
      }
      if (next.effect) {
        submitRequest(next.effect.payload).then((result) => apply({ type: "submit-result", result }));
      }
      // Asked to be shown somewhere: let the reply land first, then the chat steps aside and the orb takes over.
      if (next.navigate) {
        const dest = next.navigate;
        window.setTimeout(() => goToSite(dest), 1800);
      }
      // Agreed to the tour: the same, then it runs with Fico's explanations at the bottom of the page.
      if (next.tour) {
        const steps = next.tour;
        window.setTimeout(() => startTour(steps), 2200);
      }
    },
    [apply],
  );

  // Keep the view pinned to the newest line while a reply is being written.
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const log = logRef.current;
    const box = scrollRef.current;
    if (!log || !box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (box.scrollHeight - box.scrollTop - box.clientHeight < 160) box.scrollTop = box.scrollHeight;
    });
    ro.observe(log);
    return () => ro.disconnect();
  }, []);

  const thinking = hold !== null;
  const busy = session.sending || thinking;
  const messages = thinking ? session.messages.slice(0, hold) : session.messages;
  const question = activeQuestion(session);
  const started = session.messages.some((m) => m.role === "user");

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages.length, busy]);

  // Pre-fill the composer when going back to a text question.
  const questionKey = question?.msgId;
  const prefill = question?.type === "text" && typeof question.prefill === "string" ? question.prefill : "";
  const [seenQuestion, setSeenQuestion] = useState(questionKey);
  if (seenQuestion !== questionKey) {
    setSeenQuestion(questionKey);
    setDraft(prefill);
  }

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  // Type-ahead: only while choosing, not while typing a free-text answer such as a name or email.
  const optionLabels = useMemo(() => question?.options?.map((o) => o.label) ?? [], [question?.options]);
  const suggestions = useMemo(
    () =>
      /^@[a-z]*$/i.test(draft)
        ? commandSuggestions(draft)
        : question?.type === "text" || question?.type === "number"
          ? []
          : suggest(draft, optionLabels),
    [draft, optionLabels, question?.type],
  );
  const showSuggestions = suggestions.length > 0 && !dismissed && !busy;

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setDraft("");
    setHighlight(-1);
    dispatch({ type: "text", text });
  };
  const send = () => sendText(draft);

  const answer = (value: Answer) => dispatch({ type: "answer", value });
  const shareProfile = (values: Record<string, string>) => dispatch({ type: "profile", values });
  const canGoBack = session.history.length > 1 && !busy;

  const placeholder = question?.type === "text" ? "Type your answer…" : chatSpec.ui.composer_placeholder;

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-ink-200 bg-white pl-4 pr-3 pt-[env(safe-area-inset-top)] text-black sm:h-16">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCard(true)}
            aria-label="View Fico's profile"
            className="shrink-0 rounded-full transition-transform duration-200 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantone"
          >
            <span className="block h-9 w-9">
              <FicoOrb />
            </span>
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-tight">Fico</h2>
          </div>
        </div>
        <button type="button" onClick={onMinimize} aria-label="Minimize" className={iconButton}>
          <ChevronDown className="h-5 w-5" />
        </button>
      </header>

      {showCard && (
        <FicoCard
          onClose={() => setShowCard(false)}
          onAsk={() => {
            setShowCard(false);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          onTeam={() => {
            setShowCard(false);
            dispatch({ type: "action", id: "human_handoff", label: "Talk to the team" });
          }}
        />
      )}

      <div ref={scrollRef} className="oc-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          className="mx-auto flex w-full max-w-[760px] flex-col gap-3 px-4 py-4"
        >
          {(opened ? messages : []).map((m, i) => (
            <MessageView
              key={m.id}
              msg={m}
              showAvatar={m.role === "assistant" && messages[i - 1]?.role !== "assistant"}
              active={question?.msgId === m.id}
              disabled={busy}
              onAnswer={answer}
              onProfile={shareProfile}
              revealAt={plan[m.id]}
            />
          ))}

          {started && question && !thinking && (
            <GuidedFooter
              canGoBack={canGoBack}
              onBack={() => dispatch({ type: "back" })}
              onRestart={() => dispatch({ type: "restart" })}
            />
          )}

          {busy && (
            <div className="flex items-end gap-2" role="status">
              <Avatar />
              <div className={bubble} aria-label="Fico is typing">
                <ThinkingLoader key={phrases.join("|")} phrases={session.sending ? chatSpec.ui.thinking.submit : phrases} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {showSuggestions && (
          <ul
            id="fico-suggestions"
            role="listbox"
            aria-label="Suggestions"
            className="absolute inset-x-4 bottom-full mb-1 overflow-hidden rounded-[2px] border border-(--oc-border) bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          >
            {suggestions.map((s, i) => (
              <li key={s} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => sendText(s)}
                  className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                    i === highlight ? "bg-pantone-100 text-pantone-700" : "text-(--oc-text) hover:bg-(--oc-surface)"
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2 rounded-[2px] border border-(--oc-border) bg-white py-1.5 pl-3 pr-1.5 transition-colors duration-[160ms] ease-out focus-within:border-(--oc-brand)"
        >
          <label htmlFor="fico-chat-input" className="sr-only">
            Your message
          </label>
          <textarea
            id="fico-chat-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={1000}
            disabled={busy}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="fico-suggestions"
            aria-autocomplete="list"
            onChange={(e) => {
              setDraft(e.target.value);
              setHighlight(-1);
              setDismissed(false);
            }}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (showSuggestions) {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const n = suggestions.length;
                  setHighlight((h) => (e.key === "ArrowDown" ? (h + 1) % n : (h - 1 + n) % n));
                  return;
                }
                if (e.key === "Tab" && highlight >= 0) {
                  e.preventDefault();
                  setDraft(suggestions[highlight]);
                  setHighlight(-1);
                  return;
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  setDismissed(true);
                  return;
                }
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (showSuggestions && highlight >= 0) sendText(suggestions[highlight]);
                else send();
              }
            }}
            className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-6 placeholder:text-(--oc-muted) focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || busy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-(--oc-brand) text-white transition-colors duration-[160ms] ease-out hover:bg-(--oc-brand-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--oc-brand) disabled:cursor-not-allowed disabled:opacity-30"
          >
            <SendHorizontal className="h-[17px] w-[17px]" />
          </button>
        </form>
      </div>
    </div>
  );
}

/** Fico beside its messages: the same sphere, still, so a long conversation doesn't fill with blinking. */
function Avatar() {
  return (
    <span aria-hidden className="block h-7 w-7 shrink-0">
      <FicoOrb lively={false} />
    </span>
  );
}

function GuidedFooter({
  canGoBack,
  onBack,
  onRestart,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 pl-[30px] text-xs text-(--oc-muted)">
      <button type="button" onClick={onBack} disabled={!canGoBack} className={linkButton}>
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
        Back
      </button>
      <button type="button" onClick={onRestart} className={linkButton}>
        <RotateCcw className="h-3 w-3" aria-hidden />
        Start over
      </button>
    </div>
  );
}

function MessageView({
  msg,
  showAvatar,
  active,
  disabled,
  onAnswer,
  onProfile,
  revealAt,
}: {
  msg: Msg;
  showAvatar: boolean;
  active: boolean;
  disabled: boolean;
  onAnswer: (v: Answer) => void;
  onProfile: (values: Record<string, string>) => void;
  /** Set for a new reply: when, after it is released, this message appears. Undefined means show at once. */
  revealAt?: number;
}) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-[2px] bg-(--oc-brand) px-3.5 py-2.5 text-sm leading-relaxed text-white">
          {msg.text}
        </p>
      </div>
    );
  }

  let body: React.ReactNode;
  let wide = false;
  switch (msg.kind) {
    case "welcome":
      body = (
        <div className={bubble}>
          <p className="font-semibold">Hi, I’m Fico</p>
          <Streamed text={msg.text} stream={revealAt !== undefined}>
            {(visible) => <Markdown text={visible} className="mt-1 text-sm leading-relaxed" />}
          </Streamed>
        </div>
      );
      break;
    case "text": {
      const tone =
        msg.tone === "danger"
          ? "text-(--oc-danger)"
          : msg.tone === "warning"
            ? "text-(--oc-warning)"
            : msg.tone === "info"
              ? "text-(--oc-text-2)"
              : "";
      body = (
        <div className={bubble}>
          <Streamed text={msg.text} stream={revealAt !== undefined}>
            {(visible) => <Markdown text={visible} className={`text-sm leading-relaxed ${tone}`} />}
          </Streamed>
        </div>
      );
      break;
    }
    case "question":
      body = (
        <Streamed text={msg.question.prompt} stream={revealAt !== undefined}>
          {(visible, done) => (
            <>
              <p className={`${bubble} font-medium`}>{visible}</p>
              {done && active && !msg.answered && (
                <QuestionControls key={msg.id} question={msg.question} onAnswer={onAnswer} onProfile={onProfile} disabled={disabled} />
              )}
            </>
          )}
        </Streamed>
      );
      break;
    default:
      wide = true;
      body =
        msg.kind === "review" ? (
          <ReviewCard title={msg.title} rows={msg.rows} note={msg.note} />
        ) : (
          <StatusCard state={msg.state} text={msg.text} reference={msg.reference} />
        );
  }

  return (
    <Reveal after={revealAt}>
      <div className="flex items-start gap-2">
        {showAvatar ? <Avatar /> : <span className="w-7 shrink-0" aria-hidden />}
        <div className={`min-w-0 ${wide ? "flex-1" : "max-w-[88%]"}`}>{body}</div>
      </div>
    </Reveal>
  );
}

/** Holds a new message back until its turn, then fades it in. */
function Reveal({ after, children }: { after?: number; children: ReactNode }) {
  const [state, setState] = useState<"waiting" | "fading" | "shown">(() =>
    after === undefined || prefersReducedMotion() ? "shown" : after <= 0 ? "fading" : "waiting",
  );
  useEffect(() => {
    if (after === undefined || prefersReducedMotion()) return;
    const a = setTimeout(() => setState("fading"), Math.max(0, after));
    const b = setTimeout(() => setState("shown"), Math.max(0, after) + 30);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [after]);
  if (state === "waiting") return null;
  return <div className={state === "shown" ? "opacity-100 transition-opacity duration-200" : "opacity-0"}>{children}</div>;
}

/** Writes a reply out word by word. Shows it whole when it is not a new reply, or motion is reduced. */
function Streamed({
  text,
  stream,
  children,
}: {
  text: string;
  stream: boolean;
  children: (visible: string, done: boolean) => ReactNode;
}) {
  const tokens = useMemo(() => text.match(/\S+\s*/g) ?? [text], [text]);
  const [count, setCount] = useState(() => (stream && !prefersReducedMotion() ? 0 : tokens.length));
  useEffect(() => {
    if (!stream || prefersReducedMotion()) return;
    const step = Math.min(34, Math.max(12, 1100 / tokens.length));
    const iv = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= tokens.length) clearInterval(iv);
        return Math.min(tokens.length, c + 1);
      });
    }, step);
    return () => clearInterval(iv);
  }, [stream, tokens]);
  return <>{children(tokens.slice(0, count).join(""), count >= tokens.length)}</>;
}
