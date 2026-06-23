// data/experience.js - work experience, most recent first.

window.JH_DATA.experience = [
  {
    company: 'Stealth Startup',
    role:    'AI Engineer - AWS Bedrock',
    type:    'Contract',
    where:   'Remote',
    start:   'Jun 2026',
    end:     'Present',
    bullets: [
      'Building agent orchestration & harness on AWS Bedrock automating end-to-end business workflows (specifics under NDA).',
    ],
    tags: ['AWS Bedrock', 'Agents', 'Orchestration', 'Python'],
  },
  {
    company: 'Machine & Minds',
    role:    'Applied AI Fellow',
    type:    'Fellowship',
    where:   'Remote',
    start:   'Apr 2026',
    end:     'Present',
    bullets: [
      'Selected for an applied AI fellowship at a firm that helps business leaders identify, build, and deploy AI systems that create real, measurable P&L impact.',
      'Earning the Anthropic CCA-F (300-level) certification.',
    ],
    tags: ['Applied AI', 'Anthropic', 'CCA-F', 'Consulting'],
  },
  {
    company: 'Modern Amenities',
    role:    'AI Engineering Intern',
    type:    'Internship',
    where:   'Coburg, Oregon',
    start:   'Mar 2026',
    end:     'Jun 2026',
    bullets: [
      'Built FastAPI sales chatbot on Claude API qualifying prospects across dozens of machine SKUs in a 3D/AR demo serving 900+ app users; used tool-use API to emit structured calls so the frontend renders deterministic CTAs.',
      'Hardened the system prompt against 5 jailbreak vectors by wrapping untrusted input in delimiters and adding an output scanner, achieving a 100% block rate across all 5 tested attack patterns with zero system-prompt leaks.',
      'Cut inference cost by implementing prompt caching with ephemeral cache_control on the static prefix and a 24h token budget, reducing input token costs by upwards of 90% on cached requests.',
      'Authored a Claude Code skill that generates parameterized placeholder vending-machine 3D models via a Blender Python pipeline, wires them into a staging-only catalog, and reads manufacturer PDFs to seed full machine entries (six SandStar AI kiosks added in a single command).',
    ],
    tags: ['Claude', 'FastAPI', 'Tool Use', 'Prompt Caching', 'RAG', 'Blender', 'Agent Skills'],
  },
  {
    company: 'Oregon Blockchain Group',
    role:    'Lead Software Engineer',
    type:    'Promoted from Software Developer in <3 months',
    where:   'University of Oregon · Eugene',
    start:   'Sep 2024',
    end:     'Jun 2026',
    bullets: [
      'Led 2 engineering projects, Crop Share (farm-to-store supply-chain provenance) and TrialWeave (GLP-1 cohort RWE analytics), translating stakeholder needs into scoped specs and acceptance criteria, shipping across a team of 3-5 developers.',
      'Drove 30%+ membership growth in under a year by serving on the recruitment board, pitching in core CS classes, and interviewing potential candidates.',
      'Promoted from Software Developer to Lead in under three months after shipping initial Crop Share prototypes.',
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
      'Built a Power Automate + LLM automation that files online invoices and statements without human review, drafting summaries, classifying line items, and routing exceptions.',
      'Reduced manual processing time by roughly 100 percent, effectively eliminating the task for the team.',
      'Authored Power BI dashboards over the cleaned invoice data so leadership could track spend without re-running spreadsheets.',
    ],
    tags: ['Power Automate', 'Excel', 'Power BI', 'LLM'],
  },
];
