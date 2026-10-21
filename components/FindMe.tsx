import { site } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

// Desktop: a 2×2 grid under the photo. Phone: a stack beside the photo, same height as it (4 × 44px).
export function FindMe() {
  return (
    <nav
      aria-label="Find me elsewhere"
      className="grid flex-1 grid-cols-1 content-between font-mono text-[13px] tracking-[0.02em] md:flex-none md:self-stretch md:grid-cols-2 md:gap-x-6 md:border-t md:border-hairline md:pt-1"
    >
      {site.socials.map((s) => (
        <a key={s.key} href={s.href} rel="noopener" className="flex min-h-11 items-center gap-2.5 text-fg no-underline hover:opacity-70">
          <SocialIcon name={s.key} />
          <span>{s.label}</span>
          <span aria-hidden="true" className="ml-auto text-dim">
            ↗
          </span>
        </a>
      ))}
    </nav>
  );
}
