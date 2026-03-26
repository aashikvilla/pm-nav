// Model: deepseek/deepseek-chat-v3.1:free (primary) → stepfun/step-3.5-flash (fallback)
// Rationale: PSI reframing is the hardest agent task — contextual inference + PM-lens creative writing.
// DeepSeek V3.1 is the strongest free reasoning model. Step 3.5 Flash covers DeepSeek rate limits
// from a different provider (StepFun vs DeepSeek).
import { orChat } from "@/lib/ai/openrouter"

interface WorkBullet {
  company: string
  title: string
  bullet: string
  context?: string
}

interface PsiResult {
  problem: string
  solution: string
  impact: string
  confidenceScore: number
  skillsHinted: string[]
}

const SYSTEM_PROMPT = `You are an expert PM career coach. Your job is to reframe work experiences into PM-relevant PSI (Problem → Solution → Impact) format.

Rules:
- Extract the ACTUAL problem being solved (user/business pain, not technical task)
- Describe the solution in terms of PRODUCT decisions, not just implementation
- Frame impact in terms of user/business outcomes with numbers where possible
- Confidence score 0-100: how strong is the PM signal in this bullet
- skillsHinted: list PM skill slugs from: product-thinking, user-research, data-analysis, prioritization, stakeholder-management, technical-acumen, execution, communication, business-acumen, leadership

Return ONLY valid JSON array. No markdown.`

/**
 * Batch reframe multiple bullets in a single API call to minimize token usage.
 * Returns results in the same order as the input array.
 * Falls back gracefully — any failed parse returns a low-confidence placeholder.
 */
export async function reframeBatch(bullets: WorkBullet[]): Promise<PsiResult[]> {
  if (bullets.length === 0) return []

  const prompt = bullets
    .map(
      (b, i) =>
        `[${i}] Company: ${b.company} | Role: ${b.title} | Experience: ${b.bullet}${b.context ? ` | Context: ${b.context}` : ""}`,
    )
    .join("\n")

  const response = await orChat(
    "psiReframer",
    SYSTEM_PROMPT,
    [
      {
        role: "user",
        content: `Reframe these ${bullets.length} work experiences into PSI format.\n\n${prompt}\n\nReturn JSON array with ${bullets.length} objects, one per entry in order:\n[{"problem":string,"solution":string,"impact":string,"confidenceScore":number,"skillsHinted":string[]},...]`,
      },
    ],
    { maxTokens: 300 * bullets.length },
  )

  try {
    // Try code block first, then raw response, then find first JSON array
    const codeBlock = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const arrayMatch = response.match(/\[[\s\S]*\]/)
    const jsonStr = codeBlock ? codeBlock[1] : arrayMatch ? arrayMatch[0] : response.trim()
    const parsed = JSON.parse(jsonStr) as PsiResult[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return bullets.map((_, i) => parsed[i] ?? fallback())
    }
  } catch {
    // ignore parse errors
  }

  return bullets.map(fallback)
}

function fallback(): PsiResult {
  return { problem: "", solution: "", impact: "", confidenceScore: 0, skillsHinted: [] }
}

/** Single-bullet convenience wrapper. */
export async function reframeToPsi(bullet: WorkBullet): Promise<PsiResult> {
  const results = await reframeBatch([bullet])
  return results[0]
}
