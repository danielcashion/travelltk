# Contributing to TravelLTK

Thanks for helping build TravelLTK. This document covers the branch and pull-request conventions we use so reviews stay small and predictable.

## Prerequisites

- Node.js 20+ (Node 24 is fine)
- npm 10+
- A copied `.env.local` based on `.env.example`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Next.js app runs at [http://localhost:3000](http://localhost:3000). The AWS CDK app in `/infra` is a separate package — see `/infra/README.md` after Phase 7 scaffolding.

## Branch naming

Create a branch from `main` using one of:

- `feat/<short-description>` — new product behavior
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — tooling, deps, docs-only
- `infra/<short-description>` — CDK / AWS changes

Examples: `feat/trip-builder-legs`, `fix/checkout-tax-line`.

## Commits

- Prefer small, focused commits over one large dump.
- Write the subject in the imperative mood ("add trip filters", not "added" or "adds").
- Explain *why* in the body when the change is not obvious from the diff.

## Pull requests

1. Keep PRs reviewable: one concern per PR when possible.
2. Fill in the PR template (summary + test plan).
3. Run locally before opening:

   ```bash
   npm run lint
   npm run format:check
   npm run build
   ```

4. Request review from at least one teammate. Do not merge your own PR unless you are the on-call owner for that area.
5. Squash-merge to `main`. Delete the branch after merge.

## Code conventions

- TypeScript strict mode is on. Do not add `any` without a comment explaining why.
- Style only through Tailwind design tokens (`tailwind.config.ts` + CSS variables in `app/globals.css`). No hardcoded hex or arbitrary pixel values in components.
- Use `next/image` for imagery.
- List, feed, and detail routes must ship a `loading.tsx` skeleton and a designed empty state.
- Read environment variables only through `lib/config.ts`.

## What not to commit

- `.env.local`, secrets, Cognito/Google/Stripe live keys
- `cdk.out/`, `.next/`, `node_modules/`
- Generated lockfile churn unrelated to your change
