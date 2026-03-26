# PM Career Navigation Platform — Agent Context

## What We're Building
Career navigation platform for PM career switchers. Core loop: Resume Upload → AI Parsing → Gap-Fill Chat → Skill Gap Dashboard → Learning Path → Resume Builder.

**MVP (done):** Onboarding (5 steps) + Skill Gap Dashboard + PSI view. Next: learning path, resume builder, question bank, public profile.

## Spec Docs
- `docs/spec/solution-doc.md` — Full engineering spec (start here for any new feature)
- `docs/spec/design.md` — Design system details
- `docs/spec/designs/*/screen.png` + `code.html` — 14 screen references

## Tech Stack
- **Framework:** Next.js 16 App Router (Server Components by default)
- **DB:** Supabase PostgreSQL — Prisma 7 ORM (`prisma/schema.prisma`, client in `src/generated/prisma`)
- **Auth:** NextAuth v5 (`src/lib/auth.ts` — DO NOT MODIFY)
- **Styling:** Tailwind CSS v4 + shadcn/ui (`src/components/ui/` — DO NOT MODIFY)
- **AI:** OpenRouter free models via `src/lib/ai/openrouter.ts` → `orChat()`
  - `MODELS.REASONING` = Hermes 3 405B (PSI reframing, gap analysis)
  - `MODELS.STRUCTURED` = Llama 3.3 70B (resume parsing, conversation)
- **Deploy:** Vercel — auto-deploy from `main`

## Branch Strategy
`main` (prod) ← `develop` (integration) ← feature branches. Branch FROM `develop`, PR TO `develop`.

## Key Conventions (Non-Negotiable)
1. **Server Components by default** — `"use client"` only for event handlers/hooks/browser APIs
2. **DB via Prisma only** — `import { prisma } from "@/lib/prisma"` — no raw SQL
3. **AI via agents only** — `src/lib/ai/agents/*` — never inline `orChat()` in routes
4. **No `console.log`** — use `logger` from `@/lib/logger`
5. **Zod validation** on all API inputs
6. **Every page:** Loading (Suspense + skeleton) + Empty state + Error (error.tsx) + Success

## Design System (Quiet Authority)
- **No 1px borders** between sections — use background color shifts instead
- **Surfaces:** `bg-[var(--color-surface)]` (page) → `bg-[var(--color-surface-container-low)]` (sections) → `bg-[var(--color-surface-container-lowest)]` (cards/white)
- **Text:** `text-[var(--color-on-surface)]` (#191c1d) primary, `text-[var(--color-on-surface-variant)]` (#464555) secondary
- **Primary:** `bg-[var(--color-primary)]` (#3525cd), `rounded-full` buttons
- **Amber accent** `bg-[var(--color-secondary-fixed)]` (#ffddb8) — milestones/primary CTAs only
- **No gamification** — no badges, bright progress bars, confetti

## What's Built (don't re-implement)
- `src/app/onboarding/` — all 5 steps complete (upload, profile, analyzing, conversation, summary)
- `src/app/dashboard/page.tsx` + `psi/` — dashboard + PSI entries view complete
- `src/app/(auth)/` — login + signup with Google OAuth complete
- `src/app/api/v1/onboarding/` — all API routes complete
- `src/lib/ai/agents/` — all 4 MVP agents complete (resume-parser, psi-reframer, gap-analyzer, conversation-agent)
- `src/lib/scores.ts`, `streak.ts`, `onboarding.ts` — all utilities complete

## Next Sprint Targets
- `src/app/dashboard/learning/` — 12-stage learning path
- `src/app/dashboard/questions/` — question bank / quiz
- `src/app/dashboard/resume/` — resume builder
- `src/app/(public)/` — landing page + discover quiz
