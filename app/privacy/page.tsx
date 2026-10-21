import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";

// Plain-English privacy policy. Update `updated` whenever the substance changes
// (a new service, a new kind of data).
const updated = "October 21, 2026";

export const metadata: Metadata = {
  title: `Privacy — ${site.name}`,
  description: `What ${site.domain} collects, why, and how to get it deleted.`,
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "The short version",
    body: (
      <p>
        If you subscribe, I keep your email address so I can send you the newsletter. I don&apos;t sell it, share it or
        show you ads. Unsubscribe from any email in one tap, or email me and I&apos;ll delete everything I have.
      </p>
    ),
  },
  {
    title: "What I collect",
    body: (
      <ul>
        <li>
          <strong>Your email address</strong>, when you subscribe. Kit, the newsletter service, also records which
          emails you open and links you click, so I can tell what&apos;s worth writing.
        </li>
        <li>
          <strong>Anonymous page views.</strong> Vercel Web Analytics counts visits and whether a signup worked. It
          uses no cookies and doesn&apos;t identify you.
        </li>
        <li>
          <strong>A bot check.</strong> When you submit the signup, Vercel BotID looks at signals from your browser to
          tell people from bots. It&apos;s only used to keep spam signups out.
        </li>
        <li>
          <strong>Server logs.</strong> Like every website, the host briefly logs requests, including your IP address
          and browser, to keep the site running and secure.
        </li>
        <li>
          <strong>Emails you send me</strong> at {site.email}, and anything you choose to put in them.
        </li>
      </ul>
    ),
  },
  {
    title: "Who handles it",
    body: (
      <>
        <p>A few services do the work on my behalf. Each only gets what it needs:</p>
        <ul>
          <li>
            <strong>Kit</strong> stores the subscriber list and sends the newsletter.
          </li>
          <li>
            <strong>Vercel</strong> hosts the site and runs the analytics and bot check.
          </li>
          <li>
            <strong>Cloudflare</strong> receives mail sent to {site.email} and forwards it to my inbox.
          </li>
          <li>
            <strong>Google</strong> (Gmail) is where that mail ends up.
          </li>
        </ul>
        <p>These services are based in the United States, so your data is stored there.</p>
      </>
    ),
  },
  {
    title: "How long I keep it",
    body: (
      <p>
        Your email address stays on the list until you unsubscribe or ask me to delete it. Analytics are anonymous
        totals. Server logs are kept for a short time by the host and then deleted.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <ul>
        <li>
          <strong>Unsubscribe:</strong> every email has a link at the bottom. One tap and you&apos;re off the list.
        </li>
        <li>
          <strong>See, fix or delete your data:</strong> email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and I&apos;ll take care of it, usually within a few days.
        </li>
      </ul>
    ),
  },
  {
    title: "Kids",
    body: <p>This site isn&apos;t meant for children under 13, and I don&apos;t knowingly collect their information.</p>,
  },
  {
    title: "Changes",
    body: (
      <p>
        If anything here changes, I&apos;ll update this page and the date at the top. If it&apos;s a big change, I&apos;ll
        mention it in the newsletter.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-10 px-6 pt-6 pb-16">
      <Header />
      <section className="flex flex-col gap-2">
        <h1 className="m-0 font-display text-[clamp(56px,14vw,112px)] leading-[0.9] font-extrabold tracking-[-0.06em]">Privacy</h1>
        <p className="m-0 font-mono text-xs text-label">Last updated {updated}</p>
      </section>
      <div className="flex max-w-[680px] flex-col gap-8 text-body [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:opacity-70 [&_li]:pl-1 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-fg [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {sections.map((s) => (
          <section key={s.title} className="flex flex-col gap-3">
            <h2 className="m-0 font-display text-2xl font-bold tracking-[-0.02em] text-fg">{s.title}</h2>
            {s.body}
          </section>
        ))}
        <p>
          Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>. {site.domain} is run by {site.name}.
        </p>
      </div>
      <Footer />
    </main>
  );
}
