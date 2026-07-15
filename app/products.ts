export const products = [
  {
    id: "productpulse",
    name: "ProductPulse",
    eyebrow: "Executive Product Analytics",
    tagline:
      "See adoption, engagement, retention, revenue, and product initiatives from one decision-ready view.",
    status: "Live",
    url: "https://productpulse-fpl.vercel.app/",
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
    landmark: "The Sentinel Pyramids",
    inspiration: "Abstracted pyramid complex",
    accent: "restrained amber and risk red",
    routeLabel: "Read the risk",
    coordinate: "17.8 / R",
  },
  {
    id: "trustdesk",
    name: "TrustDesk",
    eyebrow: "Customer Trust Operations",
    tagline:
      "Accelerate security questionnaires with control-backed answers, intelligent review routing, and revenue visibility.",
    status: "Live",
    url: "https://trustdesk-fpl.vercel.app/",
    landmark: "The Covenant Circle",
    inspiration: "Abstracted standing-stone circle",
    accent: "silver blue",
    routeLabel: "Establish trust",
    coordinate: "61.4 / T",
  },
  {
    id: "agentops",
    name: "AgentOps",
    eyebrow: "AI Agent Governance",
    tagline:
      "Oversee every AI agent's readiness, governance signals, operational value, and path to launch.",
    status: "Live",
    url: "https://agentops-fpl.vercel.app/",
    landmark: "The Acropolis Control Tower",
    inspiration: "Abstracted elevated civic complex",
    accent: "cool white and pale cyan",
    routeLabel: "Command the fleet",
    coordinate: "88.2 / G",
  },
] as const;

export type Product = (typeof products)[number];
export type ProductId = Product["id"];
