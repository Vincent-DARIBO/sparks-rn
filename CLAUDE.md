# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Purpose

Live demo for a 4-day React Native training. The trainer rebuilds Scan'Stock (inventory app for a grocery manager) here, ticket by ticket.

Training material sits one level up:
- `../tickets/jour N/SCAN-XX-*.md` — user story, business rules, acceptance criteria, starting branch.
- `../corrections/jour N/SCAN-XX.md` — reference solution; `README.md` per day maps tickets to `etape-XX` branches.
- `../jour N/` — trainer/trainee booklets (PDF) and slides (pptx).
- mockup: `./maquette.html`

When implementing a ticket, read its ticket and correction first. Correction code is the target; acceptance criteria are the definition of done. Branch names mirror the corrections (`etape-00-depart` ... `etape-12-*`).

## Code conventions

Global user rules apply (service + AppError -> hook -> component, `export default function`, bun), with one override: pedagogical comments in French are allowed and encouraged so trainees understand the code.

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
