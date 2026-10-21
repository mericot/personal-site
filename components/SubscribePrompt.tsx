"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { mailtoSignup, subscribe } from "@/lib/subscribe";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; email: string } | { kind: "error"; message: string };

// The signup as a command: `$ subscribe [email] ⏎`. The terminal's `subscribe <email>` sends the same request.
// #signup-email is focused by the terminal's bare `subscribe` and the status bar's `s` shortcut.
export function SubscribePrompt() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const address = email.trim();
    const website = new FormData(e.currentTarget).get("website");
    setStatus({ kind: "sending" });
    const result = await subscribe(address, typeof website === "string" ? website : "");
    track("subscribe", { from: "prompt", ok: result.ok });
    if (result.ok) {
      setEmail("");
      setStatus({ kind: "done", email: address });
    } else if (result.reason === "not_configured") {
      setStatus({ kind: "error", message: "The list opens soon. Your mail app is saving your spot." });
      window.location.href = mailtoSignup(address);
    } else {
      setStatus({
        kind: "error",
        message: result.reason === "invalid" ? "That doesn't look like an email. Try again?" : "That didn't go through. Try again in a minute.",
      });
    }
  }

  return (
    <div className="flex max-w-[560px] flex-col gap-2">
      <form onSubmit={onSubmit} className="flex h-[52px] items-stretch border-2 border-fg font-mono text-sm md:text-[15px]">
        <label htmlFor="signup-email" className="flex items-center pl-3.5 whitespace-nowrap text-label">
          $ subscribe
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          enterKeyHint="send"
          className="w-0 min-w-0 flex-1 bg-transparent px-2.5 text-base text-fg outline-none placeholder:text-label md:text-[15px]"
        />
        {/* Honeypot: off-screen and skipped by keyboard and screen readers, so only bots fill it in. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status.kind === "sending"}
          className="min-w-[52px] cursor-pointer bg-fg px-4 font-medium whitespace-nowrap text-bg disabled:opacity-60"
        >
          <span aria-hidden="true">⏎</span>
          <span aria-hidden="true" className="hidden md:inline"> enter</span>
        </button>
      </form>
      <p role="status" className={`m-0 text-sm ${status.kind === "done" ? "text-fg" : "text-muted"}`}>
        {status.kind === "done" ? (
          <>✓ Almost there. Check {status.email} for a confirmation link.</>
        ) : status.kind === "error" ? (
          status.message
        ) : (
          <>
            {site.signupFine}
            <span className="hidden md:inline"> Works in the terminal too.</span>{" "}
            <Link href="/privacy" className="text-muted underline underline-offset-[3px] hover:text-fg">
              Privacy
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
