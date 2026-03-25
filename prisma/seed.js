/**
 * Seed script (plain JS, runs directly with node)
 * Run: node prisma/seed.js
 */
const { Client } = require("pg");

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Connected to database");

  // ── Skill Categories ──────────────────────────────────────────────
  console.log("Seeding skill categories...");
  await client.query(`
    INSERT INTO skill_categories (id, name, slug, description, sort_order) VALUES
    ('cat-1','Product Thinking','product-thinking','First principles, problem framing, user empathy, competitive analysis',1),
    ('cat-2','Analytical & Data','analytical-data','Metrics, experimentation, funnel analysis, SQL, data-driven decisions',2),
    ('cat-3','User Understanding','user-understanding','User research, personas, journey mapping, usability testing',3),
    ('cat-4','Technical Acumen','technical-acumen','How software works, APIs, system design, engineering collaboration',4),
    ('cat-5','Communication & Influence','communication-influence','PRD writing, stakeholder management, presentations, storytelling',5),
    ('cat-6','Execution & Delivery','execution-delivery','Agile, sprint planning, risk management, cross-functional coordination',6),
    ('cat-7','Business Acumen','business-acumen','Business models, monetization, unit economics, GTM strategy',7),
    ('cat-8','Leadership & Collaboration','leadership-collaboration','Leading without authority, decision-making, conflict resolution',8)
    ON CONFLICT (slug) DO NOTHING
  `);
  console.log("  ✓ 8 skill categories");

  // ── Skills (38) ───────────────────────────────────────────────────
  console.log("Seeding skills...");
  await client.query(`
    INSERT INTO skills (id, category_id, name, slug, sort_order) VALUES
    ('sk-1','cat-1','Problem Definition & Framing','problem-framing',1),
    ('sk-2','cat-1','User Empathy & Product Sense','product-sense',2),
    ('sk-3','cat-1','Competitive Analysis','competitive-analysis',3),
    ('sk-4','cat-1','Product Vision & Strategy','product-vision',4),
    ('sk-5','cat-1','Jobs To Be Done','jtbd',5),
    ('sk-6','cat-2','Defining Success Metrics','success-metrics',1),
    ('sk-7','cat-2','Funnel & Cohort Analysis','funnel-analysis',2),
    ('sk-8','cat-2','A/B Testing & Experimentation','experimentation',3),
    ('sk-9','cat-2','SQL & Data Querying','sql',4),
    ('sk-10','cat-2','Data-Driven Decision Making','data-decisions',5),
    ('sk-11','cat-3','User Interviews & Surveys','user-interviews',1),
    ('sk-12','cat-3','Persona Creation','personas',2),
    ('sk-13','cat-3','Journey Mapping','journey-mapping',3),
    ('sk-14','cat-3','Usability Testing','usability-testing',4),
    ('sk-15','cat-3','Synthesis & Insight Generation','research-synthesis',5),
    ('sk-16','cat-4','Software Development Lifecycle','sdlc',1),
    ('sk-17','cat-4','API & Systems Thinking','systems-thinking',2),
    ('sk-18','cat-4','Technical Feasibility Assessment','tech-feasibility',3),
    ('sk-19','cat-4','Engineering Collaboration','eng-collaboration',4),
    ('sk-20','cat-4','Data Architecture Basics','data-architecture',5),
    ('sk-21','cat-5','PRD & Spec Writing','prd-writing',1),
    ('sk-22','cat-5','Stakeholder Management','stakeholder-mgmt',2),
    ('sk-23','cat-5','Executive Presentations','exec-presentations',3),
    ('sk-24','cat-5','User Story Writing','user-stories',4),
    ('sk-25','cat-5','Cross-Functional Communication','cross-func-comms',5),
    ('sk-26','cat-6','Agile & Scrum','agile',1),
    ('sk-27','cat-6','Prioritization Frameworks','prioritization',2),
    ('sk-28','cat-6','Launch Planning & Go-Live','launch-planning',3),
    ('sk-29','cat-6','Risk Identification & Mitigation','risk-management',4),
    ('sk-30','cat-6','Delivery Tracking & Reporting','delivery-tracking',5),
    ('sk-31','cat-7','Business Model Understanding','business-models',1),
    ('sk-32','cat-7','Revenue & Monetization Strategy','monetization',2),
    ('sk-33','cat-7','Unit Economics','unit-economics',3),
    ('sk-34','cat-7','Go-To-Market Strategy','gtm-strategy',4),
    ('sk-35','cat-8','Leading Without Authority','leading-without-auth',1),
    ('sk-36','cat-8','Decision-Making Frameworks','decision-making',2),
    ('sk-37','cat-8','Conflict Resolution','conflict-resolution',3),
    ('sk-38','cat-8','Mentoring & Team Development','mentoring',4)
    ON CONFLICT (slug) DO NOTHING
  `);
  console.log("  ✓ 38 skills");

  // ── Role Weights ──────────────────────────────────────────────────
  console.log("Seeding role weights...");
  const weights = {
    consumer:  [0.25,0.15,0.20,0.10,0.15,0.08,0.04,0.03],
    growth:    [0.15,0.28,0.12,0.10,0.10,0.12,0.10,0.03],
    technical: [0.18,0.18,0.10,0.25,0.12,0.10,0.04,0.03],
    platform:  [0.18,0.15,0.08,0.25,0.14,0.12,0.05,0.03],
    ai:        [0.20,0.22,0.10,0.22,0.12,0.08,0.04,0.02],
    b2b:       [0.18,0.15,0.12,0.10,0.20,0.10,0.12,0.03],
  };
  const catIds = ['cat-1','cat-2','cat-3','cat-4','cat-5','cat-6','cat-7','cat-8'];
  for (const [role, wts] of Object.entries(weights)) {
    for (let i = 0; i < catIds.length; i++) {
      await client.query(
        `INSERT INTO role_weights (id, role_type, category_id, weight)
         VALUES ($1, $2, $3, $4) ON CONFLICT (role_type, category_id) DO UPDATE SET weight = $4`,
        [`rw-${role[0]}${i+1}`, role, catIds[i], wts[i]]
      );
    }
  }
  console.log("  ✓ 48 role weights");

  // ── Learning Stages ───────────────────────────────────────────────
  console.log("Seeding learning stages...");
  await client.query(`
    INSERT INTO learning_stages (id, stage_number, title, slug, description, estimated_hours, skill_categories) VALUES
    ('ls-1',1,'PM Fundamentals','pm-fundamentals','What PMs do, role types, day-in-the-life, PM vs adjacent roles','3-5',ARRAY['product-thinking']),
    ('ls-2',2,'Product Thinking & Problem Framing','product-thinking','First principles, JTBD, competitive analysis, product sense','8-12',ARRAY['product-thinking']),
    ('ls-3',3,'User Research & Understanding','user-research','Qualitative research, user interviews, persona creation, journey mapping','8-12',ARRAY['user-understanding']),
    ('ls-4',4,'Metrics & Analytical Thinking','metrics-analytics','Success metrics, funnels, cohort analysis, A/B testing, SQL basics','10-15',ARRAY['analytical-data']),
    ('ls-5',5,'Prioritization & Strategy','prioritization-strategy','RICE/ICE, opportunity assessment, product vision, roadmap, tradeoffs','8-12',ARRAY['product-thinking','business-acumen']),
    ('ls-6',6,'Technical Foundations for PMs','technical-foundations','How software works, APIs, system design basics, dev lifecycle','6-10',ARRAY['technical-acumen']),
    ('ls-7',7,'Communication & Stakeholder Management','communication','PRD writing, user stories, stakeholder mapping, managing up','8-12',ARRAY['communication-influence']),
    ('ls-8',8,'Execution & Delivery','execution-delivery','Agile/Scrum, sprint planning, launch planning, risk management','6-10',ARRAY['execution-delivery']),
    ('ls-9',9,'Business Acumen & Strategy','business-acumen','Business models, monetization, unit economics, GTM, pricing','6-8',ARRAY['business-acumen']),
    ('ls-10',10,'Leadership & Influence','leadership-influence','Leading without authority, decision-making, conflict resolution','5-8',ARRAY['leadership-collaboration']),
    ('ls-11',11,'Building Your PM Portfolio','pm-portfolio','Side project, case study creation, proof of work','10-15',ARRAY['product-thinking','communication-influence']),
    ('ls-12',12,'Application Readiness','application-readiness','Resume optimization, interview story crafting, behavioral prep','5-8',ARRAY['communication-influence'])
    ON CONFLICT (stage_number) DO NOTHING
  `);
  console.log("  ✓ 12 learning stages");

  // ── Question Bank (15 sample questions) ──────────────────────────
  console.log("Seeding question bank...");
  const questions = [
    { id:'q-1', question:"You are a PM at Swiggy. Orders have dropped 15% in the last week. Walk me through how you would diagnose and address this.", category:'product_sense', difficulty:'medium', role_types:['consumer','growth'], criteria:[{criterion:'Hypothesis-driven thinking',points:25},{criterion:'Metric identification',points:25},{criterion:'Prioritization of investigation',points:25},{criterion:'Action plan clarity',points:25}], key_points:["Check if decline is across all cities or isolated","Look at supply-side vs demand-side metrics","Rule out external factors","Define 48hr investigation plan before jumping to solutions"] },
    { id:'q-2', question:"How would you define the north star metric for a B2B SaaS product like Razorpay?", category:'analytical', difficulty:'medium', role_types:['b2b','growth'], criteria:[{criterion:'Metric selection rationale',points:30},{criterion:'Understanding of B2B vs B2C metrics',points:30},{criterion:'Input/output metric distinction',points:40}], key_points:["Distinguish revenue metrics vs product health","Consider payment volume vs active merchants","Explain why not just MRR","Secondary metrics that protect the north star"] },
    { id:'q-3', question:"Design a feature for PhonePe to help first-time users in Tier 3 cities complete their first transaction.", category:'product_sense', difficulty:'hard', role_types:['consumer','growth'], criteria:[{criterion:'User empathy & context',points:25},{criterion:'Problem definition',points:25},{criterion:'Solution creativity',points:25},{criterion:'Success metrics',points:25}], key_points:["Acknowledge literacy/language barriers","Consider feature phone vs smartphone","Define the onboarding funnel clearly","Measurable success criteria"] },
    { id:'q-4', question:"You have requests from 3 stakeholders: Sales wants a dashboard, Engineering wants to refactor auth, a key customer wants an export feature. You can build one. How do you decide?", category:'behavioral', difficulty:'medium', role_types:['consumer','b2b','growth','technical','platform','ai'], criteria:[{criterion:'Framework usage',points:25},{criterion:'Stakeholder handling',points:25},{criterion:'Data gathering',points:25},{criterion:'Decision communication',points:25}], key_points:["Ask clarifying questions first","Use RICE or similar framework","Consider strategic alignment","Communicate to losing stakeholders"] },
    { id:'q-5', question:"Estimate the number of PM job openings in India in 2024.", category:'estimation', difficulty:'medium', role_types:['consumer','b2b','growth','technical','platform','ai'], criteria:[{criterion:'Structured breakdown',points:30},{criterion:'Assumption clarity',points:30},{criterion:'Sanity check',points:20},{criterion:'Communication',points:20}], key_points:["Start from total tech workforce","Break down by company size","Use PM:Engineer ratio","Arrive at a range not single number"] },
    { id:'q-6', question:"Tell me about a time you had to influence a decision without direct authority.", category:'behavioral', difficulty:'medium', role_types:['consumer','b2b','growth','technical','platform','ai'], criteria:[{criterion:'Situation clarity',points:20},{criterion:'Influence tactics',points:30},{criterion:'Outcome',points:30},{criterion:'Learning',points:20}], key_points:["Use STAR format","Specific stakeholder named","Concrete influence tactic","Honest about what worked"] },
    { id:'q-7', question:"How would you improve the LinkedIn job recommendations feature?", category:'product_sense', difficulty:'medium', role_types:['consumer','growth'], criteria:[{criterion:'User research approach',points:25},{criterion:'Problem identification',points:25},{criterion:'Solution prioritization',points:25},{criterion:'Metrics',points:25}], key_points:["Define which user segment","Identify current pain points","Prioritize 1-2 solutions","Define how you measure success"] },
    { id:'q-8', question:"A new engineer says your feature will take 3 months. You told leadership 6 weeks. What do you do?", category:'behavioral', difficulty:'hard', role_types:['consumer','b2b','growth','technical','platform','ai'], criteria:[{criterion:'Immediate actions',points:25},{criterion:'Engineering relationship',points:25},{criterion:'Leadership communication',points:25},{criterion:'Prevention',points:25}], key_points:["Don't dismiss the engineer","Get detail before external communication","Honest conversation with leadership early","Propose scope reduction options"] },
    { id:'q-9', question:"Design an onboarding experience for a new project management tool targeting small teams.", category:'product_sense', difficulty:'medium', role_types:['consumer','b2b'], criteria:[{criterion:'User goal identification',points:25},{criterion:'Onboarding philosophy',points:25},{criterion:'UX decisions',points:25},{criterion:'Success metrics',points:25}], key_points:["Identify the aha moment","Minimize time to first value","Address empty state","Measure activation not just signups"] },
    { id:'q-10', question:"What is the difference between output metrics and outcome metrics? Give an example.", category:'analytical', difficulty:'easy', role_types:['consumer','b2b','growth','technical','platform','ai'], criteria:[{criterion:'Conceptual accuracy',points:40},{criterion:'Example quality',points:30},{criterion:'Application to product decisions',points:30}], key_points:["Output = what team ships","Outcome = what changes for user/business","PMs measured on outcomes","Concrete example"] },
  ];

  for (const q of questions) {
    await client.query(
      `INSERT INTO question_bank (id, question, category, difficulty, role_types, evaluation_criteria, key_points)
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
      [q.id, q.question, q.category, q.difficulty, q.role_types, JSON.stringify(q.criteria), q.key_points]
    );
  }
  console.log("  ✓ 10 sample questions");

  console.log("\nSeed complete ✓");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => client.end());
