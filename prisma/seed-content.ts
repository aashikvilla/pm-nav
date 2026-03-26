/**
 * Content seed data — subtopics, resources, gate assignments, question bank
 * Imported by seed.ts
 */

// ─── Stage Subtopics ────────────────────────────────────────────────────────

export const subtopicDefs = [
  // Stage 1: PM Fundamentals
  { id: "st-1-1", stageId: "ls-1", title: "What PMs Actually Do", slug: "what-pms-do", description: "Day-in-the-life across role types; responsibilities vs. myths", sortOrder: 1, quickCheck: "In 2-3 sentences, describe what a Product Manager does differently from a Project Manager." },
  { id: "st-1-2", stageId: "ls-1", title: "Types of PM Roles", slug: "pm-role-types", description: "Consumer, Growth, Technical, Platform, AI, B2B — with real examples", sortOrder: 2, quickCheck: "Name the PM role type that best fits your background and explain why in 2-3 sentences." },
  { id: "st-1-3", stageId: "ls-1", title: "The Product Lifecycle", slug: "product-lifecycle", description: "Ideation → Discovery → Build → Launch → Iterate → Sunset", sortOrder: 3, quickCheck: "Pick a product you use daily and identify which lifecycle stage it's currently in. Explain your reasoning." },
  { id: "st-1-4", stageId: "ls-1", title: "PM vs. Adjacent Roles", slug: "pm-vs-adjacent", description: "PM vs. Project Manager, Business Analyst, UX Designer, Engineering Manager", sortOrder: 4, quickCheck: "A colleague asks 'Isn't PM just project management?' How would you explain the difference?" },
  { id: "st-1-5", stageId: "ls-1", title: "The PM Toolkit", slug: "pm-toolkit", description: "Key tools — Jira, Figma, Analytics, Notion — awareness level", sortOrder: 5, quickCheck: "List 3 tools a PM uses daily and explain what each is used for." },
  { id: "st-1-6", stageId: "ls-1", title: "How PMs Are Evaluated", slug: "pm-evaluation", description: "Impact, execution, leadership — what hiring managers look for", sortOrder: 6, quickCheck: "What are the top 3 things a PM hiring manager looks for in a candidate?" },

  // Stage 2: Product Thinking & Problem Framing
  { id: "st-2-1", stageId: "ls-2", title: "Problem Framing", slug: "problem-framing", description: "Defining the right problem; '5 Whys'; problem vs. solution statements", sortOrder: 1, quickCheck: "Take a frustration you had with an app this week. Frame it as a problem statement: Who is affected? What is the problem? Why does it matter?" },
  { id: "st-2-2", stageId: "ls-2", title: "User Empathy & Personas", slug: "user-empathy", description: "Understanding users beyond demographics; jobs-to-be-done; empathy maps", sortOrder: 2, quickCheck: "Pick a product you use. Describe one user persona beyond demographics — what motivates them, what frustrates them, what workarounds they use." },
  { id: "st-2-3", stageId: "ls-2", title: "Product Sense Development", slug: "product-sense-dev", description: "Analyzing products critically; understanding what makes products work", sortOrder: 3, quickCheck: "Name one product decision you think was brilliant and one that was poor. Explain why for each." },
  { id: "st-2-4", stageId: "ls-2", title: "First Principles Thinking", slug: "first-principles", description: "Breaking down problems to fundamentals; avoiding framework theater", sortOrder: 4, quickCheck: "Take a common solution in your industry and break it down: What assumption is it based on? Is that assumption still true?" },
  { id: "st-2-5", stageId: "ls-2", title: "Tradeoff Thinking", slug: "tradeoff-thinking", description: "Speed vs. quality, user vs. business, build vs. buy, now vs. later", sortOrder: 5, quickCheck: "Describe a real tradeoff you faced at work. What did you choose and why?" },
  { id: "st-2-6", stageId: "ls-2", title: "Feature Ideation & Validation", slug: "feature-ideation", description: "Generating ideas from user problems; validation methods", sortOrder: 6, quickCheck: "Propose one feature idea for an app you use. How would you validate if users actually need it before building it?" },

  // Stage 3: User Research & Understanding
  { id: "st-3-1", stageId: "ls-3", title: "User Research Methods Overview", slug: "research-methods", description: "Qualitative vs. quantitative; when to use interviews, surveys, analytics", sortOrder: 1, quickCheck: "You want to understand why users abandon their cart. Would you use interviews, surveys, or analytics? Explain your choice." },
  { id: "st-3-2", stageId: "ls-3", title: "Conducting User Interviews", slug: "user-interviews", description: "Writing interview guides; active listening; avoiding leading questions", sortOrder: 2, quickCheck: "Write 3 non-leading interview questions to understand why someone stopped using a fitness app." },
  { id: "st-3-3", stageId: "ls-3", title: "User Personas & Segmentation", slug: "personas-segmentation", description: "Building data-informed personas; behavioral segmentation", sortOrder: 3, quickCheck: "Create a brief persona for a power user of your favorite app — include their goal, behavior, and frustration." },
  { id: "st-3-4", stageId: "ls-3", title: "Jobs to Be Done (JTBD)", slug: "jtbd-framework", description: "Understanding user motivations; functional, emotional, social jobs", sortOrder: 4, quickCheck: "What 'job' does Uber hire for beyond transportation? Think about functional, emotional, and social dimensions." },
  { id: "st-3-5", stageId: "ls-3", title: "Usability Testing Basics", slug: "usability-testing", description: "Planning and running usability tests; analyzing results", sortOrder: 5, quickCheck: "You're testing a new checkout flow. Write 3 task prompts you'd give a test participant." },
  { id: "st-3-6", stageId: "ls-3", title: "Competitive & Market Analysis", slug: "competitive-analysis", description: "Analyzing competitors systematically; identifying gaps and opportunities", sortOrder: 6, quickCheck: "Pick two competing products in any space. What does each do better than the other? What's the gap neither fills?" },

  // Stage 4: Metrics & Analytical Thinking
  { id: "st-4-1", stageId: "ls-4", title: "Metrics That Matter", slug: "metrics-that-matter", description: "North star metrics, input vs. output, vanity vs. actionable", sortOrder: 1, quickCheck: "What's the difference between a vanity metric and an actionable metric? Give an example of each." },
  { id: "st-4-2", stageId: "ls-4", title: "Defining Product Metrics", slug: "defining-metrics", description: "HEART framework, pirate metrics (AARRR), choosing the right metrics", sortOrder: 2, quickCheck: "Apply the AARRR framework to a food delivery app. Name one metric for each stage." },
  { id: "st-4-3", stageId: "ls-4", title: "Funnel Analysis", slug: "funnel-analysis", description: "Understanding conversion funnels; identifying drop-off points", sortOrder: 3, quickCheck: "An e-commerce app has 70% add-to-cart but only 20% checkout completion. What are 3 hypotheses for the drop-off?" },
  { id: "st-4-4", stageId: "ls-4", title: "Cohort & Retention Analysis", slug: "cohort-retention", description: "Measuring retention over time; understanding cohort behavior", sortOrder: 4, quickCheck: "Why is Day-7 retention more meaningful than Day-1 retention for most consumer apps?" },
  { id: "st-4-5", stageId: "ls-4", title: "A/B Testing & Experimentation", slug: "ab-testing", description: "Hypothesis formation; test design; statistical significance basics", sortOrder: 5, quickCheck: "Design a simple A/B test for changing a CTA button color. State your hypothesis, metric, and how you'd know the test succeeded." },
  { id: "st-4-6", stageId: "ls-4", title: "SQL for PMs", slug: "sql-for-pms", description: "Basic queries, joins, aggregations — enough to be self-sufficient", sortOrder: 6, quickCheck: "Write a SQL query to find the top 10 users by order count in the last 30 days." },
  { id: "st-4-7", stageId: "ls-4", title: "Root Cause Analysis", slug: "root-cause-analysis", description: "Diagnosing metric drops; structured investigation", sortOrder: 7, quickCheck: "DAU dropped 10% this week. Walk through your first 3 investigation steps." },

  // Stage 5: Prioritization & Strategy
  { id: "st-5-1", stageId: "ls-5", title: "Prioritization Frameworks", slug: "prioritization-frameworks", description: "RICE, ICE, MoSCoW, Kano — when each is useful", sortOrder: 1, quickCheck: "Pick a prioritization framework and explain when it works well and when it fails." },
  { id: "st-5-2", stageId: "ls-5", title: "Beyond Frameworks", slug: "beyond-frameworks", description: "Judgment-based prioritization; stakeholder alignment on priorities", sortOrder: 2, quickCheck: "Your CEO wants Feature A, data says Feature B is higher impact. How do you handle this?" },
  { id: "st-5-3", stageId: "ls-5", title: "Product Strategy Fundamentals", slug: "product-strategy", description: "Vision → Strategy → Roadmap → Goals; connecting work to outcomes", sortOrder: 3, quickCheck: "What's the difference between a product vision and a product strategy?" },
  { id: "st-5-4", stageId: "ls-5", title: "Business Model Understanding", slug: "business-models-intro", description: "Revenue models, unit economics basics", sortOrder: 4, quickCheck: "How does Spotify make money? What's their main unit economics challenge?" },
  { id: "st-5-5", stageId: "ls-5", title: "Market Analysis & Positioning", slug: "market-positioning", description: "Competitive positioning; market sizing basics", sortOrder: 5, quickCheck: "Estimate the TAM for an online PM certification course in India. Show your reasoning." },
  { id: "st-5-6", stageId: "ls-5", title: "Saying No — Deprioritization", slug: "saying-no", description: "How to kill features, manage scope, say no to stakeholders", sortOrder: 6, quickCheck: "A stakeholder is upset their feature was deprioritized. Write a 3-sentence response that's honest and empathetic." },

  // Stage 6: Technical Foundations
  { id: "st-6-1", stageId: "ls-6", title: "How Software Works", slug: "how-software-works", description: "Client-server, APIs, databases, frontend/backend basics", sortOrder: 1, quickCheck: "Explain what happens when you open a food delivery app and see a list of restaurants — in terms of client, server, and database." },
  { id: "st-6-2", stageId: "ls-6", title: "System Design for PMs", slug: "system-design-pms", description: "Architecture diagrams; scalability, reliability, performance", sortOrder: 2, quickCheck: "What would break in a ride-sharing app if it suddenly got 10x more users? Name 3 system components that would be stressed." },
  { id: "st-6-3", stageId: "ls-6", title: "APIs & Integrations", slug: "apis-integrations", description: "REST vs. GraphQL basics; why PMs need to understand APIs", sortOrder: 3, quickCheck: "Why would a PM need to understand APIs? Give a concrete example." },
  { id: "st-6-4", stageId: "ls-6", title: "Agile & Scrum Deep Dive", slug: "agile-deep-dive", description: "Beyond buzzwords — sprints, standups, retros, estimation, velocity", sortOrder: 4, quickCheck: "What's the difference between story points and hours? Why do agile teams prefer one over the other?" },
  { id: "st-6-5", stageId: "ls-6", title: "Technical Spec Writing", slug: "tech-spec-writing", description: "Writing specs engineers respect — requirements, edge cases, acceptance criteria", sortOrder: 5, quickCheck: "Write 3 acceptance criteria for a 'forgot password' feature." },
  { id: "st-6-6", stageId: "ls-6", title: "AI/ML for PMs", slug: "ai-ml-for-pms", description: "What ML models do; training data, bias, limitations; AI product feasibility", sortOrder: 6, quickCheck: "A stakeholder says 'Let's use AI to predict which customers will churn.' What questions would you ask before agreeing?" },

  // Stage 7: Communication & Stakeholder Mgmt
  { id: "st-7-1", stageId: "ls-7", title: "PRD / Product Brief Writing", slug: "prd-writing", description: "Structure, components, what to include/exclude", sortOrder: 1, quickCheck: "List the 5 most important sections of a PRD and explain why each matters." },
  { id: "st-7-2", stageId: "ls-7", title: "User Stories & Acceptance Criteria", slug: "user-stories-ac", description: "Writing user stories engineers can build from", sortOrder: 2, quickCheck: "Write a user story with acceptance criteria for adding items to a wishlist." },
  { id: "st-7-3", stageId: "ls-7", title: "Presenting to Leadership", slug: "presenting-leadership", description: "Structuring a product pitch; storytelling with data", sortOrder: 3, quickCheck: "You have 5 minutes with the CEO to pitch a feature. Outline your structure." },
  { id: "st-7-4", stageId: "ls-7", title: "Stakeholder Communication", slug: "stakeholder-comms", description: "Managing up; cross-functional updates; conflict resolution", sortOrder: 4, quickCheck: "Your engineering lead disagrees with the priority. How do you handle the conversation?" },
  { id: "st-7-5", stageId: "ls-7", title: "Writing Product Emails & Updates", slug: "product-emails", description: "Status updates, launch communications, escalation emails", sortOrder: 5, quickCheck: "Write a 3-sentence launch update email for a new checkout feature." },
  { id: "st-7-6", stageId: "ls-7", title: "Running Effective Meetings", slug: "effective-meetings", description: "Sprint reviews, brainstorms, decision-making meetings", sortOrder: 6, quickCheck: "What makes the difference between a productive meeting and a wasted one? List 3 concrete practices." },

  // Stage 8: Execution & Delivery
  { id: "st-8-1", stageId: "ls-8", title: "Roadmap Building", slug: "roadmap-building", description: "3-month and 6-month roadmaps; now/next/later; themes-based", sortOrder: 1, quickCheck: "What's the difference between a timeline-based roadmap and a themes-based roadmap? When would you use each?" },
  { id: "st-8-2", stageId: "ls-8", title: "Sprint Planning & Execution", slug: "sprint-planning", description: "Breaking features into sprints; estimation; managing dependencies", sortOrder: 2, quickCheck: "A feature is estimated at 3 sprints. How do you break it down so there's shippable progress each sprint?" },
  { id: "st-8-3", stageId: "ls-8", title: "Launch Planning & Coordination", slug: "launch-planning", description: "Phased rollouts; beta testing; launch checklists", sortOrder: 3, quickCheck: "List 5 items on a feature launch checklist that a PM is responsible for." },
  { id: "st-8-4", stageId: "ls-8", title: "Managing Scope & Timeline", slug: "scope-management", description: "Scope creep management; making cut decisions; communicating delays", sortOrder: 4, quickCheck: "You're 2 weeks from launch and realize a key feature won't be ready. What do you do?" },
  { id: "st-8-5", stageId: "ls-8", title: "Post-Launch Iteration", slug: "post-launch", description: "Measuring launch success; gathering feedback; prioritizing V2", sortOrder: 5, quickCheck: "Your feature launched with good adoption but poor retention. What's your investigation plan?" },
  { id: "st-8-6", stageId: "ls-8", title: "Incident Response", slug: "incident-response", description: "Triaging issues, communicating outages, post-mortems", sortOrder: 6, quickCheck: "A critical bug is reported in production. Walk through your first 30 minutes as the PM." },

  // Stage 9: Business Acumen & Strategy
  { id: "st-9-1", stageId: "ls-9", title: "Business Model Canvas", slug: "business-model-canvas", description: "Revenue streams, cost structure, value propositions", sortOrder: 1, quickCheck: "Map the business model canvas for Zomato. What's their biggest cost? Biggest revenue stream?" },
  { id: "st-9-2", stageId: "ls-9", title: "Revenue & Monetization", slug: "revenue-monetization", description: "Pricing strategies, freemium, subscriptions, marketplace dynamics", sortOrder: 2, quickCheck: "Why does Spotify offer a free tier? What role does it play in their monetization strategy?" },
  { id: "st-9-3", stageId: "ls-9", title: "Unit Economics", slug: "unit-economics-deep", description: "CAC, LTV, payback period, contribution margin", sortOrder: 3, quickCheck: "A startup spends ₹500 to acquire a customer who pays ₹200/month. Is this sustainable? What do you need to know?" },
  { id: "st-9-4", stageId: "ls-9", title: "Go-to-Market Strategy", slug: "gtm-strategy-deep", description: "Planning product launches; channel strategy; positioning", sortOrder: 4, quickCheck: "You're launching a B2B SaaS product in India. Outline your GTM strategy in 3 sentences." },
  { id: "st-9-5", stageId: "ls-9", title: "Market Sizing", slug: "market-sizing-deep", description: "TAM/SAM/SOM; top-down vs. bottom-up estimation", sortOrder: 5, quickCheck: "Estimate the SAM for a premium meditation app in India. Show your approach." },
  { id: "st-9-6", stageId: "ls-9", title: "Pricing Strategy", slug: "pricing-strategy", description: "Value-based pricing, competitive pricing, psychological pricing", sortOrder: 6, quickCheck: "A SaaS product charges ₹999/month. Competitors charge ₹499. When is pricing higher actually the right strategy?" },

  // Stage 10: Leadership & Influence
  { id: "st-10-1", stageId: "ls-10", title: "STAR Method Done Right", slug: "star-method", description: "Structuring behavioral answers authentically", sortOrder: 1, quickCheck: "Take a work situation and structure it in STAR format. Focus on what YOU did, not the team." },
  { id: "st-10-2", stageId: "ls-10", title: "Conflict Resolution for PMs", slug: "conflict-resolution-deep", description: "Disagreeing with engineering, pushing back on leadership", sortOrder: 2, quickCheck: "Describe a framework for resolving a disagreement between you and an engineering lead about technical approach." },
  { id: "st-10-3", stageId: "ls-10", title: "Cross-Functional Leadership", slug: "cross-func-leadership", description: "Leading without authority; building trust", sortOrder: 3, quickCheck: "How do you influence a team you don't manage? Give 3 concrete tactics." },
  { id: "st-10-4", stageId: "ls-10", title: "Managing Up", slug: "managing-up-deep", description: "Communicating with leadership; framing decisions", sortOrder: 4, quickCheck: "Your VP asks for a status update. Draft 3 sentences that show progress, blockers, and what you need from them." },
  { id: "st-10-5", stageId: "ls-10", title: "Failure & Learning Stories", slug: "failure-stories", description: "How to talk about failures; demonstrating growth mindset", sortOrder: 5, quickCheck: "Share a professional failure. What did you learn? How did it change your approach?" },

  // Stage 11: Building Your PM Portfolio
  { id: "st-11-1", stageId: "ls-11", title: "Choosing Your Side Project", slug: "side-project", description: "Defining a project that demonstrates PM skills", sortOrder: 1, quickCheck: "What kind of side project would best demonstrate PM skills for your target role? Describe it in 2-3 sentences." },
  { id: "st-11-2", stageId: "ls-11", title: "Case Study Creation", slug: "case-study", description: "Turning work experience into compelling case studies", sortOrder: 2, quickCheck: "Pick one of your PSI entries and outline how you'd turn it into a portfolio case study." },
  { id: "st-11-3", stageId: "ls-11", title: "Building Proof of Work", slug: "proof-of-work", description: "Creating tangible artifacts that show PM capability", sortOrder: 3, quickCheck: "List 3 artifacts from this learning path that could go into your PM portfolio." },
  { id: "st-11-4", stageId: "ls-11", title: "Portfolio Presentation", slug: "portfolio-presentation", description: "How to present your portfolio effectively", sortOrder: 4, quickCheck: "If you had 2 minutes to walk someone through your portfolio, what would you emphasize?" },

  // Stage 12: Application Readiness
  { id: "st-12-1", stageId: "ls-12", title: "Resume Optimization", slug: "resume-optimization", description: "PSI format; ATS optimization; tailoring per JD", sortOrder: 1, quickCheck: "What are 3 things that make a resume ATS-friendly?" },
  { id: "st-12-2", stageId: "ls-12", title: "LinkedIn & Online Presence", slug: "linkedin-presence", description: "PM-specific LinkedIn optimization; personal brand", sortOrder: 2, quickCheck: "What should a PM career switcher's LinkedIn headline look like? Write yours." },
  { id: "st-12-3", stageId: "ls-12", title: "Application Strategy", slug: "application-strategy", description: "Where to apply; warm vs. cold; networking; referrals", sortOrder: 3, quickCheck: "You want to apply to 10 companies. How would you split your time between warm outreach and cold applications?" },
  { id: "st-12-4", stageId: "ls-12", title: "Interview Preparation Strategy", slug: "interview-prep", description: "Types of PM interviews; company-specific preparation", sortOrder: 4, quickCheck: "Name the 4 main types of PM interview rounds and what each tests." },
  { id: "st-12-5", stageId: "ls-12", title: "Salary Negotiation", slug: "salary-negotiation", description: "Understanding compensation; negotiation tactics", sortOrder: 5, quickCheck: "You receive a PM offer at ₹18 LPA but expected ₹22 LPA. How do you approach the negotiation?" },
]

// ─── Resources (curated, real URLs omitted - use placeholder descriptions) ──

export const resourceDefs = [
  // Stage 1 resources
  { id: "r-1-1-1", subtopicId: "st-1-1", title: "A Day in the Life of a Product Manager", url: "https://www.lennysnewsletter.com/p/what-is-a-product-manager", type: "article", estimatedMins: 15, difficulty: "beginner", qualityRating: 5, sortOrder: 1 },
  { id: "r-1-1-2", subtopicId: "st-1-1", title: "What Do Product Managers Do? (Product School)", url: "https://www.youtube.com/watch?v=yUOC-Y0f5ZQ", type: "video", estimatedMins: 20, difficulty: "beginner", qualityRating: 4, sortOrder: 2 },
  { id: "r-1-2-1", subtopicId: "st-1-2", title: "The Different Types of Product Managers", url: "https://www.lennysnewsletter.com/p/product-manager-archetypes", type: "article", estimatedMins: 12, difficulty: "beginner", qualityRating: 5, sortOrder: 1 },
  { id: "r-1-3-1", subtopicId: "st-1-3", title: "Understanding the Product Lifecycle", url: "https://www.mindtheproduct.com/product-lifecycle/", type: "article", estimatedMins: 10, difficulty: "beginner", qualityRating: 4, sortOrder: 1 },
  { id: "r-1-4-1", subtopicId: "st-1-4", title: "PM vs Project Manager vs Program Manager", url: "https://www.productplan.com/learn/product-manager-vs-project-manager/", type: "article", estimatedMins: 8, difficulty: "beginner", qualityRating: 4, sortOrder: 1 },
  { id: "r-1-5-1", subtopicId: "st-1-5", title: "Essential PM Tools Overview", url: "https://www.productplan.com/learn/product-management-tools/", type: "article", estimatedMins: 10, difficulty: "beginner", qualityRating: 3, sortOrder: 1 },
  { id: "r-1-6-1", subtopicId: "st-1-6", title: "How PM Hiring Managers Evaluate Candidates", url: "https://www.lennysnewsletter.com/p/hiring-product-managers", type: "article", estimatedMins: 15, difficulty: "beginner", qualityRating: 5, sortOrder: 1 },

  // Stage 2 resources
  { id: "r-2-1-1", subtopicId: "st-2-1", title: "How Great PMs Think About Problems", url: "https://twitter.com/shreaborhade/status/1628834451", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-2-1-2", subtopicId: "st-2-1", title: "The 5 Whys Technique Explained", url: "https://www.mindtools.com/a3mi00v/5-whys", type: "article", estimatedMins: 10, difficulty: "beginner", qualityRating: 4, sortOrder: 2 },
  { id: "r-2-2-1", subtopicId: "st-2-2", title: "Jobs to Be Done Framework", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done", type: "article", estimatedMins: 20, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-2-3-1", subtopicId: "st-2-3", title: "How to Develop Product Sense", url: "https://www.lennysnewsletter.com/p/product-sense", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-2-4-1", subtopicId: "st-2-4", title: "First Principles Thinking for PMs", url: "https://fs.blog/first-principles/", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-2-5-1", subtopicId: "st-2-5", title: "Making Tradeoffs as a PM", url: "https://www.svpg.com/product-vs-feature-teams/", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-2-6-1", subtopicId: "st-2-6", title: "Idea Validation Before Building", url: "https://www.mindtheproduct.com/how-to-validate-product-ideas/", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },

  // Stage 3 resources
  { id: "r-3-1-1", subtopicId: "st-3-1", title: "User Research Methods: A Comprehensive Guide", url: "https://www.nngroup.com/articles/which-ux-research-methods/", type: "article", estimatedMins: 20, difficulty: "beginner", qualityRating: 5, sortOrder: 1 },
  { id: "r-3-2-1", subtopicId: "st-3-2", title: "How to Conduct User Interviews", url: "https://www.nngroup.com/articles/user-interviews/", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-3-3-1", subtopicId: "st-3-3", title: "Creating Useful Personas", url: "https://www.nngroup.com/articles/persona/", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-3-4-1", subtopicId: "st-3-4", title: "Jobs to Be Done: A Deep Dive", url: "https://jtbd.info/2-what-is-jobs-to-be-done-jtbd-796b82081c98", type: "article", estimatedMins: 18, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-3-5-1", subtopicId: "st-3-5", title: "Usability Testing 101", url: "https://www.nngroup.com/articles/usability-testing-101/", type: "article", estimatedMins: 15, difficulty: "beginner", qualityRating: 5, sortOrder: 1 },
  { id: "r-3-6-1", subtopicId: "st-3-6", title: "Competitive Analysis Framework", url: "https://www.productplan.com/learn/competitive-analysis/", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },

  // Stage 4 resources
  { id: "r-4-1-1", subtopicId: "st-4-1", title: "A Guide to Defining Product Metrics", url: "https://www.lennysnewsletter.com/p/choosing-your-north-star-metric", type: "article", estimatedMins: 18, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-4-2-1", subtopicId: "st-4-2", title: "AARRR Pirate Metrics Explained", url: "https://www.productplan.com/glossary/aarrr-framework/", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-4-3-1", subtopicId: "st-4-3", title: "Funnel Analysis for Product Managers", url: "https://amplitude.com/blog/funnel-analysis", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-4-4-1", subtopicId: "st-4-4", title: "Understanding Cohort Analysis", url: "https://amplitude.com/blog/cohort-analysis", type: "article", estimatedMins: 15, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
  { id: "r-4-5-1", subtopicId: "st-4-5", title: "The Ultimate Guide to A/B Testing", url: "https://www.reforge.com/blog/ab-testing-guide", type: "article", estimatedMins: 20, difficulty: "intermediate", qualityRating: 5, sortOrder: 1 },
  { id: "r-4-6-1", subtopicId: "st-4-6", title: "SQL for Product Managers", url: "https://mode.com/sql-tutorial/", type: "course", estimatedMins: 60, difficulty: "beginner", qualityRating: 4, sortOrder: 1 },
  { id: "r-4-7-1", subtopicId: "st-4-7", title: "Root Cause Analysis Techniques", url: "https://www.mindtools.com/a3mi00v/root-cause-analysis", type: "article", estimatedMins: 12, difficulty: "intermediate", qualityRating: 4, sortOrder: 1 },
]

// ─── Gate Assignments ────────────────────────────────────────────────────────

export const gateAssignmentDefs = [
  {
    id: "ga-1", stageId: "ls-1", title: "Product Analysis",
    prompt: "Pick any product you use daily. Write a 1-page analysis: What problem does it solve? Who is the target user? What are its 3 strongest features and why? What would you improve and why?",
    rubric: [
      { criterion: "Problem identification", points: 25, description: "Clearly identifies the core problem the product solves" },
      { criterion: "User understanding", points: 25, description: "Shows understanding of who uses this product and why" },
      { criterion: "Feature analysis", points: 25, description: "Thoughtful analysis of strengths with reasoning" },
      { criterion: "Improvement proposal", points: 25, description: "Feasible improvement with clear reasoning" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-2", stageId: "ls-2", title: "Problem-Solution Analysis",
    prompt: "Choose a product in your current industry or domain. Identify a real user problem that the product doesn't solve well. Frame the problem clearly (who, what, why, impact). Propose 3 potential solutions with tradeoffs for each. Recommend one and justify your recommendation.",
    rubric: [
      { criterion: "Problem clarity", points: 25, description: "Problem is specific, identifies who is affected and why" },
      { criterion: "User understanding", points: 20, description: "Shows genuine empathy; considers context and workarounds" },
      { criterion: "Solution quality", points: 20, description: "3 distinct solutions with meaningful tradeoffs" },
      { criterion: "Recommendation reasoning", points: 20, description: "Clear framework for recommendation; considers multiple dimensions" },
      { criterion: "Communication quality", points: 15, description: "Well-structured, concise, professional" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-3", stageId: "ls-3", title: "User Research Synthesis",
    prompt: "Conduct 2 mini user interviews (15-20 min each) with people who use a product in your domain. Write an interview guide beforehand. After the interviews, synthesize your findings into: (a) 2 key user personas, (b) 3 validated pain points, (c) 1 opportunity area with justification.",
    rubric: [
      { criterion: "Interview guide quality", points: 20, description: "Non-leading questions; covers key areas" },
      { criterion: "Persona quality", points: 20, description: "Data-informed, specific, behavioral" },
      { criterion: "Pain point validation", points: 25, description: "Pain points backed by interview data, not assumptions" },
      { criterion: "Opportunity identification", points: 20, description: "Opportunity is grounded in research findings" },
      { criterion: "Synthesis quality", points: 15, description: "Clear connection between data and conclusions" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-4", stageId: "ls-4", title: "Metrics & Investigation",
    prompt: "Scenario: You are the PM for a product in your domain. Your daily active users dropped 12% this month. Walk through: (a) How you would investigate this — step by step, (b) 3 hypotheses with the data you'd look at to validate each, (c) Your recommended metrics dashboard (5-7 metrics with reasoning), (d) How you would design an A/B test for one proposed solution.",
    rubric: [
      { criterion: "Investigation approach", points: 25, description: "Systematic, structured investigation methodology" },
      { criterion: "Hypothesis quality", points: 25, description: "Testable, specific hypotheses tied to data" },
      { criterion: "Metrics dashboard", points: 20, description: "Actionable, balanced set of metrics with reasoning" },
      { criterion: "Experiment design", points: 20, description: "Clear hypothesis, control, metric, sample size reasoning" },
      { criterion: "Communication clarity", points: 10, description: "Clear and well-organized" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-5", stageId: "ls-5", title: "Prioritization Exercise",
    prompt: "You are PM for a product in your domain. You have a backlog of 8 feature requests. Your engineering team can build 3 this quarter. Prioritize: (a) State your criteria and reasoning, (b) Rank all 8 with justification, (c) Present your top 3 as a 1-page product brief, (d) Explain how you'd communicate deprioritization to stakeholders.\n\nFeature requests:\n1. Dark mode\n2. Advanced search filters\n3. Export to PDF\n4. Mobile push notifications\n5. Admin dashboard\n6. Integration with Slack\n7. Performance optimization (50% faster load)\n8. User onboarding tutorial",
    rubric: [
      { criterion: "Prioritization criteria", points: 25, description: "Clear, relevant criteria applied consistently" },
      { criterion: "Ranking justification", points: 25, description: "Each ranking has specific reasoning, not just gut feel" },
      { criterion: "Product brief quality", points: 25, description: "Compelling, structured brief for the top 3" },
      { criterion: "Stakeholder communication", points: 25, description: "Empathetic, honest deprioritization communication" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-6", stageId: "ls-6", title: "System Understanding & Technical Spec",
    prompt: "Take a product you know well. (a) Describe its system architecture in PM terms — main components, how they communicate, where data is stored, what breaks at 10x scale. (b) Write a technical spec for one feature including edge cases and acceptance criteria.",
    rubric: [
      { criterion: "Architecture understanding", points: 25, description: "Accurate description of components and data flow" },
      { criterion: "Scalability thinking", points: 20, description: "Identifies realistic scaling bottlenecks" },
      { criterion: "Technical spec quality", points: 30, description: "Complete spec with edge cases and acceptance criteria" },
      { criterion: "Communication clarity", points: 25, description: "Technical concepts explained clearly for mixed audience" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-7", stageId: "ls-7", title: "PRD + Executive Pitch",
    prompt: "Write a full PRD for a new feature or improvement to a product in your domain. Include: (a) Problem statement with data, (b) Target user and use cases, (c) Proposed solution with user stories and acceptance criteria, (d) Success metrics, (e) Risks and mitigations, (f) Launch plan. Then create a 5-point executive summary.",
    rubric: [
      { criterion: "Problem framing", points: 15, description: "Clear, data-backed, user-centered problem" },
      { criterion: "Solution design", points: 20, description: "Feasible, well-scoped, edge cases considered" },
      { criterion: "User stories & AC", points: 20, description: "Buildable, complete, with acceptance criteria" },
      { criterion: "Metrics & success criteria", points: 15, description: "Measurable, actionable success metrics" },
      { criterion: "Risks & launch plan", points: 15, description: "Realistic, thorough risk assessment" },
      { criterion: "Communication quality", points: 15, description: "Professional, structured, concise" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-8", stageId: "ls-8", title: "3-Month Product Roadmap",
    prompt: "Create a 3-month product roadmap for a product in your domain. Include: (a) Strategic themes and goals, (b) Feature breakdown with sprint-level detail for Month 1, (c) Dependencies and risks, (d) Success criteria for each major item, (e) How you would communicate this differently to engineering, leadership, and sales.",
    rubric: [
      { criterion: "Strategic alignment", points: 25, description: "Roadmap tied to clear strategic themes" },
      { criterion: "Feature breakdown", points: 25, description: "Detailed Month 1, appropriate abstraction for later months" },
      { criterion: "Risk awareness", points: 20, description: "Dependencies and risks identified with mitigations" },
      { criterion: "Stakeholder communication", points: 30, description: "Different framing for each audience" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-9", stageId: "ls-9", title: "Business Model Analysis",
    prompt: "Pick a company in your domain or one you admire. (a) Map its business model canvas, (b) Calculate or estimate unit economics (CAC, LTV, payback), (c) Identify the biggest business risk, (d) Propose a new revenue stream or monetization improvement with reasoning.",
    rubric: [
      { criterion: "Business model understanding", points: 25, description: "Accurate, complete business model mapping" },
      { criterion: "Unit economics", points: 25, description: "Reasonable estimates with clear reasoning" },
      { criterion: "Risk identification", points: 25, description: "Insightful identification of real business risks" },
      { criterion: "Revenue proposal", points: 25, description: "Feasible, well-reasoned monetization idea" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-10", stageId: "ls-10", title: "Behavioral Stories",
    prompt: "Write 5 behavioral stories from your career using Problem-Action-Result format. Each story must map to a different PM skill: (a) Leading a team through ambiguity, (b) Using data to change a decision, (c) Handling a conflict with a stakeholder, (d) A failure and what you learned, (e) Going above your role definition.",
    rubric: [
      { criterion: "Story specificity", points: 25, description: "Concrete situations, not generic descriptions" },
      { criterion: "Action clarity", points: 25, description: "Clear what YOU did, not the team" },
      { criterion: "Result impact", points: 20, description: "Measurable or clearly described outcomes" },
      { criterion: "Skill demonstration", points: 20, description: "Each story clearly maps to the target PM skill" },
      { criterion: "Authenticity", points: 10, description: "Stories feel real, not manufactured" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-11", stageId: "ls-11", title: "PM Portfolio Piece",
    prompt: "Create a portfolio-ready case study from your strongest PSI entry or side project. Include: (a) Context and your role, (b) Problem discovery process, (c) Solution approach with alternatives considered, (d) Implementation highlights, (e) Results and learnings. Format it as you'd present to a hiring manager.",
    rubric: [
      { criterion: "Context setting", points: 20, description: "Clear role, scope, and constraints" },
      { criterion: "Problem-solution narrative", points: 25, description: "Compelling story from problem to solution" },
      { criterion: "Depth of analysis", points: 25, description: "Shows alternatives considered, tradeoffs made" },
      { criterion: "Results & learnings", points: 15, description: "Honest results with genuine reflections" },
      { criterion: "Presentation quality", points: 15, description: "Portfolio-ready formatting and writing" },
    ],
    passingScore: 60, maxScore: 100,
  },
  {
    id: "ga-12", stageId: "ls-12", title: "Application Package",
    prompt: "Using your complete profile: (a) Generate a tailored resume for a specific JD from your stored targets, (b) Write a 3-paragraph cover note explaining your PM transition, (c) Record a 2-minute pitch: 'Why are you transitioning to PM and why are you a good fit?'",
    rubric: [
      { criterion: "Resume quality", points: 30, description: "ATS-friendly, JD-tailored, PSI-formatted bullets" },
      { criterion: "Cover note", points: 25, description: "Compelling narrative; honest about transition" },
      { criterion: "Pitch clarity", points: 25, description: "Clear, confident, structured pitch" },
      { criterion: "Overall coherence", points: 20, description: "Resume, cover note, and pitch tell consistent story" },
    ],
    passingScore: 60, maxScore: 100,
  },
]

// ─── Question Bank ──────────────────────────────────────────────────────────

export const questionDefs = [
  // Product Sense
  { id: "q-ps-1", question: "WhatsApp wants to add a new feature for small business owners in India. What problem would you solve and how?", category: "product_sense", difficulty: "easy", roleTypes: ["consumer", "b2b"], evaluationCriteria: [{ criterion: "Defines specific user segment", points: 20 }, { criterion: "Problem is real and grounded", points: 25 }, { criterion: "Solution addresses the problem", points: 20 }, { criterion: "Considers tradeoffs", points: 15 }, { criterion: "Communication clarity", points: 20 }], sampleAnswer: null, keyPoints: ["Identifies specific business type", "India-specific context", "Ties solution to WhatsApp capabilities", "Considers adoption barriers"] },
  { id: "q-ps-2", question: "You're the PM for Google Maps. A competitor just launched real-time crowd-sourced traffic data. How do you respond?", category: "product_sense", difficulty: "medium", roleTypes: ["consumer", "technical"], evaluationCriteria: [{ criterion: "Competitive analysis", points: 20 }, { criterion: "User impact assessment", points: 25 }, { criterion: "Response strategy", points: 25 }, { criterion: "Prioritization reasoning", points: 15 }, { criterion: "Communication clarity", points: 15 }], sampleAnswer: null, keyPoints: ["Assesses actual threat level", "Considers Google's existing advantages", "Proposes measured response", "Doesn't panic-react"] },
  { id: "q-ps-3", question: "Design a feature that helps Swiggy reduce food waste from cancelled orders.", category: "product_sense", difficulty: "medium", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "Problem understanding", points: 20 }, { criterion: "User segments identified", points: 20 }, { criterion: "Solution feasibility", points: 25 }, { criterion: "Business impact", points: 20 }, { criterion: "Metrics defined", points: 15 }], sampleAnswer: null, keyPoints: ["Understands cancellation reasons", "Multi-stakeholder thinking", "Practical solution", "Measurable outcomes"] },
  { id: "q-ps-4", question: "Swiggy wants to increase order frequency for users who order once a month or less. Design a product solution.", category: "product_sense", difficulty: "hard", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "Segments low-frequency users", points: 20 }, { criterion: "Identifies root causes", points: 20 }, { criterion: "Multiple solution approaches", points: 15 }, { criterion: "Prioritizes with reasoning", points: 15 }, { criterion: "Defines success metrics", points: 15 }, { criterion: "Tests/experiments proposed", points: 15 }], sampleAnswer: null, keyPoints: ["User segmentation", "Root cause analysis", "Multiple approaches", "Experimentation plan"] },
  { id: "q-ps-5", question: "CRED has 50M users but most only open the app once a month to pay bills. How would you increase daily engagement?", category: "product_sense", difficulty: "hard", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "Understands CRED's core value", points: 20 }, { criterion: "Identifies engagement barriers", points: 20 }, { criterion: "Creative yet feasible solutions", points: 25 }, { criterion: "Avoids dark patterns", points: 15 }, { criterion: "Success metrics", points: 20 }], sampleAnswer: null, keyPoints: ["Respects core use case", "Habit formation thinking", "Value-add not engagement trap", "Ethical considerations"] },

  // Analytical / Metrics
  { id: "q-am-1", question: "You're the PM for a food delivery app. Define the north star metric and 4-5 supporting metrics for the consumer experience.", category: "analytical", difficulty: "easy", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "North star metric choice", points: 30 }, { criterion: "Supporting metrics relevance", points: 30 }, { criterion: "Metrics relationships explained", points: 20 }, { criterion: "Communication clarity", points: 20 }], sampleAnswer: null, keyPoints: ["Actionable north star", "Balanced supporting metrics", "Leading and lagging indicators", "Clear reasoning"] },
  { id: "q-am-2", question: "Your app's Day-7 retention dropped from 40% to 32% in the last month. Walk me through how you'd investigate.", category: "analytical", difficulty: "medium", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "Structured investigation", points: 25 }, { criterion: "Segmentation thinking", points: 25 }, { criterion: "Hypothesis quality", points: 25 }, { criterion: "Action plan", points: 25 }], sampleAnswer: null, keyPoints: ["Checks for external factors", "Segments by cohort", "Multiple hypotheses", "Clear next steps"] },
  { id: "q-am-3", question: "PhonePe's UPI transaction success rate dropped from 96% to 91% in the last week. Walk me through your investigation and response.", category: "analytical", difficulty: "hard", roleTypes: ["technical", "consumer"], evaluationCriteria: [{ criterion: "Clarifies scope first", points: 15 }, { criterion: "Structured investigation", points: 25 }, { criterion: "Data-driven hypotheses", points: 20 }, { criterion: "External factors considered", points: 15 }, { criterion: "Immediate + long-term actions", points: 15 }, { criterion: "Communication plan", points: 10 }], sampleAnswer: null, keyPoints: ["Scoping questions", "Systematic approach", "Bank/infra awareness", "Escalation protocol"] },
  { id: "q-am-4", question: "Design a metrics dashboard for a B2B SaaS product's customer success team.", category: "analytical", difficulty: "medium", roleTypes: ["b2b", "growth"], evaluationCriteria: [{ criterion: "Relevant metrics chosen", points: 30 }, { criterion: "Audience awareness", points: 25 }, { criterion: "Actionability", points: 25 }, { criterion: "Communication clarity", points: 20 }], sampleAnswer: null, keyPoints: ["Churn indicators", "Health score thinking", "Expansion opportunities", "Actionable alerts"] },

  // Strategy
  { id: "q-st-1", question: "Flipkart wants to enter the grocery delivery market in India. Should they? How?", category: "strategy", difficulty: "medium", roleTypes: ["consumer", "growth", "b2b"], evaluationCriteria: [{ criterion: "Market analysis", points: 25 }, { criterion: "Competitive landscape", points: 25 }, { criterion: "Strategic reasoning", points: 25 }, { criterion: "Go-to-market approach", points: 25 }], sampleAnswer: null, keyPoints: ["Market size assessment", "Competitor analysis", "Flipkart's advantages/disadvantages", "Phased approach"] },
  { id: "q-st-2", question: "You're the PM at a startup with 6 months of runway. The CEO wants to build 3 new features. You can only build 1. How do you decide?", category: "strategy", difficulty: "hard", roleTypes: ["consumer", "growth", "b2b"], evaluationCriteria: [{ criterion: "Urgency awareness", points: 20 }, { criterion: "Decision framework", points: 25 }, { criterion: "Revenue/survival focus", points: 25 }, { criterion: "Communication to CEO", points: 15 }, { criterion: "Risk assessment", points: 15 }], sampleAnswer: null, keyPoints: ["Survival mode thinking", "Impact vs. effort", "Revenue proximity", "Honest stakeholder communication"] },
  { id: "q-st-3", question: "Should Razorpay build a lending product for SMBs? Make the case for or against.", category: "strategy", difficulty: "hard", roleTypes: ["b2b", "growth"], evaluationCriteria: [{ criterion: "Market opportunity", points: 25 }, { criterion: "Strategic fit", points: 25 }, { criterion: "Risk analysis", points: 25 }, { criterion: "Recommendation clarity", points: 25 }], sampleAnswer: null, keyPoints: ["Data advantage", "Regulatory awareness", "Risk management", "Strategic alignment"] },

  // Behavioral
  { id: "q-bh-1", question: "Tell me about a time you had to convince someone to change their approach on a project.", category: "behavioral", difficulty: "easy", roleTypes: ["consumer", "growth", "technical", "platform", "ai", "b2b"], evaluationCriteria: [{ criterion: "Situation clarity", points: 20 }, { criterion: "Action specificity", points: 30 }, { criterion: "Result impact", points: 25 }, { criterion: "Self-awareness", points: 25 }], sampleAnswer: null, keyPoints: ["Specific situation", "Your actions not team", "Measurable result", "What you learned"] },
  { id: "q-bh-2", question: "Describe a situation where you had to make a decision with incomplete information. What did you do?", category: "behavioral", difficulty: "medium", roleTypes: ["consumer", "growth", "technical", "platform", "ai", "b2b"], evaluationCriteria: [{ criterion: "Ambiguity handling", points: 25 }, { criterion: "Decision framework", points: 25 }, { criterion: "Outcome", points: 25 }, { criterion: "Learning", points: 25 }], sampleAnswer: null, keyPoints: ["Acknowledges uncertainty", "Structured approach despite ambiguity", "Outcome-focused", "Honest reflection"] },
  { id: "q-bh-3", question: "Tell me about your biggest professional failure. What happened, and what did you learn?", category: "behavioral", difficulty: "hard", roleTypes: ["consumer", "growth", "technical", "platform", "ai", "b2b"], evaluationCriteria: [{ criterion: "Genuine vulnerability", points: 25 }, { criterion: "Ownership", points: 25 }, { criterion: "Learning depth", points: 30 }, { criterion: "Growth demonstrated", points: 20 }], sampleAnswer: null, keyPoints: ["Real failure not humble-brag", "Takes responsibility", "Specific learning", "Changed behavior"] },
  { id: "q-bh-4", question: "Tell me about a time you had to push back on a request from a senior leader.", category: "behavioral", difficulty: "medium", roleTypes: ["consumer", "growth", "technical", "platform", "ai", "b2b"], evaluationCriteria: [{ criterion: "Context and stakes", points: 20 }, { criterion: "Approach to pushback", points: 30 }, { criterion: "Outcome", points: 25 }, { criterion: "Relationship impact", points: 25 }], sampleAnswer: null, keyPoints: ["Respectful but firm", "Data-backed reasoning", "Outcome focused", "Maintained relationship"] },

  // Technical
  { id: "q-tc-1", question: "Explain how a ride-sharing app works from a technical perspective — what happens from the moment a user requests a ride?", category: "technical", difficulty: "easy", roleTypes: ["technical", "platform"], evaluationCriteria: [{ criterion: "System components identified", points: 30 }, { criterion: "Data flow understanding", points: 25 }, { criterion: "Technical accuracy", points: 25 }, { criterion: "Communication clarity", points: 20 }], sampleAnswer: null, keyPoints: ["Client-server flow", "Location services", "Matching algorithm", "Real-time updates"] },
  { id: "q-tc-2", question: "Your engineering team says a feature you want will take 3 months. You think it should take 3 weeks. How do you handle this?", category: "technical", difficulty: "medium", roleTypes: ["technical", "platform", "consumer"], evaluationCriteria: [{ criterion: "Respectful approach", points: 25 }, { criterion: "Scope exploration", points: 25 }, { criterion: "Technical curiosity", points: 25 }, { criterion: "Collaborative resolution", points: 25 }], sampleAnswer: null, keyPoints: ["Doesn't dismiss engineering estimate", "Explores scope reduction", "Understands hidden complexity", "Finds middle ground"] },
  { id: "q-tc-3", question: "Design the system architecture for a real-time collaborative document editor (like Google Docs). What are the key technical challenges?", category: "technical", difficulty: "hard", roleTypes: ["technical", "platform", "ai"], evaluationCriteria: [{ criterion: "Architecture understanding", points: 25 }, { criterion: "Concurrency handling", points: 25 }, { criterion: "Scalability thinking", points: 25 }, { criterion: "Communication clarity", points: 25 }], sampleAnswer: null, keyPoints: ["Real-time sync challenges", "Conflict resolution (OT/CRDT)", "Scalability considerations", "Offline handling"] },

  // Estimation
  { id: "q-es-1", question: "How many Swiggy deliveries happen in Bangalore on a typical Saturday evening?", category: "estimation", difficulty: "easy", roleTypes: ["consumer", "growth"], evaluationCriteria: [{ criterion: "Structured approach", points: 30 }, { criterion: "Reasonable assumptions", points: 30 }, { criterion: "Math accuracy", points: 20 }, { criterion: "Sanity check", points: 20 }], sampleAnswer: null, keyPoints: ["Top-down or bottom-up", "States assumptions explicitly", "Arrives at reasonable number", "Cross-checks"] },
  { id: "q-es-2", question: "Estimate the annual revenue of Zomato Gold/Pro membership program in India.", category: "estimation", difficulty: "medium", roleTypes: ["consumer", "growth", "b2b"], evaluationCriteria: [{ criterion: "Structured approach", points: 25 }, { criterion: "Market sizing logic", points: 25 }, { criterion: "Assumption quality", points: 25 }, { criterion: "Final estimate reasonableness", points: 25 }], sampleAnswer: null, keyPoints: ["Total Zomato users", "Conversion to paid", "Pricing tiers", "Cross-validation"] },
  { id: "q-es-3", question: "Estimate the revenue opportunity for Razorpay if they launched a BNPL product for small merchants.", category: "estimation", difficulty: "hard", roleTypes: ["b2b", "growth"], evaluationCriteria: [{ criterion: "Market definition", points: 25 }, { criterion: "Revenue model thinking", points: 25 }, { criterion: "Assumption quality", points: 25 }, { criterion: "Risk awareness", points: 25 }], sampleAnswer: null, keyPoints: ["SMB segment sizing", "BNPL adoption rates", "Revenue per transaction", "Default risk consideration"] },

  // Execution
  { id: "q-ex-1", question: "You just launched a new feature and adoption is 50% lower than expected. Walk me through your next steps.", category: "execution", difficulty: "easy", roleTypes: ["consumer", "growth", "technical"], evaluationCriteria: [{ criterion: "Investigation approach", points: 25 }, { criterion: "Hypothesis generation", points: 25 }, { criterion: "Action plan", points: 25 }, { criterion: "Communication", points: 25 }], sampleAnswer: null, keyPoints: ["Data first", "Multiple hypotheses", "Quick wins vs. deeper fixes", "Stakeholder communication"] },
  { id: "q-ex-2", question: "Your sprint is halfway through and a critical bug is found in a feature from the previous release. How do you handle it?", category: "execution", difficulty: "medium", roleTypes: ["technical", "consumer", "platform"], evaluationCriteria: [{ criterion: "Severity assessment", points: 25 }, { criterion: "Prioritization decision", points: 25 }, { criterion: "Communication plan", points: 25 }, { criterion: "Prevention thinking", points: 25 }], sampleAnswer: null, keyPoints: ["Assesses impact first", "Triage decision", "Clear communication", "Post-mortem mindset"] },
  { id: "q-ex-3", question: "You're managing a product launch across 3 teams (engineering, marketing, sales). Engineering is behind schedule by 2 weeks. What do you do?", category: "execution", difficulty: "hard", roleTypes: ["consumer", "b2b", "technical"], evaluationCriteria: [{ criterion: "Situation assessment", points: 20 }, { criterion: "Options generation", points: 25 }, { criterion: "Decision and reasoning", points: 25 }, { criterion: "Stakeholder management", points: 20 }, { criterion: "Risk mitigation", points: 10 }], sampleAnswer: null, keyPoints: ["Scope reduction options", "Phased launch possibility", "Cross-team alignment", "Proactive communication"] },
]
