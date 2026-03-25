# PM Career Navigation Platform — Solution Document (Engineering Handoff)

**Version:** 1.0 — MVP Specification
**Last Updated:** March 23, 2026
**Status:** Ready for implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Pain Points → Solution Mapping](#2-pain-points--solution-mapping)
3. [User Personas](#3-user-personas)
4. [Platform Architecture Overview](#4-platform-architecture-overview)
5. [User Flows](#5-user-flows)
6. [Feature Specifications — Page by Page](#6-feature-specifications)
7. [Skills Taxonomy v0](#7-skills-taxonomy-v0)
8. [Learning Path Structure](#8-learning-path-structure)
9. [Readiness Score — Calculation Logic](#9-readiness-score--calculation-logic)
10. [AI Agent Architecture](#10-ai-agent-architecture)
11. [Database Schema](#11-database-schema)
12. [API Design](#12-api-design)
13. [System Architecture](#13-system-architecture)
14. [Implementation Plan](#14-implementation-plan)
15. [Phase 2 Roadmap](#15-phase-2-roadmap)

---

## 1. Executive Summary

### What We're Building

A career navigation platform that helps professionals transition into Product Management roles. The platform extracts PM-relevant experience from a user's existing work, surfaces hidden skills, provides a personalized learning path, and produces tangible outputs (optimized resumes, public profile, readiness score) that directly help users land PM roles.

### Core Thesis

Most career switchers already have PM-relevant experience buried in their work — they can't see it, can't articulate it, and can't package it. The product's job is to **extract, reframe, and sequence** that latent value into something hireable. Everything else (learning paths, question banks, streak systems) is scaffolding around this core extraction and reframing engine.

### The Core Loop

```
Understand You → Show You Where You Stand → Tell You What To Do Next → Help You Prove You Did It → Help You Apply
```

1. **Understand:** Parse resume + conversational drill-down to extract every PM-relevant signal
2. **Assess:** Map extracted data against a skills taxonomy weighted for their target PM role
3. **Guide:** Personalized learning path with gated stages, curated resources, and practical assignments
4. **Prove:** Checkpoint submissions evaluated by AI, building a public proof-of-work profile
5. **Apply:** Resume builder that auto-generates JD-specific resumes from the master profile

### Elevator Pitch Options

| Version | Pitch | Angle |
|---------|-------|-------|
| A | "You already think like a PM. Let us prove it." | Identity — reframes who they are |
| B | "Upload your resume. See your PM potential in 5 minutes." | Speed — instant value |
| C | "Stop preparing blind. Know exactly where you stand — and what to do next." | Clarity — solves confusion |
| D | "Your next PM role starts with what you've already done." | Action — connects past to future |
| E | "The honest path from where you are to your first PM role." | Trust — differentiator from hype |

**Recommended:** Version A for brand/homepage hero. Version C for performance marketing. Version B for product onboarding CTA.

### MVP Scope

**In MVP:**
- Onboarding: resume upload + profile form + AI parsing + gap-filling conversation (text + voice)
- PSI extraction: Problem→Solution→Impact reframing of all work experiences
- Skill gap analysis: mapped against target PM role taxonomy
- Readiness score: weighted, role-specific, with sub-scores per category
- Learning path: predefined stages with curated resources, assignments, AI-evaluated gates
- Question bank: PM interview questions by topic, AI evaluation, no community features
- Resume builder: WYSIWYG editor, auto-generate from master profile per JD, ATS scoring
- Public profile page: shareable, with activity graph and verification badge
- Streak system: daily activity tracking with rewards
- Discovery module: lightweight quiz for users exploring PM as a career option

**Phase 2 (out of MVP):**
- Cover letter generation
- Peer review on assignments
- Community features on question bank (comments, peer answers)
- LinkedIn import for resume data
- Domain-specific deep-dive modules (Growth PM, AI PM, etc.)
- Admin portal for content management
- Contact/follow-up management for applications
- Mock interview features
- Mobile app

### Target Users

- **Any professional background** (engineer, QA, designer, consultant, sales, marketing, analyst, MBA, etc.)
- **<5 years experience** or no PM experience (career switchers and early-stage PMs)
- **Two entry states:** "Should I try PM?" (exploring) and "I've decided, help me prepare" (committed)
- **Geography:** India-first, globally relevant
- **Supported personas at launch:** Engineers, QA, Designers, Consultants, Sales/Marketing, Analysts, MBAs (minimum 3-4 deeply supported, rest with reasonable personalization)

---

## 2. Pain Points → Solution Mapping

| # | Pain Point | Score | How We Solve It | Primary Feature |
|---|-----------|-------|----------------|-----------------|
| 1 | **No readiness signal** — Aspirants have no reliable way to know when they're good enough to apply, so they stay in prep mode indefinitely. | P0 (25) | Readiness score with sub-scores per skill category, tied to target role. "Apply now" trigger at configurable threshold (default 70%). Score updates on revalidation and stage completion. | Readiness Score Dashboard |
| 3 | **Confidence-action loop breakdown** — Rejections trigger a spiral where people stop applying entirely. | P0 (25) | Streak system rewards consistency. Small visible wins (stage completions, score improvements). Learning path gives concrete "next action" instead of ambiguity. Score trajectory shows progress even when outcomes aren't coming. | Streak System + Activity Graph + Learning Path |
| 7 | **ATS and title-based screening** — Career switchers with non-PM titles get filtered out before any human reads the application. | P0 (25) | Resume builder with ATS scoring (keyword match + formatting). PSI reframing translates non-PM work into PM language. JD-specific resume generation selects and orders bullets for maximum relevance. | Resume Builder + PSI Extraction |
| 4 | **One-size-fits-all guidance** — Every background gets the same advice despite radically different starting points. | P1 (20) | 5-axis personalization: current role, target PM type, experience level, preparation stage, skill gaps. Learning path customized by skipping/reducing stages. Assignments tailored to user's domain. | Personalized Learning Path |
| 6 | **Behavioral scaffolding failure** — Without external deadlines or forcing functions, prep defaults to passive content consumption. | P1 (20) | Gated progression: must submit proof and pass AI evaluation to advance. Streak system with daily activity tracking. Assignments are practical (build something, write something, analyze something) not passive (read this, watch that). | Gated Stages + Streak + AI Evaluation |
| 2 | **Experience translation gap** — People with relevant non-PM backgrounds cannot frame their existing work in PM language. | P1 (16) | Core value prop. AI-powered PSI extraction converts "created frontend for gaming app" into "Identified user engagement gap in gaming platform, designed and shipped interactive interface, resulting in 20% increase in session duration." Conversational drill-down surfaces hidden PM skills. | PSI Extraction + Onboarding Conversation |
| 5 | **No employer-side signal** — Aspirants make strategic decisions based on zero hiring perspective. | P1 (16) | Skill taxonomy derived from actual PM job descriptions. Readiness score calibrated against real JD requirements. Resume builder scores against actual JD keywords. Shows which companies are realistic targets based on current profile. | Skills Taxonomy + JD-based Scoring |
| 8 | **Fragmented and unsequenced learning** — No clear order of what to learn first. | P1 (16) | Predefined learning stages in deliberate sequence. Each stage builds on previous. Resources curated and ordered, not dumped. Clear "you are here" indicator. Next step always visible. | Sequenced Learning Path |

---

## 3. User Personas

### Persona 1: The Experienced Developer (Primary)

- **Background:** 3-5 years as a software engineer/full-stack developer
- **State:** Has decided to switch to PM. Has relevant experience but doesn't know how to frame it.
- **Key need:** Extract and reframe existing work. Resume transformation. Skill gap identification for target PM role.
- **Cognitive state:** Motivated but overwhelmed by information. Has tried reading PM blogs and feels more confused. Imposter syndrome about "not being a real PM."
- **Product value:** The PSI extraction shows them "you already have 60% of what you need." The remaining 40% becomes a clear, actionable plan.
- **Example:** Priya, 4 years at an insurtech company. Built a configuration platform (LCNC). Has actually done requirements gathering, stakeholder management, and user research — but describes it all as "frontend development."

### Persona 2: The Fresh Graduate / Early Career (<2 years)

- **Background:** Recent graduate or 0-2 years in any role. Minimal work to reframe.
- **State:** Interested in PM but unsure if it's the right fit. Limited understanding of what PMs actually do.
- **Key need:** Clarity on PM roles, honest assessment of readiness, structured learning path to build from scratch.
- **Cognitive state:** Excited but naive. May have romanticized the PM role from LinkedIn posts. Needs realistic expectations.
- **Product value:** Discovery module gives honest picture. Learning path provides structured skill-building. Assignments create portfolio pieces from scratch.
- **Example:** Arjun, graduated 8 months ago, working as QA engineer. Reads PM Twitter daily. Has done zero product work but wants to switch. Needs to understand what PM actually involves and build foundational skills.

### Persona 3: The Non-Tech Professional

- **Background:** 2-4 years in consulting, sales, marketing, operations, or business analysis
- **State:** Has transferable skills (stakeholder management, data analysis, customer understanding) but doesn't recognize them as PM skills.
- **Key need:** Translation of business skills to PM language. Understanding which PM type fits their background.
- **Cognitive state:** Confident in their domain but insecure about "tech" requirements. Worried about ATS filters.
- **Product value:** PSI extraction reveals PM skills they didn't know they had. Role matching shows which PM type leverages their strengths. Learning path fills only the actual gaps.
- **Example:** Meera, 3 years as a management consultant. Has led client workshops, defined requirements, built business cases. Her resume says "management consulting" everywhere but contains PM work.

### Persona 4: The Explorer

- **Background:** Any. 0-5 years experience.
- **State:** Not committed to PM. Heard about it, curious, wants to understand if it's right for them.
- **Key need:** Honest career exploration. What PM types exist. What the work actually looks like. Whether their personality and interests align.
- **Cognitive state:** Open-minded but skeptical of "become a PM in 30 days" claims. Wants honesty, not sales.
- **Product value:** Discovery module provides genuine career clarity. If PM isn't right, we tell them. If it is, we show them the most suitable role type and a realistic path.
- **Example:** Vikram, 2 years as a data analyst. Keeps hearing "PM is the best role in tech." Not sure if that's true or if it's LinkedIn hype. Wants to understand before committing.

---

## 4. Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  Landing │ Onboarding │ Dashboard │ Learning │ Resume │ Profile │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API + WebSocket (for AI chat)
┌────────────────────────────┴────────────────────────────────────┐
│                     BACKEND (Next.js API Routes / Node.js)      │
│  Auth │ User │ Profile │ Learning │ Resume │ Score │ AI Router   │
└──┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────────┐
│ Auth │ │PostgreSQL│ │pgvector│ │ Redis  │ │   AI Layer       │
│(Gmail│ │(Primary │ │(RAG    │ │(Cache  │ │ Resume Parser    │
│OAuth)│ │  DB)    │ │Embeds) │ │Session)│ │ PSI Reframer     │
└──────┘ └────────┘ └────────┘ └────────┘ │ Gap Analyzer     │
                                           │ Conversation Bot │
                                           │ Assignment Eval  │
                                           │ Resume Optimizer │
                                           │ Learning Recomm. │
                                           └──────────────────┘
                                             │       │       │
                                             ▼       ▼       ▼
                                          Claude  GPT-4o  Open-Source
                                          Sonnet  mini    (Llama/Mistral)
```

**Key technology decisions:**
- **Frontend:** Next.js (SSR where applicable, CSR for interactive features)
- **Backend:** Next.js API routes (monolith for MVP, extractable to microservices later)
- **Database:** PostgreSQL (primary) + pgvector extension (for RAG embeddings)
- **Cache:** Redis (session management, rate limiting)
- **Auth:** NextAuth.js with Google OAuth + email/password
- **Rich Text Editor:** TipTap (resume builder)
- **Voice:** Web Speech API (browser-native) for MVP
- **AI:** Multi-model approach (see Section 10)
- **Deployment:** Vercel (frontend) + managed PostgreSQL (Supabase or Railway or Neon)

---

## 5. User Flows

### 5.1 High-Level Happy Path

```
Landing Page
    │
    ├── "I know I want PM" ──────────────────────┐
    │                                             │
    ├── "I'm exploring" ── Discovery Module ──────┤
    │                        │                    │
    │                   [PM not for you?]          │
    │                        │                    │
    │                   [Show honest feedback      │
    │                    + alternatives]           │
    │                                             │
    ▼                                             ▼
  Sign Up (Email / Google OAuth)
    │
    ▼
  Resume Upload (mandatory)
    │
    ▼
  Quick Profile Form
  (current role, years exp, target PM type or "not sure", prep stage)
    │
    ▼
  AI Analysis (loading screen with progress steps)
  [Parse resume → Generate initial PSI → Tag skills → Identify gaps]
    │
    ▼
  Brief Summary: "We found X work experiences and tagged Y skills"
    │
    ▼
  Gap-Filling Conversation (text + voice option)
  [Structured but intelligent — 5-12 questions based on gaps detected]
    │
    ▼
  Full Analysis Dashboard
  ├── PSI entries (reframed work experiences) — editable
  ├── Skills map with scores per category
  ├── Readiness score (overall + per category)
  ├── Recommended learning path
  └── "Reanalyze" button
    │
    ▼
  Main Dashboard (home base)
  ├── Learning Path (gated stages)
  ├── Resume Builder
  ├── Question Bank
  ├── Public Profile
  └── Readiness Score tracking
```

### 5.2 Discovery Module Flow (for "exploring" users)

```
Entry: User clicks "Not sure if PM is for me" or "Explore PM careers"
    │
    ▼
  Step 1: Background Assessment (structured quiz, not chatbot)
  - Current role (dropdown)
  - Years of experience
  - What do you enjoy most about your current work? (multi-select)
    □ Solving complex problems
    □ Talking to customers/users
    □ Analyzing data
    □ Leading projects
    □ Designing solutions
    □ Building strategy
    □ Coordinating across teams
  - What frustrates you about your current role? (multi-select)
  - What attracted you to PM? (multi-select)
    □ Saw it on LinkedIn / social media
    □ A friend/colleague suggested it
    □ I want to be closer to product decisions
    □ I want to transition from purely technical work
    □ Better career growth / compensation
    □ I enjoy the intersection of tech + business + users
    │
    ▼
  Step 2: PM Role Types Overview
  - Show 5 role types (Consumer, Growth, Technical, Platform, AI PM)
  - For each: 1-paragraph description, day-in-the-life snapshot, key skills
  - Based on Step 1 answers, highlight "Best fit for you" with reasoning
  - Show honest pros AND cons for each
    │
    ▼
  Step 3: Honest Assessment
  - "Based on your background, here's our take:"
  - If strong fit: "Your background in X maps well to Y PM type. Here's why..."
  - If moderate fit: "PM could work for you, but you'd need to build skills in A, B, C. Here's a realistic timeline."
  - If weak fit: "We want to be honest — PM might not be the strongest path given your current background. Here's why, and here are alternative roles that leverage your strengths."
  - Downsides section (always shown):
    - "You'll coordinate without authority — blame comes to you, credit doesn't always"
    - "The market is competitive — average time to land a PM role for switchers is X months"
    - "Entry-level PM roles are shrinking due to AI"
    - "Many assumptions about the role are wrong — it's not about having ideas, it's about making decisions with incomplete data"
    │
    ▼
  Step 4: Decision Point
  - "Want to continue?" → Sign up → main onboarding flow (with role pre-selected)
  - "I need to think about it" → Save result, can come back
  - "This helped me realize PM isn't for me" → Show alternative career paths, end gracefully
```

**Key design principle:** The discovery module is standalone. It can be linked from the main onboarding (if user picks "not sure" as their target), but it's also independently accessible. It should feel like getting advice from a honest friend, not a sales funnel.

### 5.3 Onboarding Flow (Detailed)

```
STEP 1: Sign Up
━━━━━━━━━━━━━━━
- Google OAuth (primary)
- Email + password (secondary)
- No guest flow — account required to store profile data

STEP 2: Resume Upload
━━━━━━━━━━━━━━━━━━━━
- Supported formats: PDF, DOCX, TXT
- Mandatory for MVP
- If user doesn't have a resume:
  → Show "LLM Prompt Export" option:
    "Don't have a resume handy? If you've used ChatGPT or Claude before,
     we can generate a prompt that extracts your work history from your
     conversation history. Copy this prompt, paste it into your AI tool,
     and paste the response back here."
  → Generate a structured prompt that asks the LLM to output in PSI format
  → User pastes the LLM's response into a text area
  → System parses this as alternative to resume
- File size limit: 5MB
- Show upload progress

STEP 3: Quick Profile Form
━━━━━━━━━━━━━━━━━━━━━━━━━
Fields:
- Full name (text)
- Current role / title (text)
- Company name (text, optional)
- Years of total work experience (dropdown: 0-1, 1-2, 2-3, 3-5, 5+)
- Industry / domain (dropdown: Technology, Finance, Healthcare, E-commerce, 
  Education, Insurance, Consulting, Other + text)
- Target PM role (radio):
  □ Consumer PM
  □ Growth PM
  □ Technical PM
  □ Platform PM
  □ AI PM
  □ Not sure — help me decide (links to discovery module)
  □ General PM (no specific type)
- Current preparation stage (radio):
  □ Just started exploring
  □ Have been reading/studying for a while
  □ Actively preparing for interviews
  □ Already applying / have applied and not getting callbacks
- [Optional] Paste up to 3 job descriptions you're targeting (text areas)

STEP 4: AI Analysis (Background Processing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- User sees a loading screen with animated progress steps:
  1. "Reading your resume..." (2-3 seconds)
  2. "Extracting your work experiences..." (3-5 seconds)  
  3. "Reframing your experience in PM language..." (5-10 seconds)
  4. "Mapping your skills to PM competencies..." (3-5 seconds)
  5. "Identifying skill gaps for [target role]..." (3-5 seconds)
  6. "Almost there — preparing your personalized analysis..." (2-3 seconds)
- Total expected time: 20-40 seconds
- If user switches browser tabs: show browser notification when complete
  (using Notification API — request permission on page load)
- Behind the scenes:
  a. Resume Parser agent extracts structured data
  b. PSI Reframer agent converts each experience to Problem→Solution→Impact
  c. Gap Analyzer maps extracted skills against target role taxonomy

STEP 5: Brief Summary (Pre-Conversation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Show a card:
  "We found [X] work experiences in your resume and identified [Y] PM-relevant skills.
   Your initial readiness estimate is [Z]% for [Target Role].
   
   Before we show you the full analysis, we'd like to ask a few questions
   to fill in the gaps and make sure we haven't missed anything."
   
   [Continue to conversation →]

STEP 6: Gap-Filling Conversation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Interface: Chat-style UI with text input + microphone button (voice mode)
- Voice mode: Browser-native Web Speech API for speech-to-text
  → User speaks, speech is transcribed to text, sent as message
  → AI responds in text (no text-to-speech for MVP)
- Conversation structure: STRUCTURED with LLM-guided probing
  → Not freeform chat, not a static form
  → AI has a checklist of skill areas to probe based on gaps detected
  → For each gap, asks 1-2 contextual questions related to user's work
  → Questions reference user's actual company, role, and industry

- Example conversation flow for a developer switching to Technical PM:

  AI: "I see you worked at [Company] building a configuration platform.
       That's interesting — it sounds like you were solving real business
       problems, not just writing code. Let me ask you a few things to
       understand the full picture."
  
  AI: "When you built the LCNC platform, who decided what features to
       build first? Was that you, your PM, or someone else?"
       [Probing: Prioritization, Product Thinking]
  
  User: "It was mostly our PM but I'd often push back when I thought 
         the priority was wrong"
  
  AI: "That's great — can you give me a specific example of when you
       pushed back and what happened? What was the outcome?"
       [Probing: Stakeholder Management, Decision Making]
  
  AI: "Did you ever talk directly to the end users of the platform?
       Business users who were configuring insurance products?"
       [Probing: User Understanding, Research]
  
  AI: "One more thing — you mentioned the platform reduced development
       time. How did you measure that? Did you track any metrics?"
       [Probing: Analytical Skills, Metrics]

- Question count: 5-12 questions depending on resume completeness
  → Resume with detailed bullets: 5-7 questions
  → Resume with sparse bullets: 8-12 questions
- Progress indicator: "Question 3 of ~8" (approximate)
- Skip option: "Skip for now — I'll come back later" (saves progress)
- At end: "Thanks! We have a much better picture now. Let me generate
          your full analysis."

STEP 7: Full Analysis Dashboard (First View)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- This IS the main dashboard, but shown for the first time with all 
  sections populated from onboarding data
- Shows:
  a. Readiness Score (large, prominent) + sub-scores
  b. PSI entries (reframed work experiences) — each editable
  c. Skills map (visual — radar chart or bar chart)
  d. Recommended learning path with stages highlighted
  e. "What you should do next" — single clear action
- User can:
  → Edit any PSI entry (modify problem, solution, impact, metrics)
  → Add new PSI entries they remembered during conversation
  → Click "Reanalyze Skills" button (re-runs Gap Analyzer on updated data)
  → Start their learning path
  → Jump to resume builder

- IMPORTANT: If the system detects the user might be better suited for a
  different PM role than they selected, show a non-blocking suggestion:
  "Based on your experience, you might also be a strong fit for [Technical PM].
   Your skills in [X] and [Y] align well with this role type. 
   [Switch to Technical PM] [Keep current selection]"
```

### 5.4 Edge Cases

| Scenario | Handling |
|----------|----------|
| Resume is in a non-standard format (image-based PDF, scanned) | Show error: "We couldn't parse your resume. Please upload a text-based PDF or DOCX." Offer text area to paste resume content manually. |
| Resume has very little content (<3 bullet points) | Proceed with parsing, but flag in conversation: "Your resume is quite brief. We'll need to ask more questions to understand your full experience." Increase conversation question count to 10-12. |
| User selects "Not sure" for target PM role | Route to Discovery Module. After completion, return to onboarding with role pre-selected. If they skip discovery, default to "General PM" and note that readiness score will be less specific. |
| User uploads JDs that are not PM roles | Flag: "This JD doesn't appear to be for a Product Manager role. We'll still analyze it, but our scoring is optimized for PM positions." |
| User has genuinely zero PM-relevant experience | Show honest assessment. Readiness score will be low (likely 15-30%). Emphasize learning path and side projects. "Your current profile shows limited PM experience, but that's exactly why you're here. Your learning path focuses on building these skills from scratch." |
| User abandons onboarding mid-conversation | Save all progress. On next login, resume from where they left off. Show: "Welcome back! You were in the middle of telling us about your experience. Want to pick up where you left off?" |
| User's resume is in a non-English language | MVP: English only. Show message: "Currently we only support English resumes. Please upload an English version." |
| AI analysis takes longer than 60 seconds | Show: "This is taking longer than usual. We're still working on it — you can leave this page and we'll notify you when it's ready." |

---

## 6. Feature Specifications — Page by Page

### 6.1 Landing Page

**URL:** `/`

**Purpose:** Convert visitors to sign-ups. Communicate the value proposition instantly.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ [Logo]                    [Login] [Get Started]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  "You already think like a PM. Let us prove it." │
│                                                  │
│  Upload your resume and see your PM potential    │
│  in 5 minutes — skills mapped, gaps identified,  │
│  personalized path to your first PM role.         │
│                                                  │
│  [Upload Resume & Get Started]                   │
│  [Not sure if PM is for you? Take the quiz →]   │
│                                                  │
├─────────────────────────────────────────────────┤
│  HOW IT WORKS (3 steps)                          │
│                                                  │
│  1. Upload your resume                           │
│     We extract every PM-relevant signal from     │
│     your work — things you didn't know counted.  │
│                                                  │
│  2. See where you stand                          │
│     Skills mapped against your target PM role.   │
│     Honest readiness score. No sugarcoating.     │
│                                                  │
│  3. Close the gaps and apply                     │
│     Personalized learning path. Build real        │
│     proof of work. Apply when you're actually     │
│     ready — and we'll tell you when that is.     │
│                                                  │
├─────────────────────────────────────────────────┤
│  BEFORE → AFTER EXAMPLE                          │
│                                                  │
│  [Split view showing:]                           │
│  Left: Raw developer resume bullet               │
│  "Resolved UI related bugs and validations"      │
│                                                  │
│  Right: Reframed PSI version                     │
│  Problem: Manual insurance configuration was     │
│  slow and inflexible...                          │
│  Solution: Built a low-code platform...          │
│  Impact: Reduced development time by 90%...      │
│                                                  │
├─────────────────────────────────────────────────┤
│  WHAT MAKES US DIFFERENT                         │
│                                                  │
│  ✗ "We don't tell everyone they're ready"        │
│  ✗ "We don't give you the same advice as         │
│     everyone else"                               │
│  ✗ "We don't just sell you a course"             │
│                                                  │
│  ✓ "We extract PM skills you didn't know you     │
│     had"                                         │
│  ✓ "We're honest when you're not ready yet"      │
│  ✓ "We give you a path built for YOUR            │
│     background, not a generic roadmap"           │
│                                                  │
├─────────────────────────────────────────────────┤
│  [Get Started — Free]                            │
│                                                  │
│  Footer: About │ Privacy │ Contact               │
└─────────────────────────────────────────────────┘
```

**No pricing section** — everything is free for MVP.

### 6.2 Authentication Pages

**URL:** `/auth/signup`, `/auth/login`

**Sign Up Page:**
- Google OAuth button (primary, prominent)
- Divider: "or"
- Email + password form
- "Already have an account? Log in"
- After sign up → redirect to `/onboarding/resume`

**Login Page:**
- Google OAuth button
- Email + password form
- "Don't have an account? Sign up"
- After login → redirect to `/dashboard`

**Tech:** NextAuth.js with Google provider + Credentials provider (email/password)

### 6.3 Onboarding — Resume Upload

**URL:** `/onboarding/resume`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Step 1 of 4: Upload Your Resume              │
│  ━━━━━○───────○───────○───────               │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │                                  │         │
│  │    Drag & drop your resume here  │         │
│  │    or click to browse            │         │
│  │                                  │         │
│  │    PDF, DOCX, or TXT (max 5MB)  │         │
│  │                                  │         │
│  └─────────────────────────────────┘         │
│                                               │
│  ── or ──                                     │
│                                               │
│  Don't have a resume ready?                   │
│  [Generate a prompt to extract your work      │
│   history from ChatGPT/Claude →]              │
│                                               │
│  When clicked, shows:                         │
│  ┌─────────────────────────────────┐         │
│  │ Copy this prompt and paste it    │         │
│  │ into ChatGPT, Claude, or any AI: │         │
│  │                                  │         │
│  │ [--- PROMPT TEXT ---]            │         │
│  │                                  │         │
│  │ [Copy Prompt]                    │         │
│  │                                  │         │
│  │ Then paste the response here:    │         │
│  │ [Large text area]                │         │
│  │                                  │         │
│  │ [Submit Response]                │         │
│  └─────────────────────────────────┘         │
│                                               │
│                           [Continue →]        │
└──────────────────────────────────────────────┘
```

**LLM Prompt Export (generated prompt template):**
```
I need you to help me document my complete work history in a structured format. 
For EACH role I've held, please extract the following based on our previous 
conversations (or ask me if you don't have this information):

For each project or significant task:
- **Problem:** What business/user problem was being solved?
- **Solution:** What did I specifically do? What was my role?
- **Impact:** What was the measurable outcome? (metrics, time saved, revenue, users affected)

Also list:
- Any time I defined requirements or priorities
- Any time I worked directly with users or customers
- Any time I analyzed data to make a decision
- Any time I coordinated across teams
- Any cross-functional collaboration
- Any leadership or mentorship activities
- Tools and technologies I've used

Format the output as a structured list with clear headers per company/role.
Include specific metrics and numbers wherever possible.
```

### 6.4 Onboarding — Profile Form

**URL:** `/onboarding/profile`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Step 2 of 4: Tell Us About You               │
│  ━━━━━━━━━━━━○───────○───────                │
│                                               │
│  Full Name: [___________________________]     │
│                                               │
│  Current Role / Title: [___________________]  │
│                                               │
│  Company (optional): [_____________________]  │
│                                               │
│  Years of Experience:                         │
│  [Dropdown: 0-1 | 1-2 | 2-3 | 3-5 | 5+]    │
│                                               │
│  Industry / Domain:                           │
│  [Dropdown: Technology | Finance | Healthcare │
│   | E-commerce | Education | Insurance |      │
│   Consulting | Other: _______________]        │
│                                               │
│  Which PM role are you targeting?             │
│  ○ Consumer PM                                │
│  ○ Growth PM                                  │
│  ○ Technical PM                               │
│  ○ Platform PM                                │
│  ○ AI PM                                      │
│  ○ General PM (no specific preference)        │
│  ○ Not sure — help me decide                  │
│    [Takes you to our PM Role Discovery quiz]  │
│                                               │
│  Where are you in your preparation?           │
│  ○ Just started exploring                     │
│  ○ Been reading/studying for a while          │
│  ○ Actively preparing for interviews          │
│  ○ Already applying (not getting callbacks)   │
│                                               │
│  [Optional] Paste a job description you're    │
│  targeting (helps us personalize your path):  │
│  [Text area - JD 1]                           │
│  [+ Add another JD] (max 3)                   │
│                                               │
│                           [Continue →]        │
└──────────────────────────────────────────────┘
```

### 6.5 Onboarding — AI Analysis Loading

**URL:** `/onboarding/analyzing`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Step 3 of 4: Analyzing Your Experience       │
│  ━━━━━━━━━━━━━━━━━━━━○───────                │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │                                  │         │
│  │    [Animated progress indicator] │         │
│  │                                  │         │
│  │    ✓ Reading your resume...      │         │
│  │    ✓ Extracting work experiences │         │
│  │    ◉ Reframing in PM language... │         │
│  │    ○ Mapping PM competencies     │         │
│  │    ○ Identifying skill gaps      │         │
│  │    ○ Preparing your analysis     │         │
│  │                                  │         │
│  │    This usually takes 20-40      │         │
│  │    seconds. Feel free to switch  │         │
│  │    tabs — we'll notify you.      │         │
│  │                                  │         │
│  └─────────────────────────────────┘         │
│                                               │
└──────────────────────────────────────────────┘
```

**Technical behavior:**
- Frontend polls `/api/onboarding/status` every 2 seconds
- Backend processes asynchronously (sequential agent pipeline)
- On completion: update status → frontend auto-advances
- If user leaves tab: use `Notification.requestPermission()` → show browser notification "Your PM analysis is ready!"
- If processing exceeds 60s: show "Taking longer than usual..." message

### 6.6 Onboarding — Brief Summary + Transition to Conversation

**URL:** `/onboarding/summary`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Step 3 of 4: Here's What We Found            │
│  ━━━━━━━━━━━━━━━━━━━━○───────                │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │  We found 6 work experiences     │         │
│  │  and identified 14 PM-relevant   │         │
│  │  skills in your resume.          │         │
│  │                                  │         │
│  │  Your initial readiness          │         │
│  │  estimate: 47% for Technical PM  │         │
│  │                                  │         │
│  │  Before we show you the full     │         │
│  │  analysis, we'd like to ask a    │         │
│  │  few questions to fill in the    │         │
│  │  gaps and make sure we haven't   │         │
│  │  missed anything important.      │         │
│  │                                  │         │
│  │  This takes about 5-8 minutes.   │         │
│  │                                  │         │
│  └─────────────────────────────────┘         │
│                                               │
│  [Continue to conversation →]                 │
│  [Skip for now — show me the analysis]        │
│                                               │
└──────────────────────────────────────────────┘
```

**Note:** "Skip for now" is available but discouraged. If skipped, analysis will be based only on resume data and will be less accurate. Show: "Your analysis will be less accurate without this step. You can always come back to complete it."

### 6.7 Onboarding — Gap-Filling Conversation

**URL:** `/onboarding/conversation`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Step 4 of 4: Let's Fill In The Gaps          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │ [AI Avatar]                      │         │
│  │ "I can see you worked at         │         │
│  │  Cogitate building a             │         │
│  │  configuration platform. That    │         │
│  │  sounds like really interesting  │         │
│  │  product work. Let me ask you    │         │
│  │  a few things..."               │         │
│  │                                  │         │
│  │ Question 1 of ~8                 │         │
│  │ "When you built the LCNC         │         │
│  │  platform, who decided what      │         │
│  │  features to build first?"       │         │
│  │                                  │         │
│  │ [User message bubble]            │         │
│  │ "It was mostly our PM but I'd    │         │
│  │  push back when priorities       │         │
│  │  seemed wrong..."               │         │
│  │                                  │         │
│  │ [AI Avatar]                      │         │
│  │ "That's great product instinct.  │         │
│  │  Can you give me a specific      │         │
│  │  example?"                       │         │
│  │                                  │         │
│  └─────────────────────────────────┘         │
│                                               │
│  ┌─────────────────────────────────┐         │
│  │ [Type your response...]    [🎤] │         │
│  └─────────────────────────────────┘         │
│                                               │
│  [Skip this question]  [Skip for now & see    │
│                         analysis]             │
└──────────────────────────────────────────────┘
```

**Voice mode (🎤 button):**
- Uses Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- On click: microphone activates, speech-to-text begins
- Real-time transcription appears in the text input
- User can edit transcribed text before sending
- Visual indicator when microphone is active (pulsing red dot)
- Click again to stop recording
- Fallback: if browser doesn't support Speech API, hide the button

**Conversation Agent behavior:**
- Has context: parsed resume data, profile form data, initial PSI frames, skill gaps
- Generates questions dynamically based on identified gaps
- Each question targets a specific skill area
- Follow-up questions are based on the user's response
- Extracts new PSI-relevant data from responses
- Stores conversation transcript for later reference
- Maximum 12 questions (hard cap to prevent fatigue)
- After last question: "That's really helpful. Let me put together your full analysis now."

### 6.8 Main Dashboard

**URL:** `/dashboard`

**Purpose:** Home base after onboarding. Shows current state, next actions, and progress.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Learning  Questions  Resume  Profile  [User] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, Priya                    🔥 5-day streak     │
│                                                              │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  READINESS SCORE  │  │  YOUR NEXT STEP                │  │
│  │                   │  │                                 │  │
│  │     [  62%  ]     │  │  Stage 3: Analytical Skills     │  │
│  │                   │  │  Next: Define metrics for a     │  │
│  │  Technical PM     │  │  case study product             │  │
│  │                   │  │                                 │  │
│  │  [View Details]   │  │  [Continue Learning →]          │  │
│  │  [Revalidate ↻]  │  │                                 │  │
│  └──────────────────┘  └────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SKILL BREAKDOWN                                      │  │
│  │                                                       │  │
│  │  Product Thinking     ████████████░░░░  78%           │  │
│  │  Analytical Skills    ████████░░░░░░░░  45%  ← Focus  │  │
│  │  User Understanding   ██████████░░░░░░  62%           │  │
│  │  Technical Acumen     ████████████████  95%           │  │
│  │  Communication        ████████████░░░░  72%           │  │
│  │  Execution            █████████░░░░░░░  55%           │  │
│  │  Business Acumen      ██████░░░░░░░░░░  35%  ← Focus  │  │
│  │  Leadership           ████████░░░░░░░░  48%           │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │  LEARNING PROGRESS      │  │  QUICK ACTIONS            │  │
│  │                         │  │                           │  │
│  │  ✅ PM Fundamentals     │  │  [📄 Build Resume for JD] │  │
│  │  ✅ Product Thinking    │  │  [📝 Practice Questions]  │  │
│  │  ◉  Analytical Skills   │  │  [👤 View Public Profile] │  │
│  │  ○  User Research       │  │  [✏️ Edit PSI Entries]    │  │
│  │  ○  Prioritization      │  │                           │  │
│  │  ○  ... 8 more stages   │  │                           │  │
│  │                         │  │                           │  │
│  │  [View Full Path →]     │  │                           │  │
│  └────────────────────────┘  └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RECENT ACTIVITY                                      │  │
│  │  • Completed Stage 2 checkpoint — Score: 85/100       │  │
│  │  • Added 2 new PSI entries from side project          │  │
│  │  • Readiness score increased: 58% → 62%               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**"Apply Now" trigger:** When readiness score hits 70% (configurable), show a prominent banner:
```
┌──────────────────────────────────────────────────────┐
│ 🎉 You've hit 70%! Based on your skills and profile, │
│ you're ready to start applying. Here are 3 roles     │
│ that match your profile:                              │
│ [View Matching Roles →]  [Not yet, keep preparing]   │
└──────────────────────────────────────────────────────┘
```
(Note: "View Matching Roles" in MVP simply links to their stored JDs and suggests they apply. Not a job board.)

### 6.9 PSI Entries / Work Experience Page

**URL:** `/dashboard/experience`

**Purpose:** View and edit all Problem→Solution→Impact entries. This is the master experience data.

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Your PM Experience Profile                 [+ Add Entry]    │
│  [Reanalyze Skills ↻]                                        │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Experience 1                    Priority: HIGH  [Edit] │  │
│  │  Company: Cogitate Solutions                            │  │
│  │  Original Role: Full Stack Developer                    │  │
│  │                                                         │  │
│  │  Problem:                                               │  │
│  │  Traditional insurance product configuration was        │  │
│  │  manual, slow, and inflexible—hindering rapid product   │  │
│  │  releases and market responsiveness.                    │  │
│  │                                                         │  │
│  │  Solution:                                              │  │
│  │  Built and launched the DigitalEdge Configuration       │  │
│  │  Manager—a cloud-native, low-code/no-code platform      │  │
│  │  that enables business teams to make real-time          │  │
│  │  configuration changes using data tools (SQL, APIs).    │  │
│  │                                                         │  │
│  │  Impact:                                                │  │
│  │  Reduced development time by 90%, enabled product       │  │
│  │  launches in 8–12 weeks, and onboarded 3 major clients. │  │
│  │                                                         │  │
│  │  Resume Point:                                          │  │
│  │  "Created and launched DigitalEdge Configuration        │  │
│  │  Manager (0 to 1) — a Low Code No Code platform that   │  │
│  │  streamlines insurance product configuration, reducing  │  │
│  │  development time 90%..."                               │  │
│  │                                                         │  │
│  │  Skills: Product Innovation, Strategic Planning,        │  │
│  │  Data-Driven Decisions, Cloud-Native Architecture       │  │
│  │                                                         │  │
│  │  ⚠️ Metrics note: "90% reduction" — make sure you can  │  │
│  │  justify this in an interview. What was the baseline?   │  │
│  │  How did you measure it?                                │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Experience 2                  Priority: HIGH    [Edit] │  │
│  │  ...                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ── Suggested additions ──────────────────────────────────   │
│                                                               │
│  💡 Based on your background as a developer in insurance,    │
│  you might also have experience with:                        │
│  • Defining requirements or user stories                     │
│  • Running sprint planning or retrospectives                 │
│  • Collaborating with non-technical stakeholders             │
│  • Conducting user testing or demos                          │
│                                                               │
│  [Add a new experience for any of these →]                   │
│                                                               │
│  ── Import from other sources ────────────────────────────   │
│                                                               │
│  📋 Copy this prompt into ChatGPT/Claude to extract          │
│  more experiences from your conversation history:             │
│  [View & Copy Prompt]                                        │
│                                                               │
│  📎 Or upload a document with additional experiences:         │
│  [Upload File]                                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Edit mode for a PSI entry:**
```
┌────────────────────────────────────────────────┐
│  Edit Experience                    [Save] [Cancel] │
│                                                │
│  Company: [Cogitate Solutions_______________]  │
│  Original Role: [Full Stack Developer________] │
│  Period: [2020-01] to [2023-06]               │
│                                                │
│  Problem: (What business/user problem existed?)│
│  [Multi-line text area........................]│
│  [............................................]│
│                                                │
│  Solution: (What did you specifically do?)     │
│  [Multi-line text area........................]│
│  [............................................]│
│                                                │
│  Impact: (What was the measurable outcome?)    │
│  [Multi-line text area........................]│
│  [............................................]│
│                                                │
│  ⚠️ Tip: Include specific metrics if you can  │
│  defend them in an interview. "Reduced X by Y%"│
│  is powerful but only if you know how Y was    │
│  measured. If unsure, describe the qualitative │
│  impact instead.                               │
│                                                │
│  Resume Point: (1-2 line summary for resume)   │
│  [Text area..................................]│
│                                                │
│  Skills (auto-tagged, you can add/remove):     │
│  [Product Innovation ×] [Strategic Planning ×] │
│  [+ Add skill]                                 │
│                                                │
│  Priority for profile:                         │
│  ○ High  ○ Medium  ○ Low                      │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.10 Learning Path Page

**URL:** `/dashboard/learning`

**Purpose:** Show the personalized learning path with stages, resources, and assignments.

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Your Learning Path                 🔥 5-day streak          │
│  Target: Technical PM    Readiness: 62%                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ STAGE 1: PM Fundamentals              ✅ COMPLETED      │  │
│  │ You demonstrated strong PM knowledge.  Score: 92/100    │  │
│  │ [Review Materials] [View Your Submission]               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ STAGE 2: Product Thinking              ✅ COMPLETED      │  │
│  │ "Your problem framing is strong."      Score: 85/100    │  │
│  │ [Review Materials] [View Your Submission]               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ STAGE 3: Analytical Skills             ◉ IN PROGRESS    │  │
│  │                                                         │  │
│  │  Sub-topics:                                            │  │
│  │  ✅ 3.1 Defining Success Metrics                       │  │
│  │  ✅ 3.2 North Star Metrics                             │  │
│  │  ◉  3.3 Funnel Analysis                                │  │
│  │  ○  3.4 A/B Testing Basics                             │  │
│  │  ○  3.5 SQL for PMs (optional for your role)           │  │
│  │                                                         │  │
│  │  Current: 3.3 Funnel Analysis                           │  │
│  │  ┌──────────────────────────────────────────┐          │  │
│  │  │ Resources:                                │          │  │
│  │  │ 📖 "Intro to Funnel Analysis" — Lenny's  │          │  │
│  │  │    Newsletter [Read] [Mark as Done]       │          │  │
│  │  │ 🎥 "Funnel Metrics That Matter" — YouTube │          │  │
│  │  │    (12 min) [Watch] [Mark as Done]        │          │  │
│  │  │ 📖 "AARRR Framework Explained" — Blog     │          │  │
│  │  │    [Read] [Mark as Done]                  │          │  │
│  │  │                                           │          │  │
│  │  │ ✍️ Quick Check (after resources):         │          │  │
│  │  │ "Summarize the key takeaway from the      │          │  │
│  │  │  funnel analysis resources in 2-3          │          │  │
│  │  │  sentences."                               │          │  │
│  │  │ [Text area]                [Submit]       │          │  │
│  │  └──────────────────────────────────────────┘          │  │
│  │                                                         │  │
│  │  Stage Gate Assignment:                                 │  │
│  │  🔒 Complete all sub-topics to unlock                   │  │
│  │  "Define a complete funnel metrics framework for        │  │
│  │  an e-commerce product in the [your domain] space.      │  │
│  │  Include: key stages, metrics per stage, north star     │  │
│  │  metric, and how you'd measure success."                │  │
│  │                                                         │  │
│  │  [Locked until sub-topics complete]                     │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ STAGE 4: User Research              🔒 LOCKED           │  │
│  │ Complete Stage 3 to unlock                              │  │
│  │ [Preview what you'll learn]                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ... (remaining stages)                                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Stage completion logic:**
1. User goes through sub-topics, marking resources as done
2. After resources: quick check (2-3 sentence summary or MCQ) — lightweight, AI evaluates
3. After all sub-topics: stage gate assignment unlocks
4. Submit assignment (text, link, file, or structured response)
5. AI evaluates against rubric → gives score (0-100) + specific feedback
6. Score >= 60: stage complete, next stage unlocks
7. Score < 60: "Here's what to improve..." + can resubmit
8. On stage completion: readiness score auto-triggers revalidation

**Stage skipping logic:**
- If skill gap analysis shows the user is already strong in a stage's skill area:
  → Stage shows as "Likely covered based on your experience"
  → User can go directly to the gate assignment
  → If they pass (>=60), stage is marked complete without doing sub-topics
  → If they fail, sub-topic resources open: "Looks like there are some gaps. Here are resources to brush up."

**Domain customization:**
- Assignments reference the user's domain/industry where possible
- Example: If user is from insurance, the funnel analysis assignment says "for an insurance product in your domain" instead of generic "for an e-commerce product"
- This is implemented by injecting domain context into the AI evaluation prompt

### 6.11 Question Bank Page

**URL:** `/dashboard/questions`

**Purpose:** PM interview questions organized by topic. Practice with AI evaluation.

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  PM Interview Question Bank                                   │
│                                                               │
│  Filter by:                                                   │
│  [Topic ▾]  [Difficulty ▾]  [Skill Area ▾]                  │
│                                                               │
│  Topics: All | Product Sense | Analytical | Strategy |        │
│  Behavioral | Technical | Estimation | Execution              │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Q1: Product Sense                    Difficulty: ⭐⭐   │  │
│  │                                                         │  │
│  │ "How would you improve the checkout experience          │  │
│  │  for an e-commerce platform?"                           │  │
│  │                                                         │  │
│  │ Skills tested: Product Thinking, User Understanding,    │  │
│  │ Prioritization                                          │  │
│  │                                                         │  │
│  │ [Practice This Question →]                              │  │
│  │                                                         │  │
│  │ Your last attempt: 78/100 (2 days ago)                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Q2: Analytical                       Difficulty: ⭐⭐⭐  │  │
│  │                                                         │  │
│  │ "Instagram Reels engagement dropped 15% last month.     │  │
│  │  How would you investigate and what would you do?"       │  │
│  │                                                         │  │
│  │ [Practice This Question →]                              │  │
│  │                                                         │  │
│  │ Not attempted yet                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ... (more questions)                                         │
└──────────────────────────────────────────────────────────────┘
```

**Practice a question:**
```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Question Bank                                      │
│                                                               │
│  "How would you improve the checkout experience               │
│   for an e-commerce platform?"                                │
│                                                               │
│  💡 Before you answer, consider:                              │
│  • Who are the users?                                         │
│  • What's the current experience like?                        │
│  • What metrics would you track?                              │
│  • How would you prioritize improvements?                     │
│                                                               │
│  Your Answer:                                                 │
│  ┌─────────────────────────────────────────────┐             │
│  │ [Rich text area - write your answer here]    │             │
│  │                                              │             │
│  │                                              │             │
│  │                                              │             │
│  └─────────────────────────────────────────────┘             │
│                                                               │
│  [Submit for AI Evaluation]                                   │
│                                                               │
│  ── After submission ──                                       │
│                                                               │
│  Score: 78/100                                                │
│                                                               │
│  ✅ Strong points:                                            │
│  • Good user segmentation                                     │
│  • Clear metric framework                                     │
│                                                               │
│  ⚠️ Areas to improve:                                         │
│  • Didn't consider edge cases (international users)           │
│  • Prioritization rationale was thin                          │
│  • Missing: "How would you validate your solution?"           │
│                                                               │
│  📝 Key criteria for this question:                           │
│  □ Clarifies assumptions ✓                                    │
│  □ Identifies user segments ✓                                 │
│  □ Proposes structured framework ✓                            │
│  □ Considers metrics ✓                                        │
│  □ Prioritizes with reasoning ✗                               │
│  □ Discusses validation approach ✗                            │
│  □ Considers tradeoffs ✓                                      │
│                                                               │
│  [Try Again] [Next Question →]                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 6.12 Resume Builder Page

**URL:** `/dashboard/resume`

**Purpose:** Generate and edit PM-optimized resumes from master profile, tailored to specific JDs.

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  Resume Builder                                                       │
│                                                                       │
│  Target JD: [Dropdown: JD 1 - Technical PM at Razorpay ▾]           │
│  [+ Upload New JD]                                                    │
│                                                                       │
│  ┌─────────────── LEFT PANEL ──────────┬─── RIGHT PANEL ─────────┐  │
│  │  AI Rationale & Feedback             │  Resume Editor (TipTap)  │  │
│  │                                      │                          │  │
│  │  Why we chose these entries:         │  ┌────────────────────┐  │  │
│  │                                      │  │ PRIYA SHARMA       │  │  │
│  │  ✅ "DigitalEdge Config Manager"     │  │ priya@email.com    │  │  │
│  │  → Matches JD requirement:           │  │ linkedin.com/priya │  │  │
│  │    "experience building platforms"   │  │                    │  │  │
│  │  → Keywords: low-code, cloud-native  │  │ SUMMARY            │  │  │
│  │                                      │  │ [Editable text...] │  │  │
│  │  ✅ "Pricing Configuration Feature"  │  │                    │  │  │
│  │  → Matches: "data-driven decisions"  │  │ EXPERIENCE         │  │  │
│  │  → Keywords: user-centric, agile     │  │                    │  │  │
│  │                                      │  │ [PSI Entry 1...]   │  │  │
│  │  ⚠️ We excluded "Website Redesign"   │  │                    │  │  │
│  │  → Low relevance to this JD          │  │ [PSI Entry 2...]   │  │  │
│  │  → You can add it back if you want   │  │                    │  │  │
│  │                                      │  │ SKILLS             │  │  │
│  │  ─────────────────────────────       │  │ [Skills list...]   │  │  │
│  │                                      │  │                    │  │  │
│  │  ATS SCORE: 72/100                   │  │ EDUCATION          │  │  │
│  │                                      │  │ [Education...]     │  │  │
│  │  Keywords matched: 18/25             │  │                    │  │  │
│  │  Missing keywords:                   │  └────────────────────┘  │  │
│  │  • "stakeholder management"          │                          │  │
│  │  • "product roadmap"                 │  [Download PDF]          │  │
│  │  • "cross-functional"                │  [Download DOCX]         │  │
│  │                                      │                          │  │
│  │  Formatting: ✅ ATS-friendly         │                          │  │
│  │  • Standard fonts ✓                  │                          │  │
│  │  • No tables ✓                       │                          │  │
│  │  • Proper heading hierarchy ✓        │                          │  │
│  │  • One page ✓                        │                          │  │
│  │                                      │                          │  │
│  │  [Reanalyze ↻]                      │                          │  │
│  │  (after making edits)               │                          │  │
│  │                                      │                          │  │
│  └──────────────────────────────────────┴──────────────────────────┘  │
│                                                                       │
│  Saved Resumes: [JD 1 - v2] [JD 2 - v1] [Master - v3]              │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Resume generation logic:**
1. User selects a JD (or "Master profile" for generic resume)
2. System extracts keywords and requirements from JD
3. AI selects and orders PSI entries from master profile based on JD relevance
4. Generates summary section tailored to JD
5. Produces formatted resume in editor
6. Left panel shows rationale for each inclusion/exclusion
7. ATS score calculated: keyword match percentage (from JD) + formatting compliance

**ATS scoring formula:**
```
ATS Score = (0.6 × keyword_match_percentage) + (0.4 × formatting_score)

keyword_match_percentage = matched_keywords / total_jd_keywords × 100
formatting_score = sum of:
  - Standard font used: 20 points
  - No tables/images: 20 points  
  - Proper heading hierarchy (H1 > H2 > body): 20 points
  - Single page: 20 points
  - Contact info present: 20 points
```

**Resume limits:** Max 3 JDs stored. Max 15 resume generations (MVP). Counter shown to user.

### 6.13 Public Profile Page

**URL:** `/profile/[username]` (public, no auth required)
**Edit URL:** `/dashboard/profile` (auth required)

**Public Page Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  [Avatar]  Priya Sharma                                      │
│            Aspiring Technical PM                              │
│            Current: Full Stack Developer at Cogitate          │
│            4 years experience                                 │
│                                                               │
│  ✅ Verified — Completed PM Readiness Program                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  SKILLS                                               │    │
│  │                                                       │    │
│  │  Product Thinking     ████████████░░░░  78%           │    │
│  │  Analytical Skills    █████████████░░░  82%           │    │
│  │  User Understanding   ██████████░░░░░░  62%           │    │
│  │  Technical Acumen     ████████████████  95%           │    │
│  │  Communication        ████████████░░░░  72%           │    │
│  │  Execution            ██████████░░░░░░  68%           │    │
│  │  Business Acumen      █████████░░░░░░░  55%           │    │
│  │  Leadership           ████████████░░░░  75%           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  HIGHLIGHTED EXPERIENCES (user picks top 3-5)         │    │
│  │                                                       │    │
│  │  ● Created and launched DigitalEdge Configuration     │    │
│  │    Manager (0 to 1) — reducing development time 90%   │    │
│  │    Skills: Product Innovation, Strategic Planning     │    │
│  │                                                       │    │
│  │  ● Led development of insurance premium               │    │
│  │    configuration feature, reducing turnaround 60%     │    │
│  │    Skills: User-Centric Design, Stakeholder Mgmt      │    │
│  │                                                       │    │
│  │  ... (more entries)                                   │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  COMPLETED PROJECTS & ASSIGNMENTS                     │    │
│  │                                                       │    │
│  │  📋 Funnel Metrics Framework for InsurTech            │    │
│  │     Stage: Analytical Skills | Score: 88/100          │    │
│  │                                                       │    │
│  │  📋 PRD for Claims Automation Feature                 │    │
│  │     Stage: Communication | Score: 91/100              │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  ACTIVITY                                             │    │
│  │                                                       │    │
│  │  [GitHub-style activity heatmap]                      │    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    │
│  │  ░░██░█░░░░░███░░░██░░░███░██░░░░░████░███░░░░░░░░  │    │
│  │  ░░██████░░░████░░████░████████░░█████████░░░░░░░░░  │    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    │
│  │                                                       │    │
│  │  🔥 Current streak: 12 days                           │    │
│  │  📈 Longest streak: 18 days                           │    │
│  │  ✅ 47 activities completed                           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  Powered by [Platform Name]                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Activity heatmap logic:**
- One square per day, going back 90 days (or 365 if we want full year)
- Color intensity based on number of activities that day (0 = empty, 1 = light, 2+ = dark)
- Activities that count: completing a resource, submitting an assignment, adding/editing a PSI entry, completing a stage, answering a question bank question
- Activities that DON'T count: just logging in, viewing pages

**Verification badge triggers:**
- All learning stages completed = ✅ badge
- Per-stage badges can be added later (Phase 2)

**Profile edit page** (`/dashboard/profile`):
- Same layout but with edit controls on each section
- Toggle visibility per section (show/hide on public page)
- Select which PSI entries to highlight (top 3-5)
- Edit personal info
- Preview button to see public page

### 6.14 Streak & Activity System

**Visible on:** Dashboard (top right), Public Profile, Learning Path page

**Streak rules:**
- A "streak day" requires at least one tangible activity:
  - Completing a learning resource (marking as done after reading/watching)
  - Submitting an assignment or quick check
  - Adding or editing a PSI entry
  - Answering a question bank question
  - Completing a stage gate
- Just logging in does NOT count
- Streak resets at midnight (user's local timezone)
- Grace period: none for MVP (consider 1-day freeze as Phase 2 reward)

**Streak rewards (MVP):**
- Visual: streak counter with fire emoji, displayed prominently
- Milestone celebrations: 7-day, 14-day, 30-day, 60-day, 90-day
- At milestone: "You've been consistent for 30 days! Most people give up by week 2."
- Future (Phase 2): bonus AI credits for resume optimization at milestones

**Activity log:** Every qualifying action is logged with timestamp. Powers both streak calculation and activity heatmap.

---

## 7. Skills Taxonomy v0

> **Status:** Proposed — pending validation against 15-20 real PM job descriptions per role type. Architecture supports taxonomy updates without code changes (stored in DB, not hardcoded).

### 7.1 Taxonomy Structure

Three levels:
1. **Skill Categories** (8 top-level) — shown to users on dashboard and profile
2. **Skills** (3-6 per category, ~35 total) — used internally for scoring, shown in detailed feedback
3. **Evidence Types** (per skill) — what counts as demonstrating this skill

### 7.2 Full Taxonomy

#### Category 1: Product Thinking & Strategy
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| Problem Identification & Framing | Ability to identify the right problem before jumping to solutions | PSI entry showing problem discovery, assignment, side project |
| Prioritization | Using frameworks (RICE, ICE, MoSCoW) or structured reasoning to decide what to build | PSI entry showing prioritization decisions, assignment |
| Product Sense & Intuition | Understanding what makes a good product, identifying opportunities | Question bank answers, assignment analysis |
| Tradeoff Analysis | Making and defending decisions when options have competing benefits | PSI entry, assignment |
| Vision & Strategy Setting | Defining product direction and long-term goals | PSI entry (roadmap work), assignment |

#### Category 2: Analytical & Data Skills
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| Metrics Definition & Tracking | Defining KPIs, north star metrics, success criteria | PSI entry with metrics, assignment |
| Data-Driven Decision Making | Using data to inform product decisions | PSI entry showing data usage, assignment |
| A/B Testing & Experimentation | Designing and analyzing experiments | PSI entry, assignment, certification |
| Funnel Analysis | Understanding and optimizing conversion funnels | Assignment, question bank |
| SQL & Data Querying | Basic ability to pull and analyze data | Certification, self-report, assignment |

#### Category 3: User Understanding & Research
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| User Interviews & Qualitative Research | Conducting and synthesizing user research | PSI entry, assignment (mini interview) |
| Persona Development | Creating and using user personas | Assignment |
| User Journey Mapping | Mapping end-to-end user experiences | Assignment, PSI entry |
| Usability Testing | Testing products with real users | PSI entry, assignment |
| Customer Empathy | Deep understanding of user needs and pain points | PSI entries, conversation signals, question bank |

#### Category 4: Technical Acumen
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| System Design & Architecture | Understanding how software systems work at a high level | PSI entry (for engineers), assignment |
| API Understanding | Knowing what APIs are and how they enable products | PSI entry, self-report, assignment |
| Technical Feasibility Assessment | Evaluating whether proposed solutions are technically viable | PSI entry, assignment |
| AI/ML Concepts | Understanding AI capabilities and limitations for product decisions | Assignment, certification |
| Development Process Understanding | Familiarity with how engineering teams work (sprints, CI/CD, etc.) | PSI entry, self-report |

#### Category 5: Communication & Influence
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| PRD & Spec Writing | Writing clear product requirements | Assignment (write a PRD), PSI entry |
| Stakeholder Management | Managing expectations and alignment across teams | PSI entry, conversation signals |
| Presentation Skills | Communicating ideas clearly to different audiences | Assignment, PSI entry |
| Cross-functional Collaboration | Working effectively across engineering, design, business | PSI entry, conversation signals |
| Negotiation & Persuasion | Influencing decisions without direct authority | PSI entry, conversation signals |

#### Category 6: Execution & Delivery
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| Roadmap Planning | Creating and managing product roadmaps | PSI entry, assignment |
| Agile/Scrum Management | Running sprints, standups, retrospectives | PSI entry, self-report |
| Launch Planning | Coordinating product launches | PSI entry |
| Risk Management | Identifying and mitigating risks proactively | PSI entry, assignment |
| Resource & Timeline Estimation | Estimating effort and managing timelines | PSI entry, conversation signals |

#### Category 7: Business Acumen
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| Business Model Understanding | Knowing how the business makes money | Assignment, question bank |
| Revenue & Monetization | Understanding pricing, unit economics | Assignment |
| Go-to-Market Strategy | Planning how to bring products to market | PSI entry, assignment |
| Market Sizing (TAM/SAM/SOM) | Estimating market opportunity | Assignment, question bank |

#### Category 8: Leadership & Collaboration
| Skill | Description | Evidence Types |
|-------|-------------|---------------|
| Leading Without Authority | Influencing teams you don't manage | PSI entry, conversation signals |
| Mentoring & Team Building | Developing other people's capabilities | PSI entry |
| Conflict Resolution | Handling disagreements constructively | PSI entry, conversation signals |
| Decision Making Under Uncertainty | Making calls with incomplete information | PSI entry, question bank |

### 7.3 Role Weight Distribution

Weights determine how much each category contributes to the readiness score for a given target role. Weights sum to 100% per role.

| Category | Consumer PM | Growth PM | Technical PM | Platform PM | AI PM | General PM |
|----------|-----------|-----------|-------------|-------------|-------|------------|
| Product Thinking & Strategy | 25% | 20% | 15% | 18% | 18% | 20% |
| Analytical & Data Skills | 12% | 25% | 10% | 12% | 15% | 15% |
| User Understanding & Research | 20% | 12% | 8% | 8% | 10% | 14% |
| Technical Acumen | 5% | 8% | 25% | 25% | 22% | 12% |
| Communication & Influence | 15% | 12% | 15% | 12% | 12% | 14% |
| Execution & Delivery | 10% | 10% | 15% | 15% | 10% | 12% |
| Business Acumen | 8% | 8% | 5% | 5% | 8% | 7% |
| Leadership & Collaboration | 5% | 5% | 7% | 5% | 5% | 6% |

> **Configurable:** These weights are stored in the database `role_skill_weights` table and can be updated without code changes.

### 7.4 Implementation Notes

- Taxonomy is seeded into the database on deployment
- Admin API endpoints allow updating taxonomy without redeployment
- Skill IDs are stable (UUIDs) — even if names change, references remain valid
- PSI entries auto-tagged with skills by AI, but users can manually add/remove
- Learning stages are linked to skill categories (each stage covers 1-2 categories)

---

## 8. Learning Path Structure

> **Status:** v0 — needs validation against real PM curricula, cohort programs, and job descriptions. Architecture supports full content updates from backend without code changes.

### 8.1 Overview

The learning path is a sequence of stages. Each stage covers specific skill categories, contains sub-topics with curated resources, and ends with a gate assignment. The path is personalized by:
1. **Skipping stages** where the user already has strong evidence
2. **Adjusting depth** (fewer sub-topics if user passes a preliminary check)
3. **Customizing assignments** to reference the user's domain/industry
4. **Including/excluding role-specific content** based on target PM type

### 8.2 Stage Definitions

| # | Stage Name | Skill Categories Covered | Sub-topics | Estimated Duration |
|---|-----------|------------------------|------------|-------------------|
| 1 | PM Fundamentals | Product Thinking (intro) | What is PM, PM role types, day-in-the-life, PM vs adjacent roles, PM career paths | 3-5 hours |
| 2 | Product Thinking & Problem Framing | Product Thinking & Strategy | First principles thinking, problem identification, jobs to be done, competitive analysis, product sense | 8-12 hours |
| 3 | User Research & Understanding | User Understanding & Research | Qualitative research methods, user interviews, persona creation, journey mapping, usability testing | 8-12 hours |
| 4 | Metrics & Analytical Thinking | Analytical & Data Skills | Defining success metrics, north star metrics, funnel analysis, cohort analysis, A/B testing, SQL basics | 10-15 hours |
| 5 | Prioritization & Strategy | Product Thinking (advanced) + Business | RICE/ICE frameworks, opportunity assessment, product vision, roadmap planning, tradeoff analysis, market sizing | 8-12 hours |
| 6 | Technical Foundations for PMs | Technical Acumen | How software works, APIs, system design basics, cloud/infrastructure, development lifecycle | 6-10 hours |
| 7 | Communication & Stakeholder Management | Communication & Influence | PRD writing, user stories, stakeholder mapping, presentation skills, managing up | 8-12 hours |
| 8 | Execution & Delivery | Execution & Delivery | Agile/Scrum, sprint planning, launch planning, risk management, cross-functional coordination | 6-10 hours |
| 9 | Business Acumen & Strategy | Business Acumen | Business models, revenue/monetization, unit economics, go-to-market, pricing strategy | 6-8 hours |
| 10 | Leadership & Influence | Leadership & Collaboration | Leading without authority, decision-making frameworks, conflict resolution, organizational dynamics | 5-8 hours |
| 11 | Building Your PM Portfolio | All (practical application) | Side project definition, case study creation, building proof of work, contribution to portfolio | 10-15 hours |
| 12 | Application Readiness | Communication + Meta | Resume optimization, interview story crafting, behavioral prep, positioning strategy | 5-8 hours |

**Total estimated: 80-130 hours** (varies significantly based on skipped stages and prior knowledge)

### 8.3 Sub-topic Structure (Example: Stage 4 — Metrics & Analytical Thinking)

```
Stage 4: Metrics & Analytical Thinking
│
├── 4.1 Defining Success Metrics
│   ├── Resources:
│   │   ├── 📖 Article: "How to Define Product Metrics" (curated)
│   │   ├── 🎥 Video: "North Star Metrics Explained" (YouTube, 15 min)
│   │   └── 📖 Article: "Input vs Output Metrics" (curated)
│   └── Quick Check: "For the product you use most often, identify 3 metrics
│       you'd track and explain why."
│
├── 4.2 Funnel Analysis & AARRR Framework
│   ├── Resources:
│   │   ├── 📖 Article: "AARRR Pirate Metrics" (curated)
│   │   ├── 🎥 Video: "Funnel Analysis Deep Dive" (YouTube, 20 min)
│   │   └── 📖 Case Study: "How Spotify Optimizes Its Funnel"
│   └── Quick Check: "Map the AARRR framework to a product in your domain.
│       Identify the weakest stage and explain why."
│
├── 4.3 Cohort Analysis
│   ├── Resources:
│   │   ├── 📖 Article: "Cohort Analysis for Product Managers"
│   │   └── 🎥 Video: "Reading Cohort Tables" (YouTube, 12 min)
│   └── Quick Check: "Given a retention cohort table, identify the biggest
│       drop-off point and suggest two hypotheses for why."
│
├── 4.4 A/B Testing Basics
│   ├── Resources:
│   │   ├── 📖 Article: "A/B Testing 101 for PMs"
│   │   ├── 🎥 Video: "When NOT to A/B Test" (YouTube, 10 min)
│   │   └── 📖 Article: "Statistical Significance Explained Simply"
│   └── Quick Check: "Design an A/B test for a feature change in a product
│       you know. Define hypothesis, metrics, and success criteria."
│
├── 4.5 SQL for PMs (optional — skip if already known)
│   ├── Resources:
│   │   ├── 📖 Tutorial: "SQL Basics for Product Managers"
│   │   └── 🔗 Practice: "SQLZoo first 3 exercises"
│   └── Quick Check: "Write a query to find the top 10 users by session count
│       last month."
│
└── STAGE GATE ASSIGNMENT:
    "You're a PM at [company in user's domain]. Monthly active users have
     dropped 15% over the past quarter. 
     
     Deliverable (submit as text or document):
     1. Define 5 key metrics you'd track to investigate this drop
     2. Map the user funnel for this product (at least 5 stages)
     3. Propose 3 hypotheses for the decline with reasoning
     4. Design an A/B test to validate your top hypothesis
     5. Define what 'success' looks like for your investigation
     
     Evaluation criteria:
     - Metric selection relevance and completeness (20 pts)
     - Funnel mapping accuracy (20 pts)
     - Hypothesis quality and reasoning (20 pts)
     - A/B test design rigor (20 pts)
     - Overall analytical thinking (20 pts)
     
     Passing score: 60/100"
```

### 8.4 Content Curation Strategy

**Resource database structure:**
- Each resource has: title, URL, type (article/video/tool/course), estimated reading/watch time, difficulty, related skills, quality rating (curated by us)
- Resources are stored in the database, not hardcoded
- Backend can add/update/remove resources without frontend changes
- Target at launch: 5-10 resources per sub-topic × ~40 sub-topics = 200-400 resources

**Curation sources (high-quality, free):**
- Lenny's Newsletter (selected articles)
- Product School YouTube
- Strategyzer
- Reforge blog (free articles)
- First Round Review
- Mind the Product
- Shreyas Doshi's Twitter threads / blog
- PM-specific Substack newsletters
- Harvard Business Review (free articles)
- Khan Academy (for analytics/SQL basics)

**Content is curated by us** — not auto-scraped. Each resource is reviewed for quality and relevance before being added to the database. Updates are ongoing operational work.

**Tracking completion:**
- For articles/videos: user clicks "Mark as Done" after reading/watching
- For quick checks: user submits a short response, AI gives brief feedback
- We do NOT verify they actually read it — the gate assignment is where real evaluation happens
- Quick checks between resources serve as comprehension anchors, not strict gates

### 8.5 Stage Personalization Logic

```
For each stage:
  1. Check user's skill scores for the stage's covered categories
  2. If all category scores >= 70%:
     → Stage shows as "Likely covered based on your experience"
     → User can go directly to gate assignment
     → If pass (>=60): stage complete
     → If fail: sub-topics open, user does full stage
  3. If some category scores >= 70%:
     → Sub-topics for strong areas show as "optional — brush up if needed"
     → Sub-topics for weak areas are mandatory
  4. If target PM role doesn't heavily weight this category:
     → Stage is marked "Optional for [role]" but still accessible
     → Completing optional stages still improves readiness score
  5. Assignment is customized:
     → Domain injection: "You're a PM at [a company in their domain]"
     → If user provided JDs: reference actual JD requirements
```

---

## 9. Readiness Score — Calculation Logic

### 9.1 Formula

**Per-skill score:**
```
Skill_Score = (0.5 × Evidence_Score) + (0.3 × Assignment_Score) + (0.2 × Learning_Score)
```

**Per-category score:**
```
Category_Score = Average(Skill_Scores in category)
```

**Overall readiness score:**
```
Readiness_Score = Σ (Category_Score × Role_Weight) for all 8 categories
```

### 9.2 Component Scoring

**Evidence Score (0-100):**
How strong is the user's demonstrable experience for this skill?

| Evidence Level | Score | Description |
|---------------|-------|-------------|
| PSI entry with quantified metrics | 80-100 | "Reduced development time by 90%" — strong, defensible |
| PSI entry with qualitative impact | 60-79 | "Improved user experience significantly" — good but vague |
| PSI entry with no impact stated | 40-59 | "Built a configuration platform" — shows work but no result |
| Self-reported in conversation | 20-39 | "I've done some prioritization" — claimed but not evidenced |
| No evidence | 0-19 | Skill not demonstrated anywhere in profile |

**Assignment Score (0-100):**
- AI evaluates gate assignments against rubric
- Score from most recent submission for the relevant stage
- If no assignment submitted: 0
- If stage was skipped (tested out): assignment score = gate test score

**Learning Score (0-100):**
- Percentage of relevant sub-topics completed (resources marked done + quick checks passed)
- If stage not started: 0
- If stage skipped (tested out successfully): 100

### 9.3 Score Display

**Dashboard shows:**
- Overall readiness score: large number with progress ring (e.g., 62%)
- Target role label (e.g., "for Technical PM")
- Sub-scores per category: horizontal bar chart with percentages
- Lowest 2 categories highlighted as "Focus areas"
- Score history: line chart showing score over time (from snapshots)

**Apply now trigger:**
- When overall score >= 70% (configurable)
- Show prominent banner with call to action
- Suggest reviewing stored JDs and generating tailored resumes
- This threshold is not a guarantee — caveat: "Based on our analysis, your profile is competitive for entry-level PM roles. Results vary by company and role."

### 9.4 Revalidation Logic

**Triggered by:**
1. User clicks "Revalidate" button (manual)
2. Automatic on stage gate completion
3. Automatic when user adds/edits PSI entries and clicks reanalyze

**Process:**
1. Collect all current data: PSI entries, skill tags, assignment scores, learning progress
2. Send to Gap Analyzer agent with full context + skill taxonomy + role weights
3. Agent evaluates each skill's evidence score based on updated PSI entries
4. Recalculate all component scores
5. Compute new readiness score
6. Store as new ReadinessSnapshot
7. Show before/after comparison: "Your score changed from 58% to 65%. Here's what improved..."

**Cost:** Full revalidation = 1-2 Sonnet API calls (~$0.03-0.06). Acceptable frequency: a few times per week per user.

---

## 10. AI Agent Architecture

### 10.1 Agent Overview

| Agent | Purpose | Model (MVP) | Fallback | Avg. Calls per Use |
|-------|---------|-------------|----------|-------------------|
| **Resume Parser** | Extract structured data from resume PDF/text | GPT-4o-mini | Llama 3 (via OpenRouter) | 1 |
| **PSI Reframer** | Convert raw experience → Problem/Solution/Impact | Claude Sonnet | GPT-4o | 1 per experience (5-10) |
| **Gap Analyzer** | Evaluate skills against taxonomy, generate scores | Claude Sonnet | GPT-4o | 1-2 |
| **Conversation Agent** | Conduct drill-down onboarding chat | Claude Sonnet | GPT-4o | 5-12 (one per question) |
| **Assignment Evaluator** | Score checkpoint submissions against rubric | Claude Sonnet | GPT-4o | 1 per submission |
| **Resume Optimizer** | Generate JD-tailored resume + ATS scoring | GPT-4o-mini + heuristics | — | 2-3 |
| **Learning Recommender** | Select/sequence resources, customize assignments | Rule-based + GPT-4o-mini | — | 1 |
| **Question Evaluator** | Evaluate question bank answers | Claude Sonnet | GPT-4o | 1 per answer |

### 10.2 Cost Estimation

**Per-user onboarding (one-time):**
| Step | Agent | Calls | Est. Cost |
|------|-------|-------|-----------|
| Resume parsing | Resume Parser | 1 | $0.005 |
| PSI reframing (assume 6 experiences) | PSI Reframer | 6 | $0.12 |
| Gap analysis | Gap Analyzer | 1 | $0.02 |
| Conversation (assume 8 questions) | Conversation Agent | 8 | $0.16 |
| Initial readiness score | Gap Analyzer | 1 | $0.02 |
| **Total onboarding** | | **~17** | **~$0.32** |

**Per-user ongoing (weekly active user):**
| Activity | Agent | Calls/week | Est. Cost/week |
|----------|-------|-----------|---------------|
| Learning quick checks (2-3/week) | Assignment Evaluator | 3 | $0.06 |
| Stage gate assignment (1/2 weeks) | Assignment Evaluator | 0.5 | $0.01 |
| Score revalidation | Gap Analyzer | 1 | $0.02 |
| Question bank practice (2/week) | Question Evaluator | 2 | $0.04 |
| Resume generation (1/month) | Resume Optimizer | 0.25 | $0.005 |
| **Total weekly** | | **~7** | **~$0.13** |

**At 1,000 MAU:** ~$130/month ongoing + ~$320 one-time onboarding = ~$450/month

### 10.3 Prompt Design Principles

All agent prompts follow these principles:
1. **Taxonomy-aware:** Every evaluation prompt includes the full skill taxonomy and role weights
2. **Rubric-anchored:** Assignments are evaluated against explicit rubrics, not vibes
3. **Calibrated language:** AI feedback uses calibrated language ("strong" = 80+, "developing" = 50-79, "needs work" = <50)
4. **Metrics honesty:** When generating PSI entries with metrics, AI adds caveat: "⚠️ Make sure you can defend this number in an interview"
5. **Domain-injected:** Assignments and examples reference the user's actual industry/domain
6. **Structured output:** All agents return JSON for programmatic processing, not freeform text

### 10.4 Agent Prompt Templates (Key Agents)

**PSI Reframer — System Prompt (condensed):**
```
You are an expert at translating work experience into Product Manager language.

Given a raw work experience entry, convert it into the Problem → Solution → Impact (PSI) format.

Rules:
- Problem: What business/user problem existed? Be specific about the pain.
- Solution: What did this person specifically do? Focus on PM-relevant actions 
  (defining requirements, prioritizing, coordinating, analyzing, designing solutions).
  Even if they were an engineer, frame their contribution in terms of the 
  problem they solved, not just the code they wrote.
- Impact: Quantify where possible. If the raw entry includes numbers, use them.
  If not, describe the qualitative impact. NEVER fabricate metrics.
  If you infer a metric, mark it with [ESTIMATED — verify with user].
- Resume Point: A 1-2 line summary suitable for a resume bullet.
- Skills: Tag with skills from this taxonomy: [INJECT TAXONOMY]
- Priority: Rate as High/Medium/Low based on PM relevance.

Return JSON:
{
  "problem": "...",
  "solution": "...",
  "impact": "...",
  "impact_metrics": {"metric_name": "value", ...} or null,
  "resume_point": "...",
  "skills": ["skill_id_1", "skill_id_2"],
  "priority": "high|medium|low",
  "metrics_verified": false,
  "suggestions": "Optional: what else could strengthen this entry"
}
```

**Gap Analyzer — System Prompt (condensed):**
```
You are evaluating a PM candidate's readiness for a specific role.

Given:
- Their PSI entries (work experiences in Problem/Solution/Impact format)
- Their target PM role and role weight distribution
- The skills taxonomy
- Their learning progress and assignment scores

For EACH skill in the taxonomy, evaluate:
1. Evidence score (0-100): Based on PSI entries that demonstrate this skill
   - 80-100: Strong evidence with quantified impact
   - 60-79: Clear evidence with qualitative impact
   - 40-59: Some evidence but weak framing
   - 20-39: Only self-reported, no concrete evidence
   - 0-19: No evidence at all
2. Brief justification for the score (1 sentence)

Also identify:
- Top 3 strengths (highest-scored skills with reasoning)
- Top 3 gaps (lowest-scored skills with specific suggestions)
- If the user might be better suited for a different PM role, flag it with reasoning

Return structured JSON with all scores and analysis.
```

**Conversation Agent — System Prompt (condensed):**
```
You are conducting a structured skills interview with someone who wants to 
become a Product Manager. You've already analyzed their resume.

Your goal: Extract PM-relevant experiences and skills that aren't captured 
in their resume. Ask questions that help them realize they already have 
PM-relevant experience.

Context provided to you:
- Their parsed resume and initial PSI entries
- Their target PM role
- Skill gaps identified (skills with low evidence scores)

Rules:
1. Start by acknowledging something specific from their resume
2. For each skill gap, ask 1-2 questions RELATED TO THEIR ACTUAL WORK
   - Don't ask abstract questions ("What is prioritization?")
   - Ask concrete questions ("When building [their project], who decided 
     what features to build first? Was that you?")
3. Follow up on interesting answers with probing questions
4. Maximum 12 questions total
5. Track which skills each answer provides evidence for
6. Be warm and encouraging but honest
7. If they give a vague answer, gently probe for specifics
8. After each response, extract any new PSI-relevant data

After each user message, return JSON:
{
  "response": "Your next message to the user",
  "question_number": 3,
  "total_estimated_questions": 8,
  "extracted_data": {
    "new_psi_signals": [...],
    "skills_evidenced": ["skill_id_1", ...],
    "follow_up_needed": true/false
  },
  "conversation_complete": false
}
```

### 10.5 Orchestration

**MVP approach: Simple sequential pipelines, no orchestration framework.**

Each feature has a defined pipeline:

**Onboarding pipeline:**
```
1. Resume Parser → structured work experiences
2. PSI Reframer → called once per experience (parallel possible)
3. Gap Analyzer → initial skill scores
4. Conversation Agent → loop until complete
5. PSI Reframer → for any new data from conversation
6. Gap Analyzer → final skill scores + readiness score
```

**Resume generation pipeline:**
```
1. Load user's PSI entries + master profile
2. Load target JD
3. Resume Optimizer → select entries, generate resume content
4. ATS Scorer (heuristic) → keyword match + formatting check
5. Return resume + rationale + score
```

**Assignment evaluation pipeline:**
```
1. Load assignment prompt + rubric + user submission
2. Assignment Evaluator → score + feedback
3. If score >= 60: mark stage complete
4. Update learning progress
5. Trigger readiness revalidation (Gap Analyzer)
```

**Implementation:** These pipelines are implemented as async functions in the backend. No need for LangGraph, CrewAI, or similar — just sequential `await` calls. If we need parallelism (e.g., reframing 6 experiences simultaneously), use `Promise.all()`.

---

## 11. Database Schema

### 11.1 Technology

- **Primary DB:** PostgreSQL (via Supabase, Neon, or Railway)
- **Vector Store:** pgvector extension (same Postgres instance) for RAG embeddings
- **ORM:** Prisma (type-safe, works well with Next.js)
- **Migrations:** Prisma Migrate

### 11.2 Entity Relationship Overview

```
User ──┬── WorkExperience ──── ExperienceEntry (PSI)
       │                         │
       ├── UserSkillScore ◄──────┘ (auto-tagged)
       │        │
       │        ▼
       │   SkillTaxonomy (reference)
       │        │
       │   RoleSkillWeight (reference)
       │
       ├── ReadinessSnapshot
       │
       ├── UserLearningPath
       │        │
       │   StageProgress ──── SubmissionRecord
       │
       ├── ResumeVersion ──── JobDescription
       │
       ├── QuestionAttempt ──── QuestionBank (reference)
       │
       ├── ActivityLog
       │
       └── StreakRecord
```

### 11.3 Table Definitions

```sql
-- =============================================
-- AUTH & USER
-- =============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- null for OAuth users
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'email', -- 'email' | 'google'
    
    -- Profile basics
    current_role VARCHAR(255),
    company VARCHAR(255),
    years_of_experience VARCHAR(20), -- '0-1' | '1-2' | '2-3' | '3-5' | '5+'
    industry VARCHAR(100),
    
    -- PM targeting
    target_pm_role VARCHAR(50), -- 'consumer' | 'growth' | 'technical' | 'platform' | 'ai' | 'general'
    preparation_stage VARCHAR(50), -- 'exploring' | 'studying' | 'preparing' | 'applying'
    
    -- Onboarding state
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step VARCHAR(50) DEFAULT 'resume', -- tracks where they are in onboarding
    
    -- Profile visibility
    public_profile_slug VARCHAR(100) UNIQUE,
    profile_visibility JSONB DEFAULT '{"skills": true, "experiences": true, "assignments": true, "activity": true}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WORK EXPERIENCE (raw from resume)
-- =============================================

CREATE TABLE work_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    company_name VARCHAR(255),
    role_title VARCHAR(255),
    start_date DATE,
    end_date DATE, -- null = current
    raw_description TEXT, -- original text from resume
    source VARCHAR(50) NOT NULL DEFAULT 'resume', -- 'resume' | 'conversation' | 'manual' | 'llm_import'
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPERIENCE ENTRIES (PSI — reframed entries)
-- Renamed from "PSIEntry" for clarity
-- =============================================

CREATE TABLE experience_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    work_experience_id UUID REFERENCES work_experiences(id) ON DELETE SET NULL,
    
    -- PSI fields (stored separately for rich querying)
    problem_statement TEXT,
    solution_description TEXT,
    impact_description TEXT,
    impact_metrics JSONB, -- {"development_time_reduction": "90%", "clients_onboarded": 3}
    metrics_verified BOOLEAN DEFAULT FALSE, -- user confirmed they can defend these
    
    -- Resume output
    resume_point TEXT, -- 1-2 line summary for resume
    
    -- Classification
    priority VARCHAR(20) DEFAULT 'medium', -- 'high' | 'medium' | 'low'
    source VARCHAR(50) NOT NULL DEFAULT 'ai_generated', -- 'ai_generated' | 'manual' | 'conversation'
    
    -- Skills (denormalized for fast access, also in junction table)
    skill_tags JSONB DEFAULT '[]', -- array of skill IDs
    
    -- Display
    highlighted BOOLEAN DEFAULT FALSE, -- user selected for public profile
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SKILLS TAXONOMY (reference data)
-- =============================================

CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES skill_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    evidence_types JSONB DEFAULT '[]', -- ["psi_entry", "assignment", "certification", "self_report"]
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_skill_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pm_role_type VARCHAR(50) NOT NULL, -- 'consumer' | 'growth' | 'technical' | 'platform' | 'ai' | 'general'
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id),
    weight DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000, sum per role = 1.0
    
    UNIQUE(pm_role_type, skill_category_id)
);

-- =============================================
-- USER SKILL SCORES
-- =============================================

CREATE TABLE user_skill_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    
    evidence_score INTEGER DEFAULT 0, -- 0-100
    assignment_score INTEGER DEFAULT 0, -- 0-100
    learning_score INTEGER DEFAULT 0, -- 0-100
    overall_score INTEGER DEFAULT 0, -- weighted composite
    
    evidence_justification TEXT, -- AI's 1-sentence explanation
    
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, skill_id)
);

-- =============================================
-- READINESS SNAPSHOTS
-- =============================================

CREATE TABLE readiness_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    overall_score INTEGER NOT NULL, -- 0-100
    category_scores JSONB NOT NULL, -- {"product_thinking": 78, "analytical": 45, ...}
    target_role VARCHAR(50) NOT NULL,
    
    triggered_by VARCHAR(50) NOT NULL, -- 'manual' | 'stage_completion' | 'onboarding'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LEARNING PATH
-- =============================================

CREATE TABLE learning_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    skill_categories JSONB NOT NULL, -- array of category IDs this stage covers
    order_index INTEGER NOT NULL,
    estimated_hours_min INTEGER,
    estimated_hours_max INTEGER,
    
    -- Gate assignment
    gate_assignment_prompt TEXT,
    gate_assignment_rubric JSONB, -- {"criteria": [{"name": "...", "weight": 20, "description": "..."}]}
    gate_passing_score INTEGER DEFAULT 60,
    
    -- Personalization
    skip_if_score_above INTEGER DEFAULT 70, -- auto-suggest skip if category score >= this
    optional_for_roles JSONB DEFAULT '[]', -- roles where this stage is optional
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE learning_sub_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES learning_stages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    
    -- Resources
    resources JSONB NOT NULL, -- [{title, url, type, duration_minutes, difficulty}]
    
    -- Quick check
    quick_check_prompt TEXT,
    quick_check_type VARCHAR(50) DEFAULT 'text', -- 'text' | 'mcq' | 'none'
    quick_check_rubric JSONB,
    
    -- Personalization
    optional_if_skilled BOOLEAN DEFAULT FALSE, -- can skip if user already has this skill
    related_skill_id UUID REFERENCES skills(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Customized stage list with skip/include flags
    stage_config JSONB NOT NULL, 
    -- [{"stage_id": "...", "status": "included|skipped|optional", "reason": "..."}]
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stage_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES learning_stages(id),
    sub_topic_id UUID REFERENCES learning_sub_topics(id), -- null for stage-level records
    
    status VARCHAR(50) NOT NULL DEFAULT 'not_started', 
    -- 'not_started' | 'in_progress' | 'completed' | 'skipped'
    
    -- For sub-topics: resource completion
    resources_completed JSONB DEFAULT '[]', -- array of resource URLs marked done
    quick_check_response TEXT,
    quick_check_score INTEGER,
    quick_check_feedback TEXT,
    
    -- For stages: gate assignment
    gate_submission TEXT,
    gate_submission_url VARCHAR(500),
    gate_submission_file_url VARCHAR(500),
    gate_score INTEGER,
    gate_feedback TEXT,
    gate_submitted_at TIMESTAMPTZ,
    gate_evaluated_at TIMESTAMPTZ,
    
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, stage_id, sub_topic_id)
);

-- =============================================
-- RESUME BUILDER
-- =============================================

CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255),
    company VARCHAR(255),
    description TEXT NOT NULL,
    extracted_keywords JSONB, -- ["stakeholder management", "roadmap", ...]
    source VARCHAR(50) DEFAULT 'manual', -- 'onboarding' | 'manual'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jd_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL, -- null = master resume
    
    content JSONB NOT NULL, -- structured resume data (sections, entries, etc.)
    ats_score INTEGER,
    ats_details JSONB, -- {"keyword_match": 72, "formatting": 95, "missing_keywords": [...]}
    
    ai_rationale JSONB, -- [{"entry_id": "...", "included": true, "reason": "..."}]
    
    version INTEGER DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- QUESTION BANK
-- =============================================

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    category VARCHAR(100) NOT NULL, -- 'product_sense' | 'analytical' | 'strategy' | etc.
    sub_category VARCHAR(100),
    question_text TEXT NOT NULL,
    difficulty INTEGER DEFAULT 2, -- 1-3
    
    related_skills JSONB DEFAULT '[]', -- skill IDs
    
    -- Evaluation
    evaluation_criteria JSONB NOT NULL, 
    -- [{"criterion": "Clarifies assumptions", "weight": 15}, ...]
    min_expectations TEXT, -- what a passing answer must cover
    sample_answer_points JSONB, -- key points a good answer includes
    
    -- Metadata
    related_stage_id UUID REFERENCES learning_stages(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    
    answer_text TEXT NOT NULL,
    ai_score INTEGER, -- 0-100
    ai_feedback TEXT,
    criteria_results JSONB, -- [{"criterion": "...", "met": true/false, "comment": "..."}]
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY & STREAKS
-- =============================================

CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(100) NOT NULL,
    -- 'resource_completed' | 'quick_check_submitted' | 'gate_submitted' |
    -- 'psi_entry_added' | 'psi_entry_edited' | 'question_answered' |
    -- 'resume_generated' | 'score_revalidated' | 'stage_completed'
    
    activity_data JSONB, -- additional context
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE streak_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONVERSATION HISTORY (for onboarding)
-- =============================================

CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    session_type VARCHAR(50) NOT NULL, -- 'onboarding' | 'gap_filling'
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
    
    messages JSONB NOT NULL DEFAULT '[]', 
    -- [{role: "assistant"|"user", content: "...", timestamp: "..."}]
    
    extracted_data JSONB, -- accumulated PSI signals and skill evidence from conversation
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RAG EMBEDDINGS (using pgvector)
-- =============================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE resource_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_url VARCHAR(500) NOT NULL,
    resource_title VARCHAR(255),
    chunk_text TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 dimension
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON resource_embeddings USING ivfflat (embedding vector_cosine_ops);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_work_exp_user ON work_experiences(user_id);
CREATE INDEX idx_exp_entries_user ON experience_entries(user_id);
CREATE INDEX idx_user_skills_user ON user_skill_scores(user_id);
CREATE INDEX idx_readiness_user ON readiness_snapshots(user_id, created_at DESC);
CREATE INDEX idx_stage_progress_user ON stage_progress(user_id);
CREATE INDEX idx_activity_user_date ON activity_log(user_id, activity_date);
CREATE INDEX idx_resume_user ON resume_versions(user_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_question_attempts_user ON question_attempts(user_id);
```

---

## 12. API Design

### 12.1 API Structure

Base URL: `/api/v1/`
Auth: JWT tokens via NextAuth.js (sent as Bearer token or httpOnly cookie)

### 12.2 Key Endpoints

#### Auth
```
POST   /api/auth/signup          - Email/password registration
POST   /api/auth/login           - Email/password login
GET    /api/auth/session         - Get current session (NextAuth)
POST   /api/auth/callback/google - Google OAuth callback (NextAuth)
```

#### Onboarding
```
POST   /api/onboarding/resume         - Upload resume file
POST   /api/onboarding/profile        - Save profile form data
POST   /api/onboarding/analyze        - Trigger AI analysis pipeline
GET    /api/onboarding/status          - Poll analysis status
GET    /api/onboarding/summary         - Get brief summary before conversation
POST   /api/onboarding/conversation    - Send message in gap-filling chat
POST   /api/onboarding/complete        - Mark onboarding as complete
```

#### Experience (PSI Entries)
```
GET    /api/experience                 - List all experience entries
POST   /api/experience                 - Add new entry
PUT    /api/experience/:id             - Update entry
DELETE /api/experience/:id             - Delete entry
POST   /api/experience/reanalyze       - Re-run skill analysis on all entries
POST   /api/experience/import          - Import from LLM prompt response
```

#### Readiness Score
```
GET    /api/readiness/current          - Get latest score + sub-scores
GET    /api/readiness/history          - Get score snapshots over time
POST   /api/readiness/revalidate       - Trigger full revalidation
```

#### Learning Path
```
GET    /api/learning/path              - Get user's customized learning path
GET    /api/learning/stage/:id         - Get stage details with sub-topics
POST   /api/learning/resource/complete - Mark a resource as done
POST   /api/learning/quick-check       - Submit quick check answer
POST   /api/learning/gate/submit       - Submit stage gate assignment
GET    /api/learning/gate/:stageId/feedback - Get evaluation feedback
POST   /api/learning/stage/:id/skip-test   - Attempt to test out of a stage
```

#### Questions
```
GET    /api/questions                  - List questions (with filters)
GET    /api/questions/:id              - Get question details
POST   /api/questions/:id/answer       - Submit answer for evaluation
GET    /api/questions/:id/attempts     - Get user's past attempts
```

#### Resume
```
GET    /api/resume/versions            - List all resume versions
POST   /api/resume/generate            - Generate resume for a JD
PUT    /api/resume/:id                 - Save edited resume
GET    /api/resume/:id/download/:format - Download as PDF or DOCX
POST   /api/resume/analyze-ats         - Run ATS analysis on current resume
GET    /api/resume/generation-count    - Get remaining generations (limit: 15)
```

#### Job Descriptions
```
GET    /api/jd                         - List stored JDs
POST   /api/jd                         - Add new JD
DELETE /api/jd/:id                     - Delete JD
```

#### Profile
```
GET    /api/profile                    - Get user's full profile
PUT    /api/profile                    - Update profile settings
GET    /api/profile/public/:slug       - Get public profile (no auth)
PUT    /api/profile/visibility         - Update section visibility
PUT    /api/profile/highlights         - Select highlighted PSI entries
```

#### Activity & Streaks
```
GET    /api/activity/streak            - Get current streak info
GET    /api/activity/heatmap           - Get activity data for heatmap (last 90 days)
GET    /api/activity/recent            - Get recent activity feed
```

#### Discovery Module
```
POST   /api/discovery/assess           - Submit discovery quiz answers
GET    /api/discovery/result           - Get role recommendation
```

---

## 13. System Architecture

### 13.1 High-Level Diagram

```
                    ┌─────────────┐
                    │   Vercel     │
                    │   (CDN +     │
                    │   Serverless)│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │     Next.js App          │
              │  ┌──────────────────┐   │
              │  │  Pages (SSR/CSR)  │   │
              │  │  /landing         │   │
              │  │  /onboarding/*    │   │
              │  │  /dashboard/*     │   │
              │  │  /profile/:slug   │   │
              │  └──────────────────┘   │
              │  ┌──────────────────┐   │
              │  │  API Routes       │   │
              │  │  /api/v1/*        │   │
              │  └──────┬───────────┘   │
              └─────────┼───────────────┘
                        │
         ┌──────────────┼──────────────────┐
         │              │                   │
    ┌────▼────┐   ┌────▼────┐   ┌─────────▼───────┐
    │PostgreSQL│   │  Redis   │   │   AI Service    │
    │+ pgvector│   │ (Cache)  │   │   Layer          │
    │          │   │          │   │                   │
    │ Tables:  │   │ Session  │   │ ┌─────────────┐ │
    │ users    │   │ Rate     │   │ │Resume Parser│ │
    │ exp_     │   │ Limiting │   │ │(GPT-4o-mini)│ │
    │ entries  │   │ Job      │   │ ├─────────────┤ │
    │ skills   │   │ Status   │   │ │PSI Reframer │ │
    │ scores   │   │          │   │ │(Sonnet)     │ │
    │ stages   │   │          │   │ ├─────────────┤ │
    │ etc.     │   │          │   │ │Gap Analyzer │ │
    │          │   │          │   │ │(Sonnet)     │ │
    │ vector   │   │          │   │ ├─────────────┤ │
    │ index    │   │          │   │ │Conversation │ │
    │ (RAG)    │   │          │   │ │(Sonnet)     │ │
    │          │   │          │   │ ├─────────────┤ │
    └──────────┘   └─────────┘   │ │Evaluators   │ │
                                  │ │(Sonnet)     │ │
                                  │ ├─────────────┤ │
                                  │ │Resume Opt.  │ │
                                  │ │(GPT-4o-mini)│ │
                                  │ └─────────────┘ │
                                  └─────────────────┘
                                    │           │
                              ┌─────▼───┐ ┌────▼──────┐
                              │Anthropic│ │ OpenAI    │
                              │API      │ │ API       │
                              └─────────┘ └───────────┘
```

### 13.2 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Hosting** | Vercel | Next.js-native, serverless, auto-scaling, free tier for MVP |
| **Database** | Supabase (PostgreSQL + pgvector) | Managed Postgres, built-in pgvector, auth helpers, generous free tier |
| **ORM** | Prisma | Type-safe, great DX with Next.js, migration system |
| **Auth** | NextAuth.js | Battle-tested, supports Google OAuth + credentials, session management |
| **Cache** | Vercel KV (Redis) or Upstash | Session storage, rate limiting, analysis job status |
| **File Storage** | Supabase Storage or Vercel Blob | Resume uploads, generated documents |
| **Rich Text Editor** | TipTap v2 | Extensible, headless (we control UI), active community |
| **AI Models** | Anthropic API (Sonnet) + OpenAI API (GPT-4o-mini) | Best reasoning (Sonnet) for complex tasks, cheap (4o-mini) for simple ones |
| **Voice** | Web Speech API (browser-native) | Free, no backend needed, acceptable quality for MVP |
| **PDF Generation** | Puppeteer or react-pdf | For resume download as PDF |
| **Monitoring** | Vercel Analytics + Sentry | Error tracking, performance monitoring |

### 13.3 Deployment Strategy

**MVP:** Single Vercel project with everything
- Next.js app (frontend + API routes)
- Serverless functions for API endpoints
- Supabase for database + storage
- Redis for caching (Vercel KV)

**Scaling path (when needed):**
- Extract AI service layer to separate microservice (long-running calls)
- Move to dedicated server if serverless timeout limits hit (Vercel has 60s limit on Hobby, 300s on Pro)
- Consider edge functions for public profile pages (SSR at edge)

### 13.4 Environment Configuration

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... # For Prisma migrations

# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI Models
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# Storage
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# Cache
KV_URL=... # Redis/Upstash

# Feature Flags
READINESS_THRESHOLD=70
MAX_RESUME_GENERATIONS=15
MAX_STORED_JDS=3
ENABLE_VOICE_MODE=true
```

---

## 14. Implementation Plan

### 14.1 Phase Breakdown

#### Phase 0: Foundation (Week 1)
- [ ] Project setup: Next.js 14+ with App Router
- [ ] Database schema creation (Prisma + migrations)
- [ ] Auth setup (NextAuth with Google OAuth + credentials)
- [ ] Seed skill taxonomy data
- [ ] Seed initial learning stages + sub-topics (v0 content)
- [ ] Seed question bank (initial 30-50 questions)
- [ ] Basic layout: navigation, auth pages, protected routes
- [ ] AI service layer: abstraction over Anthropic + OpenAI APIs

#### Phase 1: Core Onboarding (Week 2-3)
- [ ] Resume upload page + file storage
- [ ] Profile form page
- [ ] Resume Parser agent integration
- [ ] PSI Reframer agent integration
- [ ] Gap Analyzer agent integration
- [ ] Analysis loading page with progress steps
- [ ] Brief summary page
- [ ] Conversation agent: chat UI (text mode)
- [ ] Conversation agent: voice mode (Web Speech API)
- [ ] Full analysis dashboard (first view)
- [ ] PSI entry display + edit UI
- [ ] Skill gap visualization (bar chart)
- [ ] Initial readiness score display
- [ ] LLM prompt export feature

#### Phase 2: Dashboard & Learning (Week 3-4)
- [ ] Main dashboard page
- [ ] Readiness score widget with sub-scores
- [ ] Revalidation flow
- [ ] Score history chart
- [ ] Learning path page
- [ ] Sub-topic view with resources
- [ ] Resource completion tracking
- [ ] Quick check submission + AI evaluation
- [ ] Stage gate assignment submission + AI evaluation
- [ ] Stage progression logic (unlock next stage)
- [ ] Stage skip/test-out flow
- [ ] Streak system (tracking + display)
- [ ] Activity logging

#### Phase 3: Resume Builder & Questions (Week 4-5)
- [ ] JD storage (upload/paste)
- [ ] Resume generation pipeline
- [ ] TipTap editor integration
- [ ] Split-panel layout (rationale + editor)
- [ ] ATS scoring (keyword match + formatting)
- [ ] Resume download (PDF + DOCX)
- [ ] Resume version management
- [ ] Question bank listing page
- [ ] Question practice page with AI evaluation
- [ ] Question attempt history

#### Phase 4: Profile & Polish (Week 5-6)
- [ ] Public profile page (SSR, no auth)
- [ ] Profile edit page with visibility controls
- [ ] Activity heatmap component
- [ ] Verification badge logic
- [ ] Discovery module (quiz flow)
- [ ] Landing page
- [ ] Browser notification for analysis completion
- [ ] Onboarding resume/progress recovery
- [ ] Edge case handling (see Section 5.4)
- [ ] Performance optimization
- [ ] Error handling & logging

#### Phase 5: Testing & Launch (Week 6)
- [ ] End-to-end testing of all flows
- [ ] AI output quality review (sample 20 onboardings)
- [ ] Mobile responsiveness pass
- [ ] SEO basics (public profile pages, landing page)
- [ ] Analytics setup (Vercel Analytics)
- [ ] Error monitoring (Sentry)
- [ ] Seed more content (expand resources, questions)
- [ ] Deploy to production
- [ ] First user cohort onboarding

### 14.2 Critical Path Dependencies

```
Schema + Auth → Resume Upload → AI Parsing → Conversation → Dashboard
                                    │
                              Skill Taxonomy (must be seeded first)
                                    │
                              Learning Stages (must be seeded first)
                                    │
                    Dashboard → Learning Path → Question Bank
                        │
                    Readiness Score → Resume Builder
                        │
                    PSI Entries → Public Profile
```

### 14.3 Content Creation Tasks (Parallel to Engineering)

These can be done independently and loaded into the database:

| Task | Description | Estimated Effort |
|------|-------------|-----------------|
| Skill taxonomy validation | Analyze 15-20 JDs per PM role type, validate taxonomy against real requirements | 2-3 days |
| Role weight calibration | Determine weight distribution per role using JD analysis | 1-2 days |
| Learning stage content | For each of ~12 stages: write descriptions, curate 5-10 resources per sub-topic, write assignment prompts + rubrics | 5-7 days |
| Question bank | Write 50-100 questions across all categories with evaluation criteria | 3-4 days |
| Discovery module content | PM role type descriptions, pros/cons, day-in-the-life, quiz questions | 1-2 days |
| Landing page copy | Headlines, feature descriptions, before/after examples | 1 day |

---

## 14.5 Addendum: Features Added from Solution Space Review

> These features were identified by comparing against a parallel solution document. They address real gaps in our original spec.

### A. Proficiency Assessment in Onboarding (New Step)

**What changed:** The gap-filling conversation (Step 6 in our onboarding flow) now includes 4-6 **situational assessment questions** alongside the gap-filling probes. These are not "rate yourself 1-10" — they are mini PM scenarios that reveal actual thinking ability.

**Why this matters:** Our original flow only extracted PSI data from past work. It never independently tested whether the user can *think* like a PM when presented with a new problem. A developer might have great resume bullets but freeze when asked "orders dropped 15% — what do you do?" The assessment gives a more honest baseline.

**How it works:**
- After the gap-filling questions, the Conversation Agent switches to assessment mode
- Asks 4-6 role-specific situational questions (see examples below)
- Each answer is evaluated by the LLM against a scoring rubric for: specificity, structure, PM vocabulary, domain relevance
- Each skill area gets a proficiency tag: Strong / Developing / Needs Work
- This proficiency data feeds into the readiness score AND determines depth within learning stages

**Example assessment questions (for Technical PM target):**

| Skill Assessed | Question | What the Answer Reveals |
|---------------|----------|----------------------|
| Product Sense | "You're a PM at a food delivery app. Orders are down 15% this week. Walk me through the first 3 things you'd do." | Hypothesis-driven thinking vs jumping to solutions |
| Prioritization | "You have 3 features from sales, 2 from engineering, 1 from a top customer. You can build 2. How do you decide?" | Framework usage vs gut feel |
| Metrics | "What's one metric you'd track to know if a new onboarding flow is working? Why that and not others?" | Depth of metrics thinking |
| Stakeholder | "A senior engineer says your feature takes 3 months. Planning said 3 weeks. What do you do?" | Conflict navigation instincts |

**Impact on readiness score:** Proficiency assessment contributes to the Evidence Score component. A "Strong" proficiency assessment for a skill can boost the evidence score even if PSI entries are limited.

**Impact on learning path:** Proficiency level determines depth within each stage:

| Proficiency | Resources Assigned | Quiz Questions | Project Task |
|------------|-------------------|---------------|-------------|
| Strong | 1 refresher article | 3 questions (pass 2/3) | Optional |
| Developing | 2-3 articles | 5 questions (pass 4/5) | Required: short version |
| Needs Work | 4-5 articles + 1 video | 8 questions (pass 6/8) | Required: full version |

**Agent addition:** Add `Proficiency Evaluator` as a sub-function of the Conversation Agent (same model, different evaluation prompt).

### B. Application Tracker (New Feature)

**URL:** `/dashboard/applications`

**What it is:** A lightweight tracker where users log their job applications after hitting the "apply now" threshold. Not a CRM, not a job board — just a simple log.

**Fields per entry:**
- Company name (text)
- Role title (text)
- Date applied (date picker)
- Status (dropdown): Applied → Phone Screen → Interview → Rejected → Offer
- Notes (optional text)
- JD link (optional — links to stored JD if available)

**Why this matters:** Without this, users hit "ready" and leave our platform. The tracker:
1. Keeps them connected to the platform during the application phase
2. Enables the rejection recovery mechanism (see below)
3. Application activity counts toward streaks (1 application = 1 streak-qualifying action)
4. Provides us with eventual outcome data for calibrating the readiness score

**Database addition:**
```sql
CREATE TABLE application_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255),
    jd_id UUID REFERENCES job_descriptions(id),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'applied',
    -- 'applied' | 'phone_screen' | 'interview' | 'rejected' | 'offer'
    notes TEXT,
    status_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API endpoints:**
```
GET    /api/applications            - List all applications
POST   /api/applications            - Log new application
PUT    /api/applications/:id        - Update status
DELETE /api/applications/:id        - Remove entry
GET    /api/applications/stats      - Summary (total applied, interviews, rejections)
```

### C. Rejection Recovery Mechanism (New Feature)

**Trigger:** User changes an application status to "Rejected"

**What happens:**
Instead of just recording the rejection, the system fires a recovery prompt within the same session:

```
┌──────────────────────────────────────────────────┐
│  We see you got a rejection from [Company].       │
│  That's part of the process — here's what to do   │
│  in the next 48 hours:                            │
│                                                   │
│  📋 One action: [Context-specific suggestion]     │
│     e.g., "Review your metrics answer in Stage 3  │
│     — it was your weakest area and metrics        │
│     questions are common at companies like this." │
│                                                   │
│  📊 Your readiness: "You're at 76%. Rejection    │
│     at this score is normal — keep going."        │
│                                                   │
│  🔥 Your streak: "15 days and counting.          │
│     Log one action today to keep it alive."       │
│                                                   │
│  [Got it, keep going →]                           │
└──────────────────────────────────────────────────┘
```

**Suggestion logic:** The "one action" suggestion is contextual:
- If user has incomplete learning stages → suggest the most impactful incomplete stage
- If user hasn't practiced question bank → suggest practicing a question in their weakest skill area
- If user hasn't updated their resume recently → suggest re-running resume analysis
- If all else is done → suggest applying to one more role or reaching out to a PM at a target company

**Why this directly addresses Pain Point #3 (Confidence-Action Loop Breakdown):** The original research showed that rejections cause people to stop applying entirely. This mechanism intercepts the moment of rejection and converts it into a specific action instead of letting silence fill the gap.

### D. Intermediate Certificates (Enhancement to Public Profile)

**Current design:** Verification badge only after completing all stages.

**Updated design:** Three certificate milestones:

| Milestone | Trigger | Badge Label | What's Shown |
|-----------|---------|------------|-------------|
| Early Progress | First stage completed | "In Progress" | Partial score, completed stage |
| Midway | 50% of stages completed | "Midway" | Current score, completed stages, top skills |
| Full Completion | All stages completed | "Verified" | Full score, all skills, all projects |

**Why:** Many users will start applying before completing the full path. Intermediate certificates give them shareable proof-of-work earlier. The "In Progress" certificate is particularly valuable — it shows a hiring manager or referral contact that the person is actively investing in their PM transition.

**Certificate page URL:** `/certificate/[username]` (public, shareable, no auth required)
- Same data as the public profile but formatted as a credential
- Includes: name, target role, score, skill breakdown, stages completed, date
- Sharing options: Copy link, Share to LinkedIn (pre-filled caption), Download PDF
- LinkedIn pre-fill example: "Just completed the PM Readiness Program — Midway milestone with a score of 68. Actively preparing for Technical PM roles. Open to conversations and referrals."

### E. Before/After ATS Score (Enhancement to Resume Builder)

**Current design:** Shows one ATS score for the generated resume.

**Updated design:** Show both:
- **Original resume ATS score:** Scan the uploaded resume against the JD → show score (e.g., 34/100)
- **Tailored resume ATS score:** Score the generated resume against the same JD (e.g., 71/100)
- **Delta:** "+37 points — we added 8 missing keywords and reframed 4 bullet points"

This makes the value of the resume builder immediately visible and quantified.

### F. Quiz Retry with Resource Guidance (Enhancement to Learning Path)

**Current design:** Score < 60, "here's what to improve, resubmit."

**Updated design:** On quiz/assignment failure, show specific resource links:
```
"You scored 48/100. Here's what to strengthen before retrying:

Your answer was weak on 'structured diagnostic approach' (scored 12/20).
→ Revisit: Sub-topic 4.2 — Funnel Analysis & AARRR Framework
→ Key resource: 'AARRR Pirate Metrics' article (8 min read)

Your answer missed 'considers multiple causes' (scored 5/15).
→ Revisit: Sub-topic 4.3 — Cohort Analysis  
→ Key resource: 'Reading Cohort Tables' video (12 min)

[Revisit Resources] [Retry Assignment]"
```

This maps failure criteria back to specific learning resources, making feedback actionable.

---

## 15. Phase 2 Roadmap

Features deferred from MVP, ordered by expected impact:

| Priority | Feature | Why Deferred | Dependency |
|----------|---------|-------------|------------|
| P1 | **Cover letter generation** | Lower impact than resume, can add later | Resume builder exists |
| P1 | **Domain deep-dive modules** | Multiplies content by 5+ role types | Base learning path stable |
| P1 | **LinkedIn import** | Eliminates resume requirement, broadens access | Resume parsing works |
| P1 | **Admin portal** | Content updates currently require DB access | Learning path in production |
| P2 | **Peer review on assignments** | Needs user base critical mass | Assignment evaluation works |
| P2 | **Community features on question bank** | Cold start problem, needs users | Question bank exists |
| P2 | **Application tracking** | Contact management, follow-ups, pipeline | Resume builder exists |
| P2 | **Mock interview simulation** | Full conversation with evaluation | Conversation agent exists |
| P3 | **Mobile app** | Web works on mobile, native is a luxury | Web app stable |
| P3 | **Company-specific prep** | Interview patterns per company | Question bank has enough questions |
| P3 | **Mentor matching** | Needs supply-side (mentors) | Community exists |
| P3 | **Fine-tuned models** | Need enough user data to fine-tune | 6+ months of user data |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| PSI | Problem → Solution → Impact — the reframing format for work experiences |
| Experience Entry | A single work experience reframed in PSI format |
| Skill Category | Top-level grouping (8 total): Product Thinking, Analytical, etc. |
| Skill | Specific competency within a category (~35 total) |
| Role Weight | How much a skill category matters for a specific PM role type |
| Readiness Score | Weighted composite score (0-100) measuring PM interview readiness |
| Gate Assignment | The checkpoint submission at the end of each learning stage |
| Quick Check | Lightweight comprehension check within a sub-topic |
| ATS Score | Estimated likelihood of passing automated resume screening |
| Streak | Consecutive days with at least one qualifying activity |
| Master Profile | The complete collection of a user's PSI entries, skills, and data |

## Appendix B: Configuration Defaults

All configurable values stored in environment variables or database:

| Parameter | Default | Location |
|-----------|---------|----------|
| Readiness "apply now" threshold | 70 | env: READINESS_THRESHOLD |
| Max stored JDs per user | 3 | env: MAX_STORED_JDS |
| Max resume generations | 15 | env: MAX_RESUME_GENERATIONS |
| Stage gate passing score | 60 | DB: learning_stages.gate_passing_score |
| Stage skip threshold (skill score) | 70 | DB: learning_stages.skip_if_score_above |
| Max conversation questions | 12 | Agent prompt config |
| Readiness score formula weights | 50/30/20 | DB or config file |
| Role skill weights | See Section 7.3 | DB: role_skill_weights |
| Streak timezone | User's browser timezone | Client-side |

---

*End of Solution Document*
