export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Public Profile</h1>
      <p className="text-sm text-[var(--color-on-surface-variant)]">Coming soon — feature in development.</p>
    </div>
  )
}
