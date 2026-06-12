import {
  Rocket,
  Trophy,
  Palette,
  Globe,
  Smartphone,
  Banknote,
  TrendingUp,
  Flag,
  Swords,
  Workflow,
  type LucideIcon,
  User,
  Briefcase,
  Brush,
  Cog,
  LineChart,
  Gavel,
} from "lucide-react";

export type ReviewModeId =
  | "startup"
  | "hackathon"
  | "prototype"
  | "website"
  | "mobile"
  | "pitch"
  | "growth"
  | "launch"
  | "competitor"
  | "workflow";

export type ReviewMode = {
  id: ReviewModeId;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  inputs: string[];
  outputs: string[];
  accent: string;
};

export const reviewModes: ReviewMode[] = [
  {
    id: "startup",
    title: "Startup Idea",
    short: "Validate concepts",
    description: "Market fit, innovation, competition, monetization and buildability.",
    icon: Rocket,
    inputs: ["Product idea", "Description", "Target audience"],
    outputs: ["Market Fit", "Innovation", "Competition", "Monetization", "AI Necessity", "Buildability"],
    accent: "from-violet-500/30 to-fuchsia-500/10",
  },
  {
    id: "hackathon",
    title: "Hackathon Project",
    short: "Win the demo",
    description: "Judge appeal, demo potential, AI usage and winning potential.",
    icon: Trophy,
    inputs: ["Project description", "Features", "Tech stack"],
    outputs: ["Innovation", "AI Usage", "Demo Potential", "Judge Appeal", "Winning Potential"],
    accent: "from-amber-500/30 to-orange-500/10",
  },
  {
    id: "prototype",
    title: "Prototype Review",
    short: "UX & UI critique",
    description: "Audit Figma files, wireframes and screenshots for clarity and conversion.",
    icon: Palette,
    inputs: ["Figma link", "Screenshots", "Wireframes"],
    outputs: ["UX", "UI", "Accessibility", "Clarity", "Conversion"],
    accent: "from-pink-500/30 to-rose-500/10",
  },
  {
    id: "website",
    title: "Website Audit",
    short: "Conversion + trust",
    description: "Crawl any URL, capture screenshots and review navigation and CTAs.",
    icon: Globe,
    inputs: ["Website URL"],
    outputs: ["UX Review", "Trust", "Clarity", "CTA Analysis", "Product Understanding"],
    accent: "from-cyan-500/30 to-sky-500/10",
  },
  {
    id: "mobile",
    title: "Mobile App",
    short: "Onboarding flow",
    description: "Review screenshots or store links for onboarding and navigation.",
    icon: Smartphone,
    inputs: ["Screenshots", "App Store link", "Play Store link"],
    outputs: ["UX Review", "Onboarding", "Navigation"],
    accent: "from-emerald-500/30 to-teal-500/10",
  },
  {
    id: "pitch",
    title: "Investor Pitch",
    short: "Funding readiness",
    description: "Simulated board meeting that asks the tough questions.",
    icon: Banknote,
    inputs: ["Pitch deck", "Startup summary"],
    outputs: ["Readiness", "Funding Potential", "Tough Questions", "Key Risks"],
    accent: "from-indigo-500/30 to-blue-500/10",
  },
  {
    id: "growth",
    title: "Growth Strategy",
    short: "Acquisition loops",
    description: "Marketing channels, growth loops and retention opportunities.",
    icon: TrendingUp,
    inputs: ["Product details"],
    outputs: ["Channels", "Loops", "Acquisition", "Retention"],
    accent: "from-lime-500/30 to-green-500/10",
  },
  {
    id: "launch",
    title: "Launch Readiness",
    short: "Pre-flight check",
    description: "Score launch readiness with a complete checklist.",
    icon: Flag,
    inputs: ["Product details"],
    outputs: ["Launch Score", "Missing Components", "Checklist"],
    accent: "from-orange-500/30 to-red-500/10",
  },
  {
    id: "competitor",
    title: "Competitor Positioning",
    short: "Find the gap",
    description: "Identify advantage, weaknesses and market gaps vs competitors.",
    icon: Swords,
    inputs: ["Product description", "Competitors"],
    outputs: ["Advantage", "Weaknesses", "Market Gaps"],
    accent: "from-red-500/30 to-pink-500/10",
  },
  {
    id: "workflow",
    title: "Workflow Audit",
    short: "Reduce friction",
    description: "Map friction points, drop-offs and missing steps in journeys.",
    icon: Workflow,
    inputs: ["User journey", "Product workflow"],
    outputs: ["Friction", "Drop-off Risk", "Missing Steps"],
    accent: "from-teal-500/30 to-cyan-500/10",
  },
];

export type ExpertAgent = {
  id: "user" | "investor" | "designer" | "engineer" | "growth" | "judge";
  name: string;
  role: string;
  focus: string[];
  icon: LucideIcon;
  color: string;
};

export const experts: ExpertAgent[] = [
  {
    id: "user",
    name: "Iris Vale",
    role: "User Agent",
    focus: ["Ease of use", "Understanding", "Experience"],
    icon: User,
    color: "oklch(0.78 0.14 195)",
  },
  {
    id: "investor",
    name: "Marcus Thorne",
    role: "Investor Agent",
    focus: ["Market size", "Scalability", "Revenue"],
    icon: Briefcase,
    color: "oklch(0.74 0.16 158)",
  },
  {
    id: "designer",
    name: "Lena Park",
    role: "Designer Agent",
    focus: ["UI", "UX", "Accessibility"],
    icon: Brush,
    color: "oklch(0.78 0.18 340)",
  },
  {
    id: "engineer",
    name: "Kai Okafor",
    role: "Engineer Agent",
    focus: ["Feasibility", "Architecture", "Complexity"],
    icon: Cog,
    color: "oklch(0.7 0.19 268)",
  },
  {
    id: "growth",
    name: "Sana Iyer",
    role: "Growth Agent",
    focus: ["Acquisition", "Retention", "Virality"],
    icon: LineChart,
    color: "oklch(0.78 0.16 75)",
  },
  {
    id: "judge",
    name: "Hon. Aurelia Vance",
    role: "Chief Judge",
    focus: ["Innovation", "Execution", "Impact"],
    icon: Gavel,
    color: "oklch(0.66 0.22 22)",
  },
];

export type Review = {
  id: string;
  project: string;
  tagline: string;
  modeId: ReviewModeId;
  createdAt: string;
  overallScore: number;
  verdictLabel: string;
  scores: { label: string; value: number }[];
  radar: { dimension: string; score: number; benchmark: number }[];
  expertFeedback: {
    expertId: ExpertAgent["id"];
    rating: string;
    headline: string;
    body: string;
    signal: string;
  }[];
  risks: { severity: "critical" | "high" | "medium"; title: string; detail: string }[];
  improvements: { priority: "now" | "next" | "later"; title: string; detail: string }[];
  finalVerdict: string;
};

export const sampleReview: Review = {
  id: "REV-08291",
  project: "OmniStream Alpha",
  tagline: "Real-time edge analytics for fintech infrastructure teams.",
  modeId: "startup",
  createdAt: "2 hours ago",
  overallScore: 84,
  verdictLabel: "Strong Potential",
  scores: [
    { label: "Market Fit", value: 92 },
    { label: "Innovation", value: 88 },
    { label: "Competition", value: 64 },
    { label: "Monetization", value: 81 },
    { label: "AI Necessity", value: 73 },
    { label: "Buildability", value: 95 },
  ],
  radar: [
    { dimension: "Market", score: 92, benchmark: 70 },
    { dimension: "Design", score: 76, benchmark: 65 },
    { dimension: "Tech", score: 88, benchmark: 72 },
    { dimension: "Growth", score: 71, benchmark: 68 },
    { dimension: "Revenue", score: 81, benchmark: 60 },
    { dimension: "Risk", score: 64, benchmark: 50 },
  ],
  expertFeedback: [
    {
      expertId: "investor",
      rating: "Strong Buy",
      headline: "Unit economics are compelling at mid-market scale",
      body: "Payback period under 14 months for the fintech ICP, but acquisition cost is underestimated in the residential tier. Recommend tightening the pricing model before the next round.",
      signal: "CAC risk in residential segment",
    },
    {
      expertId: "designer",
      rating: "B+",
      headline: "Density is high — apply progressive disclosure",
      body: "Information architecture is dense for first-time users. Consider hiding advanced filters behind a toggle and increasing line-height across primary tables.",
      signal: "Cognitive load reduction needed",
    },
    {
      expertId: "engineer",
      rating: "Feasible",
      headline: "Real-time sync layer is the primary risk",
      body: "Architecture is sound. Move from WebSockets to gRPC streaming to reduce battery drain on remote edge devices and improve reconnection semantics.",
      signal: "gRPC migration suggested",
    },
    {
      expertId: "user",
      rating: "Loves the speed",
      headline: "Origin of data needs to be more transparent",
      body: "Speed is delightful, but I cannot tell where a number came from when it changes. Add a small lineage chip beside live metrics.",
      signal: "Data lineage missing",
    },
    {
      expertId: "growth",
      rating: "Needs loops",
      headline: "Virality loops are missing entirely",
      body: "There is no shareable artifact today. Allow exporting a public read-only report with attribution — that single move could halve CAC.",
      signal: "Add shareable reports",
    },
    {
      expertId: "judge",
      rating: "Qualified Advance",
      headline: "Execution outweighs the flaws — proceed to beta",
      body: "The board recommends immediate market entry targeting mid-market fintech before expanding to legacy banking. Address the two critical risks within 30 days of beta launch.",
      signal: "Advance to beta",
    },
  ],
  risks: [
    {
      severity: "critical",
      title: "Data privacy controls are insufficient",
      detail: "Current ACL model cannot satisfy SOC2 type II requirements for enterprise deployment.",
    },
    {
      severity: "high",
      title: "Pricing alienates entry-level segment",
      detail: "$499 floor cuts out the indie hackers most likely to drive organic adoption and reviews.",
    },
    {
      severity: "medium",
      title: "No clear competitive moat",
      detail: "Two well-funded competitors could replicate the core feature within a quarter.",
    },
  ],
  improvements: [
    {
      priority: "now",
      title: "Add collaborative workspace",
      detail: "Multiplayer review rooms with cursors, comments and decision tracking.",
    },
    {
      priority: "now",
      title: "Simplify the primary navigation",
      detail: "Collapse three top-level sections into a single command palette entrypoint.",
    },
    {
      priority: "next",
      title: "Ship a public report export",
      detail: "Branded shareable URLs with selected sections, expiring after 30 days.",
    },
    {
      priority: "next",
      title: "Introduce a free tier",
      detail: "Limit to one project and watermark exports to seed bottom-up growth.",
    },
    {
      priority: "later",
      title: "Native mobile companion",
      detail: "Read-only app for execs to monitor scores and risk drift on the go.",
    },
  ],
  finalVerdict:
    "OmniStream Alpha demonstrates a sophisticated grasp of the underlying technical hurdles in high-bandwidth edge computing. While the interface requires reduction in cognitive load and pricing must accommodate bottom-up adoption, the market timing and infrastructure foundations are exceptional. The board recommends immediate beta launch targeting mid-market fintech, with the two critical risks resolved within 30 days. Funding readiness: cleared for seed round at the agreed valuation band.",
};

export const recentReviews = [
  { id: "REV-08291", project: "OmniStream Alpha", mode: "Startup Idea", score: 84, trend: "+6" },
  { id: "REV-08284", project: "Halo Finance", mode: "Investor Pitch", score: 72, trend: "+2" },
  { id: "REV-08271", project: "Beacon Studio", mode: "Prototype", score: 91, trend: "+12" },
  { id: "REV-08262", project: "Loop Health", mode: "Website Audit", score: 58, trend: "-4" },
  { id: "REV-08250", project: "Drift CRM", mode: "Growth Strategy", score: 79, trend: "+3" },
];
