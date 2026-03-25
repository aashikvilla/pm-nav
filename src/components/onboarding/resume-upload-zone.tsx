"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

type Mode = "upload" | "paste"

export function ResumeUploadZone() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) return "File must be under 5MB"
    const valid = ["application/pdf", "text/plain"]
    if (!valid.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      return "Only PDF and .txt files are supported"
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setSelectedFile(file)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      let response: Response

      if (mode === "paste") {
        if (!pastedText.trim() || pastedText.trim().length < 100) {
          setError("Please paste your resume text (minimum 100 characters)")
          setIsSubmitting(false)
          return
        }
        response = await fetch("/api/v1/onboarding/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pastedText }),
        })
      } else {
        if (!selectedFile) {
          setError("Please select a file or switch to text paste mode")
          setIsSubmitting(false)
          return
        }
        const formData = new FormData()
        formData.append("file", selectedFile)
        response = await fetch("/api/v1/onboarding/parse-resume", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to parse resume")
      }

      router.push("/onboarding/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode toggle */}
      <div className="flex bg-[var(--color-surface-container-low)] rounded-full p-1 w-fit">
        <button
          onClick={() => setMode("upload")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "upload"
              ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm"
              : "text-[var(--color-on-surface-variant)]"
          }`}
        >
          Upload file
        </button>
        <button
          onClick={() => setMode("paste")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "paste"
              ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm"
              : "text-[var(--color-on-surface-variant)]"
          }`}
        >
          Paste text
        </button>
      </div>

      {/* Upload zone */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={onFileChange}
            className="hidden"
          />
          {selectedFile ? (
            <div className="rounded-2xl bg-[var(--color-primary-fixed)] p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                <span className="text-white text-sm">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{selectedFile.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{formatBytes(selectedFile.size)}</p>
              </div>
              <button
                onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`w-full rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                isDragging
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-fixed)]"
                  : "border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-fixed)]"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-2xl">
                  📎
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    Drop your resume here, or <span className="text-[var(--color-primary)]">browse</span>
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">PDF or TXT · Max 5MB</p>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Paste zone */}
      {mode === "paste" && (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your resume text here — job titles, responsibilities, achievements..."
          rows={12}
          className="w-full rounded-2xl bg-[var(--color-surface-container-lowest)] p-5 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200"
        />
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary)] text-white rounded-full py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Analyzing your resume..." : "Analyze my resume →"}
      </button>
    </div>
  )
}
