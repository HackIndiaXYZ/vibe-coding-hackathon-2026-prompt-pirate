import type { ReviewModeId } from "./review-data";

export type { ReviewModeId };

// ─── Status ──────────────────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "generating" | "complete" | "error";

export type AgentStatus = "idle" | "running" | "complete" | "error";

// ─── Agent / Expert ───────────────────────────────────────────────────────────

export type ExpertId =
  | "user"
  | "investor"
  | "designer"
  | "engineer"
  | "growth"
  | "judge";

export type ExpertFeedback = {
  expertId: ExpertId;
  score: number;
  rating: string;
  headline: string;
  body: string;
  signal: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

export type AgentProgressStep = {
  id: ExpertId | "init" | "saving";
  label: string;
  status: AgentStatus;
};

// ─── Review Data ──────────────────────────────────────────────────────────────

export type ReviewScore = {
  label: string;
  value: number;
};

export type RadarPoint = {
  dimension: string;
  score: number;
  benchmark: number;
};

export type Risk = {
  severity: "critical" | "high" | "medium";
  title: string;
  detail: string;
};

export type Improvement = {
  priority: "now" | "next" | "later";
  title: string;
  detail: string;
};

// ─── Submission ───────────────────────────────────────────────────────────────

/** What the user typed into the New Review form. */
export type ReviewSubmission = {
  projectName: string;
  modeId: ReviewModeId;
  /** Dynamic key-value pairs matching the mode's input[] labels */
  inputs: Record<string, string>;
};

// ─── Stored Review ────────────────────────────────────────────────────────────

/**
 * The shape stored in localStorage (Phase 1) and later Supabase (Phase 2).
 * All optional fields are absent while status === "generating".
 */
export type StoredReview = {
  id: string;
  projectName: string;
  tagline: string;
  modeId: ReviewModeId;
  status: ReviewStatus;
  createdAt: string; // ISO string
  submission: ReviewSubmission;
  // Populated after generation
  overallScore?: number;
  verdictLabel?: string;
  scores?: ReviewScore[];
  radar?: RadarPoint[];
  expertFeedback?: ExpertFeedback[];
  risks?: Risk[];
  improvements?: Improvement[];
  finalVerdict?: string;
  errorMessage?: string;
};

// ─── AI Engine I/O ────────────────────────────────────────────────────────────

export type GenerationInput = {
  projectName: string;
  modeId: ReviewModeId;
  inputs: Record<string, string>;
};

export type GenerationResult = {
  tagline: string;
  overallScore: number;
  verdictLabel: string;
  scores: ReviewScore[];
  radar: RadarPoint[];
  expertFeedback: ExpertFeedback[];
  risks: Risk[];
  improvements: Improvement[];
  finalVerdict: string;
};

export type GenerationResponse =
  | { success: true; data: GenerationResult }
  | { success: false; error: string };
