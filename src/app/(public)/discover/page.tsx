"use client"

import Link from "next/link"
import { useState } from "react"

type RoleType = "consumer" | "growth" | "technical" | "platform" | "ai" | "b2b"
type Scores = Record<RoleType, number>

interface Question {
  text: string
  options: {
    label: string
    scores: Partial<Scores>
  }[]
}

const QUESTIONS: Question[] = [
  {
    text: "What energizes you most?",
    options: [
      { label: "Understanding users deeply", scores: { consumer: 2 } },
      { label: "Growth experiments & data", scores: { growth: 2 } },
      { label: "Solving technical puzzles", scores: { technical: 2 } },
      { label: "Building platforms others build on", scores: { platform: 2 } },
    ],
  },
  {
    text: "Pick your ideal Friday win:",
    options: [
      { label: "Shipped a feature users love", scores: { consumer: 2 } },
      { label: "Hit a conversion target", scores: { growth: 2 } },
      { label: "Solved a gnarly system design problem", scores: { technical: 2, ai: 1 } },
      { label: "Closed an enterprise deal", scores: { b2b: 2 } },
    ],
  },
  {
    text: "Your go-to superpower:",
    options: [
      { label: "Empathy & user intuition", scores: { consumer: 2, b2b: 1 } },
      { label: "Analytical rigor", scores: { growth: 2, ai: 1 } },
      { label: "Technical depth", scores: { technical: 2, platform: 1 } },
      { label: "Stakeholder alignment", scores: { b2b: 2 } },
    ],
  },
  {
    text: "Preferred data source:",
    options: [
      { label: "User interviews & session recordings", scores: { consumer: 2 } },
      { label: "Dashboards & funnels", scores: { growth: 2 } },
      { label: "System logs & architecture diagrams", scores: { technical: 2, platform: 1 } },
      { label: "CRM & sales calls", scores: { b2b: 2 } },
    ],
  },
  {
    text: "Dream project:",
    options: [
      { label: "Consumer app millions use daily", scores: { consumer: 2 } },
      { label: "ML-powered recommendation engine", scores: { ai: 2, technical: 1 } },
      { label: "Developer API used by thousands", scores: { platform: 2, technical: 1 } },
      { label: "Enterprise SaaS product", scores: { b2b: 2 } },
    ],
  },
  {
    text: "How do you make decisions?",
    options: [
      { label: "User research & testing", scores: { consumer: 2 } },
      { label: "A/B tests & metrics", scores: { growth: 2 } },
      { label: "Technical feasibility & tradeoffs", scores: { technical: 2 } },
      { label: "Business cases & ROI", scores: { b2b: 2, growth: 1 } },
    ],
  },
  {
    text: "Weekend reading:",
    options: [
      { label: "Design blogs & product teardowns", scores: { consumer: 2 } },
      { label: "Growth case studies", scores: { growth: 2 } },
      { label: "AI/ML research papers", scores: { ai: 2 } },
      { label: "Industry analysis & market reports", scores: { b2b: 2, platform: 1 } },
    ],
  },
]

const ROLE_DESCRIPTIONS: Record<RoleType, { title: string; description: string; detail: string }> = {
  consumer: {
    title: "Consumer PM",
    description: "You live and breathe user experience. Your superpower is deep empathy.",
    detail:
      "Consumer PMs ship products that millions of people use daily. You obsess over the full user journey — from first impression to habitual use. Companies like Spotify, Duolingo, and Airbnb are where you thrive.",
  },
  growth: {
    title: "Growth PM",
    description: "You're data-obsessed and experiment-driven. Funnels are your canvas.",
    detail:
      "Growth PMs move the needle on activation, retention, and revenue. You run dozens of experiments, interpret ambiguous data, and turn insights into compounding loops. Ideal at companies with large user bases and optimization-first cultures.",
  },
  technical: {
    title: "Technical PM",
    description: "You bridge engineering and product. Complex systems excite you.",
    detail:
      "Technical PMs earn deep respect from engineering teams. You can read code, debate architecture, and translate hard constraints into product decisions. Fintech, infrastructure, and developer tools are your natural habitat.",
  },
  platform: {
    title: "Platform PM",
    description: "You build for builders. APIs, SDKs, and developer experience are your domain.",
    detail:
      "Platform PMs think in ecosystems. Your customer is the developer, and your product is the foundation others build on. You measure success in integrations shipped and partners enabled — not just end users.",
  },
  ai: {
    title: "AI/ML PM",
    description: "You're at the frontier. You thrive where technology meets ambiguity.",
    detail:
      "AI/ML PMs operate at the edge of what's possible. You're comfortable with probabilistic outputs, model evaluation, and the unique UX challenges of intelligent systems. The demand for this role is growing faster than any other PM track.",
  },
  b2b: {
    title: "B2B/Enterprise PM",
    description: "You understand businesses buying software. Revenue and relationships drive you.",
    detail:
      "B2B PMs balance the needs of buyers, users, and internal stakeholders simultaneously. You think in contracts and deal sizes, not just DAUs. Your impact is measured in ARR, churn reduction, and enterprise renewals.",
  },
}

const ROLE_COLORS: Record<RoleType, string> = {
  consumer: "bg-[var(--color-primary)]",
  growth: "bg-emerald-600",
  technical: "bg-slate-700",
  platform: "bg-violet-600",
  ai: "bg-rose-600",
  b2b: "bg-amber-700",
}

function calculateResult(answers: Partial<Scores>[]): RoleType {
  const totals: Scores = { consumer: 0, growth: 0, technical: 0, platform: 0, ai: 0, b2b: 0 }
  for (const answer of answers) {
    for (const [role, pts] of Object.entries(answer) as [RoleType, number][]) {
      totals[role] = (totals[role] ?? 0) + pts
    }
  }
  return (Object.entries(totals) as [RoleType, number][]).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
}

export default function DiscoverPage() {
  const [step, setStep] = useState(0) // 0 = intro, 1-7 = questions, 8 = result
  const [answers, setAnswers] = useState<Partial<Scores>[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  const currentQuestion = step >= 1 && step <= 7 ? QUESTIONS[step - 1] : null
  const isResult = step === 8
  const result = isResult ? calculateResult(answers) : null
  const roleInfo = result ? ROLE_DESCRIPTIONS[result] : null

  function handleStart() {
    setStep(1)
  }

  function handleSelect(idx: number) {
    setSelected(idx)
  }

  function handleNext() {
    if (selected === null || !currentQuestion) return
    setAnimating(true)
    const scoreContribution = currentQuestion.options[selected].scores
    const newAnswers = [...answers, scoreContribution]
    setTimeout(() => {
      setAnswers(newAnswers)
      setSelected(null)
      setStep((s) => s + 1)
      setAnimating(false)
    }, 250)
  }

  function handleRestart() {
    setStep(0)
    setAnswers([])
    setSelected(null)
  }

  const progress = step === 0 ? 0 : isResult ? 100 : Math.round(((step - 1) / 7) * 100)

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Nav */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/20">
        <div className="flex items-center justify-between px-6 h-16 max-w-3xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
            Loomis
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-[var(--color-primary)] text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Intro */}
          {step === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center bg-[var(--color-secondary-fixed)] px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
                Discovery Quiz
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-on-surface)] mb-6 leading-tight">
                What kind of PM are you?
              </h1>
              <p className="text-lg text-[var(--color-on-surface-variant)] max-w-xl mx-auto leading-relaxed mb-12">
                7 questions. 2 minutes. Find out which PM archetype matches your strengths, instincts, and working style.
              </p>
              <button
                onClick={handleStart}
                className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Start the Quiz
              </button>
              <p className="mt-6 text-xs text-[var(--color-on-surface-variant)]">No account required</p>
            </div>
          )}

          {/* Questions */}
          {currentQuestion && (
            <div className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
              {/* Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-widest">
                    Question {step} of 7
                  </span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 shadow-[var(--shadow-ambient)]">
                <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-8">
                  {currentQuestion.text}
                </h2>

                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 ${
                        selected === idx
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-on-surface)]"
                          : "border-transparent bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-on-surface)]"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className="w-full bg-[var(--color-primary)] text-white py-3.5 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {step === 7 ? "See My Result" : "Next Question"}
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {isResult && result && roleInfo && (
            <div className="py-8">
              <div className="text-center mb-10">
                <p className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-3">
                  Your PM Type
                </p>
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${ROLE_COLORS[result]} text-white text-3xl font-black mb-6`}
                >
                  {result[0].toUpperCase()}
                </div>
                <h1 className="text-4xl font-bold text-[var(--color-on-surface)] mb-3">{roleInfo.title}</h1>
                <p className="text-xl text-[var(--color-on-surface-variant)] mb-6">{roleInfo.description}</p>
              </div>

              <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 shadow-[var(--shadow-ambient)] mb-8">
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-base">{roleInfo.detail}</p>
              </div>

              <div className="bg-[var(--color-secondary-fixed)] rounded-2xl p-8 mb-6">
                <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-2">
                  Ready to start your PM journey?
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                  Loomis builds a personalized learning path based on your background and target role type. No generic advice — just what you actually need.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="flex-1 bg-[var(--color-primary)] text-white px-6 py-3.5 rounded-full font-semibold text-center hover:opacity-90 transition-opacity"
                  >
                    Get Started — Free
                  </Link>
                  <button
                    onClick={handleRestart}
                    className="flex-1 bg-white text-[var(--color-on-surface-variant)] px-6 py-3.5 rounded-full font-semibold text-center hover:bg-[var(--color-surface-container-low)] transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-[var(--color-on-surface-variant)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
