<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (Turbopack). Do not run it in the foreground as a check; it never exits.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), runs with no file arguments.
- `npx tsc --noEmit` — typecheck (there is no `typecheck` script).
- `npm run build` — the only compile-level check besides tsc.
- There is **no test suite and no CI**. Verify changes with `npm run lint && npx tsc --noEmit && npm run build`.
- npm only (`package-lock.json`); don't use pnpm/yarn/bun.

## Stack facts (verified)

- Next.js 16.4.3 App Router, source in `src/`; path alias `@/*` → `./src/*` (tsconfig). React 19.3, TypeScript strict.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` (babel-plugin-react-compiler).
  React Compiler is on: components must be pure during render (no side effects or mutations in render), and manual
  `memo`/`useMemo` for render stability is unnecessary. For the semantics of these flags, consult
  `node_modules/next/dist/docs/` rather than training-data knowledge.
- Tailwind CSS v4, CSS-first: **there is no `tailwind.config.*`**. Theme/custom CSS lives in `src/app/globals.css`.
  Tailwind is applied through the `@tailwindcss/turbopack` loader rule in `next.config.ts` — keep that rule.

## shadcn/ui

- Config in `components.json`: style **`base-nova`** — components wrap `@base-ui/react` primitives, **not Radix**.
  Don't reach for `@radix-ui/react-*`.
- Generated components land in `src/components/ui/`. Add more with `npx shadcn add <component>` (CLI is a local dep).
- `cn` is the `cn` npm package; `src/lib/utils.ts` re-exports it. Generated components import `import { cn } from "cn"`
  directly — either import works, but match the file you're editing.
- `globals.css` imports `shadcn/tailwind.css`; `shadcn eject` would inline and remove it — don't run eject.
