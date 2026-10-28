import type { SubmitPayload, SubmitResult } from "./session";

/** The one backend route the chat may submit to. */
export const SUBMIT_ENDPOINT = "/api/support-requests";

/**
 * Posts a request and reports exactly what the server said. It never turns a
 * missing or unreadable answer into success.
 */
export async function submitRequest(payload: SubmitPayload): Promise<SubmitResult> {
  try {
    const res = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let body: { state?: unknown; message?: unknown; reference?: unknown } | null = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { httpStatus: res.status, body };
  } catch {
    return { error: "network" };
  }
}
