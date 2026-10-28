"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Answer } from "@/lib/chat/types";
import { UNSURE, validateProfile } from "@/lib/chat/engine";
import type { QuestionView } from "@/lib/chat/session";

const chip =
  "rounded-[2px] border border-(--oc-border) bg-white px-3 py-2 text-left text-[13px] leading-snug text-(--oc-text) transition-colors duration-[160ms] ease-out hover:border-(--oc-brand) hover:bg-(--oc-surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--oc-brand) disabled:opacity-50";

const primary =
  "rounded-[2px] bg-(--oc-brand) px-4 py-2 text-sm font-medium text-white transition-colors duration-[160ms] ease-out hover:bg-(--oc-brand-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--oc-brand) disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Answer controls for the question the assistant just asked. Typing in the
 * composer is always available as well.
 */
export default function QuestionControls({
  question,
  onAnswer,
  onProfile,
  disabled,
}: {
  question: QuestionView;
  onAnswer: (value: Answer) => void;
  onProfile: (values: Record<string, string>) => void;
  disabled: boolean;
}) {
  const layout = "flex flex-wrap gap-1.5";

  // The opening question is answered by typing. Matching options still appear as suggestions while typing.
  if (question.typeOnly) return null;

  if (question.type === "select") {
    const previous = typeof question.prefill === "string" ? question.prefill : null;
    return (
      <div className={`mt-2 ${layout}`} role="group" aria-label="Answer options">
        {question.options?.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={disabled}
            aria-pressed={previous === o.value}
            onClick={() => onAnswer(o.value)}
            className={`${chip} ${previous === o.value ? "!border-(--oc-brand) !bg-(--oc-surface-hover)" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "form") {
    return <ProfileForm question={question} onSubmit={onProfile} disabled={disabled} />;
  }

  if (question.type === "multi_select") {
    return <MultiSelect question={question} onAnswer={onAnswer} disabled={disabled} />;
  }

  if (question.type === "number") {
    return <NumberInput question={question} onAnswer={onAnswer} disabled={disabled} />;
  }

  // text: the composer is the input; offer a skip for optional questions.
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <p className="text-sm text-(--oc-text-2)">
        {question.format === "email" ? "Type your email below." : "Type your answer below."}
      </p>
      {!question.required && (
        <button type="button" disabled={disabled} onClick={() => onAnswer("")} className={chip}>
          Skip
        </button>
      )}
    </div>
  );
}

/** Takes a customer's details in one go, once. */
function ProfileForm({
  question,
  onSubmit,
  disabled,
}: {
  question: QuestionView;
  onSubmit: (values: Record<string, string>) => void;
  disabled: boolean;
}) {
  const fields = question.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, question.values?.[f.id] ?? ""])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const autoComplete: Record<string, string> = {
    name: "name",
    work_email: "email",
    company: "organization",
    phone: "tel",
    location: "address-level2",
    site_city: "address-level2",
  };

  return (
    <form
      className="mt-3 flex flex-col gap-2.5"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const checked = validateProfile(fields, values);
        if (checked.ok) onSubmit(checked.values);
        else setErrors(checked.errors);
      }}
    >
      {fields.map((f) => (
        <div key={f.id}>
          <label htmlFor={`pf-${f.id}`} className="text-xs font-medium text-(--oc-text-2)">
            {f.label}
            {f.required && <span className="text-(--oc-danger)"> *</span>}
          </label>
          <input
            id={`pf-${f.id}`}
            type={f.format === "email" ? "email" : f.format === "phone" ? "tel" : "text"}
            autoComplete={autoComplete[f.id]}
            value={values[f.id] ?? ""}
            disabled={disabled}
            aria-invalid={Boolean(errors[f.id])}
            aria-describedby={errors[f.id] ? `pf-${f.id}-err` : undefined}
            onChange={(e) => {
              setValues((v) => ({ ...v, [f.id]: e.target.value }));
              if (errors[f.id]) setErrors((x) => ({ ...x, [f.id]: "" }));
            }}
            className="mt-1 w-full rounded-[2px] border border-(--oc-border) bg-white px-3 py-2 text-sm focus:border-(--oc-brand) focus:outline-none aria-[invalid=true]:border-(--oc-danger)"
          />
          {errors[f.id] && (
            <p id={`pf-${f.id}-err`} className="mt-1 text-xs text-(--oc-danger)">
              {errors[f.id]}
            </p>
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={disabled} className={primary}>
          Continue
        </button>
        <span className="text-xs text-(--oc-muted)">You&apos;ll only need to enter this once.</span>
      </div>
    </form>
  );
}

function MultiSelect({
  question,
  onAnswer,
  disabled,
}: {
  question: QuestionView;
  onAnswer: (value: Answer) => void;
  disabled: boolean;
}) {
  const [picked, setPicked] = useState<string[]>(Array.isArray(question.prefill) ? question.prefill : []);
  const toggle = (v: string) =>
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Answer options, choose any that apply">
        {question.options?.map((o) => {
          const on = picked.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              disabled={disabled}
              aria-pressed={on}
              onClick={() => toggle(o.value)}
              className={`${chip} flex items-center gap-1.5 ${on ? "!border-(--oc-brand) !bg-white" : ""}`}
            >
              {on && <Check className="h-3.5 w-3.5 text-(--oc-brand)" aria-hidden />}
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          disabled={disabled || (question.required && picked.length === 0)}
          onClick={() => onAnswer(picked)}
          className={primary}
        >
          Continue
        </button>
        <span className="text-xs text-(--oc-muted)">Choose all that apply</span>
      </div>
    </div>
  );
}

function NumberInput({
  question,
  onAnswer,
  disabled,
}: {
  question: QuestionView;
  onAnswer: (value: Answer) => void;
  disabled: boolean;
}) {
  const start =
    typeof question.prefill === "number"
      ? question.prefill
      : typeof question.default === "number"
        ? question.default
        : "";
  const [value, setValue] = useState(String(start));
  const parsed = value.trim() === "" ? Number.NaN : Number(value);

  return (
    <form
      className="mt-3 flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (Number.isFinite(parsed)) onAnswer(parsed);
      }}
    >
      <label className="sr-only" htmlFor={`num-${question.id}`}>
        {question.prompt}
      </label>
      <input
        id={`num-${question.id}`}
        type="number"
        inputMode="decimal"
        min={question.min}
        max={question.max}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        className="w-28 rounded-[2px] border border-(--oc-border) bg-white px-3 py-2 text-sm focus:border-(--oc-brand) focus:outline-none"
      />
      {question.unit && <span className="text-sm text-(--oc-text-2)">{question.unit}</span>}
      <button type="submit" disabled={disabled || !Number.isFinite(parsed)} className={primary}>
        Continue
      </button>
      {question.unsure && (
        <button type="button" disabled={disabled} onClick={() => onAnswer(UNSURE)} className={chip}>
          {question.unsure}
        </button>
      )}
      {!question.required && (
        <button type="button" disabled={disabled} onClick={() => onAnswer("")} className={chip}>
          Skip
        </button>
      )}
    </form>
  );
}
