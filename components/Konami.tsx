"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// ↑↑↓↓←→←→BA on a keyboard, ten taps on the wordmark on a phone, or `konami` in the terminal.
// Also marks the page ready for the intro animation once it's actually painting.
export function Konami() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => document.documentElement.classList.add("ready"));
    let pos = 0;
    let taps = 0;
    let tapTimer: ReturnType<typeof setTimeout> | undefined;
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    const flip = () => {
      const on = document.documentElement.classList.toggle("flipped");
      setToast(on ? "Page flipped. Do it again to fix it." : "Back to normal. Nice.");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(null), 3500);
      track("konami");
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return; // don't fire while typing
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === SEQUENCE[pos] ? pos + 1 : k === SEQUENCE[0] ? 1 : 0;
      if (pos === SEQUENCE.length) {
        pos = 0;
        flip();
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#wordmark")) return;
      taps += 1;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (taps = 0), 1500);
      if (taps > 1) e.preventDefault(); // only the first tap navigates home
      if (taps >= 10) {
        taps = 0;
        flip();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    window.addEventListener("konami:flip", flip);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(tapTimer);
      clearTimeout(toastTimer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("konami:flip", flip);
    };
  }, []);

  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-10 flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 bg-fg px-[18px] py-3.5 font-semibold text-bg"
    >
      <span className="hidden font-mono text-[13px] tracking-[0.1em] whitespace-nowrap md:inline">↑↑↓↓←→←→BA</span>
      <span>{toast}</span>
    </div>
  );
}
