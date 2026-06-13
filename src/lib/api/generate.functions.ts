import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runReviewEngine } from "../ai/gemini.server";
import type { GenerationResponse } from "../types";

const inputSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  modeId: z.string(),
  inputs: z.record(z.string()),
});

/**
 * Server function — generates a complete AI review using all 6 agents.
 * Called from the review detail page when a review is in "generating" status.
 *
 * Usage:
 *   const result = await generateReview({ data: { projectName, modeId, inputs } })
 */
export const generateReview = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<GenerationResponse> => {
    try {
      const result = await runReviewEngine({
        projectName: data.projectName,
        modeId: data.modeId as Parameters<typeof runReviewEngine>[0]["modeId"],
        inputs: data.inputs,
      });

      return { success: true, data: result };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown generation error";
      console.error("[generate] Review generation failed:", message);
      return { success: false, error: message };
    }
  });
