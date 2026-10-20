// Everything on the page that isn't layout lives here. Edit, push, and Vercel redeploys.
// Values in [BRACKETS] are placeholders still to fill in.

export type SocialKey = "tiktok" | "instagram" | "github" | "linkedin";

export type Social = { key: SocialKey; label: string; href: string };

export type Project = { name: string; href: string; line: string };

export const site = {
  name: "Samuel",
  domain: "mericot.com",
  url: "https://mericot.com",
  email: "hello@mericot.com",
  year: 2026,

  headline: ["I build software", "in public."],
  headlineDim: "Here's the deeper cut.",
  lead: "The reels show 30 seconds. This is the rest, once a week: what I built, what broke, what I learned.",
  signupFine: "Once a week. Unsubscribe in one tap.",
  footer: { before: "Building something too?", link: "Email me", after: ". I read everything." },

  socials: [
    { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@[HANDLE]" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/[HANDLE]" },
    { key: "github", label: "GitHub", href: "https://github.com/mericot" },
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/[HANDLE]" },
  ] satisfies Social[],

  newsletter: {
    // Set NEXT_PUBLIC_BEEHIIV_EMBED_ID in Vercel (Beehiiv → Grow → Subscribe Forms → Embed).
    embedId: process.env.NEXT_PUBLIC_BEEHIIV_EMBED_ID ?? "",
    latest: null as null | { title: string; date: string; url: string },
  },

  projects: [
    { name: "SnapExpense", href: "[SNAPEXPENSE URL]", line: "snap a receipt, get a categorized expense. Live, still shipping weekly." },
    { name: "Order-Saga", href: "https://github.com/mericot", line: "an order system where a failed payment cleanly undoes everything before it." },
  ] satisfies Project[],
};
