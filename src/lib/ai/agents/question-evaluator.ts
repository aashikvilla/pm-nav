// Model: deepseek/deepseek-chat-v3.1:free (primary) → stepfun/step-3.5-flash (fallback)
// Rationale: Question evaluation needs nuanced rubric reasoning to distinguish strong vs
// surface-level PM answers. DeepSeek V3.1 has near-o1 reasoning quality. Using DeepSeek
// here (vs StepFun for assignment-evaluator) splits load across providers.
import { orChat } from "@/lib/ai/openrouter"

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

  const response = await orChat("questionEvaluator", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    jsonMode: true,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as QuestionEvalResult
  } catch {
    throw new Error("Failed to parse question evaluation JSON from AI response: " + response)
  }
}
