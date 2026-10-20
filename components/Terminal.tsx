"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { chips, complete, runCommand, type Line } from "@/content/terminal";
import { site } from "@/content/site";

type Entry = { id: number; kind: "in" | "out"; line: Line };

const WELCOME: Line = ["Welcome. Type help, or tap a command below."];

let nextId = 0;
const entry = (kind: Entry["kind"], line: Line): Entry => ({ id: nextId++, kind, line });

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>(() => [entry("out", WELCOME)]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1); // index into history while pressing ↑/↓, -1 = not browsing
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Keep the newest line in view: scrolls the output box only, never the page.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

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
    setEntries((e) => [...e, entry("in", [input]), ...(result.lines ?? []).map((l) => entry("out", l))]);

    if (result.action === "konami") window.dispatchEvent(new Event("konami:flip"));
    if (result.action === "email") window.location.href = `mailto:${site.email}`;
    if (result.action === "subscribe") {
      const target = document.getElementById("signup");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      target?.focus({ preventScroll: true });
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
    if ((e.target as HTMLElement).closest("a")) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <section aria-label="Terminal" className="flex flex-col gap-3">
      <div
        onClick={focusPrompt}
        className="border-2 border-fg font-mono text-sm leading-[1.6] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-fg/40"
      >
        <div className="border-b border-hairline px-4 py-2 text-xs tracking-[0.02em] text-muted">samuel@mericot:~</div>
        <div ref={outputRef} role="log" aria-live="polite" className="h-[180px] overflow-y-auto px-4 pt-3 pb-1">
          {entries.map((x) => (
            <p key={x.id} className={`m-0 break-words whitespace-pre-wrap ${x.kind === "in" ? "text-fg" : "text-body"}`}>
              {x.kind === "in" && <span className="text-dim">$ </span>}
              {x.line.map((seg, i) =>
                typeof seg === "string" ? (
                  <span key={i}>{seg}</span>
                ) : (
                  <a key={i} href={seg.href} rel="noopener" className="text-fg underline underline-offset-[3px] hover:opacity-70">
                    {seg.text}
                  </a>
                ),
              )}
            </p>
          ))}
        </div>
        <label className="flex items-center gap-2 px-4 pt-1 pb-3">
          <span aria-hidden="true" className="text-dim">
            $
          </span>
          <input
            ref={inputRef}
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
            placeholder="help"
            className="min-w-0 flex-1 bg-transparent text-fg caret-fg outline-none placeholder:text-dim"
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
