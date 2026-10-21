import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";

// Where Kit sends people after they click "Confirm your subscription" in the confirmation email
// (form settings → Incentive → redirect URL: https://mericot.com/subscribed).
export const metadata: Metadata = {
  title: `You're in — ${site.name}`,
  robots: { index: false },
};

export default function Subscribed() {
  const instagram = site.socials.find((s) => s.key === "instagram");

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-10 px-6 pt-6 pb-16">
      <Header />
      <section className="flex flex-col gap-2">
        <h1 className="m-0 font-display text-[clamp(56px,14vw,112px)] leading-[0.9] font-extrabold tracking-[-0.06em]">You&apos;re in.</h1>
        <p className="m-0 text-lg text-body">Subscription confirmed. The next big update lands in your inbox.</p>
        <p className="m-0 text-sm text-label">Not seeing my emails? Check spam and mark it &ldquo;Not junk&rdquo; so the next one finds you.</p>
      </section>
      <div className="border-2 border-fg font-mono text-sm leading-[1.6]">
        <div className="border-b border-hairline px-4 py-2 text-xs tracking-[0.02em] text-muted">samuel@mericot:~</div>
        <div className="flex flex-col px-4 py-3 text-body">
          <p className="m-0 text-fg">
            <span className="text-label">$ </span>subscribe --confirm
          </p>
          <p className="m-0">
            <span className="text-fg">[ ok ] </span>email confirmed
          </p>
          <p className="m-0">
            <span className="text-fg">[ ok ] </span>added to the list
          </p>
          <p className="m-0">Only the big stuff: launches, breakthroughs, what broke.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn inline-flex h-11 items-center border-2 border-fg px-4 text-sm font-semibold text-fg no-underline">
          Back to the site
        </Link>
        {instagram && (
          <a href={instagram.href} rel="noopener" className="btn inline-flex h-11 items-center border border-hairline px-4 text-sm font-semibold text-fg no-underline">
            Watch the reels
          </a>
        )}
      </div>
      <Footer />
    </main>
  );
}
