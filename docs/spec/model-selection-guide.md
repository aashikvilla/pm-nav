# OpenRouter Free Model Selection Guide — PM Career Navigation Platform

**Purpose:** Map every AI agent in our platform to the best free model available on OpenRouter, with justified fallbacks. Reduce our AI costs from ~$0.32/onboarding to $0 for MVP while maintaining quality.

**Last Updated:** March 26, 2026
**Source:** OpenRouter free models collection + provider documentation

---

## Key Constraints

- **Rate limits on free models:** ~20 requests/minute, ~200 requests/day per model
- **Availability:** Free models can be removed or throttled without notice
- **Data privacy:** Some providers (notably DeepSeek) may use prompts for training — avoid for sensitive user data unless self-hosted
- **Strategy:** Use different free models for different agents to spread rate limits. Have paid fallbacks for production.

---

## Available Free Models — Ranked by Capability

Based on research as of March 2026, here are the free models on OpenRouter relevant to our use cases:

| # | Model | Provider | Params (Active) | Context | Strengths | Weaknesses | OpenRouter ID |
|---|-------|----------|-----------------|---------|-----------|------------|--------------|
| 1 | **DeepSeek V3.1** | DeepSeek | 671B (37B) | 164K | Best free reasoning model. Hybrid thinking/non-thinking modes. Strong tool use, coding, agentic tasks. Near o1-level reasoning. | Data sent to China-based servers. Higher latency on long prompts. | `deepseek/deepseek-chat-v3.1:free` |
| 2 | **Step 3.5 Flash** | StepFun | 196B (11B) | 256K | Excellent reasoning, very fast for its capability. Huge context window. Top rankings in legal, finance, academia. | Less tested in English-only use cases. Newer model, less community validation. | `stepfun/step-3.5-flash:free` |
| 3 | **NVIDIA Nemotron 3 Super** | NVIDIA | 120B (12B) | 262K | Massive 262K context. Hybrid Mamba-Transformer. Excellent for long-document tasks. Open license. | Less proven on nuanced evaluation tasks. Can be verbose. | `nvidia/nemotron-3-super-120b-a12b:free` |
| 4 | **OpenAI GPT-OSS 120B** | OpenAI | 117B (5.1B) | 131K | OpenAI quality at zero cost. Configurable reasoning depth. Native tool use and structured output. Apache 2.0 license. | New model, still being evaluated by community. Possible quality variations. | `openai/gpt-oss-120b:free` |
| 5 | **Qwen3 Next 80B A3B** | Qwen | 80B (3B) | 262K | Optimized for RAG, tool use, agentic workflows. No thinking traces (fast). Huge context. Stable on multi-turn. | Only 3B active params — may struggle with highly nuanced evaluation. | `qwen/qwen3-next-80b-a3b-instruct:free` |
| 6 | **Meta Llama 3.3 70B** | Meta | 70B (70B) | 66K | Well-tested, community-validated. Strong multilingual. Reliable structured output. Closest to GPT-4 level of all free models. | Smaller context (66K). Not MoE — full 70B active, can be slower. | `meta-llama/llama-3.3-70b-instruct:free` |
| 7 | **MiniMax M2.5** | MiniMax | — | 197K | Excellent agentic performance (SWE-Bench 80.2%). Strong at following complex instructions. | Newer provider, less community testing. Primarily Chinese lab. | `minimax/minimax-m2.5:free` |
| 8 | **Mistral Small 3.1 24B** | Mistral | 24B | 128K | Fast, reliable, good general performance. Function calling support. Great for simpler tasks. | Not powerful enough for complex reasoning or nuanced evaluation. | `mistralai/mistral-small-3.1-24b-instruct:free` |
| 9 | **OpenAI GPT-OSS 20B** | OpenAI | 21B (3.6B) | 131K | Runs on consumer hardware. Good for simple extraction tasks. Structured output support. | Too small for complex reasoning. Limited evaluation capability. | `openai/gpt-oss-20b:free` |
| 10 | **Arcee Trinity Large** | Arcee | 400B (13B) | 131K | Good creative writing and agentic tasks. Designed for agent harnesses. | More creative/roleplay focused. Less tested for structured evaluation. | `arcee-ai/trinity-large-preview:free` |
| 11 | **NVIDIA Nemotron Nano 9B** | NVIDIA | 9B | 128K | Very fast. Built-in reasoning with optional trace. Good for simple tasks. | Too small for complex evaluation. Prone to hallucination on nuanced tasks. | `nvidia/nemotron-nano-9b-v2:free` |
| 12 | **Z.ai GLM 4.5 Air** | Z.ai (Zhipu) | MoE | 131K | Thinking/non-thinking modes. Good general capability. | Chinese provider, less English-first optimization. | `z-ai/glm-4.5-air:free` |
| 13 | **Qwen3 Coder 480B A35B** | Qwen | 480B (35B) | 262K | SOTA free coding model. Excellent for structured output generation. | Optimized for code, not general evaluation. Overkill for non-code tasks. | `qwen/qwen3-coder:free` |

---

## Agent → Model Mapping

### Overview Decision Matrix

| Agent | Quality Need | Complexity | Structured Output? | Primary Model | Fallback Model | Paid Fallback |
|-------|-------------|-----------|-------------------|---------------|----------------|---------------|
| Resume Parser | Medium | Low | Yes (JSON) | GPT-OSS 120B | Mistral Small 3.1 | GPT-4o-mini |
| PSI Reframer | **High** | **High** | Yes (JSON) | DeepSeek V3.1 | Step 3.5 Flash | Claude Sonnet |
| Gap Analyzer | **High** | **High** | Yes (JSON) | Step 3.5 Flash | DeepSeek V3.1 | Claude Sonnet |
| Conversation Agent | **High** | **High** | Yes (JSON) | Llama 3.3 70B | GPT-OSS 120B | Claude Sonnet |
| Proficiency Evaluator | **High** | **High** | Yes (JSON) | DeepSeek V3.1 | GPT-OSS 120B | Claude Sonnet |
| Assignment Evaluator | **High** | **High** | Yes (JSON) | Step 3.5 Flash | DeepSeek V3.1 | Claude Sonnet |
| Question Evaluator | **High** | **High** | Yes (JSON) | DeepSeek V3.1 | Step 3.5 Flash | Claude Sonnet |
| Resume Optimizer | Medium-High | Medium | Yes (JSON) | Qwen3 Next 80B | Mistral Small 3.1 | GPT-4o-mini |
| ATS Scorer | Medium | Low | Yes (JSON) | Mistral Small 3.1 | GPT-OSS 20B | — |
| Learning Recommender | Low | Low | Yes (JSON) | GPT-OSS 20B | Mistral Small 3.1 | — |

---

## Detailed Justification Per Agent

### 1. Resume Parser
**Task:** Extract structured data (name, company, roles, bullet points, skills, education) from raw resume text.

**Why GPT-OSS 120B (Primary):**
- Resume parsing is primarily an extraction task, not a reasoning task. It needs to reliably identify fields and produce structured JSON.
- GPT-OSS 120B has native structured output support (inherited from OpenAI's training on tool use and function calling). This makes JSON extraction reliable.
- 131K context handles even long, multi-page resumes comfortably.
- OpenAI models have historically been the best at following precise output schemas — GPT-OSS inherits this behavior.
- Apache 2.0 license — no privacy concerns with resume data.

**Why not DeepSeek V3.1:** Overkill for extraction. We want speed here, not deep reasoning. DeepSeek's China-based servers also raise concerns since we're processing resumes (PII-adjacent data).

**Why Mistral Small 3.1 (Fallback):**
- 24B is sufficient for extraction tasks. Fast, reliable.
- Good structured output support. 128K context.
- Different provider = different rate limits, so if GPT-OSS is throttled, Mistral still works.

**Expected quality:** 90-95% field extraction accuracy. Resume parsing is a well-solved problem at this model tier.

---

### 2. PSI Reframer
**Task:** Convert raw work experience ("Resolved UI bugs and validations") into Problem→Solution→Impact format with skill tagging. The most creative and reasoning-heavy agent.

**Why DeepSeek V3.1 (Primary):**
- This is the hardest agent task. It requires genuine reasoning: understanding what someone actually did from a terse resume bullet, inferring the business context, and reframing it in PM language.
- DeepSeek V3.1 is the strongest free reasoning model available. 671B total params with 37B active per pass. Hybrid thinking mode can be enabled for complex reframing.
- Benchmarked near OpenAI o1 levels on reasoning tasks. This matters because PSI reframing is fundamentally a reasoning + creative writing hybrid task.
- Supports both thinking and non-thinking modes — we can enable thinking for complex entries and disable for simpler ones to manage latency.

**Why not Llama 3.3 70B:** Good model, but consistently weaker on tasks requiring creative reframing and contextual inference. PSI reframing is where model quality has the most direct user-facing impact — this is the "wow moment." Can't afford mediocrity here.

**Why Step 3.5 Flash (Fallback):**
- Second-strongest reasoning model available for free. 196B total, 11B active.
- Very fast despite strong capability.
- Different provider (StepFun vs DeepSeek) = separate rate limits.

**Privacy note:** DeepSeek servers are China-based. Resume data flows through them. For MVP this is acceptable since we're free and we disclose it. For production, add Claude Sonnet as paid fallback and route sensitive users to it.

**Expected quality:** 80-90% of Claude Sonnet quality. May need more explicit prompting for metric inference guardrails.

---

### 3. Gap Analyzer
**Task:** Compare user's skills against the taxonomy, assign evidence scores per skill, identify gaps, compute readiness score components. Heavy structured evaluation.

**Why Step 3.5 Flash (Primary):**
- Gap analysis needs to process a large amount of structured data (all PSI entries + full taxonomy + role weights) and produce consistent, calibrated scores.
- Step 3.5 Flash has 256K context — critical because the full taxonomy + all PSI entries + role weights easily exceeds 10K tokens.
- Ranked #2 in finance and #9 in academia on OpenRouter, indicating strong performance on structured analytical tasks.
- Very fast inference (11B active params) means the analysis step doesn't bottleneck onboarding.

**Why not DeepSeek V3.1:** We're already using DeepSeek for PSI Reframing. Using a different model for Gap Analysis spreads our rate limits across providers. Also, gap analysis is more about consistent rubric application than creative reasoning — Step 3.5 Flash is well-suited for systematic evaluation.

**Why DeepSeek V3.1 (Fallback):**
- If Step 3.5 Flash is unavailable, DeepSeek V3.1 is equally capable.
- Different provider = separate availability.

**Expected quality:** 85-90% consistency in scoring. The rubric-based approach (explicitly defined in the prompt) anchors the evaluation.

---

### 4. Conversation Agent
**Task:** Conduct the onboarding drill-down conversation. Must be natural, contextual, warm, and extract PM-relevant information from user responses. Multi-turn.

**Why Llama 3.3 70B (Primary):**
- The conversation agent is the only agent that talks directly to the user. Tone, warmth, and naturalness matter more than raw reasoning power.
- Llama 3.3 70B is the most community-tested model on this list. Its conversational quality is well-validated across millions of interactions on OpenRouter.
- Full 70B dense model (not MoE) — for conversational tasks, dense models tend to be more coherent and less prone to mode-switching than MoE models.
- Strong multilingual support (includes Hindi) — critical for our Indian user base who may mix English and Hindi.
- 66K context is sufficient for a 12-question conversation (total context including system prompt + resume data + conversation history stays well under 20K tokens).

**Why not DeepSeek V3.1:** For conversation, we prioritize naturalness and tone over raw reasoning. DeepSeek can sound more robotic in conversational mode. Also, privacy: the conversation agent processes the most personal user data (direct quotes about their work experiences). Llama 3.3 via OpenRouter doesn't have the China-server concern.

**Why GPT-OSS 120B (Fallback):**
- OpenAI models have excellent conversational quality.
- Structured output support helps with extracting JSON from each conversation turn.
- Different provider than Meta = separate rate limits.

**Expected quality:** 90%+ user satisfaction with conversational naturalness. The structured conversation approach (AI has a question checklist) bounds the task enough that even slightly weaker models perform well.

---

### 5. Proficiency Evaluator
**Task:** Score user's answers to situational PM questions against a rubric. Must evaluate specificity, structure, PM vocabulary, and domain relevance.

**Why DeepSeek V3.1 (Primary):**
- Proficiency evaluation is a complex rubric-adherence task. The model must read a user's free-text answer and score it across 4-6 criteria without being too harsh or too lenient.
- DeepSeek V3.1's thinking mode is perfect here — enable it to let the model reason through each criterion before assigning a score.
- Calibrated evaluation requires the model to distinguish between "specific and structured" (Strong), "decent but vague" (Developing), and "surface-level" (Needs Work). This is a reasoning-heavy distinction.
- We can share the same prompt engineering as the Assignment Evaluator — DeepSeek handles both similarly.

**Why GPT-OSS 120B (Fallback):**
- Strong structured output support for returning score breakdowns.
- OpenAI training specifically included evaluation-style tasks.

**Expected quality:** 80-85% agreement with human evaluators on a 3-level scale (Strong/Developing/Needs Work). Acceptable for MVP.

---

### 6. Assignment Evaluator
**Task:** Score stage gate assignments against detailed rubrics (5-6 criteria, each weighted). Must provide specific feedback pointing to what was strong and what needs improvement.

**Why Step 3.5 Flash (Primary):**
- Assignments can be long (1-2 page case studies, PRDs, analyses). Step 3.5 Flash's 256K context handles full submissions + rubric + prompt with room to spare.
- Ranked highly on academic and analytical tasks — exactly the skill set needed for rubric-based evaluation.
- Fast inference means users get feedback quickly after submitting.
- The same reasoning applies as Gap Analyzer: systematic rubric application at scale.

**Why DeepSeek V3.1 (Fallback):**
- Strongest reasoning model as backup.
- Thinking mode can be enabled for assignments that need deep evaluation.

**Expected quality:** 80-85% rubric adherence. Assignments with clear rubrics produce more consistent AI evaluation. The main risk is being too lenient — we mitigate by explicitly instructing the model to use the full score range.

---

### 7. Question Evaluator
**Task:** Evaluate PM interview practice answers. Similar to Assignment Evaluator but for shorter, more focused answers.

**Why DeepSeek V3.1 (Primary):**
- Question answers are shorter than assignments, so context isn't the constraint — quality of evaluation is.
- Each question has specific evaluation criteria (see question bank spec). DeepSeek V3.1 with thinking mode can reason through criteria systematically.
- We want to differentiate this from the Assignment Evaluator (which uses Step 3.5 Flash) to spread rate limits across providers.

**Why Step 3.5 Flash (Fallback):**
- Interchangeable quality for this task.
- If one model is rate-limited, the other takes over.

**Expected quality:** 80-85%. For interview-style questions, the evaluation criteria in our prompts are specific enough to anchor scoring.

---

### 8. Resume Optimizer
**Task:** Given a master profile and a target JD, select relevant PSI entries, generate a tailored resume, and explain the rationale for each inclusion/exclusion.

**Why Qwen3 Next 80B A3B (Primary):**
- Resume optimization is a structured selection + generation task. It needs to: parse JD keywords, match them against PSI entries, select and rank entries, then generate formatted resume content.
- Qwen3 Next is explicitly optimized for RAG and agentic workflows — and JD-to-profile matching is essentially a retrieval + generation pipeline.
- 262K context handles even detailed JDs + full master profiles.
- "No thinking traces" mode means deterministic, fast output — important for the resume builder's on-demand workflow.
- 80B total with only 3B active = extremely fast, which matters because users may regenerate resumes multiple times.

**Why Mistral Small 3.1 (Fallback):**
- Good at following structured output instructions.
- Fast and reliable for the simpler parts of resume generation.
- 128K context is sufficient for this task.

**Expected quality:** 85-90%. Resume generation is more templated than creative — the PSI entries already exist, the model is selecting and arranging them.

---

### 9. ATS Scorer
**Task:** Compare a resume against a JD for keyword matches. Evaluate formatting compliance. Return a score with breakdown.

**Why Mistral Small 3.1 (Primary):**
- ATS scoring is primarily keyword matching + formatting heuristics. This is the simplest AI task in the platform.
- 24B model is more than sufficient for: extracting keywords from a JD, checking if they appear in the resume, and scoring formatting.
- Fast. Cheap. Reliable. No need for a heavy model here.

**Why GPT-OSS 20B (Fallback):**
- Even simpler model for an even simpler task.
- 21B total, 3.6B active = near-instant responses.

**Expected quality:** 90%+. This task barely needs AI — it could be done with rules-based keyword matching. The AI layer adds natural-language keyword expansion (e.g., "stakeholder management" in JD matching "cross-functional collaboration" in resume).

---

### 10. Learning Recommender
**Task:** Select and sequence resources from the database based on user's skill gaps. Customize assignment prompts with user's domain. Mostly rule-based with light AI for domain customization.

**Why GPT-OSS 20B (Primary):**
- This is the simplest agent. The learning path is predefined, resources are in the database, and the recommendation is mostly rule-based (if skill_score < 70, include this stage).
- The only AI part is domain injection: "Your assignment is to analyze a funnel for a [user's domain] company." GPT-OSS 20B handles template filling easily.
- 21B with 3.6B active = fastest possible inference.
- Reserve heavier models for tasks that need them.

**Why Mistral Small 3.1 (Fallback):**
- Slightly more capable if domain customization needs more nuance.

**Expected quality:** 95%+. This task is nearly deterministic.

---

## Rate Limit Management Strategy

Since free models are limited to ~20 req/min and ~200 req/day per model, we need to spread load across providers.

### Onboarding Flow (per user, ~17 calls)

| Step | Agent | Model Provider | Calls |
|------|-------|---------------|-------|
| 1. Resume parse | Resume Parser | **OpenAI** (GPT-OSS 120B) | 1 |
| 2. PSI reframing (6 experiences) | PSI Reframer | **DeepSeek** (V3.1) | 6 |
| 3. Initial gap analysis | Gap Analyzer | **StepFun** (Step 3.5 Flash) | 1 |
| 4. Summary generation | Gap Analyzer | **StepFun** | (reuse) |
| 5. Conversation (8 questions) | Conversation | **Meta** (Llama 3.3 70B) | 8 |
| 6. Final gap analysis | Gap Analyzer | **StepFun** | 1 |
| **Total** | | **4 different providers** | **~17** |

**Per-provider breakdown:**
- OpenAI: 1 call (well within limits)
- DeepSeek: 6 calls (well within limits)
- StepFun: 2-3 calls (well within limits)
- Meta: 8 calls (well within limits)

**Daily capacity at 200 req/day per model:** We can theoretically onboard ~11-12 users/day on free models alone (200 ÷ 17 ≈ 11, but spread across 4 providers means effectively ~25-30/day before hitting any single model's limit).

### Ongoing Usage (per active user/day)

| Activity | Agent | Model Provider | Calls |
|----------|-------|---------------|-------|
| 1 quick check | Assignment Evaluator | **StepFun** | 1 |
| 1 question practice | Question Evaluator | **DeepSeek** | 1 |
| Score revalidation (weekly) | Gap Analyzer | **StepFun** | 0.14/day |
| **Total daily** | | | **~2-3** |

**Daily capacity for active users:** With 200 req/day per model and ~2-3 calls per active user, each model can serve ~70-100 active users/day. Across 4 providers, we can support **~200-300 DAU** on free models.

### When to Upgrade to Paid

| Signal | Action |
|--------|--------|
| Hitting rate limits consistently (>50% of requests) | Add $10-20 OpenRouter credits, use paid variants of same models |
| >300 DAU | Must move to paid models or self-hosted |
| User-facing quality complaints | Switch PSI Reframer and Evaluators to Claude Sonnet (paid) |
| Production launch | PSI Reframer + Gap Analyzer + Conversation → Claude Sonnet. Rest stay free. |

---

## Implementation Guide

### Setup

```typescript
// lib/openrouter.ts
import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL,
    'X-Title': 'PM Career Nav Platform',
  },
});

export { openrouter };
```

### Model Configuration (Swappable)

```typescript
// config/models.ts
export const MODEL_CONFIG = {
  resumeParser: {
    primary: 'openai/gpt-oss-120b:free',
    fallback: 'mistralai/mistral-small-3.1-24b-instruct:free',
    paid: 'openai/gpt-4o-mini',
  },
  psiReframer: {
    primary: 'deepseek/deepseek-chat-v3.1:free',
    fallback: 'stepfun/step-3.5-flash:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  gapAnalyzer: {
    primary: 'stepfun/step-3.5-flash:free',
    fallback: 'deepseek/deepseek-chat-v3.1:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  conversationAgent: {
    primary: 'meta-llama/llama-3.3-70b-instruct:free',
    fallback: 'openai/gpt-oss-120b:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  proficiencyEvaluator: {
    primary: 'deepseek/deepseek-chat-v3.1:free',
    fallback: 'openai/gpt-oss-120b:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  assignmentEvaluator: {
    primary: 'stepfun/step-3.5-flash:free',
    fallback: 'deepseek/deepseek-chat-v3.1:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  questionEvaluator: {
    primary: 'deepseek/deepseek-chat-v3.1:free',
    fallback: 'stepfun/step-3.5-flash:free',
    paid: 'anthropic/claude-sonnet-4-20250514',
  },
  resumeOptimizer: {
    primary: 'qwen/qwen3-next-80b-a3b-instruct:free',
    fallback: 'mistralai/mistral-small-3.1-24b-instruct:free',
    paid: 'openai/gpt-4o-mini',
  },
  atsScorer: {
    primary: 'mistralai/mistral-small-3.1-24b-instruct:free',
    fallback: 'openai/gpt-oss-20b:free',
    paid: null, // not needed
  },
  learningRecommender: {
    primary: 'openai/gpt-oss-20b:free',
    fallback: 'mistralai/mistral-small-3.1-24b-instruct:free',
    paid: null, // not needed
  },
} as const;
```

### Automatic Fallback Logic

```typescript
// lib/agent-runner.ts
import { openrouter } from './openrouter';
import { MODEL_CONFIG } from '@/config/models';

type AgentName = keyof typeof MODEL_CONFIG;

export async function runAgent(
  agentName: AgentName,
  systemPrompt: string,
  userMessage: string,
  options?: { usePaid?: boolean; temperature?: number }
) {
  const config = MODEL_CONFIG[agentName];
  const modelsToTry = options?.usePaid
    ? [config.paid, config.primary, config.fallback].filter(Boolean)
    : [config.primary, config.fallback, config.paid].filter(Boolean);

  for (const model of modelsToTry) {
    try {
      const response = await openrouter.chat.completions.create({
        model: model as string,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: options?.temperature ?? 0.3,
        response_format: { type: 'json_object' },
      });

      return {
        result: JSON.parse(response.choices[0].message.content || '{}'),
        model_used: model,
        fallback_used: model !== config.primary,
      };
    } catch (error: any) {
      console.error(`Agent ${agentName} failed on ${model}:`, error.message);
      // Rate limited or model unavailable — try next
      if (error?.status === 429 || error?.status === 503) continue;
      throw error; // Unexpected error — don't retry
    }
  }

  throw new Error(`All models failed for agent: ${agentName}`);
}
```

---

## Quality Testing Plan

Before going live, test each agent with 5 sample inputs and compare output quality across primary, fallback, and paid models.

| Test | Input | Expected Output | Pass Criteria |
|------|-------|----------------|---------------|
| Resume Parser × 5 resumes | Real resumes (varied backgrounds) | Structured JSON with all fields | All fields extracted, no hallucinated data |
| PSI Reframer × 10 experiences | Raw resume bullets | PSI JSON with reasonable reframing | Problem/Solution/Impact are coherent, no fabricated metrics |
| Gap Analyzer × 3 profiles | Full profile + taxonomy | Scores per skill + top gaps | Scores are in reasonable range, gaps make sense |
| Conversation × 2 full flows | Resume + profile data | Natural conversation, 8-12 questions | Questions are contextual, not generic |
| Assignment Evaluator × 5 submissions | Real assignments (weak, medium, strong) | Scores matching expected quality tier | Strong > Medium > Weak in all cases |
| Question Evaluator × 5 answers | PM question answers of varying quality | Calibrated scores | Clear score separation between quality tiers |
| Resume Optimizer × 3 JDs | Profile + JD | Tailored resume with rationale | Keywords matched, entries relevant to JD |

**If any free model fails testing:**
1. Try the fallback model
2. If fallback also fails, use the paid model for that agent only
3. Log which agents need paid models — this informs our cost baseline

---

## Cost Summary

| Scenario | Monthly Cost | Capacity |
|----------|-------------|----------|
| **All free models** | $0 | ~25-30 onboardings/day, ~200-300 DAU |
| **Free + paid for PSI Reframer only** | ~$30-50/month | Same capacity, higher PSI quality |
| **Free + paid for all evaluation agents** | ~$100-150/month | Same capacity, higher quality across the board |
| **All paid (Claude Sonnet + GPT-4o-mini)** | ~$450/month at 1,000 MAU | Unlimited within API limits |

**Recommendation:** Start with all free. Test quality. Selectively upgrade the agents where quality is visibly below user expectations. PSI Reframer will likely be the first to need a paid upgrade.

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Free model removed from OpenRouter | Medium | High — agent breaks | Automatic fallback logic. Multiple models per agent. Monitor OpenRouter announcements. |
| Rate limits hit during usage spike | Medium | Medium — some users wait | Spread across 5+ providers. Add $10 credits as buffer. Queue requests during peaks. |
| Model quality degrades without notice | Low | Medium — scores become unreliable | Weekly quality spot-checks. Compare 5 random evaluations against human judgment. |
| DeepSeek data privacy concern raised by user | Low | High — trust issue | Have paid Claude Sonnet fallback ready. Route sensitive data through Llama/OpenAI instead. Add data handling disclosure to terms. |
| Model availability varies by time of day | Medium | Low — higher latency | Fallback models auto-activate. Users see "loading" screen during delays. |

---

*End of Model Selection Guide*
