import Link from "next/link";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* id is used by Konami.tsx: ten taps on the wordmark flips the page on phones */}
      <Link id="wordmark" href="/" className="font-display text-2xl font-bold tracking-[-0.02em] text-fg no-underline">
        {site.name}
      </Link>
      <a
        href={`mailto:${site.email}`}
        className="btn inline-flex h-10 items-center border-2 border-fg px-4 text-sm font-semibold text-fg no-underline"
      >
        Say hi
      </a>
    </header>
  );
}
