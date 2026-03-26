import OpenAI from "openai"
import { logger } from "@/lib/logger"

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    "X-Title": "PM Career Nav Platform",
  },
})

// ─── Per-agent model config ───────────────────────────────────────────────────
// Primary spreads load across different providers to avoid rate limits.
// Fallback uses a different provider than primary.
// See docs/spec/model-selection-guide.md for full justification.

// Available free models (verified 2026-03-26):
// nvidia/nemotron-3-super-120b-a12b:free  — 262K ctx, strong reasoning
// stepfun/step-3.5-flash:free             — 256K ctx, fast structured output
// minimax/minimax-m2.5:free               — 196K ctx, good conversational
// nvidia/nemotron-3-nano-30b-a3b:free     — 256K ctx, lightweight
// arcee-ai/trinity-large-preview:free     — 131K ctx, general purpose

export const MODEL_CONFIG = {
  resumeParser: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: null,
  },
  psiReframer: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "minimax/minimax-m2.5:free",
    paid: null,
  },
  gapAnalyzer: {
    primary: "stepfun/step-3.5-flash:free",
    fallback: "nvidia/nemotron-3-super-120b-a12b:free",
    paid: null,
  },
  conversationAgent: {
    primary: "minimax/minimax-m2.5:free",
    fallback: "nvidia/nemotron-3-super-120b-a12b:free",
    paid: null,
  },
  proficiencyEvaluator: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: null,
  },
  assignmentEvaluator: {
    primary: "stepfun/step-3.5-flash:free",
    fallback: "nvidia/nemotron-3-super-120b-a12b:free",
    paid: null,
  },
  questionEvaluator: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: null,
  },
  resumeOptimizer: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "minimax/minimax-m2.5:free",
    paid: null,
  },
  atsScorer: {
    primary: "stepfun/step-3.5-flash:free",
    fallback: "nvidia/nemotron-3-nano-30b-a3b:free",
    paid: null,
  },
  learningRecommender: {
    primary: "arcee-ai/trinity-large-preview:free",
    fallback: "nvidia/nemotron-3-nano-30b-a3b:free",
    paid: null,
  },
} as const

export type AgentName = keyof typeof MODEL_CONFIG

// ─── Core chat function with automatic fallback ───────────────────────────────

export async function orChat(
  agentName: AgentName,
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  opts?: {
    maxTokens?: number
    temperature?: number
    jsonMode?: boolean
    usePaid?: boolean
  },
): Promise<string> {
  const config = MODEL_CONFIG[agentName]
  const modelsToTry = opts?.usePaid
    ? ([config.paid, config.primary, config.fallback] as (string | null)[]).filter(Boolean)
    : ([config.primary, config.fallback, config.paid] as (string | null)[]).filter(Boolean)

  let lastError: unknown

  for (const model of modelsToTry as string[]) {
    try {
      logger.info(`[OpenRouter] Calling agent=${agentName} model=${model}`)

      const response = await openrouter.chat.completions.create({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: opts?.maxTokens ?? 4096,
        temperature: opts?.temperature ?? 0.3,
        ...(opts?.jsonMode ? { response_format: { type: "json_object" } } : {}),
      })

      const content = response.choices[0]?.message?.content ?? ""

      // Empty response = model didn't produce output; try fallback
      if (!content.trim()) {
        logger.warn(`[OpenRouter] agent=${agentName} model=${model} returned empty response, trying next`)
        lastError = new Error(`Empty response from ${model}`)
        continue
      }

      logger.info(`[OpenRouter] Success agent=${agentName} model=${model} chars=${content.length}`)
      return content
    } catch (error: any) {
      const status = error?.status ?? error?.statusCode
      logger.warn(`[OpenRouter] agent=${agentName} model=${model} failed status=${status} msg=${error?.message}`)
      lastError = error

      // Retry on rate-limit, provider unavailability, or invalid model
      if (status === 429 || status === 503 || status === 502 || status === 400) continue

      // Unexpected error — don't try fallbacks
      throw error
    }
  }

  throw lastError ?? new Error(`All models failed for agent: ${agentName}`)
}
