// Model: REASONING (nousresearch/hermes-3-llama-3.1-405b:free)
// Rationale: PM interview answer evaluation requires understanding what "good"
// looks like in PM interviews across 7 question categories (product sense,
// analytical, strategy, behavioral, technical, estimation, execution). Hermes
// 405B's deep reasoning gives it the ability to identify nuanced PM thinking
// patterns that distinguish strong answers from surface-level ones.
import { orChat, MODELS } from "@/lib/ai/openrouter"

interface QuestionEvalInput {
  question: string
  category: string
  evaluationCriteria: { criterion: string; points: number }[]
  keyPoints: string[]
  userResponse: string
}

interface QuestionEvalResult {
  totalScore: number
  breakdown: { criterion: string; score: number; maxPoints: number; comment: string }[]
  feedback: string
  missedKeyPoints: string[]
  strongPoints: string[]
}

const SYSTEM_PROMPT = `You are a PM interview coach evaluating a candidate's answer to a PM interview question.
Be honest and constructive. Score against criteria. Return ONLY valid JSON.`

export async function evaluateQuestion(input: QuestionEvalInput): Promise<QuestionEvalResult> {
  const criteriaText = input.evaluationCriteria.map((c) => `- ${c.criterion}: ${c.points} pts`).join("\n")
  const keyPointsText = input.keyPoints.join("\n- ")

  const prompt = `Question (${input.category}): ${input.question}

Evaluation criteria:
${criteriaText}

Key points a strong answer should cover:
- ${keyPointsText}

Candidate's answer:
${input.userResponse}

Return JSON: {"totalScore":number,"breakdown":[{"criterion":string,"score":number,"maxPoints":number,"comment":string}],"feedback":string,"missedKeyPoints":string[],"strongPoints":string[]}`

  const response = await orChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    model: MODELS.REASONING,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as QuestionEvalResult
  } catch {
    throw new Error("Failed to parse question evaluation JSON from AI response: " + response)
  }
}
