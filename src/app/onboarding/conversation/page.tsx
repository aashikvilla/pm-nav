"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
}

const OPENER = "Hi! I've reviewed your resume and have a good picture of your background. I want to ask you a few questions to surface PM experience that might not be obvious from your resume. Ready to start?"

export default function OnboardingConversationPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: OPENER },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [turnCount, setTurnCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput("")
    setError(null)
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setIsLoading(true)

    try {
      const res = await fetch("/api/v1/onboarding/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const data = await res.json()
      setSessionId(data.sessionId)
      setTurnCount(data.turnCount)
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])

      if (data.isComplete) {
        setTimeout(() => router.push("/onboarding/summary"), 2000)
      }
    } catch {
      setError("Failed to send message. Please try again.")
      setMessages((prev) => prev.slice(0, -1))
      setInput(text)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const MAX_TURNS = 8

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--color-surface-container-lowest)] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[var(--color-on-surface)]">Skills deep-dive</h1>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Helping surface PM experience not on your resume
          </p>
        </div>
        {turnCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: MAX_TURNS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i < turnCount ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-container)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--color-on-surface-variant)]">
              {turnCount}/{MAX_TURNS}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary-fixed)] flex items-center justify-center text-xs mr-3 shrink-0 mt-0.5">
                🤖
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--color-primary)] text-white rounded-br-sm"
                  : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary-fixed)] flex items-center justify-center text-xs mr-3 shrink-0">
              🤖
            </div>
            <div className="bg-[var(--color-surface-container-low)] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-on-surface-variant)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-on-surface-variant)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-on-surface-variant)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 text-center bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-[var(--color-surface-container-lowest)] shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your answer... (Enter to send)"
            rows={2}
            disabled={isLoading}
            className="flex-1 resize-none rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8L2 2l2 6-2 6 12-6z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-2 text-center">
          Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
