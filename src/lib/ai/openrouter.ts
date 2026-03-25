import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    "X-Title": "PM Nav",
  },
})

/**
 * Model selection rationale:
 *
 * REASONING — nousresearch/hermes-3-llama-3.1-405b:free
 *   405B parameters, Nous Hermes fine-tuned for "advanced agentic capabilities,
 *   nuanced reasoning, and roleplaying." Best free model for tasks that require
 *   deep domain understanding: PSI reframing (PM coaching), gap scoring (0-100
 *   calibration across 10 skills), and assignment/question evaluation (rubric
 *   interpretation). Context: 131K.
 *
 * STRUCTURED — meta-llama/llama-3.3-70b-instruct:free
 *   Meta's latest 70B flagship, top benchmark scores for instruction-following
 *   and structured JSON output. Chosen for resume parsing (schema extraction),
 *   conversation (optimised for "multilingual dialogue use cases"), and resume
 *   optimisation (ATS keyword transformation). Faster than 405B — better for
 *   real-time / high-frequency calls. Context: 131K.
 */
export const MODELS = {
  REASONING: "nousresearch/hermes-3-llama-3.1-405b:free",
  STRUCTURED: "meta-llama/llama-3.3-70b-instruct:free",
} as const

export type ModelKey = keyof typeof MODELS

/**
 * Single chat function for all agents.
 * systemPrompt is injected as the system role.
 * messages is the conversation history (user/assistant turns).
 */
export async function orChat(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  opts?: { model?: string; maxTokens?: number },
): Promise<string> {
  const response = await client.chat.completions.create({
    model: opts?.model ?? MODELS.STRUCTURED,
    max_tokens: opts?.maxTokens ?? 4096,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  })
  return response.choices[0].message.content ?? ""
}
