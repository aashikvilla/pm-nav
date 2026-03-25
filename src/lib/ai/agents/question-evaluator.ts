import { claudeChat } from "@/lib/ai/anthropic"

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

  const response = await claudeChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }])
  try {
    return JSON.parse(response) as QuestionEvalResult
  } catch {
    throw new Error("Failed to parse question evaluation JSON")
  }
}
