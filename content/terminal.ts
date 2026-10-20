// The fake terminal's commands. Each command returns lines to print and/or an action for the page.
import { site } from "./site";

export type Segment = string | { text: string; href: string };
export type Line = Segment[];
export type Action = "clear" | "konami" | "subscribe" | "email";
export type Result = { lines?: Line[]; action?: Action };

type Command = {
  name: string;
  hint: string;
  hidden?: boolean; // works, but not listed in `help`
  run: (args: string[]) => Result;
};

const say = (...lines: string[]): Result => ({ lines: lines.map((l) => [l]) });

export const commands: Command[] = [
  {
    name: "help",
    hint: "list commands",
    run: () => ({
      lines: [
        ...commands.filter((c) => !c.hidden).map((c) => [c.name.padEnd(11, " ") + c.hint]),
        ["(there are a few more. try ls)"],
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
    name: "socials",
    hint: "where else I post",
    run: () => ({ lines: site.socials.map((s) => [s.label.padEnd(11, " "), { text: s.href.replace(/^https:\/\/(www\.)?/, ""), href: s.href }]) }),
  },
  {
    name: "latest",
    hint: "the latest issue",
    run: () => {
      const l = site.newsletter.latest;
      return l
        ? { lines: [[`${l.date} · `, { text: l.title, href: l.url }]] }
        : say("No issues out yet. The first one lands soon; type subscribe to get it.");
    },
  },
  { name: "subscribe", hint: "get the weekly write-up", run: () => ({ ...say("Taking you to the signup…"), action: "subscribe" }) },
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
  { name: "rm", hint: "", hidden: true, run: () => say("Not on my site you don't.") },
];

export function runCommand(input: string): Result {
  const [name = "", ...args] = input.trim().toLowerCase().split(/\s+/);
  if (!name) return {};
  const cmd = commands.find((c) => c.name === name);
  return cmd ? cmd.run(args) : say(`command not found: ${name} — try help`);
}

/** Tab completion: the single command that starts with `partial`, or the list of candidates. */
export function complete(partial: string): { match?: string; options: string[] } {
  const p = partial.trim().toLowerCase();
  const options = commands.filter((c) => !c.hidden && c.name.startsWith(p)).map((c) => c.name);
  return options.length === 1 ? { match: options[0], options } : { options };
}

export const chips = ["help", "projects", "subscribe", "email", "konami"] as const;
