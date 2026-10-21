import { site } from "@/content/site";

// Shared by the `$ subscribe` prompt, the terminal's `subscribe <email>` and the API route.
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type SubscribeResult = { ok: true } | { ok: false; reason: "invalid" | "not_configured" | "failed" };

// `website` is the prompt's honeypot field: empty for people, filled by form-stuffing bots.
export async function subscribe(email: string, website = ""): Promise<SubscribeResult> {
  if (!EMAIL_RE.test(email)) return { ok: false, reason: "invalid" };
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, reason: data.error === "not_configured" || data.error === "invalid" ? data.error : "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

// Until Beehiiv is connected: open the visitor's mail app with their address filled in, so the signup isn't lost.
export function mailtoSignup(email: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent("Put me on the list")}&body=${encodeURIComponent(email)}`;
}
