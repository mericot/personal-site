"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { chips, complete, runCommand, welcome, type Line } from "@/content/terminal";
import { site } from "@/content/site";
import { mailtoSignup, subscribe } from "@/lib/subscribe";

type Entry = { id: number; kind: "in" | "out" | "boot"; line: Line };

// The terminal's startup log. It plays inside the box once the box is on screen, so the page is never gated.
const BOOT: Line[] = [["mounting /reels"], ["loading the deeper cut"], ["hiding a few easter eggs"]];
const BOOT_STEP_MS = 170;

let nextId = 0;
const entry = (kind: Entry["kind"], line: Line): Entry => ({ id: nextId++, kind, line });

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Touch screens get a hint about the command buttons in the placeholder.
const noSubscribe = () => () => {};
const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [booting, setBooting] = useState(true);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1); // index into history while pressing ↑/↓, -1 = not browsing
  const touch = useSyncExternalStore(noSubscribe, isTouch, () => false);
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const bootTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function boot() {
    bootTimers.current.forEach(clearTimeout);
    const lines = [...BOOT.map((l) => entry("boot", l)), entry("out", welcome)];
    if (reducedMotion()) {
      setEntries(lines);
      setBooting(false);
      return;
    }
    setEntries([]);
    setBooting(true);
    bootTimers.current = lines.map((l, i) =>
      setTimeout(() => {
        setEntries((e) => [...e, l]);
        if (i === lines.length - 1) setBooting(false);
      }, BOOT_STEP_MS * (i + 1)),
    );
  }

  // Boot when at least 40% of the terminal is visible; on phones it starts below the fold.
  useEffect(() => {
    const el = sectionRef.current;
    const timers = bootTimers.current;
    if (!el || !("IntersectionObserver" in window)) {
      boot();
      return;
    }
    const io = new IntersectionObserver(
      (seen) => {
        if (seen.some((s) => s.isIntersecting)) {
          io.disconnect();
          boot();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      bootTimers.current.forEach(clearTimeout);
    };
  }, []);

  // Keep the newest line in view: scrolls the output box only, never the page.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  async function sendSubscribe(address: string) {
    setEntries((e) => [...e, entry("out", ["checking…"])]);
    const result = await subscribe(address);
    track("subscribe", { from: "terminal", ok: result.ok });
    const reply: Line = result.ok
      ? ["✓ you're on the list. the first issue lands soon."]
      : result.reason === "not_configured"
        ? ["the list opens soon. opening your mail app to save your spot…"]
        : result.reason === "invalid"
          ? ["that doesn't look like an email. try again?"]
          : ["that didn't go through. try again in a minute."];
    setEntries((e) => [...e, entry("out", reply)]);
    if (!result.ok && result.reason === "not_configured") window.location.assign(mailtoSignup(address));
  }

  function execute(raw: string) {
    const input = raw.trim();
    if (!input) return;
    const result = runCommand(input);
    setHistory((h) => [input, ...h].slice(0, 50));
    setCursor(-1);
    setValue("");
    track("terminal", { cmd: input.split(/\s+/)[0].toLowerCase() });

    if (result.action === "clear") {
      setEntries([]);
      return;
    }
    if (result.action === "reboot") {
      boot();
      return;
    }
    setEntries((e) => [...e, entry("in", [input]), ...(result.lines ?? []).map((l) => entry("out", l))]);

    if (result.action === "subscribe-email" && result.arg) void sendSubscribe(result.arg);
    if (result.action === "konami") window.dispatchEvent(new Event("konami:flip"));
    if (result.action === "email") window.location.assign(`mailto:${site.email}`);
    if (result.action === "subscribe") {
      const field = document.getElementById("signup-email");
      field?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      field?.focus({ preventScroll: true });
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab" && value.trim()) {
      // Only hijack Tab when there's something to complete, so keyboard users can still tab out.
      e.preventDefault();
      const { match, options } = complete(value);
      if (match) setValue(match + " ");
      else if (options.length) setEntries((x) => [...x, entry("out", [options.join("  ")])]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  // Clicking the terminal focuses the prompt, unless the visitor is selecting text or clicking a link.
  function focusPrompt(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <section ref={sectionRef} aria-label="Terminal" className="flex flex-col gap-3">
      <div
        onClick={focusPrompt}
        className="border-2 border-fg font-mono text-sm leading-[1.6] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-fg/40"
      >
        <div className="border-b border-hairline px-4 py-2 text-xs tracking-[0.02em] text-muted">samuel@mericot:~</div>
        <div ref={outputRef} role="log" aria-live="polite" aria-busy={booting} className="h-[200px] overflow-y-auto px-4 pt-3 pb-1 md:h-[180px]">
          {entries.map((x) => (
            <p key={x.id} className={`m-0 break-words whitespace-pre-wrap ${x.kind === "in" ? "text-fg" : "text-body"}`}>
              {x.kind === "in" && <span className="text-label">$ </span>}
              {x.kind === "boot" && <span className="text-fg">[ ok ] </span>}
              {x.line.map((seg, i) =>
                typeof seg === "string" ? (
                  <span key={i}>{seg}</span>
                ) : "cmd" in seg ? (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      execute(seg.cmd);
                    }}
                    className="cursor-pointer px-px text-fg underline underline-offset-[3px] hover:bg-fg hover:text-bg hover:no-underline focus-visible:bg-fg focus-visible:text-bg"
                  >
                    {seg.cmd}
                  </button>
                ) : (
                  <a key={i} href={seg.href} rel="noopener" className="text-fg underline underline-offset-[3px] hover:opacity-70">
                    {seg.text}
                  </a>
                ),
              )}
            </p>
          ))}
          {booting && <span aria-hidden="true" className="cur" />}
        </div>
        <label className="flex items-center gap-2 px-4 pt-1 pb-3">
          <span aria-hidden="true" className="text-label">
            $
          </span>
          <input
            ref={inputRef}
            id="terminal-input"
            aria-label="Terminal command"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCursor(-1);
            }}
            onKeyDown={onKeyDown}
            enterKeyHint="go"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={touch ? "tap a command, or type here" : "help"}
            className="min-w-0 flex-1 bg-transparent text-base text-fg caret-fg outline-none placeholder:text-label md:text-sm"
          />
        </label>
      </div>

      {/* Phones: tap instead of typing on a phone keyboard */}
      <div className="flex flex-wrap gap-2 md:hidden">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => execute(c)}
            className="btn h-11 border border-hairline px-3 font-mono text-[13px] text-fg"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
