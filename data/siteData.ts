// src/data/siteData.ts

export const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const skills: Record<string, string[]> = {
  Programming: [
    "Python",
    "NumPy",
    "Pandas",
    "Scikit-Learn",
    "Matplotlib",
    "Seaborn",
    "PySpark",
    "SQL",
    "C",
    "C++",
    "JavaScript",
    "HTML/CSS",
  ],
  "Frameworks & Tools": [
    "Flask",
    "FastAPI",
    "Streamlit",
    "Docker",
    "Git/GitHub",
    "Linux",
    "AWS",
    "Power BI",
    "Figma",
    "ChatGPT",
  ],
  "Data & ML": [
    "Data Analytics",
    "Feature Engineering",
    "Predictive Modeling",
    "A/B Testing",
    "Data Visualization",
    "ETL/ELT",
  ],
  Databases: ["MySQL", "PostgreSQL", "SQL Schema Design"],
};

export interface Project {
  title: string;
  subtitle: string;
  awards?: string[];
  tech: string[];
  description: string;
  gradient: string;
  category: "Data Science" | "Machine Learning" | "Software";
  image?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    title: "Evergreen Capital",
    subtitle: "QuackHacks 2 Hackathon",
    awards: ["1st Place (Solana Track)", "2nd Place (Polymarket Track)"],
    tech: ["Python", "Solana", "LLM Agents", "Gemini"],
    description:
      "Designed an AI-driven decentralized hedge fund using Polymarket API, multi-agent LLM decision systems, and Solana-based staking. Built a six-agent Gemini debate system for market research, proposal evaluation, and autonomous trading.",
    gradient: "from-amber-500 to-orange-600",
    category: "Software",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    github: "https://github.com/jhatch3",
  },
  {
    title: "AI Stock Analysis Platform",
    subtitle: "Software Consulting Group",
    tech: ["Flask", "MySQL", "OpenAI", "AWS"],
    description:
      "Developed an AI-powered stock analysis web platform with backend data pipelines, ML-driven insights, REST APIs, and automated ingestion workflows. Containerized and deployed on AWS App Runner.",
    gradient: "from-cyan-500 to-blue-600",
    category: "Software",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    github: "https://github.com/jhatch3",
  },
  {
    title: "Customer Churn Prediction",
    subtitle: "Supervised ML Classification",
    tech: ["Python", "Decision Trees", "KNN", "SVM", "MLP"],
    description:
      "Performed data cleaning, feature engineering, EDA, and applied multiple ML models. Achieved 91% accuracy through hyperparameter tuning and model validation.",
    gradient: "from-emerald-500 to-teal-600",
    category: "Machine Learning",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    github: "https://github.com/jhatch3",
  },
  {
    title: "Monte Carlo Stock Modeling",
    subtitle: "Finance Simulations",
    tech: ["Python", "Pandas", "GBM"],
    description:
      "Implemented GBM-based Monte Carlo simulations for stock price prediction and scenario testing. Designed modular code for rapid financial experimentation.",
    gradient: "from-violet-500 to-purple-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800",
    github: "https://github.com/jhatch3",
  },
  {
    title: "Intel & GRAMMY U Analytics",
    subtitle: "Data Analytics & A/B Testing",
    tech: ["Excel", "Statistical Analysis", "Data Visualization"],
    description:
      "Analyzed Intel sustainability data for high-ROI improvements. Conducted rigorous A/B testing for GRAMMY U CTA optimization. Delivered narrative-driven visualizations.",
    gradient: "from-rose-500 to-pink-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    github: "https://github.com/jhatch3",
  },
  {
    title: "Linear Regression Least Squares",
    subtitle: "Statistical Modeling",
    tech: ["Python", "Matplotlib", "NumPy"],
    description:
      "Implemented linear regression using the Least Squares method. Read 100 data points from file, generated best fit line, visualized results with Matplotlib, and calculated prediction error.",
    gradient: "from-sky-500 to-indigo-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    github: "https://github.com/jhatch3/linearRegLeastSq",
  },
  {
    title: "Bank Marketing Data Cleaning",
    subtitle: "Data Wrangling Project",
    tech: ["Python", "Pandas", "NumPy"],
    description:
      "Cleaned and prepared bank marketing campaign data for future analysis. Handled missing values, converted data types, reformatted dates, and structured output into relational CSV files for database import.",
    gradient: "from-teal-500 to-green-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    github:
      "https://github.com/jhatch3/Cleaning-Bank-Marketing-Campaign-Data",
  },
];

export const projectCategories = [
  "All",
  "Data Science",
  "Machine Learning",
  "Software",
];

export const certifications = [
  "Associate Data Engineer in SQL",
  "Intel - Data Visualization",
  "OpenAI - AI Professional Skills",
  "Intercultural Skills",
];
