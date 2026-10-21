import { checkBotId } from "botid/server";
import { EMAIL_RE } from "@/lib/subscribe";

// POST /api/subscribe { email } adds the address to the Kit (ConvertKit) form, which handles
// double opt-in and the welcome email. Needs KIT_API_KEY and KIT_FORM_ID in Vercel. Until they're
// set it answers 503 not_configured and the page falls back to an email.
// Every signup triggers a confirmation email, so bots are turned away before Kit sees the address:
// BotID (see instrumentation-client.ts) plus a honeypot field that only bots fill in.
export async function POST(request: Request) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return Response.json({ error: "denied" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown; website?: unknown } | null;
  if (body?.website) {
    // Pretend it worked so the bot has no signal to adapt to.
    return Response.json({ ok: true });
  }
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const key = process.env.KIT_API_KEY;
  const form = process.env.KIT_FORM_ID;
  if (!key || !form) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch(`https://api.kit.com/v4/forms/${form}/subscribers`, {
    method: "POST",
    headers: { "X-Kit-Api-Key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: email, referrer: "https://mericot.com" }),
  });
  if (!res.ok) {
    return Response.json({ error: "failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
