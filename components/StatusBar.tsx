"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

// A terminal status line along the bottom edge, wide screens only (1360px+, where the side margins are empty).
// Left: the keyboard shortcuts, which work anywhere outside a text field. Right: a rotating tip and the scroll
// position, the way `less` shows it.
const TIPS = ["try ls", "type :q", "subscribe works in here", "type reboot", "type whoami"];
const TIP_MS = 4000;

function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  el.focus({ preventScroll: true });
}

export function StatusBar() {
  const [tip, setTip] = useState(0);
  const [pos, setPos] = useState("Top");

  useEffect(() => {
    const timer = setInterval(() => setTip((i) => (i + 1) % TIPS.length), TIP_MS);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setPos(y < 4 ? "Top" : max <= 0 || y >= max - 2 ? "Bot" : `${Math.round((y / max) * 100)}%`);
    };

    // The shortcuts only work while the bar that lists them is visible.
    const wide = window.matchMedia("(min-width: 1360px)");
    const onKey = (e: KeyboardEvent) => {
      if (!wide.matches) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "/") {
        e.preventDefault();
        focusField("terminal-input");
      } else if (e.key === "s") {
        e.preventDefault();
        focusField("signup-email");
      } else if (e.key === "e") {
        window.location.href = `mailto:${site.email}`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKey);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const seg = "flex items-center px-3.5 whitespace-nowrap";
  return (
    <aside
      aria-label="Status bar"
      className="fixed inset-x-0 bottom-0 z-[5] hidden h-[30px] items-stretch border-t border-hairline bg-bg font-mono text-xs tracking-[0.02em] text-label min-[1360px]:flex"
    >
      <span className={`${seg} border-r border-hairline text-fg`}>{site.domain}</span>
      <span className={`${seg} gap-[18px]`}>
        <span>
          <kbd className="font-mono text-fg">/</kbd> terminal
        </span>
        <span>
          <kbd className="font-mono text-fg">s</kbd> subscribe
        </span>
        <span>
          <kbd className="font-mono text-fg">e</kbd> email
        </span>
      </span>
      <span className="flex-1" />
      <span className={`${seg} min-w-[250px] justify-end border-l border-hairline`}>
        tip:<span className="ml-1.5 text-fg">{TIPS[tip]}</span>
      </span>
      <span className={`${seg} min-w-12 justify-center bg-fg font-medium text-bg`} aria-label={`Scroll position: ${pos}`}>
        {pos}
      </span>
    </aside>
  );
}
