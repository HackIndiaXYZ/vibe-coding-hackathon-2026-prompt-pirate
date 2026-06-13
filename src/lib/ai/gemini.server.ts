/**
 * Gemini API client — server-only.
 *
 * This module integrates with the Gemini API using @google/generative-ai
 * and expects process.env.GEMINI_API_KEY to be defined.
 *
 * The .server.ts suffix prevents Vite from bundling this into the client
 * bundle. Never import this file from a non-server context.
 */

import process from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  ExpertId,
  ExpertFeedback,
  GenerationInput,
  GenerationResult,
} from "../types";
import {
  boardSystemInstruction,
  buildSingleReviewPrompt,
  getModeScoreCategories,
} from "./agents";

const EXPERT_IDS: ExpertId[] = [
  "user",
  "investor",
  "designer",
  "engineer",
  "growth",
  "judge",
];

const SPECIALIST_IDS: ExpertId[] = EXPERT_IDS.slice(0, 5);

// ─── Client Factory ───────────────────────────────────────────────────────────

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env.local file.",
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

// ─── Single Review Board Call ─────────────────────────────────────────────────

async function callReviewBoard(
  input: GenerationInput,
): Promise<Record<string, unknown>> {
  const genAI = getClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: boardSystemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.75,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildSingleReviewPrompt(input);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    console.error("[gemini] Failed to parse unified review JSON:", text);
    throw new Error("Review board returned invalid JSON.");
  }
}

// ─── Type-safe extractor helpers ─────────────────────────────────────────────

function str(raw: unknown, fallback = ""): string {
  return typeof raw === "string" ? raw : fallback;
}

function num(raw: unknown, fallback = 70): number {
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : fallback;
}

function strArr(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function parseExpertFeedback(
  id: ExpertId,
  raw: Record<string, unknown>,
): ExpertFeedback {
  return {
    expertId: id,
    score: num(raw.score),
    rating: str(raw.rating, "Reviewed"),
    headline: str(raw.headline, "Analysis complete"),
    body: str(raw.body, "No detailed analysis available."),
    signal: str(raw.signal, "See full report"),
    strengths: strArr(raw.strengths),
    weaknesses: strArr(raw.weaknesses),
    recommendations: strArr(raw.recommendations),
  };
}

function parseUnifiedResponse(
  raw: Record<string, unknown>,
  input: GenerationInput,
): GenerationResult {
  const expertsRaw = (raw.experts ?? {}) as Record<
    string,
    Record<string, unknown>
  >;

  const expertFeedback: ExpertFeedback[] = EXPERT_IDS.map((id) =>
    parseExpertFeedback(id, expertsRaw[id] ?? {}),
  );

  const judgeExpert = expertsRaw.judge ?? {};
  const specialistScores = SPECIALIST_IDS.map((id) =>
    num(expertsRaw[id]?.score, 65),
  );
  const avgSpecialistScore =
    specialistScores.length > 0
      ? specialistScores.reduce((sum, s) => sum + s, 0) / specialistScores.length
      : 65;

  const overallScore = num(raw.overallScore ?? judgeExpert.score, 70);

  const verdictOptions = [
    "Exceptional",
    "Strong Potential",
    "Promising",
    "Needs Work",
    "Not Ready",
  ];
  const verdictLabel = verdictOptions.includes(str(raw.verdictLabel))
    ? str(raw.verdictLabel)
    : "Promising";

  const rawScores = Array.isArray(raw.scores) ? raw.scores : [];
  const categories = getModeScoreCategories(input.modeId);
  const scores =
    rawScores.length >= categories.length
      ? rawScores.map((s: unknown) => {
          const obj = s as Record<string, unknown>;
          return {
            label: str(obj.label, "Score"),
            value: num(obj.value, 65),
          };
        })
      : categories.map((label, i) => ({
          label,
          value: Math.max(
            50,
            Math.min(
              95,
              Math.round(avgSpecialistScore + (i % 2 === 0 ? 5 : -5)),
            ),
          ),
        }));

  const rawRadar = Array.isArray(raw.radar) ? raw.radar : [];
  const radar =
    rawRadar.length === 6
      ? rawRadar.map((r: unknown) => {
          const obj = r as Record<string, unknown>;
          return {
            dimension: str(obj.dimension),
            score: num(obj.score),
            benchmark: num(obj.benchmark, 65),
          };
        })
      : [
          {
            dimension: "Market",
            score: num(expertsRaw.investor?.score, 70),
            benchmark: 65,
          },
          {
            dimension: "Design",
            score: num(expertsRaw.designer?.score, 65),
            benchmark: 60,
          },
          {
            dimension: "Tech",
            score: num(expertsRaw.engineer?.score, 70),
            benchmark: 65,
          },
          {
            dimension: "Growth",
            score: num(expertsRaw.growth?.score, 60),
            benchmark: 55,
          },
          {
            dimension: "Revenue",
            score: num(expertsRaw.investor?.score, 65),
            benchmark: 60,
          },
          { dimension: "Risk", score: overallScore - 10, benchmark: 50 },
        ];

  const rawRisks = Array.isArray(raw.risks) ? raw.risks : [];
  const risks = rawRisks.map((r: unknown) => {
    const obj = r as Record<string, unknown>;
    const sev = str(obj.severity);
    return {
      severity: (["critical", "high", "medium"].includes(sev)
        ? sev
        : "medium") as "critical" | "high" | "medium",
      title: str(obj.title, "Risk identified"),
      detail: str(obj.detail, "See full report for details."),
    };
  });

  const rawImprovements = Array.isArray(raw.improvements)
    ? raw.improvements
    : [];
  const improvements = rawImprovements.map((item: unknown) => {
    const obj = item as Record<string, unknown>;
    const pri = str(obj.priority);
    return {
      priority: (["now", "next", "later"].includes(pri)
        ? pri
        : "next") as "now" | "next" | "later",
      title: str(obj.title, "Action item"),
      detail: str(obj.detail, "See full report for details."),
    };
  });

  const finalVerdict = str(
    raw.finalVerdict ?? judgeExpert.body,
    "The board has delivered its verdict. Please review the full report for detailed analysis.",
  );

  const tagline = str(
    judgeExpert.headline,
    `AI review of ${input.projectName}`,
  );

  return {
    tagline,
    overallScore,
    verdictLabel,
    scores,
    radar,
    expertFeedback,
    risks,
    improvements,
    finalVerdict,
  };
}

// ─── Review Engine ────────────────────────────────────────────────────────────

/**
 * Run the full AI review board in a single Gemini API request.
 * All 6 expert personas and board-level synthesis are returned as one JSON payload.
 */
export async function runReviewEngine(
  input: GenerationInput,
): Promise<GenerationResult> {
  console.info("[gemini] Starting single-call review board generation");
  const raw = await callReviewBoard(input);
  console.info("[gemini] Review board generation complete (1 API call)");
  return parseUnifiedResponse(raw, input);
}
