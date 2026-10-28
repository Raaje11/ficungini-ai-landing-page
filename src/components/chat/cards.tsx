import { CircleCheck } from "lucide-react";

const card = "rounded-[2px] border border-(--oc-border) bg-white p-4 shadow-(--oc-shadow) sm:p-5";

export function ReviewCard({
  title,
  rows,
  note,
}: {
  title: string;
  rows: { label: string; value: string }[];
  note: string;
}) {
  return (
    <section className={card} aria-label={title}>
      <h3 className="text-base font-semibold">{title}</h3>
      <dl className="mt-3 divide-y divide-(--oc-border) rounded-[2px] border border-(--oc-border)">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-3 py-2.5 text-sm sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-(--oc-text-2)">{r.label}</dt>
            <dd className="min-w-0 break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm leading-relaxed text-(--oc-text-2)">{note}</p>
    </section>
  );
}

const STATE_LABEL: Record<string, string> = {
  submitted_pending_review: "Submitted · pending review",
  accepted: "Accepted",
  scheduled: "Scheduled",
  resolved: "Resolved",
};

export function StatusCard({ state, text, reference }: { state: string; text: string; reference?: string }) {
  return (
    <section
      role="status"
      className="rounded-[2px] border border-(--oc-success)/40 bg-(--oc-success)/5 p-4 sm:p-5"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-(--oc-success)">
        <CircleCheck className="h-4 w-4" aria-hidden />
        {STATE_LABEL[state] ?? state}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed">{text}</p>
      {reference && (
        <p className="mt-2 text-sm text-(--oc-text-2)">
          Reference: <span className="font-medium text-(--oc-text)">{reference}</span>
        </p>
      )}
    </section>
  );
}
