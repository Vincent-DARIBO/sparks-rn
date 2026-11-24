# Plan: CLAUDE.md for sparks-rn + align training material with user conventions

## Context
`/init` requested. sparks-rn is a fresh `create-expo-app` blank TS template (Expo SDK 58, RN 0.88.1, React 19.3, TS 6, bun) used as the **live demo rebuild** of Scan'Stock during a 4-day React Native training. Training material lives next to the repo: `../jour 1..4` (PDF booklets + pptx), `../tickets/jour N/SCAN-*.md` (GitHub-issue-ready tickets with starting branch), `../corrections/jour N/SCAN-*.md` (solution code from `etape-XX` branches of the `scan-stock-formation` repo), `../Programme_Formation_React_Native.pdf`.

User decision: code in sparks-rn follows **the user's global rules** (no comments, `export default function`, bun, Service class + AppError subclasses -> custom hook -> component, React Query hook conventions, feature-sliced `src/features/`). Correction and ticket files must be rewritten to match. Model: Sonnet.

## Phase 1 — CLAUDE.md (orchestrator writes it, single file)

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Purpose

Live demo for a 4-day React Native training. The trainer rebuilds Scan'Stock (inventory app for a grocery manager) here, ticket by ticket.

Training material sits one level up:
- `../tickets/jour N/SCAN-XX-*.md` — user story, business rules, acceptance criteria, starting branch.
- `../corrections/jour N/SCAN-XX.md` — reference solution; `README.md` per day maps tickets to `etape-XX` branches.
- `../jour N/` — trainer/trainee booklets (PDF) and slides (pptx).

When implementing a ticket, read its ticket and correction first. Correction code is the target; acceptance criteria are the definition of done. Branch names mirror the corrections (`etape-00-depart` ... `etape-12-*`).

## Stack progression

Day 1 TypeScript/React/StyleSheet (theme, optional NativeWind) · Day 2 FlashList, Expo Router tabs + deep links, react-hook-form + zod · Day 3 TanStack Query against json-server, zustand + expo-sqlite kv-store, expo-camera/location/image-picker, Reanimated + Gesture Handler · Day 4 Jest + jest-expo + Testing Library, Maestro, EAS Build/Update/Workflows, a11y, i18next, web, AI.

Install libraries with `bunx expo install <pkg>` only when the ticket that needs them is reached.

## Current state

Blank template: `index.ts` registers `App.tsx`. No `src/`, no expo-router, no ESLint config, no test runner yet.

## Commands

```bash
bun install
bun run start          # expo start (add -c to clear cache)
bun run ios | android | web
bunx tsc --noEmit
bunx expo lint
bunx expo-doctor
```
```

Commands for tests (`bun run test`, single test `bun run test -- path/to/file.test.tsx`) added when SCAN-19 lands.

## Phase 2 — Rewrite ../corrections and ../tickets

### Shared target conventions (embedded in every agent brief)
- Code blocks: zero comments (`//`, `/** */`, `{/* */}`). Every removed pedagogical comment becomes prose in the markdown around the block ("Points clés"), so no teaching content is lost.
- Components/screens: `export default function Name(props: NameProps) {}`; no `useState`/`useEffect`/`useMemo` in components — move to a hook (e.g. D2 `pressCount` -> `src/hooks/useDebugCounter.ts`). Imports switch to default imports.
- Data access: `Service` classes with static async methods, try/catch, throw typed errors.
  - `src/shared/errors/AppError.ts` (user's AppError verbatim).
  - `api/productsApi.ts` -> `services/ProductService.ts` + `services/ProductError.ts`
  - `api/openFoodFacts.ts` -> `services/OpenFoodFactsService.ts` + `OpenFoodFactsError`
  - `api/aiApi.ts` -> `services/AiService.ts` + `AiError`
  - `shared/storage/kvStorage(.web).ts` -> `shared/services/StorageService(.web).ts` + `StorageError`
  - `shared/api/client.ts` stays a thin fetch helper used by services.
- React Query hooks move from `features/products/api/` to `features/products/hooks/`, follow the user's query/infinite/mutation templates (descriptive return keys, `enabled`, mutation `onSuccess/onError` + `showToast`). Add `src/shared/hooks/useToast.ts` minimal (Alert/ToastAndroid) on day 3 when first mutation appears.
- Pure utils (`utils/stock.ts`, `filterProducts.ts`) and types files keep named exports (not components).
- Day 1 keeps flat `src/components|hooks|screens|types|utils` layout (pedagogical start); migration to `src/features/` stays where the corrections already do it (day 2). Screens keep `Screen` suffix.
- Commands: `npm install` -> `bun install`, `npx` -> `bunx`, `npx expo start -c` -> `bunx expo start -c`.
- Tests (day 4): `jest.spyOn(productsApi, ...)` -> `jest.spyOn(ProductService, ...)`; paths updated.
- Tickets: only commands (`npx` -> `bunx`) and file paths that changed; story, rules, criteria untouched.
- Prose stays in French.

### Execution
1. Save this plan to `sparks-rn/aidd_docs/tasks/2026-11-24-claude-md-and-training-conventions.md`.
2. Spawn 4 `aidd-dev:implementer` agents (model sonnet) in parallel, one per day: `corrections/jour N/*` + `tickets/jour N/*`. Each brief carries the user request, the conventions above, and the mapping table so names match across days.
3. Spawn `caveman:cavecrew-reviewer` on all four days for cross-day consistency (same service/hook names, imports resolve to files defined earlier, no leftover comments). Re-spawn the day agent on drift.

## Files to modify
- `sparks-rn/CLAUDE.md` — new.
- `../corrections/jour {1..4}/*.md` — code blocks and commands rewritten.
- `../tickets/jour {1..4}/*.md` — commands and paths only.

## Risk
Rewritten corrections no longer match the `etape-XX` branches of `scan-stock-formation`. Branches built in sparks-rn during the demo become the new source of truth.

## Verification
- `grep -rnE "npx |npm install|npm i " ../corrections ../tickets` -> empty.
- `grep -rnE "^export function [A-Z]" ../corrections` -> empty (components).
- `grep -rn "productsApi\|features/products/api/" ../corrections ../tickets` -> empty.
- Comment scan inside fenced ts/tsx blocks (`//`, `/**`, `{/*`) -> empty.
- Reviewer report clean. `bunx tsc --noEmit` passes in sparks-rn.
