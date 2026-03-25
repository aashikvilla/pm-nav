type GapExplanations = Record<string, Record<string, string>>;

export const gapExplanations: GapExplanations = {
  consumer: {
    "product-thinking": "Consumer PMs live and die by product intuition — you need to deeply understand what users want before they know it themselves.",
    "analytical-data": "Consumer products are driven by engagement metrics and retention loops; data fluency is non-negotiable at this level.",
    "user-understanding": "Consumer PMs must be obsessive about user empathy — your entire job is to understand and serve millions of diverse users.",
    "technical-acumen": "You don't need to code, but understanding technical constraints helps you ship faster and earn engineering trust.",
    "communication-influence": "Consumer PMs coordinate across design, engineering, marketing, and legal — clear communication is your primary tool.",
    "execution-delivery": "Shipping consistently and on time is what separates good consumer PMs from great ones.",
    "business-acumen": "Consumer products must generate revenue; understanding monetization and unit economics is essential for roadmap decisions.",
    "leadership-collaboration": "Leading cross-functional teams without direct authority is the core challenge of every consumer PM role.",
  },
  growth: {
    "product-thinking": "Growth PMs need sharp product instincts to identify which levers actually move the needle on acquisition and retention.",
    "analytical-data": "Growth is fundamentally a data discipline — A/B testing, funnel analysis, and cohort metrics are your daily tools.",
    "user-understanding": "Understanding why users drop off or convert is the foundation of every growth experiment you'll run.",
    "technical-acumen": "Growth PMs work closely with data engineers and ML teams; technical fluency accelerates your experimentation velocity.",
    "communication-influence": "Growth work spans marketing, product, and engineering — you need to align stakeholders around experiment results and priorities.",
    "execution-delivery": "Growth PMs ship dozens of experiments per quarter; execution speed and rigor directly impact your impact.",
    "business-acumen": "Growth is ultimately about business metrics — CAC, LTV, and payback period should be second nature to you.",
    "leadership-collaboration": "Growth teams are cross-functional by nature; your ability to lead without authority determines your team's output.",
  },
  technical: {
    "product-thinking": "Technical PMs must balance deep system thinking with user-facing product sense — both are required to build great platform products.",
    "analytical-data": "Technical products require rigorous metrics around reliability, latency, and developer experience alongside user metrics.",
    "user-understanding": "Your users are often developers or internal teams — understanding their workflows and pain points is just as critical as consumer research.",
    "technical-acumen": "This is your primary differentiator as a Technical PM — deep system design and API knowledge is what earns engineering credibility.",
    "communication-influence": "Translating complex technical tradeoffs into business decisions for non-technical stakeholders is a core Technical PM skill.",
    "execution-delivery": "Technical projects often have long timelines and complex dependencies — strong execution and risk management are essential.",
    "business-acumen": "Technical infrastructure must justify its cost; understanding ROI and build-vs-buy decisions is critical for this role.",
    "leadership-collaboration": "Technical PMs often work with senior engineers and architects — leading these conversations requires both confidence and humility.",
  },
  platform: {
    "product-thinking": "Platform PMs think in systems — your product decisions affect every team that builds on top of your platform.",
    "analytical-data": "Platform health is measured through adoption, reliability, and developer velocity metrics that require sophisticated analysis.",
    "user-understanding": "Your users are internal developers and partner teams — understanding their integration needs is your primary research challenge.",
    "technical-acumen": "Platform PMs need the deepest technical knowledge of any PM type — APIs, SDKs, and system architecture are your product.",
    "communication-influence": "Platform work requires aligning dozens of internal stakeholders with competing priorities — influence without authority is essential.",
    "execution-delivery": "Platform changes have cascading effects; disciplined execution and backward compatibility management are critical.",
    "business-acumen": "Platforms are cost centers that enable revenue — you need to articulate their business value clearly to leadership.",
    "leadership-collaboration": "Platform PMs lead through influence across the entire engineering organization, making collaboration your most important skill.",
  },
  ai: {
    "product-thinking": "AI PMs must think probabilistically — your product sense needs to account for model uncertainty and emergent behaviors.",
    "analytical-data": "AI products require deep understanding of model evaluation metrics, data quality, and the difference between offline and online performance.",
    "user-understanding": "AI features often behave unexpectedly for users — deep user research helps you design for trust and appropriate reliance.",
    "technical-acumen": "Understanding ML concepts, training pipelines, and inference constraints is essential for scoping AI features realistically.",
    "communication-influence": "AI PMs must translate model capabilities and limitations to business stakeholders who often have unrealistic expectations.",
    "execution-delivery": "AI projects have unique risks around data, model performance, and safety — structured execution frameworks are critical.",
    "business-acumen": "AI infrastructure is expensive; you need to build clear ROI cases and understand the economics of model serving at scale.",
    "leadership-collaboration": "AI teams include researchers, ML engineers, and data scientists — bridging these disciplines requires strong collaborative leadership.",
  },
  general: {
    "product-thinking": "Strong product thinking is the foundation of every PM role — it's how you identify the right problems to solve.",
    "analytical-data": "Data-driven decision making separates good PMs from great ones across every product domain.",
    "user-understanding": "Deep user empathy is the most consistent predictor of PM success regardless of the product type.",
    "technical-acumen": "Technical fluency helps you scope work accurately, earn engineering trust, and make better build-vs-buy decisions.",
    "communication-influence": "PMs lead without authority — your ability to communicate and influence is your primary lever for getting things done.",
    "execution-delivery": "Shipping consistently and learning from each release is the core PM feedback loop that builds your judgment over time.",
    "business-acumen": "Every product decision has a business consequence — understanding the economics of your product makes you a better PM.",
    "leadership-collaboration": "PMs are the connective tissue of product teams; strong collaboration skills determine how much you can actually accomplish.",
  },
};

const FALLBACK = "Strengthening this skill will make you a more well-rounded PM candidate and improve your overall readiness score.";

export function getGapExplanation(roleType: string | null, categorySlug: string): string {
  const role = roleType ?? "general";
  return gapExplanations[role]?.[categorySlug] ?? gapExplanations["general"]?.[categorySlug] ?? FALLBACK;
}
