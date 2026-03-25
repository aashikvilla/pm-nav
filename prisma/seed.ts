/**
 * Prisma Seed — PM Nav
 * Run: pnpm prisma db seed
 *
 * Seeds: skill categories, skills, role weights, learning stages, question bank
 */

import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding skill categories...")
  const categories = await Promise.all([
    prisma.skillCategory.upsert({ where: { slug: "product-thinking" }, update: {}, create: { id: "cat-1", name: "Product Thinking", slug: "product-thinking", description: "First principles, problem framing, user empathy, competitive analysis", sortOrder: 1 } }),
    prisma.skillCategory.upsert({ where: { slug: "analytical-data" }, update: {}, create: { id: "cat-2", name: "Analytical & Data", slug: "analytical-data", description: "Metrics, experimentation, funnel analysis, SQL, data-driven decisions", sortOrder: 2 } }),
    prisma.skillCategory.upsert({ where: { slug: "user-understanding" }, update: {}, create: { id: "cat-3", name: "User Understanding", slug: "user-understanding", description: "User research, personas, journey mapping, usability testing", sortOrder: 3 } }),
    prisma.skillCategory.upsert({ where: { slug: "technical-acumen" }, update: {}, create: { id: "cat-4", name: "Technical Acumen", slug: "technical-acumen", description: "How software works, APIs, system design, engineering collaboration", sortOrder: 4 } }),
    prisma.skillCategory.upsert({ where: { slug: "communication-influence" }, update: {}, create: { id: "cat-5", name: "Communication & Influence", slug: "communication-influence", description: "PRD writing, stakeholder management, presentations, storytelling", sortOrder: 5 } }),
    prisma.skillCategory.upsert({ where: { slug: "execution-delivery" }, update: {}, create: { id: "cat-6", name: "Execution & Delivery", slug: "execution-delivery", description: "Agile, sprint planning, risk management, cross-functional coordination", sortOrder: 6 } }),
    prisma.skillCategory.upsert({ where: { slug: "business-acumen" }, update: {}, create: { id: "cat-7", name: "Business Acumen", slug: "business-acumen", description: "Business models, monetization, unit economics, GTM strategy", sortOrder: 7 } }),
    prisma.skillCategory.upsert({ where: { slug: "leadership-collaboration" }, update: {}, create: { id: "cat-8", name: "Leadership & Collaboration", slug: "leadership-collaboration", description: "Leading without authority, decision-making, conflict resolution", sortOrder: 8 } }),
  ])
  console.log(`  ✓ ${categories.length} categories`)

  console.log("Seeding skills...")
  const skillDefs = [
    // Product Thinking
    { id: "sk-1",  categoryId: "cat-1", name: "Problem Definition & Framing",    slug: "problem-framing",      sortOrder: 1 },
    { id: "sk-2",  categoryId: "cat-1", name: "User Empathy & Product Sense",     slug: "product-sense",        sortOrder: 2 },
    { id: "sk-3",  categoryId: "cat-1", name: "Competitive Analysis",             slug: "competitive-analysis", sortOrder: 3 },
    { id: "sk-4",  categoryId: "cat-1", name: "Product Vision & Strategy",        slug: "product-vision",       sortOrder: 4 },
    { id: "sk-5",  categoryId: "cat-1", name: "Jobs To Be Done",                  slug: "jtbd",                 sortOrder: 5 },
    // Analytical & Data
    { id: "sk-6",  categoryId: "cat-2", name: "Defining Success Metrics",         slug: "success-metrics",      sortOrder: 1 },
    { id: "sk-7",  categoryId: "cat-2", name: "Funnel & Cohort Analysis",         slug: "funnel-analysis",      sortOrder: 2 },
    { id: "sk-8",  categoryId: "cat-2", name: "A/B Testing & Experimentation",    slug: "experimentation",      sortOrder: 3 },
    { id: "sk-9",  categoryId: "cat-2", name: "SQL & Data Querying",              slug: "sql",                  sortOrder: 4 },
    { id: "sk-10", categoryId: "cat-2", name: "Data-Driven Decision Making",      slug: "data-decisions",       sortOrder: 5 },
    // User Understanding
    { id: "sk-11", categoryId: "cat-3", name: "User Interviews & Surveys",        slug: "user-interviews",      sortOrder: 1 },
    { id: "sk-12", categoryId: "cat-3", name: "Persona Creation",                 slug: "personas",             sortOrder: 2 },
    { id: "sk-13", categoryId: "cat-3", name: "Journey Mapping",                  slug: "journey-mapping",      sortOrder: 3 },
    { id: "sk-14", categoryId: "cat-3", name: "Usability Testing",                slug: "usability-testing",    sortOrder: 4 },
    { id: "sk-15", categoryId: "cat-3", name: "Synthesis & Insight Generation",   slug: "research-synthesis",   sortOrder: 5 },
    // Technical Acumen
    { id: "sk-16", categoryId: "cat-4", name: "Software Development Lifecycle",   slug: "sdlc",                 sortOrder: 1 },
    { id: "sk-17", categoryId: "cat-4", name: "API & Systems Thinking",           slug: "systems-thinking",     sortOrder: 2 },
    { id: "sk-18", categoryId: "cat-4", name: "Technical Feasibility Assessment", slug: "tech-feasibility",     sortOrder: 3 },
    { id: "sk-19", categoryId: "cat-4", name: "Engineering Collaboration",        slug: "eng-collaboration",    sortOrder: 4 },
    { id: "sk-20", categoryId: "cat-4", name: "Data Architecture Basics",         slug: "data-architecture",    sortOrder: 5 },
    // Communication & Influence
    { id: "sk-21", categoryId: "cat-5", name: "PRD & Spec Writing",               slug: "prd-writing",          sortOrder: 1 },
    { id: "sk-22", categoryId: "cat-5", name: "Stakeholder Management",           slug: "stakeholder-mgmt",     sortOrder: 2 },
    { id: "sk-23", categoryId: "cat-5", name: "Executive Presentations",          slug: "exec-presentations",   sortOrder: 3 },
    { id: "sk-24", categoryId: "cat-5", name: "User Story Writing",               slug: "user-stories",         sortOrder: 4 },
    { id: "sk-25", categoryId: "cat-5", name: "Cross-Functional Communication",   slug: "cross-func-comms",     sortOrder: 5 },
    // Execution & Delivery
    { id: "sk-26", categoryId: "cat-6", name: "Agile & Scrum",                    slug: "agile",                sortOrder: 1 },
    { id: "sk-27", categoryId: "cat-6", name: "Prioritization Frameworks",        slug: "prioritization",       sortOrder: 2 },
    { id: "sk-28", categoryId: "cat-6", name: "Launch Planning & Go-Live",        slug: "launch-planning",      sortOrder: 3 },
    { id: "sk-29", categoryId: "cat-6", name: "Risk Identification & Mitigation", slug: "risk-management",      sortOrder: 4 },
    { id: "sk-30", categoryId: "cat-6", name: "Delivery Tracking & Reporting",    slug: "delivery-tracking",    sortOrder: 5 },
    // Business Acumen
    { id: "sk-31", categoryId: "cat-7", name: "Business Model Understanding",     slug: "business-models",      sortOrder: 1 },
    { id: "sk-32", categoryId: "cat-7", name: "Revenue & Monetization Strategy",  slug: "monetization",         sortOrder: 2 },
    { id: "sk-33", categoryId: "cat-7", name: "Unit Economics",                   slug: "unit-economics",       sortOrder: 3 },
    { id: "sk-34", categoryId: "cat-7", name: "Go-To-Market Strategy",            slug: "gtm-strategy",         sortOrder: 4 },
    // Leadership & Collaboration
    { id: "sk-35", categoryId: "cat-8", name: "Leading Without Authority",        slug: "leading-without-auth", sortOrder: 1 },
    { id: "sk-36", categoryId: "cat-8", name: "Decision-Making Frameworks",       slug: "decision-making",      sortOrder: 2 },
    { id: "sk-37", categoryId: "cat-8", name: "Conflict Resolution",              slug: "conflict-resolution",  sortOrder: 3 },
    { id: "sk-38", categoryId: "cat-8", name: "Mentoring & Team Development",     slug: "mentoring",            sortOrder: 4 },
  ]
  for (const s of skillDefs) {
    await prisma.skill.upsert({ where: { slug: s.slug }, update: {}, create: s })
  }
  console.log(`  ✓ ${skillDefs.length} skills`)

  console.log("Seeding role weights...")
  const roleTypes = ["consumer", "growth", "technical", "platform", "ai", "b2b"]
  const weightMap: Record<string, number[]> = {
    consumer:  [0.25, 0.15, 0.20, 0.10, 0.15, 0.08, 0.04, 0.03],
    growth:    [0.15, 0.28, 0.12, 0.10, 0.10, 0.12, 0.10, 0.03],
    technical: [0.18, 0.18, 0.10, 0.25, 0.12, 0.10, 0.04, 0.03],
    platform:  [0.18, 0.15, 0.08, 0.25, 0.14, 0.12, 0.05, 0.03],
    ai:        [0.20, 0.22, 0.10, 0.22, 0.12, 0.08, 0.04, 0.02],
    b2b:       [0.18, 0.15, 0.12, 0.10, 0.20, 0.10, 0.12, 0.03],
  }
  const catIds = ["cat-1", "cat-2", "cat-3", "cat-4", "cat-5", "cat-6", "cat-7", "cat-8"]
  for (const role of roleTypes) {
    for (let i = 0; i < catIds.length; i++) {
      await prisma.roleWeight.upsert({
        where: { roleType_categoryId: { roleType: role, categoryId: catIds[i] } },
        update: { weight: weightMap[role][i] },
        create: { roleType: role, categoryId: catIds[i], weight: weightMap[role][i] },
      })
    }
  }
  console.log(`  ✓ ${roleTypes.length * catIds.length} role weights`)

  console.log("Seeding learning stages...")
  const stages = [
    { id: "ls-1",  stageNumber: 1,  title: "PM Fundamentals",                     slug: "pm-fundamentals",        description: "What PMs do, role types, day-in-the-life, PM vs adjacent roles", estimatedHours: "3-5",  skillCategories: ["product-thinking"] },
    { id: "ls-2",  stageNumber: 2,  title: "Product Thinking & Problem Framing",  slug: "product-thinking",       description: "First principles, JTBD, competitive analysis, product sense", estimatedHours: "8-12", skillCategories: ["product-thinking"] },
    { id: "ls-3",  stageNumber: 3,  title: "User Research & Understanding",       slug: "user-research",          description: "Qualitative research, user interviews, persona creation, journey mapping", estimatedHours: "8-12", skillCategories: ["user-understanding"] },
    { id: "ls-4",  stageNumber: 4,  title: "Metrics & Analytical Thinking",       slug: "metrics-analytics",      description: "Success metrics, funnels, cohort analysis, A/B testing, SQL basics", estimatedHours: "10-15", skillCategories: ["analytical-data"] },
    { id: "ls-5",  stageNumber: 5,  title: "Prioritization & Strategy",           slug: "prioritization-strategy",description: "RICE/ICE, opportunity assessment, product vision, roadmap, tradeoffs", estimatedHours: "8-12", skillCategories: ["product-thinking", "business-acumen"] },
    { id: "ls-6",  stageNumber: 6,  title: "Technical Foundations for PMs",       slug: "technical-foundations",  description: "How software works, APIs, system design basics, dev lifecycle", estimatedHours: "6-10", skillCategories: ["technical-acumen"] },
    { id: "ls-7",  stageNumber: 7,  title: "Communication & Stakeholder Mgmt",   slug: "communication",          description: "PRD writing, user stories, stakeholder mapping, managing up", estimatedHours: "8-12", skillCategories: ["communication-influence"] },
    { id: "ls-8",  stageNumber: 8,  title: "Execution & Delivery",                slug: "execution-delivery",     description: "Agile/Scrum, sprint planning, launch planning, risk management", estimatedHours: "6-10", skillCategories: ["execution-delivery"] },
    { id: "ls-9",  stageNumber: 9,  title: "Business Acumen & Strategy",          slug: "business-acumen",        description: "Business models, monetization, unit economics, GTM, pricing", estimatedHours: "6-8",  skillCategories: ["business-acumen"] },
    { id: "ls-10", stageNumber: 10, title: "Leadership & Influence",               slug: "leadership-influence",   description: "Leading without authority, decision-making, conflict resolution", estimatedHours: "5-8",  skillCategories: ["leadership-collaboration"] },
    { id: "ls-11", stageNumber: 11, title: "Building Your PM Portfolio",           slug: "pm-portfolio",           description: "Side project, case study creation, proof of work", estimatedHours: "10-15", skillCategories: ["product-thinking", "communication-influence"] },
    { id: "ls-12", stageNumber: 12, title: "Application Readiness",                slug: "application-readiness",  description: "Resume optimization, interview story crafting, behavioral prep", estimatedHours: "5-8",  skillCategories: ["communication-influence"] },
  ]
  for (const stage of stages) {
    await prisma.learningStage.upsert({ where: { stageNumber: stage.stageNumber }, update: {}, create: stage })
  }
  console.log(`  ✓ ${stages.length} learning stages`)

  console.log("Seed complete ✓")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
