# Requirements Document

## Introduction

The Dashboard is the central hub of the PM Career Navigation Platform. After completing onboarding, users land here to see their readiness score, skill gap analysis, PSI (Problem→Solution→Impact) work experiences, streak activity, and quick-access links to all platform features (Learning Path, Resume Builder, Question Bank, Applications, Profile). The dashboard must surface the most actionable information first — where the user stands, what they should do next, and evidence of their progress over time.

## Glossary

- **Dashboard**: The main authenticated page at `/dashboard` that aggregates a user's career readiness data.
- **Readiness_Score**: A weighted composite score (0–100) representing how prepared a user is for their target PM role.
- **Skill_Category**: A grouping of related PM skills (e.g., Product Thinking, Analytical Skills, Stakeholder Management). Defined in the `skill_categories` table.
- **PSI_Entry**: A reframed work experience in Problem→Solution→Impact format, stored in the `psi_entries` table.
- **Streak**: A count of consecutive days the user has performed at least one meaningful activity on the platform.
- **Gap_Panel**: A UI section highlighting the 2–3 skill categories with the lowest scores for the user's target role.
- **Onboarding_Guard**: A redirect mechanism that prevents users who have not completed onboarding from accessing the dashboard.
- **Score_Widget**: The circular progress ring component displaying the overall Readiness_Score.
- **Skill_Breakdown**: A sorted list of horizontal bars showing per-category scores.
- **Activity_Graph**: A heatmap-style calendar showing daily activity over the past 12 weeks.
- **Target_Role**: The PM role type the user is preparing for (consumer, growth, technical, platform, ai, b2b), stored in `user_pm_targets`.
- **Dashboard_API**: The server-side API route at `GET /api/v1/dashboard/summary` that aggregates all data for the dashboard.
- **PSI_Page**: The sub-page at `/dashboard/psi` listing all PSI entries with edit capability.

---

## Requirements

### Requirement 1: Onboarding Guard

**User Story:** As a user who has not completed onboarding, I want to be redirected to the correct onboarding step, so that I do not see an empty or broken dashboard.

#### Acceptance Criteria

1. WHEN a user navigates to `/dashboard` and `profile.onboardingCompleted` is `false`, THE Dashboard SHALL redirect the user to the appropriate onboarding step URL based on `profile.onboardingStep`.
2. WHEN a user navigates to `/dashboard` and no profile record exists for the authenticated user, THE Dashboard SHALL redirect the user to `/onboarding/upload`.
3. WHEN a user navigates to `/dashboard` and the user is not authenticated, THE Dashboard SHALL redirect the user to `/login`.
4. WHILE `profile.onboardingCompleted` is `true` and `userSkillScore` records are absent for the user, THE Dashboard SHALL display an "Analysis still running" empty state with a loading indicator instead of score widgets.

---

### Requirement 2: Readiness Score Widget

**User Story:** As a user, I want to see my overall PM readiness score prominently, so that I know at a glance how prepared I am for my target role.

#### Acceptance Criteria

1. THE Score_Widget SHALL display the user's overall Readiness_Score as an integer between 0 and 100 inside a circular progress ring.
2. THE Score_Widget SHALL label the score with the user's Target_Role (e.g., "for Technical PM") beneath the numeric value.
3. WHEN the Readiness_Score is greater than or equal to 70, THE Score_Widget SHALL display an amber call-to-action reading "You're ready to apply".
4. WHEN the Readiness_Score is less than 70, THE Score_Widget SHALL display a subdued note reading "Apply when you reach 70".
5. THE Score_Widget SHALL calculate the Readiness_Score using the formula: `Readiness_Score = Σ (Category_Score × role_weight)` where `Category_Score = avg(0.5 × evidence_score + 0.3 × assignment_score + 0.2 × learning_score)` for all skills in the category.
6. IF no `readiness_score_snapshots` record exists for the user, THEN THE Score_Widget SHALL derive the score live from `user_skill_scores` and display it without error.

---

### Requirement 3: Skill Category Breakdown

**User Story:** As a user, I want to see my score for each PM skill category, so that I can understand which areas are strong and which need work.

#### Acceptance Criteria

1. THE Skill_Breakdown SHALL render one horizontal bar per Skill_Category, showing the category name on the left and the numeric score percentage on the right.
2. THE Skill_Breakdown SHALL sort categories in ascending order by score so that the lowest-scoring (highest-priority) categories appear at the top.
3. WHEN a category score is below 30, THE Skill_Breakdown SHALL render that bar in the amber accent color (`--color-secondary`).
4. WHEN a category score is between 30 and 50 inclusive, THE Skill_Breakdown SHALL render that bar in the muted gray color (`--color-outline-variant`).
5. WHEN a category score is above 50, THE Skill_Breakdown SHALL render that bar in the primary indigo color (`--color-primary`).
6. THE Skill_Breakdown SHALL render without gridlines or dividers between rows, using vertical spacing only.

---

### Requirement 4: Skill Gaps Panel

**User Story:** As a user, I want to see my top focus areas with actionable context, so that I know exactly what to work on next.

#### Acceptance Criteria

1. THE Gap_Panel SHALL display the 2 to 3 Skill_Categories with the lowest scores for the user's Target_Role.
2. WHEN displaying each gap card, THE Gap_Panel SHALL show the category name, the current score, and a 1–2 sentence explanation of why this skill matters for the user's Target_Role.
3. THE Gap_Panel SHALL include a "Start improving →" text link on each gap card.
4. IF fewer than 2 Skill_Categories have scores below 50, THEN THE Gap_Panel SHALL still display the 2 lowest-scoring categories regardless of their absolute score values.

---

### Requirement 5: PSI Entries Summary

**User Story:** As a user, I want to see a summary of my reframed work experiences on the dashboard, so that I can quickly access and manage my PSI entries.

#### Acceptance Criteria

1. THE Dashboard SHALL display the total count of PSI_Entry records associated with the authenticated user.
2. THE Dashboard SHALL include a "View all experiences" link that navigates to `/dashboard/psi`.
3. THE Dashboard SHALL display the 2 most recently created PSI_Entry records as preview cards showing the Problem field truncated to 120 characters.

---

### Requirement 6: PSI Entries Page

**User Story:** As a user, I want to view, edit, and add my PSI work experiences, so that I can keep my profile accurate and complete.

#### Acceptance Criteria

1. THE PSI_Page SHALL render all PSI_Entry records for the authenticated user where `is_visible` is `true`.
2. WHEN a user clicks the edit button on a PSI_Entry card, THE PSI_Page SHALL open an inline edit form pre-populated with the existing Problem, Solution, and Impact fields.
3. WHEN a user submits an edited PSI_Entry, THE PSI_Page SHALL persist the changes via `PUT /api/v1/psi/:id` and reflect the updated content without a full page reload.
4. WHEN a user clicks "Add new entry", THE PSI_Page SHALL display a blank PSI form with Problem, Solution, and Impact text fields.
5. WHEN a user submits a new PSI_Entry, THE PSI_Page SHALL persist it via `POST /api/v1/psi` and append it to the list without a full page reload.
6. WHEN a user deletes a PSI_Entry, THE PSI_Page SHALL call `DELETE /api/v1/psi/:id` which sets `is_visible = false` and removes the entry from the rendered list.
7. THE PSI_Page SHALL display skill tags on each PSI_Entry card showing the PM skill categories that entry demonstrates, derived from `psi_skill_mappings`.
8. IF a PSI_Entry has no `psi_skill_mappings`, THEN THE PSI_Page SHALL display a "No skills tagged" placeholder on that card.

---

### Requirement 7: Streak Widget

**User Story:** As a user, I want to see my current activity streak on the dashboard, so that I stay motivated to engage with the platform daily.

#### Acceptance Criteria

1. WHEN `user_streaks.currentStreak` is greater than 0, THE Dashboard SHALL display the Streak widget showing the current streak count and the longest streak count.
2. WHEN `user_streaks.currentStreak` is 0 and `user_streaks.totalDaysActive` is 0, THE Dashboard SHALL hide the Streak widget entirely.
3. THE Dashboard SHALL display the `lastActiveDate` in a human-readable relative format (e.g., "Active today", "Last active 2 days ago").

---

### Requirement 8: Activity Graph

**User Story:** As a user, I want to see a heatmap of my daily activity over the past 12 weeks, so that I can visualize my consistency and progress over time.

#### Acceptance Criteria

1. THE Activity_Graph SHALL render a 12-week calendar heatmap using data from `activity_logs` for the authenticated user.
2. THE Activity_Graph SHALL color each day cell based on the count of activity log entries for that day: 0 activities = no fill, 1–2 = light tint, 3–5 = medium tint, 6+ = full primary color.
3. THE Activity_Graph SHALL display abbreviated day labels (M, W, F) on the left axis and abbreviated month labels on the top axis.
4. WHEN a user hovers over a day cell, THE Activity_Graph SHALL display a tooltip showing the date and the count of activities performed.
5. IF no `activity_logs` records exist for the user in the past 12 weeks, THEN THE Activity_Graph SHALL render all cells with no fill and display the message "Start learning to build your streak".

---

### Requirement 9: Dashboard Data API

**User Story:** As a developer, I want a single API endpoint that returns all dashboard data, so that the dashboard page can be rendered server-side with a single data fetch.

#### Acceptance Criteria

1. THE Dashboard_API SHALL return a JSON response containing: `profile`, `readiness` (overall score and per-category breakdown), `topGaps`, `topStrengths`, `psiCount`, `streak`, and `lastSnapshot`.
2. WHEN the authenticated user has no `user_skill_scores` records, THE Dashboard_API SHALL return `readiness: { overall: 0, byCategory: {} }` without error.
3. THE Dashboard_API SHALL require authentication and return HTTP 401 if the request is unauthenticated.
4. THE Dashboard_API SHALL return HTTP 200 with all available data within 2000ms under normal database load.
5. IF the user has no `user_pm_targets` record, THEN THE Dashboard_API SHALL return `profile.targetRoleType` as `null` and omit role-weighted score calculations.

---

### Requirement 10: PSI CRUD API

**User Story:** As a developer, I want REST API routes for PSI entry management, so that the PSI page can create, read, update, and delete entries.

#### Acceptance Criteria

1. THE PSI_API `GET /api/v1/psi` SHALL return all PSI_Entry records for the authenticated user where `is_visible` is `true`, including associated `psi_skill_mappings` and skill names.
2. THE PSI_API `POST /api/v1/psi` SHALL create a new PSI_Entry record with the provided `problem`, `solution`, and `impact` fields and associate it with the authenticated user.
3. THE PSI_API `PUT /api/v1/psi/:id` SHALL update the `problem`, `solution`, and `impact` fields of the specified PSI_Entry, provided the entry belongs to the authenticated user.
4. THE PSI_API `DELETE /api/v1/psi/:id` SHALL set `is_visible = false` on the specified PSI_Entry, provided the entry belongs to the authenticated user.
5. IF a `PUT` or `DELETE` request targets a PSI_Entry that does not belong to the authenticated user, THEN THE PSI_API SHALL return HTTP 403.
6. THE PSI_API SHALL validate that `problem`, `solution`, and `impact` fields are non-empty strings on `POST` and `PUT` requests, returning HTTP 400 with a descriptive error message if validation fails.
7. FOR ALL valid PSI_Entry records, a `GET` followed by a `PUT` with the same field values followed by another `GET` SHALL return equivalent data (round-trip property).
