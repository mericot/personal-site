// The fake terminal's commands. Each command returns lines to print and/or an action for the page.
import { site } from "./site";

// A segment is plain text, a link, or a command the visitor can tap to run.
export type Segment = string | { text: string; href: string } | { cmd: string };
export type Line = Segment[];
// subscribe-email carries the address in `arg`; the terminal sends it and prints the outcome.
export type Action = "clear" | "konami" | "subscribe" | "subscribe-email" | "email" | "reboot";
export type Result = { lines?: Line[]; action?: Action; arg?: string };

type Command = {
  name: string;
  hint: string;
  hidden?: boolean; // works, but not listed in `help`
  run: (args: string[]) => Result;
};

const say = (...lines: string[]): Result => ({ lines: lines.map((l) => [l]) });

// Until site.reels has entries, `reels` still answers but isn't advertised.
const hasReels = site.reels.length > 0;

export const welcome: Line = [
  "Welcome. Tap ",
  { cmd: "help" },
  ", or try ",
  { cmd: "projects" },
  " · ",
  ...(hasReels ? [{ cmd: "reels" }, " · "] : []),
  { cmd: "latest" },
];

export const commands: Command[] = [
  {
    name: "help",
    hint: "list commands",
    run: () => ({
      lines: [
        ...commands.filter((c) => !c.hidden).map((c): Line => [{ cmd: c.name }, " ".repeat(Math.max(1, 11 - c.name.length)) + c.hint]),
        ["(there are a few more. try ", { cmd: "ls" }, ")"],
      ],
    }),
  },
  { name: "whoami", hint: "who's this", run: () => say("Samuel. CS senior at UMass Lowell. I build software in public.") },
  {
    name: "projects",
    hint: "what I'm building",
    run: () => ({ lines: site.projects.map((p) => [{ text: p.name, href: p.href }, ` — ${p.line}`]) }),
  },
  {
    name: "reels",
    hint: "the code behind my videos",
    hidden: !hasReels,
    run: () => ({
      lines: [
        ...(hasReels
          ? site.reels.map((r): Line => [`${r.title} · ${r.date} → `, { text: "the code", href: r.code }])
          : [["No reels with code yet. They're coming."] as Line]),
        ["more on ", { text: "TikTok", href: site.socials[0].href }],
      ],
    }),
  },
  {
    name: "socials",
    hint: "where else I post",
    run: () => ({ lines: site.socials.map((s) => [s.label.padEnd(11, " "), { text: s.href.replace(/^https:\/\/(www\.)?/, ""), href: s.href }]) }),
  },
  {
    name: "latest",
    hint: "what's coming up",
    run: () => {
      const { latest, next } = site.newsletter;
      if (latest) return { lines: [[`${latest.date} · `, { text: latest.title, href: latest.url }]] };
      return {
        lines: [
          next ? [`next up: ${next.label} — ${next.topic}`] : ["The first one lands soon."],
          ["get it in your inbox: ", { cmd: "subscribe" }],
        ],
      };
    },
  },
  {
    name: "subscribe",
    hint: "subscribe <your email>",
    run: (args) =>
      args[0]
        ? { action: "subscribe-email", arg: args[0] }
        : { ...say("↑ type your email in the box up top, or: subscribe you@email.com"), action: "subscribe" },
  },
  { name: "email", hint: "write to me", run: () => ({ lines: [["Opening your mail app… or write to ", { text: site.email, href: `mailto:${site.email}` }]], action: "email" }) },
  { name: "konami", hint: "do not type this", run: () => ({ ...say("↑↑↓↓←→←→BA"), action: "konami" }) },
  { name: "clear", hint: "clear the screen", run: () => ({ action: "clear" }) },

  { name: "ls", hint: "", hidden: true, run: () => say("projects/  socials/  secrets.txt") },
  {
    name: "cat",
    hint: "",
    hidden: true,
    run: (args) =>
      args[0] === "secrets.txt"
        ? say("I still google how to center a div. Every time.")
        : say(`cat: ${args[0] ?? ""}: No such file or directory`),
  },
  { name: "cd", hint: "", hidden: true, run: (args) => (args[0] === "projects" ? commands.find((c) => c.name === "projects")!.run([]) : args[0] === "socials" ? commands.find((c) => c.name === "socials")!.run([]) : say("You're already where the good stuff is.")) },
  { name: "sudo", hint: "", hidden: true, run: () => say("Nice try.") },
  { name: "hire", hint: "", hidden: true, run: () => say("Not right now. Type subscribe and you'll hear first.") },
  { name: "exit", hint: "", hidden: true, run: () => say("There's no exit. Only subscribe.") },
  { name: ":q", hint: "", hidden: true, run: () => ({ lines: [["no quitting here. try ", { cmd: ":wq" }]] }) },
  { name: ":wq", hint: "", hidden: true, run: () => say("saved. now type subscribe <your email> and you're on the list.") },
  { name: "reboot", hint: "", hidden: true, run: () => ({ action: "reboot" }) },
  { name: "rm", hint: "", hidden: true, run: () => say("Not on my site you don't.") },
];

export function runCommand(input: string): Result {
  const [name = "", ...args] = input.trim().toLowerCase().split(/\s+/);
  if (!name) return {};
  const cmd = commands.find((c) => c.name === name);
  return cmd ? cmd.run(args) : { lines: [[`command not found: ${name} — try `, { cmd: "help" }]] };
}

/** Tab completion: the single command that starts with `partial`, or the list of candidates. */
export function complete(partial: string): { match?: string; options: string[] } {
  const p = partial.trim().toLowerCase();
  const options = commands.filter((c) => !c.hidden && c.name.startsWith(p)).map((c) => c.name);
  return options.length === 1 ? { match: options[0], options } : { options };
}

export const chips = ["help", "projects", ...(hasReels ? ["reels"] : []), "latest", "subscribe"];
