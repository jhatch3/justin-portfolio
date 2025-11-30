// src/data/siteData.ts

export const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education & Experience" },
  { id: "contact", label: "Contact" },
];

export const skills: Record<string, string[]> = {
  Programming: [
    "Python",
    "SQL",
    "C",
    "C++",
    "JavaScript",
    "HTML/CSS"
  ],
  "Data & ML": [
    "Pandas",
    "NumPy",
    "Scikit-Learn",
    "Predictive Modeling",
    "Feature Engineering", 
    "Model tuning",
    "A/B Testing",
    "Data Visualization",
    "Data Analytics",
    "ETL/ELT",
    "Excel",

  ],
  "Frameworks & Tools": [
    "Flask",
    "FastAPI",
    "Streamlit",
    "Docker",
    "PySpark",
    "Git/GitHub",
    "Linux",
    "AWS",
    "PowerBI",
    "ChatGPT",
    "Claude",
    "Base-44",
    "Microsoft 365 Apps"
  ],
  Databases: [
    "MySQL",
    "PostgreSQL",
    "SQL Schema Design"
  ],
};

export interface Project {
  title: string;
  subtitle: string;
  awards?: string[];
  tech: string[];
  description: string;
  gradient: string;
  category: "Data Science" | "Machine Learning / AI" | "Software";
  image?: string;
  github?: string;
  demo?: string; 
}

export const projects: Project[] = [
  {
    title: "Evergreen Capital",
    subtitle: "QuackHacks 2 Hackathon",
    awards: ["1st Place (Solana Track)", "2nd Place (Polymarket Track)"],
    tech: ["Python", "Solana", "LLM Agents", "Gemini"],
    description:
  "Designed an AI-driven decentralized hedge fund using Polymarket API, multi-agent LLM decision systems, and Solana-based staking.\n\nBuilt a six-agent Gemini debate system for market research, proposal evaluation, and autonomous trading.",
    gradient: "from-amber-500 to-orange-600",
    category: "Software",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    github: "https://github.com/jhatch3/Evergreen-Capital/tree/main",
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
      "Performed data cleaning, feature engineering, EDA, and applied multiple ML models (Decision Trees, KNN, SVM, MLP). Improved performance with hyperparameter tuning and model validation. Achieved 91% accuracy, enabling proactive churn detection. Authored a technical report covering methodology and performance analysis.",
    gradient: "from-emerald-500 to-teal-600",
    category: "Machine Learning / AI",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    github: "https://github.com/jhatch3/ML-Churn_Report",
  },
  {
    title: "Monte Carlo Stock Price Simulator (Black–Scholes GBM) ",
    subtitle: "Finance Simulations",
    tech: ["Python", "Pandas", "GBM"],
    description:
      "Implemented Black–Scholes GBM–based Monte Carlo simulations to model stock price paths for prediction and scenario testing. Built a Streamlit dashboard for interactive experimentation, letting users choose tickers, set simulation parameters, and visualize expected prices, confidence intervals, and outcome distributions. Designed modular code for data ingestion, log-return computation, parameter estimation, and simulation to enable rapid iteration and future model extensions.",
    gradient: "from-violet-500 to-purple-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    github: "https://github.com/jhatch3/finance_ds_projects/tree/main/Monte_Carlo",
    demo: "https://montecarloapps.streamlit.app/"
  },
  {
    title: "Intel & GRAMMY U Analytics",
    subtitle: "Data Analytics & A/B Testing",
    tech: ["Excel", "Statistical Analysis", "Data Visualization"],
    description:
    "Analyzed Intel sustainability data to identify high-ROI improvements and presented actionable insights. Conducted a statistically rigorous A/B test to determine the best CTA button for increasing GRAMMY U membership. Delivered narrative-driven visualizations aligned with industry reporting standards. Completed as part of the Global Career Accelerator program.",
    gradient: "from-rose-500 to-pink-600",
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
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
    {
    title: "Freelane AI Annotation Work",
    subtitle: "AI Training",
    tech: ["OBS, Microsoft 365 Apps"],
    description:
        "Produced high-quality screen-recorded demonstrations using OBS to train AI models on Microsoft Office workflows. Created detailed task walk-throughs with step-by-step reasoning and instructional clarity. Reviewed and annotated system-captured actions, providing structured “thought-process” explanations to improve LLM reasoning.",
    gradient: "from-teal-500 to-green-600",
    category: "Machine Learning / AI",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  },
];

export const projectCategories = [
  "All",
  "Data Science",
  "Machine Learning / AI",
  "Software",
];

export const certifications = [
  {
    name: "Associate Data Engineer in SQL",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/6c472811dcd40bb903cd12173203158cd8fe7c15"
  },
  {
    name: "Intel - Data Visualization",
    url: "https://www.credential.net/ce291740-905f-4c17-ae0d-70d45100f817#acc.cNTtR52je"
  },
  {
    name: "OpenAI - AI Professional Skills",
    url: "https://www.credential.net/97dde745-4ba0-4736-a815-27aec3104af8#acc.FmCSXkMj"
  },
  {
    name: "Intercultural Skills",
    url: "https://www.credential.net/bc6baf65-649d-4dee-9e32-28eddbb22971#acc.qGmZC6UJ"
  }
];
