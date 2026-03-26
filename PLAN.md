# MVP Build Plan — PM Career Navigation Platform

**Read CLAUDE.md first for project context, tech stack, conventions, and design rules.**

---

## Current Status

### ✅ Complete (do not re-implement)

| Area | Status |
|------|--------|
| Base infrastructure (DB, auth, AI layer, design tokens, stubs) | ✅ Done |
| Onboarding — all 5 steps + all API routes | ✅ Done |
| Skill Gap Dashboard + PSI entries view | ✅ Done |
| Auth — login + signup (Google OAuth + email) | ✅ Done |
| All AI agents (resume parser, PSI reframer, gap analyzer, conversation) | ✅ Done |
| Shared utilities (scores.ts, streak.ts, onboarding.ts) | ✅ Done |

### ⬜ Next Sprint

```
feat/landing     →  Landing page + discover quiz
feat/learning    →  12-stage learning path
feat/resume      →  Resume builder (JD-specific)
feat/questions   →  Question bank / quiz
feat/profile     →  Public profile / portfolio
```

---

## File Ownership Map

| Branch | Owns | Never Touch |
|--------|------|-------------|
| `feat/learning` | `src/app/dashboard/learning/**`, `src/app/api/v1/learning/**`, `src/components/learning/**` | others |
| `feat/resume` | `src/app/dashboard/resume/**`, `src/app/api/v1/resume/**`, `src/components/resume/**` | others |
| `feat/questions` | `src/app/dashboard/questions/**`, `src/app/api/v1/questions/**`, `src/components/questions/**` | others |
| `feat/landing` | `src/app/(public)/**`, `src/components/landing/**` | everything else |

**Shared files (read-only for all feature branches):**
- `src/lib/auth.ts`, `src/lib/prisma.ts`, `src/lib/ai/openrouter.ts` — DO NOT MODIFY
- `src/components/ui/**` — DO NOT MODIFY
- `prisma/schema.prisma` — coordinate before changing

---

## Section 1: feat/learning

**Spec:** `docs/spec/solution-doc.md` → Learning Path section + `docs/spec/content-research-output.md`
**Design:** `docs/spec/designs/` (learning stage screens)

12 gated learning stages. Each stage: read content → complete assignment → AI evaluates → unlock next stage.

**Routes to build:**
- `src/app/dashboard/learning/page.tsx` — stage map overview
- `src/app/dashboard/learning/[stageId]/page.tsx` — stage detail + assignment
- `src/app/api/v1/learning/stages/route.ts` — GET user's stage progress
- `src/app/api/v1/learning/assignments/route.ts` — POST submit assignment
- `src/lib/ai/agents/assignment-evaluator.ts` — already stubbed, needs implementation

**Key DB models:** `learning_stage`, `user_stage_progress`, `assignment_submission`

---

## Section 2: feat/questions

**Spec:** `docs/spec/content-research-output.md` → Question Bank section

Skill-specific questions. User answers → AI scores → updates skill scores.

**Routes to build:**
- `src/app/dashboard/questions/page.tsx` — question bank browser
- `src/app/api/v1/questions/route.ts` — GET questions by skill/category
- `src/app/api/v1/questions/answer/route.ts` — POST answer → AI evaluation
- `src/lib/ai/agents/question-evaluator.ts` — already stubbed, needs implementation

**Key DB models:** `question`, `question_attempt`

---

## Section 3: feat/resume

**Spec:** `docs/spec/solution-doc.md` → Resume Builder section

JD-specific resume generation from PSI entries.

**Routes to build:**
- `src/app/dashboard/resume/page.tsx` — resume builder UI
- `src/app/api/v1/resume/optimize/route.ts` — POST JD text → optimized bullets
- `src/lib/ai/agents/resume-optimizer.ts` — already stubbed, needs implementation

**Key DB models:** `resume_version`, `resume_bullet`

---

## Section 4: feat/landing

**Spec:** `docs/spec/solution-doc.md` → Landing + Discover Quiz section

**Routes to build:**
- `src/app/(public)/page.tsx` — landing page
- `src/app/(public)/quiz/page.tsx` — discover quiz (no auth required)
- `src/components/landing/` — landing-specific components

---

## Testing Checklist (End-to-End — before PR to develop)

- [ ] `pnpm build` passes with no errors
- [ ] Feature works logged out → redirects to login
- [ ] Feature works with seeded test user
- [ ] Loading, empty, and error states all render correctly
- [ ] No `console.log` in committed code
- [ ] Mobile layout checked (375px)
