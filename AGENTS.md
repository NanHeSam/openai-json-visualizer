# Repository Guidelines

This guide explains how to work effectively inside the OpenAI JSON Visualizer codebase and keep contributions consistent with the current setup.

## Project Structure & Module Organization
- `src/` holds all TypeScript sources. Entry points live in `src/index.tsx` and `src/App.tsx`.
- Reusable UI pieces sit in `src/components/` (e.g., `JsonEditor`, `ChatVisualization`, `ConfigPanel`).
- Shared data and helpers belong in `src/utils/` such as `defaultData.js` for seed conversation payloads.
- Build tooling is configured via `vite.config.ts`, Tailwind in `tailwind.config.js`, and global HTML shell in `index.html`.

## Build, Test, and Development Commands
- `npm install` installs dependencies once per checkout.
- `npm run dev` launches Vite with hot reload at `http://localhost:5173`.
- `npm run build` produces an optimized production bundle in `dist/`.
- `npm run preview` serves the build for smoke-testing production output.
- `npm run lint` runs ESLint across `.ts/.tsx` sources; fix warnings before opening a PR.

## Coding Style & Naming Conventions
- Use 2-space indentation and TypeScript for new logic; prefer functional React components.
- Export React components in PascalCase, hooks in camelCase with a `use` prefix, and files named after their default export (e.g., `ConfigPanel.tsx`).
- Keep props typed explicitly, avoid `any`, and colocate component-specific styles in the default Tailwind utility classes defined in `src/index.css`.
- Run `npm run lint -- --fix` before committing if formatting drifts.

## Testing Guidelines
- No automated tests exist yet; new work should introduce Vitest + React Testing Library alongside the component (`ComponentName.test.tsx`).
- Aim to cover parsing logic, JSON editor interactions, and visualization state transitions. Document gaps in the PR description when full coverage is deferred.

## Commit & Pull Request Guidelines
- Write imperative, concise commit subjects (≤72 chars) with optional scope, e.g., `feat(editor): sync chat scroll state`.
- Group related changes per commit; include context in the body when behavior changes or migrations are required.
- For PRs provide a summary, testing notes (`npm run lint`, manual UX checks), linked issues, and UI screenshots/GIFs when visuals change.
- Request review from a project maintainer and ensure CI (where available) passes before merge.

## Configuration Notes
- Monaco editor assets load locally; avoid bundling external CDN links without discussion.
- Tailwind utility classes drive styling—extend `tailwind.config.js` rather than adding global CSS rules unless necessary.
