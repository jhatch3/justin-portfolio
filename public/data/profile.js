// data/profile.js - top-level identity, links, about, certs, honors.
// Loaded FIRST. Creates window.JH_DATA; later data/*.js files extend it.

window.JH_DATA = {
  name: 'Justin Hatch',
  role: 'AI / ML Engineer',
  location: 'Cambridge, Massachusetts',
  domain: 'justinhatch.com',
  graduating: 'June 2026',

  // Current employment status. Consumed by the desktop terminal (apps.jsx), the
  // token-stream widget (widgets.jsx), and the chatbot ground truth
  // (server/system-prompt.mjs) - keep it here so those three can't drift.
  // Deliberately does NOT repeat `location`; call sites compose the two.
  status: {
    line: 'Software Engineer, AI/ML at Horizon Intelligence Labs',
    type: 'full-time',
  },
  school: 'University of Oregon',
  degree: 'B.S. Computer Science · Specialization in DS, ML & AI',

  honors: [
    "Dean's List",
    'Department Honors',
    'QuackHacks II - Winner',
    'ETH Global Hackathon - Top 10% of 470+ projects',
  ],

  links: {
    github:    { label: 'github.com/jhatch3',           href: 'https://github.com/jhatch3' },
    linkedin:  { label: 'linkedin.com/in/justinhatch',  href: 'https://www.linkedin.com/in/justinhatch/' },
    twitter:   { label: 'x.com/jjhatch11',              href: 'https://x.com/jjhatch11' },
    instagram: { label: '@justinhatch',                 href: '#' },
    email:     { label: 'jjhatch03@gmail.com',          href: 'mailto:jjhatch03@gmail.com' },
    resume:    { label: 'resume.pdf',                   href: 'Resume.pdf' },
  },

  about: [
    "Software Engineer, AI/ML at Horizon Intelligence Labs in Cambridge, MA, building and deploying production applications on Cortex, the company's AI platform, and designing the benchmarks that evaluate model capabilities. Previously shipped production LLM systems at Modern Amenities and agent orchestration on AWS Bedrock at Oregon Blockchain Group.",
    "Generalist AI/ML engineer working across language models, autonomous agents, and retrieval-augmented generation. I ship systems that hold up in production: sales agents, cohort analytics, and supply-chain provenance.",
    "Graduated from the University of Oregon in June 2026 with a B.S. in Computer Science, specializing in ML, AI, and Data Science; previously Lead Software Engineer at Oregon Blockchain Group.",
  ],

  certs: [
    'DataCamp - Associate Data Engineer in SQL',
    'Anthropic - CCA-F (300-level)',
    'Intel - Data Visualization',
    'OpenAI - AI Professional Skills',
  ],
};
