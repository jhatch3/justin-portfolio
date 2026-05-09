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
      'Built a Claude and FastAPI sales chatbot that qualifies prospects across dozens of machines inside a 3D and AR demo.',
      "Used Anthropic's tool-use API to emit structured calls so the frontend renders deterministic calls-to-action without parsing free text.",
      'Red-teamed the system prompt against five jailbreak vectors; all were rejected through a single canonical refusal.',
      'Cut inference cost through prompt caching, and added per-IP rate limiting, a 24-hour token budget, and structured logs that track request IDs and cached-token counts.',
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
      'Lead two projects: Crop Share, a supply-chain provenance system that tracks produce from farm to retailer via linked-list-style record chains (not on-chain), and Trial Weave, GLP-1 cohort analytics built on real-world evidence.',
      'Translate stakeholder needs into clear scopes, acceptance criteria, and implementation plans.',
      'Sit on the recruitment board, present in core CS classes, and interview engineering candidates.',
      'Grew the group by more than 30 percent in under a year.',
    ],
    tags: ['Leadership', 'Rust', 'Postgres', 'Recruitment'],
  },
  {
    company: 'Oregon Software Consulting',
    role:    'Junior Software Developer',
    type:    'Freelance',
    where:   'Eugene, Oregon',
    start:   'Oct 2025',
    end:     'Jan 2026',
    bullets: [
      'Client-facing software engineering across data and AI scopes.',
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
      'Built a Power Automate plus LLM automation system that files online invoices and statements without human review.',
      'Reduced manual processing time by roughly 100 percent, effectively eliminating the task.',
    ],
    tags: ['Power Automate', 'Excel', 'Power BI'],
  },
];
