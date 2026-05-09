// data/profile.js — top-level identity, links, about, certs, honors.
// Loaded FIRST. Creates window.JH_DATA; later data/*.js files extend it.

window.JH_DATA = {
  name: 'Justin Hatch',
  role: 'AI / ML Engineer',
  location: 'Eugene, Oregon · Remote',
  domain: 'justinhatch.com',
  graduating: 'June 2026',
  school: 'University of Oregon',
  degree: 'B.S. Computer Science',

  honors: [
    "Dean's List",
    'Department Honors',
    'Quack Hacks II - Winner',
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
    "Generalist AI/ML engineer working across language models, autonomous agents, and retrieval-augmented generation. I ship systems that hold up in production: sales agents, cohort analytics, and supply-chain provenance.",
    "Currently AI Engineering Intern at Modern Amenities and Lead Software Engineer at Oregon Blockchain Group, graduating from the University of Oregon in June 2026.",
  ],

  certs: [
    'DataCamp - Associate Data Engineer in SQL',
    'Intel - Data Visualization',
    'OpenAI - AI Professional Skills',
  ],
};
