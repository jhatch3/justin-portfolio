// data/experience.js — work experience, most recent first.

window.JH_DATA.experience = [
  {
    company: 'Modern Amenities',
    role:    'AI Engineering Intern - AIMS',
    type:    'Internship',
    where:   'Coburg, Oregon',
    start:   'Mar 2026',
    end:     'Present',
    bullets: [
      'Built Claude + FastAPI sales chatbot qualifying prospects across dozens of machines in a 3D/AR demo.',
      'Used tool-use API to emit structured calls so the frontend renders deterministic CTAs.',
      'Red-teamed system prompt against 5 jailbreak vectors - all rejected via a single canonical refusal.',
      'Cut inference cost via prompt caching; added rate limit, 24h token budget, and structured logs with request IDs and cached-token counts.',
    ],
    tags: ['Claude', 'FastAPI', 'Tool Use', 'Prompt Caching', 'RAG'],
  },
  {
    company: 'Oregon Blockchain Group',
    role:    'Lead Software Engineer',
    type:    'Promoted from Software Developer · Dec 2025',
    where:   'University of Oregon · Eugene',
    start:   'Oct 2025',
    end:     'Present',
    bullets: [
      'Lead 2 projects: Crop Share (supply-chain provenance, farm → retailer) and Trial Weave (GLP-1 tracking with cohort RWE analytics).',
      'Translate stakeholder needs into scopes, acceptance criteria, and implementation plans.',
      'Sit on the recruitment board, pitch in core CS classes, interview engineering candidates.',
      'Grew the group >30% in under a year.',
    ],
    tags: ['Leadership', 'Rust', 'Postgres', 'Recruitment'],
  },
  {
    company: 'Oregon Software Consulting',
    role:    'Jr Software Developer',
    type:    'Freelance',
    where:   'Eugene, Oregon',
    start:   'Oct 2025',
    end:     'Jan 2026',
    bullets: [
      'Client-facing software engineering across data + AI scopes.',
    ],
    tags: ['Python', 'Data', 'AI'],
  },
  {
    company: 'University of Oregon',
    role:    'Student Business Operations Assistant',
    type:    'Part-time',
    where:   'Eugene, Oregon',
    start:   'Oct 2023',
    end:     'Present',
    bullets: [
      'Built a Power Automate + LLM automation system that files online invoices and statements.',
      'Reduced manual processing time by ~100%.',
    ],
    tags: ['Power Automate', 'Excel', 'Power BI'],
  },
];
