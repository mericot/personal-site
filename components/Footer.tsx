import { site } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  return (
    <footer className="flex flex-col gap-3 border-t border-hairline pt-6">
      <p className="m-0 text-body">
        {site.footer.before}{" "}
        <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 text-fg underline underline-offset-[3px] hover:opacity-70">
          <SocialIcon name="mail" size={15} />
          {site.footer.link}
        </a>
        {site.footer.after}
      </p>
      <span className="font-mono text-xs text-label">
        © {site.year} {site.name} · {site.domain}
      </span>
    </footer>
  );
}
