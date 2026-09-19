# Codex Full Review Prompt — OpsEngine

Paste everything below the line into Codex (or any AI coding agent) to run a full review of this repository.

---

## Role

You are a senior frontend engineer reviewing the **OpsEngine** codebase — an internal operational reference and procedure platform for Texas Auto Value (TAV). It documents the vehicle lifecycle from sourcing to sale across 12 stages.

This is a **Base44 app**: React 18 + Vite + Tailwind CSS + shadcn/ui, backed by the Base44 platform (auth, database entities, integrations, hosting). The frontend talks to the backend through a pre-initialized SDK client at `src/api/base44Client.js`.

## Stack (do not propose adding libraries outside this list)

- React 18, react-router-dom v6, Tailwind CSS 3, shadcn/ui (Radix primitives in `src/components/ui/`)
- lucide-react (icons), react-markdown, mermaid, recharts, framer-motion, date-fns, lodash, moment
- @tanstack/react-query for server state
- @base44/sdk + @base44/vite-plugin (platform — do not remove)
- ESM only — no `require()`, no `module.exports`

## What to review

Run a **full review** across these dimensions. For each, list findings as: `file:line — severity (blocker/major/minor/nit) — description — suggested fix`.

### 1. Build reliability (blockers — these break the app)

- Every import resolves to a real file or installed package. Flag any `Cannot resolve` or missing-import warnings.
- `cn` is imported from `@/lib/utils`, `createPageUrl` from `@/utils`. Flag any wrong source.
- shadcn primitives are imported from their own file (`@/components/ui/button`, `@/components/ui/label`, etc.) — never re-exported from a sibling.
- No name collisions between a lucide icon and a local declaration (e.g. `Home` icon vs `Home` page — must be aliased).
- No JSX in `.js` files; no `require()` anywhere.
- React hooks are called only at the top level of a component — never conditionally, in loops, or inside handlers.
- Tailwind classes are literal strings (no dynamic `bg-${color}-500` construction that the purge step would drop).
- `@apply` in `src/index.css` only uses classes that `tailwind.config.js` actually defines.

### 2. Routing and auth

- `src/App.jsx` is the router. `<Routes>` contains only `<Route>` elements — no stray components as direct children.
- All four auth routes are registered: `/login`, `/register`, `/forgot-password`, `/reset-password`.
- Authenticated pages are nested under `<ProtectedRoute>`.
- `ProtectedRoute` renders `<Outlet />` (not `return children`) when used as a layout route.
- No duplicate or dead routes; the `/` route points at the intended home page.

### 3. Data layer (Base44 entities)

Entities live as JSON schemas in `base44/entities/*.jsonc`. The frontend reads them via `base44.entities.<Name>.<op>()` from `@/api/base44Client`.

- Every entity referenced in code (by relation field or SDK call) has a matching schema file.
- Relation fields store IDs; UI code resolves them by fetching the related entity and mapping — verify no code assumes a populated object where only an ID is stored.
- `list`/`filter` calls use sensible sort + limit params; no unbounded `list()` that could fetch thousands of records.
- `deleteMany` / `updateMany` queries are specific (never `{}`) to avoid mass data loss.
- No large content (base64, blobs) stored in entity fields — file URLs only.

### 4. Componentization and file structure

- Components are small and focused (ideally ≤50 lines). Flag files over ~200 lines that should be split.
- Every page/component is a default export, named the same as its file.
- No page or component added inline to an existing file when it should be its own file.
- `src/pages/` for pages, `src/components/` for components, `src/lib/` for hooks/contexts/utils.

### 5. Styling and design system

- `src/index.css` owns the token values; `tailwind.config.js` maps them. Color usage in JSX uses token classes (`bg-primary`, `text-muted-foreground`, `border-border`) — not hardcoded hex values or `bg-white`.
- HSL channel tuples in `index.css` match their consumers (`hsl(var(--token))` needs HSL channels like `222 47% 11%`).
- Light and dark mode both defined in `:root` and `.dark`.
- Content images (media.base44.com / static.wixstatic.com URLs) use the `<Image>` component from `@/components/ui/image`, not plain `<img>`.
- Layout is responsive (mobile + desktop). Flag fixed widths that break on small screens.

### 6. Domain-specific rules (OpsEngine product decisions)

These are hard product constraints — flag any violation:

- **No PII**: roles are posts, not people. No individual names, mobile numbers, or personal emails anywhere in code, seed data, or comments. Contacts are by role or department group inbox only.
- **Financial entities** (`PaymentInstrument`, `FundingAccount`) describe purpose and routing only — no account numbers, routing numbers, or balances, in code or seed data.
- **DocFeedback is the only write/input mechanism** on the site. Flag any other form, field, or write capability added to the UI.
- The feedback button label is exactly: `Is this page wrong or out of date?`
- **Glossary tooltips** (`src/components/Markdown.jsx` + `GlossaryTooltip.jsx`) must skip code blocks and existing links when annotating terms. Verify the `SKIP_RE` covers fenced code, inline code, and markdown links.
- **Procedure status badges** appear on every procedure occurrence; procedures that are not `Current` show a "not yet finalised" banner at the top of their page.
- **Printable procedures** strip out navigation, headers, search, and breadcrumbs (`print:hidden` classes).
- **Legal documents**: standing rule is black or blue ink only, no mark-throughs (mistake = fresh form), second signer added on the existing form.
- **Gate boxes** are visually distinct: heavy borders, accent colors, uppercase labels (irreversible steps).

### 7. Markdown and glossary

- `src/components/Markdown.jsx` annotates glossary terms in markdown content. Verify:
  - The skip regex ignores fenced code blocks, inline code, and existing markdown links.
  - Term matching is case-insensitive and word-boundary anchored.
  - Longer terms are matched first (sort by length descending) to avoid partial matches.
  - The `glossary:` href scheme is handled in the custom `a` renderer.

### 8. Error and loading states

- Every page that fetches data shows a loading state while the request is in flight.
- Every page handles the not-found / empty case.
- Errors are allowed to bubble (no unnecessary try/catch) except in user-facing form/auth flows where inline errors are the feature.

### 9. Accessibility

- Interactive elements have `aria-label` where icon-only.
- Color contrast meets WCAG AA in both light and dark themes.
- Focus rings are visible (`:focus-visible` ring styling in `index.css`).
- Mobile touch targets are large enough for one-handed use (≥44px on primary actions).

### 10. Dead code and cleanup

- Unused imports, unused variables, unreachable code.
- Files that are imported nowhere.
- Commented-out code blocks.

## How to run the review

1. Read `AGENTS.md` and `README.md` for project conventions.
2. Start with `src/App.jsx` and trace every route to its page component.
3. For each page, trace imports down to components and lib files.
4. Read every file in `base44/entities/` and cross-check against SDK calls in the frontend.
5. Run `npm run lint` and `npm run typecheck` and report any errors.
6. Produce a single prioritized findings table, then a short summary of the top 5 issues to fix first.

## Output format

```
## Findings

| # | File:Line | Severity | Issue | Suggested fix |
|---|-----------|----------|-------|---------------|
| 1 | src/App.jsx:42 | blocker  | ...   | ...           |

## Summary
- Top 5 issues to fix first:
  1. ...
  2. ...

## Verdict
One paragraph: is this app production-ready, and what blocks it if not.
``