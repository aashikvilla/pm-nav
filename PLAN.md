# MVP Build Plan — PM Career Navigation Platform

**Read CLAUDE.md first for project context, tech stack, conventions, and design rules.**

---

## Current Status

### ✅ Base Infrastructure (Complete — DO NOT re-do)

| Item | Status | Notes |
|------|--------|-------|
| Next.js 16 App Router scaffold | ✅ Done | `src/app/` structure in place |
| Supabase project | ✅ Done | ID: `wfbrcnysrumknuhwfxdg`, ap-south-1 |
| All 30+ DB tables | ✅ Done | Applied via migration |
| pgvector extension | ✅ Done | 1536-dim embeddings ready |
| Prisma schema | ✅ Done | `prisma/schema.prisma` |
| Seed data | ✅ Done | Run `pnpm prisma db seed` |
| NextAuth v5 | ✅ Done | `src/lib/auth.ts`, `src/middleware.ts` |
| All route stubs | ✅ Done | Every page returns placeholder |
| AI service layer | ✅ Done | `src/lib/ai/` with 6 agents |
| Design tokens | ✅ Done | Quiet Authority in `globals.css` |
| shadcn/ui components | ✅ Done | `src/components/ui/` |
| Dashboard sidebar | ✅ Done | `src/components/layout/sidebar.tsx` |
| spec docs in repo | ✅ Done | `docs/spec/` with designs |

### ⬜ MVP Flow (To Build — Divided Below)

```
[Onboarding]          [Dashboard]
  Step 1: Upload  ──┐
  Step 2: Profile    ├──▶ AI Analysis API ──▶ Skill Gap Dashboard
  Step 3: Loading    │    (background job)     (readiness score +
  Step 4: Chat   ────┘                          category breakdown)
  Step 5: Summary ◀────────────────────────────  PSI entries view)
```

---

## File Ownership Map (Prevents Conflicts)

> Each branch owns its listed paths. **Never modify files owned by another branch.**

| Branch | Owns | Never Touch |
|--------|------|-------------|
| `feat/onboarding` | `src/app/onboarding/**`, `src/app/api/v1/onboarding/**`, `src/components/onboarding/**` | dashboard/, auth/, lib/ |
| `feat/dashboard` | `src/app/dashboard/page.tsx`, `src/app/api/v1/dashboard/**`, `src/components/dashboard/**` | onboarding/, auth/, lib/ |
| `feat/auth` | `src/app/(auth)/**`, `src/app/api/v1/user/**` | lib/auth.ts (DO NOT touch), others |
| `feat/landing` | `src/app/(public)/**`, `src/components/landing/**` | everything else |
| `feat/shared` (base) | `src/lib/**`, `src/components/layout/**`, `prisma/**` | app routes |

**Shared files (read-only for feature branches):**
- `src/lib/auth.ts` — DO NOT MODIFY
- `src/lib/prisma.ts` — DO NOT MODIFY
- `src/lib/ai/anthropic.ts` — DO NOT MODIFY
- `src/lib/ai/openai.ts` — DO NOT MODIFY
- `src/components/ui/**` — DO NOT MODIFY (shadcn components)
- `prisma/schema.prisma` — coordinate before changing; create new migration

---

## Section 1: feat/onboarding

**Branch:** `feat/onboarding`
**Goal:** Complete 5-step onboarding flow from resume upload to skill summary display
**Spec reference:** `docs/spec/solution-doc.md` → Section 5 (User Flows) + Section 6 (Feature Specs, Onboarding)
**Design references:** `docs/spec/designs/onboarding_resume_upload/`, `onboarding_profile_details/`, `analysis_loading_v1/`, `gap_filling_chat_v1/`, `analysis_dashboard_v1/`

### Step 1 — Resume Upload Page (`/onboarding/upload`)

**File:** `src/app/onboarding/upload/page.tsx`

**What it does:**
- User uploads a PDF or pastes resume text
- File stored in Supabase Storage (bucket: `resumes`)
- On submit → call `POST /api/v1/onboarding/parse-resume`
- On success → redirect to `/onboarding/profile`

**UI spec:**
- Full-page centered layout (no sidebar during onboarding)
- Large drag-drop zone with dashed border (ghost border style — `border-[var(--color-outline-variant)] border-opacity-30`)
- OR paste text textarea toggle
- Primary CTA button: "Analyze my resume" → primary indigo, rounded-full
- Show filename + file size after upload
- Show error state if file >5MB or wrong type
- Reference: `docs/spec/designs/onboarding_resume_upload/screen.png`

**API route to create:** `src/app/api/v1/onboarding/parse-resume/route.ts`
```
POST /api/v1/onboarding/parse-resume
Body: FormData { file: File } OR { text: string }
Auth: Required (NextAuth session)
Steps:
  1. Extract text from PDF (use pdf-parse library)
  2. Call parseResume() from src/lib/ai/agents/resume-parser.ts
  3. Store raw work experiences in DB: work_experiences table
  4. Create profile record if not exists
  5. Return: { success: true, experienceCount: number }
```

**DB operations:**
- `prisma.workExperience.createMany()` — one row per job
- `prisma.profile.upsert()` — create/update profile
- `prisma.activityLog.create()` — type: `resume_uploaded`

**Component to create:** `src/components/onboarding/resume-upload-zone.tsx` (client component — needs file drag-drop)

---

### Step 2 — Profile Form Page (`/onboarding/profile`)

**File:** `src/app/onboarding/profile/page.tsx`

**What it does:**
- Collect: Full name, current job title, current industry, years of experience, target PM role type, target timeline
- Auto-populate name/email from parsed resume if available
- On submit → `POST /api/v1/onboarding/save-profile` → redirect to `/onboarding/analyzing`

**Fields + validation (Zod):**
```typescript
{
  fullName: z.string().min(2),
  currentJobRole: z.string().min(2),
  currentIndustry: z.string(),
  yearsExperience: z.number().min(0).max(40),
  targetRoleType: z.enum(["consumer","growth","technical","platform","ai","b2b"]),
  targetTimeline: z.enum(["3months","6months","12months"]),
  preparationStage: z.enum(["exploring","committed","applying"]),
}
```

**UI spec:**
- Clean form layout, sections separated by spacing not lines
- Target role cards (not a dropdown) — 6 PM type cards with short description
- Each card shows role name + 2-line description + click to select
- Reference: `docs/spec/designs/onboarding_profile_details/screen.png`

**API route:** `src/app/api/v1/onboarding/save-profile/route.ts`
```
POST /api/v1/onboarding/save-profile
Body: { fullName, currentJobRole, currentIndustry, yearsExperience, targetRoleType, targetTimeline, preparationStage }
Steps:
  1. Validate with Zod
  2. prisma.profile.update() — update all fields, set onboardingStep: 2
  3. prisma.userPmTarget.upsert() — save target role
  4. Return: { success: true }
```

---

### Step 3 — Analyzing Page (`/onboarding/analyzing`)

**File:** `src/app/onboarding/analyzing/page.tsx`

**What it does:**
- Shows animated loading while AI processes the resume
- Triggers AI analysis via `POST /api/v1/onboarding/analyze`
- Polls `GET /api/v1/onboarding/analysis-status` every 2s
- On completion → redirect to `/onboarding/conversation`
- If user navigates away and comes back → resume from where analysis left off

**UI spec (copy the design closely):**
- Dark/indigo background (use `bg-[var(--color-primary)]`)
- White text, centered
- 4-step progress animation: "Parsing resume..." → "Extracting PM signals..." → "Mapping skill gaps..." → "Preparing your profile..."
- Each step fades in/out with 200ms ease
- Subtle pulsing circle behind the step icon
- Reference: `docs/spec/designs/analysis_loading_v1/screen.png`

**API routes:**
```
POST /api/v1/onboarding/analyze
Auth: Required
Steps:
  1. Get user's work experiences from DB
  2. Get user's target PM role from DB
  3. For each work experience bullet → call reframeToPsi() from agents/psi-reframer.ts
  4. Store PSI entries in DB: psi_entries + psi_skill_mappings
  5. Call analyzeGaps() from agents/gap-analyzer.ts with all PSI entries
  6. Store skill scores: user_skill_scores (one per skill)
  7. Calculate + store readiness score snapshot: readiness_score_snapshots
  8. Update profile.onboardingStep = 3
  9. Return: { success: true, psiCount: number, analysisComplete: true }

Note: This may take 30-90 seconds for a full resume. Use streaming response or
store status in DB and poll. Recommended: set a `analysis_status` field on profile
(add column if needed via migration), poll the status route.
```

**Implementation note:** Run PSI reframing in parallel batches of 3-5 bullets using `Promise.allSettled()` to speed up processing.

---

### Step 4 — Gap-Fill Conversation (`/onboarding/conversation`)

**File:** `src/app/onboarding/conversation/page.tsx` (CLIENT COMPONENT — needs real-time chat)

**What it does:**
- AI-driven chat to surface skills not visible in the resume
- AI asks targeted questions based on the identified skill gaps
- User answers → AI extracts additional PSI signals → updates skill scores
- 6-8 turns typical, ends with "I have what I need" trigger
- On complete → redirect to `/onboarding/summary`

**UI spec:**
- Chat bubble UI, left-aligned AI messages, right-aligned user messages
- AI message: `bg-[var(--color-surface-container-low)]` bubble
- User message: `bg-[var(--color-primary)]` white text bubble
- Input bar at bottom — fixed position
- Show progress indicator: "3 of 8 questions"
- Reference: `docs/spec/designs/gap_filling_chat_v1/screen.png`

**API route:** `src/app/api/v1/onboarding/conversation/route.ts`
```
POST /api/v1/onboarding/conversation
Body: { sessionId?: string, message: string }
Auth: Required
Steps:
  1. Load or create conversation_session (type: 'gap_filling')
  2. Load conversation history from conversation_turns
  3. Load user's current skill gaps (lowest scoring skills) from user_skill_scores
  4. Build system prompt with gap context
  5. Call claudeChat() with history + new message
  6. Parse AI response for any new PSI signals mentioned
  7. If new signals found → update psi_entries + user_skill_scores
  8. Store turn in conversation_turns
  9. Return: { reply: string, sessionId: string, isComplete: boolean }

System prompt outline:
"You are a PM career coach having a conversation with [name].
Their skill gaps are: [gaps]. Their background is: [currentRole].
Ask ONE specific question at a time about their experience to surface PM-relevant skills.
Focus on gaps: [top 3 gap categories].
After 6-8 turns, end with: [COMPLETE]"
```

**Conversation agent file to add:** `src/lib/ai/agents/conversation-agent.ts`

---

### Step 5 — Summary Page (`/onboarding/summary`)

**File:** `src/app/onboarding/summary/page.tsx`

**What it does:**
- Shows the top-level results of analysis before entering dashboard
- Brief readiness score preview
- Top 3 strengths + top 3 gaps (category level)
- Count of PSI entries extracted
- "Enter your Dashboard" CTA → `/dashboard`

**API route:** `GET /api/v1/onboarding/summary`
```
Returns:
{
  overallScore: number,
  targetRole: string,
  topStrengths: { category: string, score: number }[],
  topGaps: { category: string, score: number }[],
  psiCount: number,
  readyToApply: boolean  // score >= 70
}
```

---

### Onboarding — Shared Requirements

**Onboarding layout** (`src/app/onboarding/layout.tsx`):
- No sidebar
- Progress bar at top showing step 1/2/3/4/5
- Steps: Upload → Profile → Analyzing → Conversation → Summary
- Back navigation on steps 1-2 (not 3-4-5)

**Progress persistence:**
- `profile.onboardingStep` tracks where user is (0-5)
- If user closes browser and returns → redirect to correct step
- Add this check to each onboarding step's page (server-side redirect)

**Guard pattern (add to each onboarding page):**
```typescript
// In page.tsx (Server Component)
const session = await auth()
if (!session) redirect("/login")
const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
// Redirect to correct step based on profile.onboardingStep
```

---

## Section 2: feat/dashboard

**Branch:** `feat/dashboard`
**Goal:** Build the skill gap analysis dashboard — the core value delivery after onboarding
**Spec reference:** `docs/spec/solution-doc.md` → Section 6 (Dashboard Feature Spec) + Section 9 (Readiness Score Logic)
**Design references:** `docs/spec/designs/analysis_dashboard_v2/screen.png` ← PRIMARY
**Also see:** `docs/spec/designs/detailed_master_profile/screen.png` for the PSI view below dashboard

### Dashboard Main Page (`/dashboard`)

**File:** `src/app/dashboard/page.tsx`

**What it renders:**
1. **Readiness Score Widget** — top of page
2. **Skill Category Breakdown** — bar chart or category cards
3. **Top Gaps Panel** — 2-3 focus areas with "what to do next" hints
4. **PSI Entries Summary** — count + "View all experiences" link
5. **Streak Widget** — current streak + last active (if streak > 0)

**Data fetching (Server Component):**
```typescript
// All fetched server-side — no loading state needed for initial render
const [profile, pmTarget, skillScores, latestSnapshot, psiCount, streak] = await Promise.all([
  prisma.profile.findUnique({ where: { userId } }),
  prisma.userPmTarget.findUnique({ where: { userId } }),
  prisma.userSkillScore.findMany({
    where: { userId },
    include: { skill: { include: { category: true } } },
  }),
  prisma.readinessScoreSnapshot.findFirst({
    where: { userId },
    orderBy: { takenAt: "desc" },
  }),
  prisma.psiEntry.count({ where: { userId } }),
  prisma.userStreak.findUnique({ where: { userId } }),
])
```

---

### Widget 1: Readiness Score (`src/components/dashboard/readiness-score.tsx`)

**Visual spec (from design):**
- Large circular progress ring — primary indigo fill on gray track
- Score number in center: e.g., "62" in large weight (~2.75rem)
- Below: "for Technical PM" label in `on-surface-variant`
- Below score: "Apply when you reach 70" subtle note
- If score >= 70: show amber CTA "You're ready to apply"

**Score calculation (use this formula):**
```
Skill_Score = (0.5 × evidence_score) + (0.3 × assignment_score) + (0.2 × learning_score)
Category_Score = avg(Skill_Scores in category)
Readiness_Score = Σ (Category_Score × role_weight) for target role
```

**Helper function to create:** `src/lib/scores.ts`
```typescript
export function calculateReadinessScore(
  skillScores: UserSkillScore[],
  roleWeights: RoleWeight[],
  categories: SkillCategory[]
): { overall: number; byCategory: Record<string, number> }
```

---

### Widget 2: Skill Category Breakdown (`src/components/dashboard/skill-breakdown.tsx`)

**Visual spec:**
- 8 horizontal bars, one per skill category
- Each bar: category name left, score % right, colored fill
- Color: primary indigo for bars above 50%, amber for bars below 30%, gray for 30-50%
- No gridlines — just the bars and spacing
- Sort: lowest scores first (focus areas at top)
- Clicking a category → eventually links to learning stage (for now: no-op or tooltip)

---

### Widget 3: Skill Gaps Panel (`src/components/dashboard/gap-panel.tsx`)

**Visual spec:**
- Section header: "Your Focus Areas"
- 2-3 cards, each showing:
  - Category name + current score
  - 1-2 sentence explanation of what this means for a [target role] PM
  - "Start improving →" text link (no-op for now)
- Card bg: `surface-container-lowest` (white) on `surface-container-low` background

---

### PSI Entries Page (`/dashboard/psi` — NEW ROUTE)

> **Note:** The design shows PSI entries as a separate view accessible from the dashboard.
> Create this as `/dashboard/psi/page.tsx` (add to dashboard layout).

**File to create:** `src/app/dashboard/psi/page.tsx`

**What it renders:**
- List of all PSI entries for the user
- Each entry: Problem / Solution / Impact as a card
- Tags showing which PM skills this entry demonstrates
- Edit button (opens modal, edits inline — save to DB)
- "Add new entry" button → opens blank PSI form
- Reference: `docs/spec/designs/detailed_master_profile/screen.png`

**API routes:**
```
GET  /api/v1/psi          → list user's PSI entries with skill mappings
POST /api/v1/psi          → create new PSI entry (manual)
PUT  /api/v1/psi/:id      → update PSI entry
DELETE /api/v1/psi/:id    → soft delete (set is_visible = false)
```

**Sidebar update:** Add "My Experiences" link to sidebar pointing to `/dashboard/psi`
**Ownership:** `feat/dashboard` owns this — update `src/components/layout/sidebar.tsx`

---

### Dashboard API Routes

**Create:** `src/app/api/v1/dashboard/summary/route.ts`
```
GET /api/v1/dashboard/summary
Auth: Required
Returns:
{
  profile: { fullName, targetRoleType, onboardingCompleted },
  readiness: { overall: number, byCategory: Record<string, number> },
  topGaps: { categoryName: string, score: number, slug: string }[],
  topStrengths: { categoryName: string, score: number, slug: string }[],
  psiCount: number,
  streak: { current: number, longest: number } | null,
  lastSnapshot: { takenAt: string, score: number } | null,
}
```

**Create:** `src/app/api/v1/psi/route.ts`
**Create:** `src/app/api/v1/psi/[id]/route.ts`

---

### Dashboard — Guard & Empty State

If user hasn't completed onboarding (`profile.onboardingCompleted === false`):
- Show a full-page "Complete your profile setup" prompt with CTA → `/onboarding/upload`
- Don't show the dashboard content

If user completed onboarding but has 0 skill scores:
- Show "Your analysis is still running..." with a spinner
- This handles the case where the analyze API is still processing

---

## Section 3: feat/auth

**Branch:** `feat/auth`
**Goal:** Build working login and signup pages
**Spec reference:** `docs/spec/solution-doc.md` → Section 6 (Auth pages)

### Login Page (`/login`)

**File:** `src/app/(auth)/login/page.tsx`

- Google OAuth button → calls `signIn("google")`
- Email/password form (credentials) → for now show as disabled or "coming soon"
- Link to `/signup`
- After login → NextAuth redirects to `/dashboard` (set in `auth.ts` pages config)
- Clean, centered card, no sidebar

### Signup Page (`/signup`)

**File:** `src/app/(auth)/signup/page.tsx`

- "Continue with Google" → `signIn("google")`
- After first login → check if profile exists
  - If no profile → redirect to `/onboarding/upload`
  - If profile exists but onboarding incomplete → redirect to correct onboarding step
  - If onboarding complete → redirect to `/dashboard`

**This redirect logic goes in the NextAuth `signIn` callback in `src/lib/auth.ts`:**
```typescript
// After successful sign in, create profile + streak if first time
async signIn({ user }) {
  const existingProfile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!existingProfile) {
    await prisma.profile.create({ data: { userId: user.id, onboardingStep: 0 } })
    await prisma.userStreak.create({ data: { userId: user.id } })
  }
  return true
}
```

**Redirect after auth (in middleware.ts — already handles `/dashboard` redirect for logged-in users on auth pages).**

---

## Section 4: Conversation Agent (shared)

**Branch:** `feat/onboarding` (owns this file)
**File to create:** `src/lib/ai/agents/conversation-agent.ts`

This agent doesn't exist yet and is needed by the onboarding Section 1, Step 4.

```typescript
// Gap-filling conversation — builds on top of claudeChat()
export async function runConversationTurn(input: {
  userName: string
  currentRole: string
  targetRole: string
  topGaps: { categoryName: string; score: number }[]
  history: { role: "user" | "assistant"; content: string }[]
  userMessage: string
}): Promise<{ reply: string; isComplete: boolean; newPsiSignals: PsiSignal[] }>
```

---

## Section 5: Shared Utilities (base)

These should be done on `develop` branch before feature branches start (or on `feat/shared`):

### Score Calculator (`src/lib/scores.ts`)

```typescript
export function calculateCategoryScores(
  skillScores: { skillId: string; evidenceScore: number; assignmentScore: number; learningScore: number }[],
  skills: { id: string; categoryId: string }[],
): Record<string, number>  // categoryId → 0-100

export function calculateReadinessScore(
  categoryScores: Record<string, number>,
  roleWeights: { categoryId: string; weight: number }[],
): number  // 0-100
```

### Streak Updater (`src/lib/streak.ts`)

```typescript
export async function recordActivity(userId: string, activityType: string, entityId?: string): Promise<void>
// Updates user_streaks + creates activity_log entry
// Call this after any meaningful user action (resume upload, conversation turn, etc.)
```

### Onboarding Progress (`src/lib/onboarding.ts`)

```typescript
export async function getOnboardingRedirect(userId: string): Promise<string>
// Returns the correct URL based on profile.onboardingStep
// 0 → /onboarding/upload
// 1 → /onboarding/profile
// 2 → /onboarding/analyzing
// 3 → /onboarding/conversation
// 4 → /onboarding/summary
// 5+ → /dashboard
```

---

## Implementation Order & Dependencies

```
Phase 0 (Base — already done):
  ✅ DB, auth, routes, AI agents, design system, seed data

Phase 1 (Do in parallel — no conflicts):
  feat/auth         →  Login + Signup pages
  feat/onboarding   →  Steps 1-5 (upload → summary)
                        Requires: Supabase Storage bucket "resumes" (create via Supabase dashboard)

Phase 2 (Start after onboarding API is working):
  feat/dashboard    →  Dashboard main + PSI view
                        Requires: user_skill_scores to be populated by onboarding

Phase 3 (Later sprints — not in current focus):
  feat/landing      →  Landing page + discover quiz
  feat/learning     →  Learning path stages
  feat/resume       →  Resume builder
  feat/questions    →  Question bank
  feat/profile      →  Public profile
```

---

## Supabase Storage Setup (Manual — One Time)

Before testing onboarding, create the storage bucket in Supabase:
1. Go to Supabase Dashboard → Storage
2. Create bucket: `resumes`
3. Set to **private** (not public)
4. Add RLS policy: `authenticated users can INSERT their own files`
   ```sql
   CREATE POLICY "Users can upload their own resumes"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

---

## Testing Checklist (Before Merging to Develop)

**feat/onboarding:**
- [ ] Upload a real PDF → work experiences saved to DB
- [ ] Profile form saves + redirects correctly
- [ ] Analyzing page shows progress animation + triggers AI
- [ ] PSI entries created in DB after analysis
- [ ] Skill scores created in DB after analysis
- [ ] Conversation chat sends/receives messages
- [ ] Summary page shows correct data
- [ ] Browser-back on step 3-4 handled gracefully

**feat/dashboard:**
- [ ] Dashboard shows after completed onboarding
- [ ] Readiness score matches formula from solution-doc Section 9
- [ ] Skill bars show correct values
- [ ] PSI entries page lists all entries with skill tags
- [ ] Edit PSI entry saves to DB
- [ ] Empty state shows when onboarding not complete

**feat/auth:**
- [ ] Google OAuth completes and redirects correctly
- [ ] First-time user → profile + streak created → redirects to onboarding
- [ ] Returning user → redirects to dashboard
- [ ] Protected routes redirect to /login when not authenticated

---

## Quick Reference — Key Prisma Models

```typescript
// Most-used models — import { prisma } from "@/lib/prisma"

prisma.profile.upsert(...)              // User profile + onboarding state
prisma.userPmTarget.upsert(...)         // Target PM role type
prisma.workExperience.createMany(...)   // Raw job history from resume
prisma.psiEntry.create(...)             // Reframed Problem/Solution/Impact
prisma.psiSkillMapping.createMany(...)  // Links PSI entries to skills
prisma.userSkillScore.upsert(...)       // Per-skill scores (evidence/assignment/learning)
prisma.readinessScoreSnapshot.create(...)  // Point-in-time overall score
prisma.conversationSession.create(...)  // Chat session
prisma.conversationTurn.create(...)     // Individual chat messages
prisma.activityLog.create(...)          // All user activities (for streak + heatmap)
prisma.userStreak.update(...)           // Streak tracking
```

---

## PR Guidelines

1. Keep PRs focused — one feature area per PR
2. PR title format: `feat(onboarding): implement resume upload step`
3. PRs target `develop` not `main`
4. Include a short description of what was built + any DB changes
5. All builds must pass `pnpm build` before merge
6. After merge to `develop` → delete feature branch
