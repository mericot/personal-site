import { checkBotId } from "botid/server";
import { EMAIL_RE } from "@/lib/subscribe";

// POST /api/subscribe { email } adds the address to the Kit (ConvertKit) form, which sends
// any welcome email. Needs KIT_API_KEY and KIT_FORM_ID in Vercel. Until they're
// set it answers 503 not_configured and the page falls back to an email.
// Every signup goes straight onto the list, so bots are kept away from Kit: a honeypot field that only
// bots fill in, plus BotID (see instrumentation-client.ts).
// BotID is log-only for now: in production it flagged every real visitor as a bot (October 2026). Its
// verdict is logged, without the address or IP, until we know why; then set BLOCK_BOTS back to true.
const BLOCK_BOTS = false;

export async function POST(request: Request) {
  const verification = await checkBotId();
  if (verification.isBot) {
    console.warn(
      "botid flagged signup",
      JSON.stringify({
        blocked: BLOCK_BOTS,
        isVerifiedBot: verification.isVerifiedBot,
        bypassed: verification.bypassed,
        reason: "classificationReason" in verification ? verification.classificationReason : undefined,
        hasToken: request.headers.has("x-is-human"),
        viaCloudflare: request.headers.has("cf-ray"),
        userAgent: request.headers.get("user-agent"),
      }),
    );
    if (BLOCK_BOTS) {
      return Response.json({ error: "denied" }, { status: 403 });
    }
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

  // Kit only adds existing subscribers to a form (404 otherwise), so create them first. New ones start
  // inactive; with the form's double opt-in off (Oct 2026), adding them to the form makes them active
  // right away. The create is an upsert that leaves an existing subscriber's state alone.
  const headers = { "X-Kit-Api-Key": key, "Content-Type": "application/json" };
  const created = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, state: "inactive" }),
  });
  if (!created.ok) {
    console.error("kit create subscriber", created.status, await created.text());
    return Response.json({ error: "failed" }, { status: 502 });
  }

  const added = await fetch(`https://api.kit.com/v4/forms/${form}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, referrer: "https://mericot.com" }),
  });
  if (!added.ok) {
    console.error("kit add to form", added.status, await added.text());
    return Response.json({ error: "failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
