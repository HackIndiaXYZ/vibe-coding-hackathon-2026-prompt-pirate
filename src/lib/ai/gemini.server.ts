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
  agentDefs,
  getModeScoreCategories,
  buildSpecialistPrompt,
  buildJudgePrompt,
} from "./agents";

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

// ─── Single Agent Call ────────────────────────────────────────────────────────

async function callAgent(
  agentId: ExpertId,
  userPrompt: string,
): Promise<Record<string, unknown>> {
  const genAI = getClient();
  const agentDef = agentDefs.find((a) => a.id === agentId)!;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: agentDef.systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.75,
      maxOutputTokens: 1500,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    console.error(`[gemini] Failed to parse JSON from ${agentId}:`, text);
    throw new Error(`Agent ${agentId} returned invalid JSON.`);
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

// ─── Review Engine ────────────────────────────────────────────────────────────

/**
 * Run all 6 AI agents and return a complete GenerationResult.
 * 5 specialist agents run in parallel, then Judge agent synthesizes.
 */
export async function runReviewEngine(
  input: GenerationInput,
): Promise<GenerationResult> {
  const specialistIds: ExpertId[] = [
    "user",
    "investor",
    "designer",
    "engineer",
    "growth",
  ];
  const basePrompt = buildSpecialistPrompt(input);

  // ── Phase 1: Specialists in parallel ──────────────────────────────────────
  const specialistRaws = await Promise.all(
    specialistIds.map((id) => callAgent(id, basePrompt)),
  );

  const specialistReports: Record<string, object> = {};
  specialistIds.forEach((id, i) => {
    specialistReports[id] = specialistRaws[i];
  });

  // ── Phase 2: Judge synthesizes ────────────────────────────────────────────
  const judgePrompt = buildJudgePrompt(input, specialistReports);
  const judgeRaw = await callAgent("judge", judgePrompt);

  // ── Build expertFeedback array ────────────────────────────────────────────
  const expertFeedback: ExpertFeedback[] = [
    ...specialistIds.map((id, i) =>
      parseExpertFeedback(id, specialistRaws[i]),
    ),
    parseExpertFeedback("judge", judgeRaw),
  ];

  // ── Extract judge-level fields ────────────────────────────────────────────
  const overallScore = num(judgeRaw.overallScore ?? judgeRaw.score, 70);

  const verdictOptions = [
    "Exceptional",
    "Strong Potential",
    "Promising",
    "Needs Work",
    "Not Ready",
  ];
  const verdictLabel = verdictOptions.includes(str(judgeRaw.verdictLabel))
    ? str(judgeRaw.verdictLabel)
    : "Promising";

  // Scores — use judge's array or fall back to generated values
  const rawScores = Array.isArray(judgeRaw.scores) ? judgeRaw.scores : [];
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
              Math.round(
                specialistRaws.reduce(
                  (sum, r) => sum + num(r.score, 65),
                  0,
                ) /
                  specialistRaws.length +
                  (i % 2 === 0 ? 5 : -5),
              ),
            ),
          ),
        }));

  // Radar
  const rawRadar = Array.isArray(judgeRaw.radar) ? judgeRaw.radar : [];
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
            score: num(judgeRaw.score, 70),
            benchmark: 65,
          },
          {
            dimension: "Design",
            score: num(specialistRaws[2]?.score, 65),
            benchmark: 60,
          },
          {
            dimension: "Tech",
            score: num(specialistRaws[3]?.score, 70),
            benchmark: 65,
          },
          {
            dimension: "Growth",
            score: num(specialistRaws[4]?.score, 60),
            benchmark: 55,
          },
          {
            dimension: "Revenue",
            score: num(specialistRaws[1]?.score, 65),
            benchmark: 60,
          },
          { dimension: "Risk", score: overallScore - 10, benchmark: 50 },
        ];

  // Risks
  const rawRisks = Array.isArray(judgeRaw.risks) ? judgeRaw.risks : [];
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

  // Improvements
  const rawImprovements = Array.isArray(judgeRaw.improvements)
    ? judgeRaw.improvements
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
    judgeRaw.finalVerdict ?? judgeRaw.body,
    "The board has delivered its verdict. Please review the full report for detailed analysis.",
  );

  const tagline = str(judgeRaw.headline, `AI review of ${input.projectName}`);

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
