export const products = [
  {
    id: "productpulse",
    name: "ProductPulse",
    eyebrow: "Executive Product Analytics",
    tagline:
      "See adoption, engagement, retention, revenue, and product initiatives from one decision-ready view.",
    status: "Live",
    url: "https://productpulse-fpl.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/productpulse",
    landmark: "The Colonnaded Observatory",
    inspiration: "Abstracted Parthenon",
    accent: "warm gold",
    routeLabel: "Measure the signal",
    coordinate: "43.1 / A",
  },
  {
    id: "vulnboard",
    name: "VulnBoard",
    eyebrow: "Vulnerability Risk & Remediation",
    tagline:
      "Translate vulnerability findings into business-owned risk, SLA pressure, and executive action.",
    status: "Live",
    url: "https://vuln-board-fpl.vercel.app/dashboard",
    githubUrl: "https://github.com/Fischer-Product-Lab/VulnBoard",
    landmark: "The Sentinel Pyramids",
    inspiration: "Abstracted pyramid complex",
    accent: "restrained amber and risk red",
    routeLabel: "Read the risk",
    coordinate: "17.8 / R",
  },
  {
    id: "portfoliohealth",
    name: "Portfolio Health",
    eyebrow: "ITSM Portfolio Intelligence",
    tagline:
      "Track service disruption, root-cause progress, change execution, and release risk in one decision-ready view.",
    status: "Live",
    url: "https://portfolio-health-fpl.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/portfolio-health",
    landmark: "The Confluence Rotunda",
    inspiration: "Abstracted civic rotunda and converging waterways",
    accent: "patina green and soft gold",
    routeLabel: "Survey the portfolio",
    coordinate: "72.6 / H",
  },
  {
    id: "trustdesk",
    name: "TrustDesk",
    eyebrow: "Customer Trust Operations",
    tagline:
      "Accelerate security questionnaires with control-backed answers, intelligent review routing, and revenue visibility.",
    status: "Live",
    url: "https://trustdesk-fpl.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/trustdesk",
    landmark: "The Covenant Circle",
    inspiration: "Abstracted standing-stone circle",
    accent: "silver blue",
    routeLabel: "Establish trust",
    coordinate: "61.4 / T",
  },
  {
    id: "aurora",
    name: "Aurora",
    eyebrow: "Agent Orchestration",
    tagline:
      "Watch an AI agent team investigate, make controlled decisions, recover from failure, and prove the result.",
    description:
      "An interactive laboratory for watching simulated AI agents investigate in parallel, challenge incomplete plans, respect approval and spending limits, recover from failure, and verify the outcome.",
    portfolioValue:
      "Aurora makes coordination, evidence, review, permissions, budgets, recovery, and verification understandable.",
    status: "Featured",
    url: "https://aurora-fpl.vercel.app",
    githubUrl: "https://github.com/Fischer-Product-Lab/aurora-fpl",
    ctaLabel: "Explore the simulation",
    landmark: "The Aurora Observatory",
    inspiration: "Northern lights converging above a dark observatory",
    accent: "glacial teal and quiet violet",
    routeLabel: "Explore the simulation",
    coordinate: "66.5 / O",
  },
  {
    id: "agentops",
    name: "AgentOps",
    eyebrow: "AI Agent Governance",
    tagline:
      "Oversee every AI agent's readiness, governance signals, operational value, and path to launch.",
    status: "Live",
    url: "https://agentops-fpl.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/agentops",
    landmark: "The Acropolis Control Tower",
    inspiration: "Abstracted elevated civic complex",
    accent: "cool white and pale cyan",
    routeLabel: "Command the fleet",
    coordinate: "88.2 / G",
  },
  {
    id: "programforge",
    name: "ProgramForge",
    eyebrow: "Cross-Team Program Management",
    tagline:
      "See which cross-team initiatives are on track, what is blocked, and what leadership must decide this cycle.",
    description:
      "An executive program-management dashboard for priorities, dependencies, RAID, readiness gates, milestones, capacity pressure, and leadership briefs.",
    portfolioValue:
      "ProgramForge turns mid-flight delivery signals into deterministic, explainable program health and a decision-ready leadership view.",
    status: "New",
    url: "https://program-forge-fpl.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/ProgramForge",
    ctaLabel: "Explore the dashboard",
    landmark: "The Forge of Hephaestus",
    inspiration: "The Temple of Hephaestus reimagined as a working decision forge",
    accent: "weathered bronze, ember gold, and muted plum",
    routeLabel: "Enter the forge",
    coordinate: "75.0 / F",
  },
  {
    id: "orrery",
    name: "ORRERY",
    eyebrow: "Agent Supervision Laboratory",
    tagline:
      "Supervise long-running agents through plans, tools, approvals, cost, provenance, and fleet state instead of a longer chat transcript.",
    description:
      "A fictional agentic UX laboratory that renders one shared event stream across mission control, plain language, terminal, mobile, and ambient observatory surfaces.",
    portfolioValue:
      "ORRERY turns agent supervision into a reusable interface language for plans, tools, approval gates, provenance, triage, and human control.",
    status: "Exploration",
    url: "https://orrery-orpin.vercel.app/",
    githubUrl: "https://github.com/Fischer-Product-Lab/FPL-Orrery",
    ctaLabel: "Explore the instrument",
    landmark: "The Meridian Armillary",
    inspiration:
      "An exposed mountaintop telescope nested inside an armillary sphere, tracking one event stream across five operational surfaces.",
    accent: "phosphor amber and cold starlight",
    routeLabel: "Explore the instrument",
    coordinate: "05.11 / O",
  },
] as const;

export type Product = (typeof products)[number];
export type ProductId = Product["id"];
