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
      "Used Anthropic's tool-use API so the frontend renders deterministic calls-to-action from structured outputs instead of parsing free-text replies.",
      'Red-teamed the system prompt against five jailbreak vectors; all rejected with a single canonical refusal.',
      'Cut inference cost through prompt caching and added per-IP rate limiting, a 24-hour token budget, and structured logs that track request IDs and cached-token counts.',
      'Authored a Claude Code skill that generates parameterized placeholder vending-machine 3D models via a Blender Python pipeline, wires them into a staging-only catalog, and reads manufacturer PDFs to seed full machine entries — six SandStar AI kiosks added in a single command.',
    ],
    tags: ['Claude', 'FastAPI', 'Tool Use', 'Prompt Caching', 'RAG', 'Blender', 'Agent Skills'],
  },
  {
    company: 'Oregon Blockchain Group',
    role:    'Lead Software Engineer',
    type:    'Promoted from Software Developer · Dec 2025',
    where:   'University of Oregon · Eugene',
    start:   'Oct 2025',
    end:     'Present',
    bullets: [
      'Lead two projects: Crop Share, a supply-chain provenance system that tracks produce from farm to retailer via linked-list-style record chains, with consumer-facing QR codes that surface the full chain-of-custody trail; and Trial Weave, GLP-1 cohort analytics built on real-world evidence.',
      'Translate stakeholder needs into clear scopes, acceptance criteria, and implementation plans.',
      'Sat on the recruitment board, presented in core CS classes, and interviewed engineering candidates.',
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
      'Built a Power Automate and LLM automation system that files online invoices and statements without human review.',
      'Reduced manual processing time by roughly 100 percent, effectively eliminating the task.',
    ],
    tags: ['Power Automate', 'Excel', 'Power BI'],
  },
];
