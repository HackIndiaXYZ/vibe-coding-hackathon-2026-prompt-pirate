import type { StoredReview } from "./types";

/**
 * ─── Storage Service — Phase 1: localStorage ─────────────────────────────────
 *
 * All functions have the same interface that Phase 2 will expose via Supabase.
 * To migrate: replace each function body with a Supabase call. Callers stay
 * identical.
 *
 * Key layout:
 *   productjudge_reviews_v1  →  StoredReview[]  (newest first)
 */

const STORAGE_KEY = "productjudge_reviews_v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readRaw(): StoredReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredReview[]) : [];
  } catch {
    return [];
  }
}

function writeRaw(reviews: StoredReview[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error("[storage] write failed", e);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Return all reviews ordered newest-first. */
export function getAllReviews(): StoredReview[] {
  return readRaw();
}

/** Return a single review by ID, or null if not found. */
export function getReviewById(id: string): StoredReview | null {
  return readRaw().find((r) => r.id === id) ?? null;
}

/** Insert or update a review in storage. */
export function saveReview(review: StoredReview): void {
  const all = readRaw();
  const idx = all.findIndex((r) => r.id === review.id);
  if (idx >= 0) {
    all[idx] = review;
  } else {
    all.unshift(review); // newest first
  }
  writeRaw(all);
}

/** Remove a review by ID. */
export function deleteReview(id: string): void {
  writeRaw(readRaw().filter((r) => r.id !== id));
}

/** Generate a unique review ID in the format REV-XXXXX. */
export function generateReviewId(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `REV-${n}`;
}
