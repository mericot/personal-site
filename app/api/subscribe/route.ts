import { EMAIL_RE } from "@/lib/subscribe";

// POST /api/subscribe { email } adds the address to the Beehiiv publication.
// Needs BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in Vercel. Until they're set it answers
// 503 not_configured and the page falls back to an email.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const key = process.env.BEEHIIV_API_KEY;
  const publication = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !publication) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${publication}/subscriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      utm_source: "mericot.com",
      referring_site: "https://mericot.com",
    }),
  });
  if (!res.ok) {
    return Response.json({ error: "failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
