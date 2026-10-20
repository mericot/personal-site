import { site } from "@/content/site";
import { BeehiivEmbed } from "./BeehiivEmbed";
import { FindMe } from "./FindMe";
import { Portrait } from "./Portrait";

// Photo first in the DOM: on phones it sits above the headline with the links beside it;
// from 720px up, row-reverse puts it on the right with the links in a 2×2 grid underneath.
export function Hero() {
  return (
    <section className="flex flex-col items-start gap-x-16 gap-y-8 md:flex-row-reverse md:justify-between">
      <figure className="fade-in m-0 flex w-full items-stretch gap-4 md:w-80 md:flex-none md:flex-col md:items-start md:gap-3">
        <Portrait />
        <FindMe />
      </figure>

      <div className="flex min-w-0 flex-1 flex-col gap-7 md:basis-[420px]">
        <h1 className="m-0 font-display text-[clamp(40px,11vw,72px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
          {site.headline.map((line) => (
            <span key={line} className="reveal-line">
              <span>{line}</span>
            </span>
          ))}
          <span className="reveal-line">
            <span className="text-[0.72em] text-dim">{site.headlineDim}</span>
          </span>
        </h1>
        <p className="fade-in m-0 max-w-[480px] text-lg text-body">{site.lead}</p>
        {/* #signup is where the terminal's `subscribe` command scrolls to */}
        <div id="signup" tabIndex={-1} className="fade-in flex max-w-[560px] scroll-mt-24 flex-col gap-2 outline-none">
          <BeehiivEmbed />
          <p className="m-0 text-sm text-muted">{site.signupFine}</p>
        </div>
      </div>
    </section>
  );
}
