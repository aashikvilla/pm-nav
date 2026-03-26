import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/20">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <span className="text-xl font-bold tracking-tight text-[var(--color-primary)]">Loomis</span>
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

      <main className="pt-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center bg-[var(--color-secondary-fixed)] text-[var(--color-secondary-fixed-text)] px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase">
            The Honest Path
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-on-surface)] mb-8 leading-[1.1]">
            Your first PM role shouldn&apos;t be a{" "}
            <span className="text-[var(--color-primary)]">guessing game.</span>
          </h1>

          <p className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto leading-relaxed mb-12">
            We don&apos;t sell you &ldquo;guaranteed six-figure offers&rdquo; or secret hacks. We provide the
            methodical, architectural strategy required to break into Product Management through genuine
            skill and clinical preparation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="bg-[var(--color-secondary-fixed)] text-[var(--color-on-surface)] px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Take the Discovery Quiz
            </Link>
            <Link
              href="/signup"
              className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Bento grid */}
        <section className="max-w-6xl mx-auto px-6 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large narrative card */}
            <div className="md:col-span-7 bg-[var(--color-surface-container-lowest)] p-10 rounded-2xl shadow-[var(--shadow-ambient)] flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">We don&apos;t just sell you a course.</h3>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-lg mb-8">
                  Most bootcamps treat career changes like a factory line. They give you a template, a
                  badge, and send you on your way.
                  <br />
                  <br />
                  Loomis is a career architecture firm. We help you deconstruct your current experience
                  and rebuild it into a high-performance PM narrative that resonates with hiring managers
                  at companies like Stripe, Linear, and Notion.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-8 border-t border-[var(--color-outline-variant)]/10">
                <div className="w-12 h-12 bg-[var(--color-primary-fixed)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--color-primary)] text-lg font-bold">M</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Methodical Accuracy</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Built by Senior PMs for future PMs.</p>
                </div>
              </div>
            </div>

            {/* Accent cards */}
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              <div className="bg-[var(--color-primary)] text-white p-8 rounded-2xl flex flex-col justify-center">
                <div className="text-3xl mb-4">🔬</div>
                <h4 className="text-xl font-bold mb-2">Clinical Preparation</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  No fluff. No filler. Just the technical and behavioral frameworks that actually work in
                  modern interviews.
                </p>
              </div>
              <div className="bg-[var(--color-secondary-fixed)] text-[var(--color-secondary-fixed-text)] p-8 rounded-2xl flex flex-col justify-center">
                <div className="text-3xl mb-4">🧠</div>
                <h4 className="text-xl font-bold mb-2">The Honest Truth</h4>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
                  We tell you what you&apos;re missing, not what you want to hear. Real growth starts with
                  real feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="how-it-works" className="bg-[var(--color-surface-container-low)] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">The Strategic Architecture</h2>
              <p className="text-[var(--color-on-surface-variant)]">
                Four phases of career transformation, zero shortcuts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Dashed connector */}
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-[var(--color-outline-variant)]/30 z-0" />

              {[
                { num: "01", title: "Audit", desc: "A deep dive into your existing skills and identifying the exact PM archetype you fit into." },
                { num: "02", title: "Rebuild", desc: "Crafting your resume and LinkedIn not just to 'look good', but to pass the PM smell test." },
                { num: "03", title: "Execute", desc: "Rigorous mock interviews and case study preparation using real-world product briefs." },
                { num: "04", title: "Secure", desc: "Negotiation strategy and onboarding support for your first 90 days in the new role.", highlight: true },
              ].map((step) => (
                <div
                  key={step.num}
                  className="relative z-10 bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[var(--shadow-ambient)]"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black mb-6 text-sm ${
                      step.highlight
                        ? "bg-[var(--color-primary)] text-white shadow-lg"
                        : "bg-[var(--color-surface)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/5"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h5 className="font-bold mb-2">{step.title}</h5>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before / After */}
        <section className="max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">See the transformation</h2>
            <p className="text-[var(--color-on-surface-variant)]">
              We extract PM skills you didn&apos;t know you had.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-surface-container-low)] p-8 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4">
                Before — Raw resume bullet
              </p>
              <p className="text-[var(--color-on-surface-variant)] italic leading-relaxed">
                &ldquo;Resolved UI related bugs and validations for insurance product configuration
                module.&rdquo;
              </p>
            </div>
            <div className="bg-[var(--color-primary-fixed)] p-8 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] mb-4">
                After — PSI reframe
              </p>
              <div className="space-y-3 text-sm text-[var(--color-on-surface)] leading-relaxed">
                <p>
                  <strong>Problem:</strong> Manual insurance product configuration was slow and
                  inflexible, blocking rapid product releases.
                </p>
                <p>
                  <strong>Solution:</strong> Built a low-code configuration platform enabling business
                  teams to make real-time changes without engineering.
                </p>
                <p>
                  <strong>Impact:</strong> Reduced development time by 90%, enabling product launches in
                  8–12 weeks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-40 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready for an honest conversation?</h2>
          <p className="text-[var(--color-on-surface-variant)] text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Join focused professionals who value precision over hype. No spam, no false promises. Just a
            clear path to your next career milestone.
          </p>
          <div className="bg-[var(--color-surface-container)] px-12 py-16 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Link
                href="/signup"
                className="flex-grow bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold text-center hover:opacity-90 transition-opacity"
              >
                Get Started — Free
              </Link>
            </div>
            <p className="mt-6 text-xs text-[var(--color-on-surface-variant)] uppercase tracking-widest font-medium">
              Join 2,400+ aspiring product managers
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-outline-variant)]/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-black tracking-tighter text-[var(--color-primary)] mb-1">
              Loomis
            </span>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              The Methodical Architect of PM Careers.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-[var(--color-on-surface-variant)]">
            <Link href="/dashboard/learning" className="hover:text-[var(--color-primary)] transition-colors">
              Learning Path
            </Link>
            <Link href="/dashboard/resume" className="hover:text-[var(--color-primary)] transition-colors">
              Resume Builder
            </Link>
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
              Support
            </a>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em]">
            © 2025 Loomis. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
