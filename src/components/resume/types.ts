export interface JdItem {
  id: string
  title: string
  company: string | null
  keywords: string[]
  createdAt: string
}

export interface ResumeContent {
  summary: string
  bullets: { original: string; optimized: string; keywords: string[] }[]
  profile: {
    fullName: string
    email: string
    linkedinUrl: string
    currentRole: string
  }
}

export interface ResumeVersionItem {
  id: string
  title: string
  atsScore: number | null
  keywordMatch: { matched: string[]; missing: string[] } | null
  content: ResumeContent
  createdAt: string
  jd: { id: string; title: string; company: string | null } | null
}
