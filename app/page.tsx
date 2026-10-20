import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Terminal } from "@/components/Terminal";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-14 px-6 pt-6 pb-16">
      <Header />
      <Hero />
      <Terminal />
      <Footer />
    </main>
  );
}
