import type { Answers } from "./scoring";
import type { ReelAnswers } from "@/data/reelCheck";

const KEY = "rai-reels-assessment-v2";

export type Mode = "reel" | "team" | "plan";

export interface SavedState {
  mode?: Mode | null;
  answers: Answers; // team mode
  step: number; // team mode
  reelAnswers?: ReelAnswers;
  planAnswers?: ReelAnswers; // plan mode (shares the framing-question shape)
  updatedAt: string;
}

export function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: SavedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode, quota); silently skip
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
