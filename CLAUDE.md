# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Version warning (read AGENTS.md)

This project pins **Next.js 16.2.6**, **React 19**, and **Tailwind CSS v4** — all newer than most training data. `AGENTS.md` directs you to read `node_modules/next/dist/docs/` before writing Next.js code, because APIs, conventions, and file structure have breaking changes from earlier versions. Do not assume Next 13/14 patterns transfer. In particular:

- Tailwind v4 uses the `@tailwindcss/postcss` plugin (see `postcss.config.mjs`) and CSS-first config — there is no `tailwind.config.js`. Theme tokens live in `src/app/globals.css`.
- React 19 — server components and the `use` hook are the defaults; verify any hook/API shape against installed types rather than memory.

## Commands

```bash
npm install        # required first run — node_modules was skipped during scaffold
npm run dev        # start dev server on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (flat config in eslint.config.mjs)
```

There is no test script configured yet.

## Structure

- **App Router** under `src/app/` — `layout.tsx` is the root layout, `page.tsx` is `/`. New routes are folders under `src/app/`.
- **Import alias**: `@/*` resolves to `./src/*` (configured in `tsconfig.json`). Prefer `@/...` over relative paths that climb out of `src/app/`.
- **Static assets**: `public/` (served from `/`).
- **Fonts**: `next/font/google` is wired up in `layout.tsx` (Geist + Geist Mono) with CSS variables `--font-geist-sans` / `--font-geist-mono`.
- TypeScript `strict` is on; `next.config.ts` is currently empty — add config there, not in a `.js` variant.


## /make-slide
When the user types "/make-slide", read `.claude/skills/make-slide/SKILL.md` and follow the presentation creation workflow. Browse themes at https://make-slide.vercel.app
