// Everything on the page that isn't layout lives here. Edit, push, and Vercel redeploys.
// Values in [BRACKETS] are placeholders still to fill in.

export type SocialKey = "tiktok" | "instagram" | "github" | "linkedin";

export type Social = { key: SocialKey; label: string; href: string };

export type Project = { name: string; href: string; line: string };

export type Reel = { title: string; date: string; code: string };

export const site = {
  name: "Samuel",
  domain: "mericot.com",
  url: "https://mericot.com",
  email: "hello@mericot.com",
  year: 2026,

  headline: ["You saw", "30 seconds."],
  headlineDim: "This is the rest.",
  lead: "I build things on camera. The write-up is everything the reel cut: what broke, how I fixed it, what I'd do differently.",
  signupFine: "Only the big stuff: launches, breakthroughs, what broke. Unsubscribe in one tap.",
  footer: { before: "Building something too?", link: "Email me", after: ". I read everything." },

  socials: [
    { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@mericot.dev" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/mericot.dev" },
    { key: "github", label: "GitHub", href: "https://github.com/mericot" },
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-pimentel-166514209" },
  ] satisfies Social[],

  newsletter: {
    // Signups go through app/api/subscribe (needs KIT_API_KEY and KIT_FORM_ID in Vercel).
    latest: null as null | { title: string; date: string; url: string },
    // Teased under the signup and by the terminal's `latest`. Set to null to hide.
    next: null as null | { label: string; topic: string },
  },

  projects: [
    { name: "SnapExpense", href: "[SNAPEXPENSE URL]", line: "snap a receipt, get a categorized expense. Live, still shipping weekly." },
    { name: "Order-Saga", href: "https://github.com/mericot", line: "an order system where a failed payment cleanly undoes everything before it." },
  ] satisfies Project[],

  // Newest first. The first one is linked under the signup ("from the latest reel"); `reels` lists them all.
  // Empty hides both, and the terminal stops advertising `reels`. Add e.g.
  // { title: "Built a receipt scanner in a day", date: "Oct 2026", code: "https://github.com/mericot/snap-expense" }
  reels: [] as Reel[],
};
