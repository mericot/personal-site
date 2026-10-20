import { site } from "@/content/site";

// Beehiiv's embedded form. Style it inside Beehiiv to match the page:
// background #0A0A0A, 2px white input border, white button with black text, radius 0, Inter.
// Until the embed ID is set, show an honest in-palette fallback instead of Beehiiv's white "Not found" box.
export function BeehiivEmbed({ title = "Get the updates" }: { title?: string }) {
  const id = site.newsletter.embedId;

  if (id) {
    return (
      <iframe
        src={`https://embeds.beehiiv.com/${id}?slim=true`}
        title={title}
        loading="lazy"
        scrolling="no"
        className="block h-[90px] w-full max-w-[560px] border-0 bg-transparent"
      />
    );
  }

  return (
    <div className="flex max-w-[560px] flex-wrap items-center gap-x-4 gap-y-2 border-2 border-fg px-4 py-3">
      <span className="text-body">The newsletter opens soon.</span>
      <a
        href={`mailto:${site.email}?subject=Put%20me%20on%20the%20list`}
        className="font-semibold text-fg underline underline-offset-4 hover:opacity-70"
      >
        Get on the list →
      </a>
    </div>
  );
}
