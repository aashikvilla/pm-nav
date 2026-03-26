// Model: deepseek/deepseek-chat-v3.1:free (primary) → mistralai/mistral-small-3.1-24b-instruct:free (fallback)
// Rationale: Quick checks are short, focused prompts. DeepSeek V3.1 gives nuanced feedback
// for brief conceptual answers. Different provider split from assignment-evaluator.
import { orChat } from "@/lib/ai/openrouter"

interface QuickCheckInput {
  subtopicTitle: string
  quickCheckPrompt: string
  userResponse: string
}

interface QuickCheckResult {
  passed: boolean
  feedback: string
  strengthAreas: string[]
  improvementAreas: string[]
}

const SYSTEM_PROMPT = `You are a supportive PM learning coach evaluating a quick knowledge check.
Be encouraging but honest. If the answer shows understanding of the core concept, mark as passed.
Only fail if the answer misses fundamental concepts or is too vague to demonstrate understanding.
Return ONLY valid JSON.`

export async function evaluateQuickCheck(input: QuickCheckInput): Promise<QuickCheckResult> {
  const prompt = `Topic: ${input.subtopicTitle}
Quick Check Question: ${input.quickCheckPrompt}

Student's Response:
${input.userResponse}

Evaluate whether the student demonstrates understanding of this PM concept.
Return JSON: {"passed":boolean,"feedback":string,"strengthAreas":string[],"improvementAreas":string[]}`

  const response = await orChat("questionEvaluator", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    jsonMode: true,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as QuickCheckResult
  } catch {
    throw new Error("Failed to parse quick check evaluation JSON from AI response: " + response)
  }
}
