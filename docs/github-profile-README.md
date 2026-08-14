<!--
  GitHub PROFILE README.

  This is not this repo's README - it belongs in the special repo whose name
  matches your handle: github.com/jhatch3/jhatch3  ->  README.md at its root.
  Create that repo (public) if it doesn't exist and GitHub renders this at the
  top of your profile page.

  Kept here so it's version-controlled alongside the data it mirrors: if you
  change a role in public/data/experience.js, change it here too.
-->

<div align="center">

# Justin Hatch

**Software Engineer, AI/ML** · I ship production agent systems
Cambridge, Massachusetts · B.S. Computer Science, University of Oregon (2026)

[![Portfolio](https://img.shields.io/badge/Portfolio-justinhatch.dev-1d4ed8?style=flat-square&logoColor=white)](https://justinhatch.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/justinhatch/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:jjhatch03@gmail.com)

</div>

---

### About

I work across the stack that production AI actually needs — relational schema
design and ETL, model training and evaluation, and the agent tooling on top.
Most interested in problems where modeling, infrastructure, and product
intersect, and in systems that stay correct, observable, and readable six months
later.

Lately that has meant a lot of time on the unglamorous half of LLM work:
grounding generations in real data, hardening prompts against injection, and
building evals that fail loudly instead of looking good.

> **Currently:** Software Engineer, AI/ML at **Horizon Intelligence Labs** —
> building production applications on Cortex, the company's AI platform, and
> designing the benchmarks that evaluate model capabilities.

---

### Stack

| | |
|---|---|
| **Languages** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TS-3178C6?style=flat-square&logo=typescript&logoColor=white) ![SQL](https://img.shields.io/badge/-SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white) ![C++](https://img.shields.io/badge/-C++-00599C?style=flat-square&logo=cplusplus&logoColor=white) ![C](https://img.shields.io/badge/-C-A8B9CC?style=flat-square&logo=c&logoColor=black) |
| **AI / LLM Ops** | ![Claude](https://img.shields.io/badge/-Claude-CC785C?style=flat-square&logo=anthropic&logoColor=white) ![OpenAI](https://img.shields.io/badge/-OpenAI-412991?style=flat-square&logo=openai&logoColor=white) ![LangChain](https://img.shields.io/badge/-LangChain-1C3C3C?style=flat-square) ![LangGraph](https://img.shields.io/badge/-LangGraph-1C3C3C?style=flat-square) ![RAG](https://img.shields.io/badge/-RAG-4B8BBE?style=flat-square) ![Vector DBs](https://img.shields.io/badge/-Vector%20DBs-4B8BBE?style=flat-square) ![Evals](https://img.shields.io/badge/-LLM--as--judge-4B8BBE?style=flat-square) |
| **ML / Data Sci** | ![XGBoost](https://img.shields.io/badge/-XGBoost-EB6C2D?style=flat-square) ![SHAP](https://img.shields.io/badge/-SHAP-0094C6?style=flat-square) ![scikit-learn](https://img.shields.io/badge/-sklearn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white) ![Pandas](https://img.shields.io/badge/-Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/-NumPy-013243?style=flat-square&logo=numpy&logoColor=white) ![MLflow](https://img.shields.io/badge/-MLflow-0194E2?style=flat-square&logo=mlflow&logoColor=white) |
| **Backend / Infra** | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pydantic](https://img.shields.io/badge/-Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white) ![Postgres](https://img.shields.io/badge/-Postgres-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Dagster](https://img.shields.io/badge/-Dagster-654FF0?style=flat-square&logo=dagster&logoColor=white) ![dbt](https://img.shields.io/badge/-dbt-FF694B?style=flat-square&logo=dbt&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/-AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white) ![GCP](https://img.shields.io/badge/-GCP-4285F4?style=flat-square&logo=googlecloud&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![Node.js](https://img.shields.io/badge/-Node-339933?style=flat-square&logo=nodedotjs&logoColor=white) |

---

### Experience

| Role | Org | Focus |
|---|---|---|
| **Software Engineer, AI/ML** | Horizon Intelligence Labs | Production applications on Cortex; benchmarks evaluating model capabilities; Cortex SDK |
| Applied AI Intern | Machine & Minds | Applied AI systems built for measurable P&L impact |
| AI Engineer Intern | Modern Amenities | FastAPI + Claude sales chatbot, 900+ users, structured tool-use outputs, prompt-injection hardening |
| Lead Software Engineer | Oregon Blockchain Group | Agent orchestration on AWS Bedrock; TrialWeave (GLP-1 RWE) & Crop Share; led teams of 3–5 |

---

### Featured work

**[Portfolio + Justin's Bot](https://justinhatch.dev)** · `React` `Express` `Claude` `Docker` `Caddy`
A portfolio that's also a macOS desktop simulation, a streaming Claude chatbot, and a live Coinbase order book. The bot runs a hardened, identity-pinned system prompt with prompt caching and a per-IP rate limit, and ships with a red-team suite that hammers it with 12 adversarial prompts — jailbreaks, injection via fake transcripts, base64 obfuscation, identity probes. Self-hosted on EC2 behind Caddy with automatic TLS.

**Churn Prediction + LLM Retention Email Pipeline** · `XGBoost` `TreeSHAP` `Dagster` `dbt` `MLflow` `Claude` `Postgres`
Nightly churn-to-retention pipeline scoring 18,618 customers at 0.79 ROC-AUC. TreeSHAP attributions are persisted as structured prompt input for Claude-generated retention emails, each grounded in live order and review history through read-only Postgres tools. An LLM-as-judge eval with enum-typed verdicts against explicit criteria surfaced real generator bugs — wrong CTA intent, prohibited offers, tone/label mismatch — that a rubric score alone would have hidden.

**Evergreen Capital — AI-Governed On-Chain Prediction Fund** · `Gemini` `FastAPI` `Solana` `TypeScript`
A 5-agent research desk (Quant, Macro, Skeptic, Data Miner, Trader) that researches independently, debates via structured cross-examination, and produces weighted consensus votes triggering autonomous Polymarket trades with no human in the loop. Full-stack MVP in 24 hours — 1st Place Solana Track, 2nd Place Polymarket Track at QuackHacks II.

**Lethe — 3-LLM Consensus Medical-Bill Auditor** · `GPT-4o` `Claude` `Gemini` `0G Chain`
Three models audit hospital bills through a two-round reflection protocol — independent analysis, then peer-informed refinement — with a 2-of-3 quorum required to dispute a charge. Agents talk over a P2P mesh with ed25519 identities, so no single model can dictate the verdict. PHI is stripped before anything reaches the agents. Top 10% of 470+ projects at ETH Global.

**Market Data Pipeline + AI News Synthesis** · `FastAPI` `Supabase` `AWS` `Dagster` `LangChain`
Postgres medallion schema (Bronze → Silver → Gold → AI) keyed by (ticker, interval, timestamp) across 4.5M+ rows and 230+ tickers, with conflict-aware upserts and 100% idempotent reruns. A scheduled LangChain agent synthesizes market context, news, and filings into source-attributed summaries powering downstream RAG.

---

<div align="center">
<sub>Dean's List · Department Honors · QuackHacks II winner · ETH Global top 10%</sub>
</div>
