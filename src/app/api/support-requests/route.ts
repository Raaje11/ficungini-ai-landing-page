/**
 * Support-chat submission endpoint (demo request, enquiry).
 *
 * Emails a plain-text case summary to the sales inbox via Resend. It reports
 * success only after the provider accepts the message, and then only as
 * `submitted_pending_review`; accepted / scheduled / resolved need a real
 * tracking backend, which this endpoint does not have.
 *
 * Env:
 *   RESEND_API_KEY          required; without it the endpoint answers 503 not_configured
 *   SUPPORT_EMAIL_FROM      required with the key (a sender verified in Resend)
 *   SUPPORT_REQUEST_TO      required; the inbox that receives requests. There is no default, so a
 *                           misconfigured deployment answers 503 instead of mailing a guessed address
 */

const MAX_BODY_BYTES = 64 * 1024;
const KINDS = ["demo", "enquiry"] as const;

type Kind = (typeof KINDS)[number];

type Payload = {
  kind: Kind;
  contact: { name: string; email: string; phone?: string };
  consent: { given: true; timestamp: string };
  /** what the chat collected, serialised by the client */
  summary: Record<string, unknown>;
};

function reply(status: number, state: string, message: string, extra = {}) {
  return Response.json({ state, message, ...extra }, { status });
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validate(raw: unknown): { ok: true; value: Payload } | { ok: false; error: string } {
  if (!isRecord(raw)) return { ok: false, error: "Body must be a JSON object." };

  const { kind, contact, consent, summary } = raw;
  if (!KINDS.includes(kind as Kind)) return { ok: false, error: "Unknown request kind." };

  if (!isRecord(contact)) return { ok: false, error: "Contact details are required." };
  const name = typeof contact.name === "string" ? contact.name.trim() : "";
  const email = typeof contact.email === "string" ? contact.email.trim() : "";
  const phone = typeof contact.phone === "string" ? contact.phone.trim() : undefined;
  if (!name || name.length > 200) return { ok: false, error: "A valid name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (phone && phone.length > 40) return { ok: false, error: "Phone number is too long." };

  if (!isRecord(consent) || consent.given !== true || typeof consent.timestamp !== "string" || Number.isNaN(Date.parse(consent.timestamp))) {
    return { ok: false, error: "Consent is required before submission." };
  }

  if (!isRecord(summary)) return { ok: false, error: "A case summary is required." };

  return {
    ok: true,
    value: {
      kind: kind as Kind,
      contact: { name, email, phone },
      consent: { given: true, timestamp: consent.timestamp },
      summary,
    },
  };
}

function renderEmail(p: Payload, reference: string): string {
  return [
    `Reference: ${reference}`,
    `Type: ${p.kind}`,
    `Consent given: ${p.consent.timestamp}`,
    "",
    "Contact",
    `  Name:  ${p.contact.name}`,
    `  Email: ${p.contact.email}`,
    `  Phone: ${p.contact.phone ?? "not provided"}`,
    "",
    "Case summary",
    JSON.stringify(p.summary, null, 2),
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SUPPORT_EMAIL_FROM;
  const to = process.env.SUPPORT_REQUEST_TO;
  if (!apiKey || !from || !to) {
    return reply(503, "not_configured", "Submissions are not enabled yet, so nothing was sent.");
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return reply(413, "rejected", "Request is too large.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return reply(400, "rejected", "Body is not valid JSON.");
  }

  const checked = validate(raw);
  if (!checked.ok) return reply(400, "rejected", checked.error);
  const payload = checked.value;

  const reference = `FIC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.contact.email,
        subject: `[${reference}] ${payload.kind} request from ${payload.contact.name}`,
        text: renderEmail(payload, reference),
      }),
    });
  } catch {
    return reply(502, "failed", "Could not reach the email service. Nothing was submitted.");
  }

  if (!res.ok) {
    return reply(502, "failed", "The email service did not accept the request. Nothing was submitted.");
  }

  return reply(200, "submitted_pending_review", "Your request was submitted for review.", { reference });
}
