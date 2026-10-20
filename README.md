# mericot.com

Samuel's personal site: newsletter signup first, email second, a fake terminal, a Konami code, and a 404 page you can play.

Built with Next.js (App Router), TypeScript and Tailwind. Hosted on Vercel.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` checks types and builds the static site.

## Change the words

Almost everything you'd edit lives in two files:

- `content/site.ts`: headline, lead, email, social links, projects, latest newsletter issue.
- `content/terminal.ts`: the terminal's commands and their replies.

Push to `main` and Vercel redeploys in about a minute.

## Newsletter

The signup is a Beehiiv embed. Set `NEXT_PUBLIC_BEEHIIV_EMBED_ID` in Vercel (Beehiiv → Grow → Subscribe Forms → Embed). Until it's set, the page shows a "Get on the list" email link instead. The welcome email text is in `docs/WELCOME_EMAIL.md`.

## Easter eggs

- **Terminal:** type `help`. Try `ls` too.
- **Konami:** ↑↑↓↓←→←→BA, ten taps on the name on a phone, or `konami` in the terminal.
- **404:** any broken link is the dino game.

## Layout

```
app/          page, 404, layout, link-preview image, icons, robots, sitemap
components/   Header, Hero, Portrait, FindMe, Terminal, Konami, DinoGame, Footer
content/      site.ts, terminal.ts
docs/design/  the 7f design artboards this was built from
```

## License

Code: MIT. The photo and the writing are Samuel's and aren't licensed for reuse.
