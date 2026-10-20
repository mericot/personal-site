import type { Metadata } from "next";
import { BeehiivEmbed } from "@/components/BeehiivEmbed";
import { DinoGame } from "@/components/DinoGame";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "404 — the game didn't break",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-10 px-6 pt-6 pb-16">
      <Header />
      <section className="flex flex-col gap-2">
        <h1 className="m-0 font-display text-[clamp(72px,20vw,160px)] leading-[0.9] font-extrabold tracking-[-0.06em]">404</h1>
        <p className="m-0 text-lg text-body">That link broke. The game didn&apos;t.</p>
      </section>
      <DinoGame />
      <section className="flex flex-col gap-3">
        <p className="m-0 font-display text-2xl font-bold tracking-[-0.02em]">While you&apos;re here: the weekly write-up.</p>
        <BeehiivEmbed />
      </section>
      <Footer />
    </main>
  );
}
