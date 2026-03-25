# PM Career Navigation Platform — Agent Context

## What We're Building

A career navigation platform for professionals transitioning into Product Management. The platform:
1. **Extracts** PM-relevant experience from a user's existing work (PSI: Problem → Solution → Impact)
2. **Assesses** skill gaps by mapping experience against a role-weighted taxonomy (38 skills, 8 categories, 6 PM role types)
3. **Guides** via a personalized gated learning path (12 stages)
4. **Proves** via AI-evaluated assignments building a public profile
5. **Applies** via a resume builder that auto-generates JD-specific resumes

**Core loop:** Resume Upload → AI Parsing → Gap-Fill Conversation → Skill Gap Dashboard → Learning Path → Resume Builder

## ⚠️ MVP FOCUS (Current Sprint)
We are only building the first end-to-end flow:
1. **Onboarding** (resume upload → profile form → AI analysis → conversation → skill summary)
2. **Skill Gap Dashboard** (readiness score + category breakdown)
3. **PSI Experience View** (the extracted + reframed experiences)

Learning path, resume builder, question bank, and public profile come **after** this flow works end-to-end.

---

## Spec Docs (Read Before Working on Any Feature)

| Doc | What It Contains |
|-----|-----------------|
| `docs/spec/solution-doc.md` | **Start here.** Full engineering spec: flows, wireframes, DB schema, AI agents, APIs |
| `docs/spec/content-research-output.md` | Skills taxonomy validation, question bank, learning stage content |
| `docs/spec/design.md` | Design system: Quiet Authority aesthetic, colors, typography, component rules |
| `docs/spec/designs/*/screen.png` | Visual design references (14 screens with HTML prototypes) |
| `docs/spec/designs/*/code.html` | Interactive HTML prototypes — open in browser to see the design |

**Key design refs for MVP:**
- `docs/spec/designs/onboarding_resume_upload/` — Step 1 UI
- `docs/spec/designs/onboarding_profile_details/` — Step 2 UI
- `docs/spec/designs/analysis_loading_v1/` — Step 3 loading UI
- `docs/spec/designs/gap_filling_chat_v1/` — Step 4 conversation UI
- `docs/spec/designs/analysis_dashboard_v2/` — Skill gap dashboard UI ← primary reference
- `docs/spec/designs/detailed_master_profile/` — PSI entries view

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 App Router | Server Components by default |
| Language | TypeScript | Strict mode |
| Database | Supabase PostgreSQL | Project ID: `wfbrcnysrumknuhwfxdg` |
| ORM | Prisma 7 | Schema in `prisma/schema.prisma`, client in `src/generated/prisma` |
| Auth | NextAuth v5 | Config in `src/lib/auth.ts` |
| Styling | Tailwind CSS v4 + shadcn/ui | CSS-only config via `@theme` in `globals.css` |
| AI (primary) | Anthropic Claude Sonnet | Via `src/lib/ai/anthropic.ts` → `claudeChat()` |
| AI (fast/cheap) | OpenAI GPT-4o-mini | Via `src/lib/ai/openai.ts` → `gptChat()` |
| Deployment | Vercel | Auto-deploy from `main` branch |

---

## Repository Structure

```
src/
  app/
    (public)/              ← Landing page, discover quiz, public profile
    (auth)/login/          ← Sign in page
    (auth)/signup/         ← Sign up page
    onboarding/
      upload/              ← Step 1: Resume upload
      profile/             ← Step 2: Profile + PM target form
      analyzing/           ← Step 3: AI processing loading
      conversation/        ← Step 4: Gap-filling AI chat
      summary/             ← Step 5: PSI + skill gap summary
    dashboard/
      page.tsx             ← Skill gap dashboard (main)
      learning/            ← Learning path (later sprint)
      questions/           ← Question bank (later sprint)
      resume/              ← Resume builder (later sprint)
      profile/             ← Edit profile (later sprint)
      applications/        ← Application tracker (later sprint)
    api/
      auth/[...nextauth]/  ← NextAuth handler (DO NOT MODIFY)
      v1/                  ← All feature API routes
  components/
    ui/                    ← shadcn/ui base components (DO NOT MODIFY)
    layout/sidebar.tsx     ← App sidebar (shared)
    onboarding/            ← Onboarding-specific components
    dashboard/             ← Dashboard widgets
  lib/
    auth.ts                ← NextAuth config (DO NOT MODIFY)
    prisma.ts              ← Prisma singleton (DO NOT MODIFY)
    logger.ts              ← Structured logger — use instead of console.log
    ai/
      anthropic.ts         ← Claude client (DO NOT MODIFY)
      openai.ts            ← OpenAI client (DO NOT MODIFY)
      agents/              ← AI agent functions (add new agents here)
  generated/prisma/        ← Auto-generated (DO NOT EDIT)
prisma/
  schema.prisma            ← Full DB schema
  seed.ts                  ← Seed data (run: pnpm prisma db seed)
docs/spec/                 ← Engineering spec + design references
PLAN.md                    ← Detailed task plan for all feature agents
```

---

## Branch Strategy

```
main          ← production (Vercel deploy, protected — PR only)
  └── develop ← integration (all feature PRs merge here first)
        ├── feat/onboarding    ← Resume upload → AI analysis → PSI chat
        ├── feat/dashboard     ← Skill gap dashboard + readiness score
        ├── feat/auth          ← Login/signup pages
        ├── feat/landing       ← Landing page + discover quiz (later)
        ├── feat/learning      ← Learning path (later sprint)
        ├── feat/resume        ← Resume builder (later sprint)
        ├── feat/questions     ← Question bank (later sprint)
        └── feat/profile       ← Public profile (later sprint)
```

**Rules:**
- Branch FROM `develop`, PR back TO `develop`
- Each branch owns specific files/folders — see PLAN.md for ownership map
- No two branches modify the same file (except `develop` merges)

---

## Key Conventions (Non-Negotiable)

### Code
1. **Server Components by default** — add `"use client"` only for event handlers, hooks, browser APIs
2. **All DB access via Prisma** — `import { prisma } from "@/lib/prisma"` — never raw SQL in components
3. **All AI calls via agents** — use functions in `src/lib/ai/agents/*` — never inline `anthropic.messages.create()`
4. **No `console.log`** — use `import { logger } from "@/lib/logger"` → `logger.info/warn/error()`
5. **Zod validation** on all API route inputs
6. **Every page must handle:** Loading (Suspense + skeleton), Empty state, Error (error.tsx), Success

### Design System (Quiet Authority — Non-Negotiable)
- **NO 1px opaque borders** to separate sections — use background color shifts
- **Surface hierarchy:** `#f8f9fa` (base) → `#f3f4f5` (sections) → `#ffffff` (cards)
- **Text:** always `#191c1d` — never `text-black` or `#000000`
- **Primary:** `#3525cd` indigo, `rounded-full` buttons
- **Amber accent** `#ffddb8` — use ONLY for milestones/primary CTAs
- **Transitions:** `transition-all duration-200` on interactive elements
- **No gamification** — no bright progress bars, no badges, no confetti

### CSS Variables (Tailwind v4 — use in className)
```
bg-[var(--color-primary)]                  → #3525cd
bg-[var(--color-primary-fixed)]            → #e8e5ff (light indigo bg)
bg-[var(--color-secondary-fixed)]          → #ffddb8 (amber accent)
bg-[var(--color-surface)]                  → #f8f9fa (page bg)
bg-[var(--color-surface-container-low)]    → #f3f4f5 (section bg)
bg-[var(--color-surface-container)]        → #edeeef (hover bg)
bg-[var(--color-surface-container-lowest)] → #ffffff (card bg)
text-[var(--color-on-surface)]             → #191c1d (primary text)
text-[var(--color-on-surface-variant)]     → #464555 (secondary text)
```

---

## Supabase Project

- **Project ID:** `wfbrcnysrumknuhwfxdg`
- **URL:** `https://wfbrcnysrumknuhwfxdg.supabase.co`
- **Region:** ap-south-1 (Mumbai)
- **Extensions:** `vector` (pgvector), `uuid-ossp`, `pg_trgm`
- **All 30+ tables created** via migrations — see `prisma/schema.prisma` for full schema

---

## First-Time Setup

```bash
cp .env.example .env
# Fill in: DATABASE_URL, GOOGLE_CLIENT_ID/SECRET, ANTHROPIC_API_KEY, OPENAI_API_KEY, NEXTAUTH_SECRET

pnpm install
pnpm prisma generate
pnpm prisma db seed
pnpm dev
```

---

## AI Agents Available

| Agent | File | Model | Purpose |
|-------|------|-------|---------|
| Resume Parser | `agents/resume-parser.ts` | GPT-4o-mini | Resume text → structured JSON |
| PSI Reframer | `agents/psi-reframer.ts` | Claude Sonnet | Work bullet → Problem/Solution/Impact |
| Gap Analyzer | `agents/gap-analyzer.ts` | Claude Sonnet | PSI entries → skill scores + gaps |
| Assignment Evaluator | `agents/assignment-evaluator.ts` | Claude Sonnet | Submission + rubric → score |
| Question Evaluator | `agents/question-evaluator.ts` | Claude Sonnet | Answer → score + feedback |
| Resume Optimizer | `agents/resume-optimizer.ts` | GPT-4o-mini | PSI + JD → optimized bullets |
