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

export const MODEL_CONFIG = {
  resumeParser: {
    primary: "mistralai/mistral-small-3.1-24b-instruct:free",
    fallback: "meta-llama/llama-3.3-70b-instruct:free",
    paid: "openai/gpt-4o-mini",
  },
  psiReframer: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  gapAnalyzer: {
    primary: "stepfun/step-3.5-flash:free",
    fallback: "nvidia/nemotron-3-super-120b-a12b:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  conversationAgent: {
    primary: "meta-llama/llama-3.3-70b-instruct:free",
    fallback: "mistralai/mistral-small-3.1-24b-instruct:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  proficiencyEvaluator: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  assignmentEvaluator: {
    primary: "stepfun/step-3.5-flash:free",
    fallback: "nvidia/nemotron-3-super-120b-a12b:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  questionEvaluator: {
    primary: "nvidia/nemotron-3-super-120b-a12b:free",
    fallback: "stepfun/step-3.5-flash:free",
    paid: "anthropic/claude-sonnet-4-20250514",
  },
  resumeOptimizer: {
    primary: "qwen/qwen3-next-80b-a3b-instruct:free",
    fallback: "mistralai/mistral-small-3.1-24b-instruct:free",
    paid: "openai/gpt-4o-mini",
  },
  atsScorer: {
    primary: "mistralai/mistral-small-3.1-24b-instruct:free",
    fallback: "openai/gpt-oss-20b:free",
    paid: null,
  },
  learningRecommender: {
    primary: "openai/gpt-oss-20b:free",
    fallback: "mistralai/mistral-small-3.1-24b-instruct:free",
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
        max_tokens: opts?.maxTokens ?? 2048,
        temperature: opts?.temperature ?? 0.3,
        ...(opts?.jsonMode ? { response_format: { type: "json_object" } } : {}),
      })

      const content = response.choices[0]?.message?.content ?? ""
      logger.info(`[OpenRouter] Success agent=${agentName} model=${model} chars=${content.length}`)
      return content
    } catch (error: any) {
      const status = error?.status ?? error?.statusCode
      logger.warn(`[OpenRouter] agent=${agentName} model=${model} failed status=${status} msg=${error?.message}`)
      lastError = error

      // Only retry on rate-limit or provider unavailability
      if (status === 429 || status === 503 || status === 502) continue

      // Unexpected error — don't try fallbacks
      throw error
    }
  }

  throw lastError ?? new Error(`All models failed for agent: ${agentName}`)
}
