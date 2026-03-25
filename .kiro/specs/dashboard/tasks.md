# Implementation Plan: Dashboard

## Overview

Implement the authenticated dashboard home page and PSI management sub-page for the PM Career Navigation Platform. The work is ordered by dependency: utilities and data layer first, then API routes, then UI components, then page assembly.

## Tasks

- [x] 1. Score calculation utility
  - Create `src/lib/score-calculator.ts` with a pure `computeReadinessScore` function
  - Implement the formula: `Skill_Score = 0.5×evidence + 0.3×assignment + 0.2×learning`, `Category_Score = avg(Skill_Score per category)`, `Readiness_Score = Σ(Category_Score × role_weight)` rounded to nearest integer
  - When no role weights are provided, fall back to a simple average of all category scores
  - Export input/output TypeScript types alongside the function
  - _Requirements: 2.5, 2.6_

  - [ ]* 1.1 Write property test for score formula (Property 4)
    - **Property 4: Readiness score formula correctness**
    - **Validates: Requirements 2.5**
    - File: `__tests__/lib/score-calculator.test.ts`
    - Use `fast-check` to generate arbitrary skill score arrays and role weight maps; assert computed result equals manual formula within 0.01 tolerance

- [x] 2. Relative date utility
  - Create `src/lib/relative-date.ts` with a pure `formatRelativeDate(date: Date | null): string` function
  - Return "Active today" when date is today, "Last active N days ago" for past dates, "Never active" when null
  - _Requirements: 7.3_

  - [ ]* 2.1 Write property test for relative date formatting (Property 19)
    - **Property 19: Relative date formatting**
    - **Validates: Requirements 7.3**
    - File: `__tests__/lib/relative-date.test.ts`
    - Use `fast-check` to generate arbitrary Date values; assert output is always a non-empty string and never contains a raw ISO timestamp

- [x] 3. Gap explanation map
  - Create `src/lib/gap-explanations.ts` exporting a `gapExplanations` constant typed as `Record<string, Record<string, string>>`
  - Populate with 1–2 sentence explanations for each `roleType × categorySlug` combination covering all 6 role types and all skill categories from the taxonomy
  - Export a helper `getGapExplanation(roleType: string | null, categorySlug: string): string` that returns the explanation or a sensible fallback
  - _Requirements: 4.2_

- [x] 4. Dashboard summary API route
  - Create `src/app/api/v1/dashboard/summary/route.ts` with a `GET` handler
  - Authenticate via `auth()` from NextAuth; return HTTP 401 if unauthenticated
  - Run parallel Prisma queries for: profile + pmTarget, userSkillScores (with skill + category + roleWeights), psiEntries (visible, latest 2), userStreak, activityLogs (past 84 days)
  - Compute readiness score using the utility from task 1; build `byCategory` map
  - Derive `topGaps` (2–3 lowest-scoring categories) and `topStrengths` (top 3) with gap explanations from task 3
  - Build `activityByDay` map keyed by ISO date string for the past 84 days
  - Return the full `DashboardSummary` shape defined in the design document
  - Return `readiness: { overall: 0, byCategory: {} }` when no skill scores exist
  - Return `streak: null` when no `user_streaks` record exists
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 4.1 Write property test for API response shape (Property 18)
    - **Property 18: Dashboard API response shape**
    - **Validates: Requirements 9.1**
    - File: `__tests__/api/dashboard-summary.test.ts`
    - Mock Prisma; use `fast-check` to generate varied user data states; assert all required top-level keys are always present in the response

- [x] 5. PSI API routes
  - Create `src/app/api/v1/psi/route.ts` with `GET` and `POST` handlers
  - `GET`: return all `psi_entries` where `is_visible = true` for the authenticated user, including `psi_skill_mappings` joined with skill and category names; return HTTP 401 if unauthenticated
  - `POST`: validate `problem`, `solution`, `impact` are non-empty strings (return HTTP 400 with field-level errors on failure); create the entry; return the created entry with skill mappings
  - Create `src/app/api/v1/psi/[id]/route.ts` with `PUT` and `DELETE` handlers
  - `PUT`: verify entry ownership (HTTP 403 if mismatch, HTTP 404 if not found); validate fields; update and return the entry
  - `DELETE`: verify ownership; set `is_visible = false`; return HTTP 204
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 5.1 Write property tests for PSI CRUD (Properties 10, 12, 13, 15, 16)
    - **Property 10: PSI list shows only visible entries** — Validates: Requirements 6.1, 10.1
    - **Property 12: PSI CRUD round-trip** — Validates: Requirements 6.3, 6.5, 10.2, 10.3, 10.7
    - **Property 13: PSI delete removes from list** — Validates: Requirements 6.6, 10.4
    - **Property 15: PSI ownership enforcement** — Validates: Requirements 10.5
    - **Property 16: PSI field validation rejects empty inputs** — Validates: Requirements 10.6
    - File: `__tests__/api/psi.test.ts`
    - Use `fast-check` to generate arbitrary PSI field strings and user IDs

- [ ] 6. Checkpoint — utilities and API layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. ReadinessScoreWidget component
  - Create `src/components/dashboard/readiness-score-widget.tsx` as a Server Component
  - Render a circular SVG progress ring using `stroke-dasharray` / `stroke-dashoffset` with `--color-primary` stroke
  - Display the integer score inside the ring and the target role label beneath it
  - When score ≥ 70 show amber "You're ready to apply" CTA; when score < 70 show subdued "Apply when you reach 70" note
  - Accept `ReadinessScoreWidgetProps` as defined in the design document
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 7.1 Write property test for score widget CTA (Properties 2, 3)
    - **Property 2: Score widget renders correct score and role label** — Validates: Requirements 2.1, 2.2
    - **Property 3: Score threshold CTA is mutually exclusive** — Validates: Requirements 2.3, 2.4
    - File: `__tests__/dashboard/readiness-widget.test.ts`
    - Use `fast-check` with `fc.integer({ min: 0, max: 100 })` and arbitrary role strings; assert exactly one CTA variant is present in rendered output

- [x] 8. SkillBreakdown component
  - Create `src/components/dashboard/skill-breakdown.tsx` as a Server Component
  - Sort categories ascending by score before rendering
  - Render one horizontal bar per category; apply amber / gray / indigo color based on score thresholds (< 30 / 30–50 / > 50)
  - No dividers between rows — use `gap-3` vertical spacing only
  - Accept `SkillBreakdownProps` as defined in the design document
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 8.1 Write property tests for skill breakdown (Properties 5, 6)
    - **Property 5: Skill breakdown sort order** — Validates: Requirements 3.2
    - **Property 6: Skill breakdown color tier assignment** — Validates: Requirements 3.3, 3.4, 3.5
    - File: `__tests__/dashboard/skill-breakdown.test.ts`
    - Use `fast-check` to generate arbitrary category arrays; assert rendered order and color class assignments

- [x] 9. SkillGapsPanel component
  - Create `src/components/dashboard/skill-gaps-panel.tsx` as a Server Component
  - Always render 2–3 entries (the lowest-scoring categories regardless of absolute value)
  - Each card: category name, score badge, explanation text, "Start improving →" link to `/dashboard/learning`
  - Accept `SkillGapsPanelProps` as defined in the design document
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 9.1 Write property tests for gap panel (Properties 7, 8)
    - **Property 7: Gap panel always shows 2–3 lowest categories** — Validates: Requirements 4.1, 4.4
    - **Property 8: Gap cards contain required fields** — Validates: Requirements 4.2, 4.3
    - File: `__tests__/dashboard/skill-gaps-panel.test.ts`
    - Use `fast-check` to generate category arrays with ≥ 2 entries; assert count is 2–3 and each card contains all required elements

- [x] 10. PsiSummaryWidget component
  - Create `src/components/dashboard/psi-summary-widget.tsx` as a Server Component
  - Display total PSI count, 2 preview cards with problem text truncated to 120 characters, and a "View all experiences →" link to `/dashboard/psi`
  - Accept `PsiSummaryWidgetProps` as defined in the design document
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 10.1 Write property test for PSI preview truncation (Property 9)
    - **Property 9: PSI preview truncation**
    - **Validates: Requirements 5.3**
    - File: `__tests__/dashboard/psi-summary.test.ts`
    - Use `fast-check` to generate strings longer than 120 chars; assert rendered preview is ≤ 120 characters

- [x] 11. StreakWidget component
  - Create `src/components/dashboard/streak-widget.tsx` as a Server Component
  - Hide entirely when `currentStreak === 0 && totalDaysActive === 0`
  - Display current streak, longest streak, total days active, and relative last-active date using the utility from task 2
  - Accept `StreakWidgetProps` as defined in the design document
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 12. ActivityGraph component
  - Create `src/components/dashboard/activity-graph.tsx` as a Client Component (`"use client"`)
  - Render a 12×7 grid of day cells; color tiers: 0 → `bg-surface-container`, 1–2 → `bg-primary/20`, 3–5 → `bg-primary/50`, 6+ → `bg-primary`
  - Show abbreviated day labels (M, W, F) on the left axis and month labels on the top axis
  - Implement hover tooltip showing ISO date and activity count
  - When all counts are 0, display "Start learning to build your streak" message below the grid
  - Accept `ActivityGraphProps` as defined in the design document
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 12.1 Write property test for activity graph color tiers (Property 17)
    - **Property 17: Activity graph color tier assignment**
    - **Validates: Requirements 8.2**
    - File: `__tests__/dashboard/activity-graph.test.ts`
    - Use `fast-check` with `fc.nat()` to generate arbitrary counts; assert the correct CSS class is applied for each tier and tiers are mutually exclusive

- [x] 13. PsiEntriesList and PsiEntryCard client components
  - Create `src/components/dashboard/psi-entries-list.tsx` as a Client Component
  - Manage local state for the entry list; handle add (blank form), inline edit (pre-populated form), and delete (optimistic removal)
  - Each mutation calls the PSI API and updates state on success; no full page reload
  - Create `src/components/dashboard/psi-entry-card.tsx` rendering problem, solution, impact, skill tags from `skillMappings`, and "No skills tagged" placeholder when mappings are empty
  - Accept `PsiEntriesListProps` and `PsiEntryWithSkills` types as defined in the design document
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 13.1 Write property test for PSI edit form pre-population (Property 11)
    - **Property 11: PSI edit form pre-population**
    - **Validates: Requirements 6.2**
    - File: `__tests__/dashboard/psi-entries-list.test.ts`
    - Use `fast-check` to generate arbitrary PSI entry objects; assert that after clicking edit, each form field value exactly matches the entry's current field value

  - [ ]* 13.2 Write property test for PSI skill tags (Property 14)
    - **Property 14: PSI skill tags presence**
    - **Validates: Requirements 6.7, 6.8**
    - File: `__tests__/dashboard/psi-entries-list.test.ts`
    - Use `fast-check` to generate entries with and without skill mappings; assert tags are shown when mappings exist and placeholder is shown when they don't

- [x] 14. Dashboard main page
  - Replace the stub in `src/app/dashboard/page.tsx` with a Server Component
  - Read session server-side; redirect to `/login` if unauthenticated
  - Redirect to `/onboarding/upload` if no profile record exists
  - Redirect to `ONBOARDING_STEP_URLS[profile.onboardingStep]` if `onboardingCompleted === false`
  - Fetch `GET /api/v1/dashboard/summary` server-side; render "Analysis still running" empty state when `readiness.byCategory` is empty
  - Compose `ReadinessScoreWidget`, `SkillBreakdown`, `SkillGapsPanel`, `PsiSummaryWidget`, `StreakWidget`, and `ActivityGraph` with data from the summary response
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1–2.6, 3.1–3.6, 4.1–4.4, 5.1–5.3, 7.1–7.3, 8.1–8.5_

  - [ ]* 14.1 Write property test for onboarding guard (Property 1)
    - **Property 1: Onboarding guard redirects to correct step**
    - **Validates: Requirements 1.1**
    - File: `__tests__/dashboard/guard.test.ts`
    - Use `fast-check` with `fc.integer({ min: 0, max: 4 })` for `onboardingStep`; assert redirect target matches `ONBOARDING_STEP_URLS[step]` and is never `/dashboard`

- [x] 15. PSI page
  - Create `src/app/dashboard/psi/page.tsx` as a Server Component
  - Authenticate server-side; redirect to `/login` if unauthenticated
  - Fetch `GET /api/v1/psi` server-side and pass `initialEntries` to `PsiEntriesList`
  - _Requirements: 6.1–6.8_

- [ ] 16. Install fast-check and wire up test infrastructure
  - Add `fast-check` as a dev dependency (`pnpm add -D fast-check`)
  - Confirm the project has a test runner configured (Vitest or Jest); add minimal config if absent
  - Create `__tests__/` directory structure matching the test file paths referenced in the design document
  - _Requirements: all property tests_

- [ ] 17. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations per property
- Each property-based test must include a comment: `// Feature: dashboard, Property {N}: {property_text}`
- The schema already contains all required tables (`psi_entries`, `psi_skill_mappings`, `user_streaks`, `activity_logs`) — no migrations are needed
