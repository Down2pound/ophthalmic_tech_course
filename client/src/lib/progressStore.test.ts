import { beforeEach, describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  getProgressPercent,
  loadProgress,
  markLessonComplete,
  resetProgress,
  saveProgress,
  type StorageLike,
} from "./progressStore";

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

let storage: StorageLike;

beforeEach(() => {
  storage = createMemoryStorage();
});

describe("progressStore", () => {
  it("starts empty", () => {
    const progress = createEmptyProgress();
    expect(progress.completedLessonIds).toEqual([]);
    expect(progress.quizScores).toEqual({});
  });

  it("saves and loads progress", () => {
    const progress = markLessonComplete(
      createEmptyProgress(),
      "m1-l1-what-techs-do"
    );
    saveProgress(storage, progress);
    expect(loadProgress(storage).completedLessonIds).toEqual([
      "m1-l1-what-techs-do",
    ]);
  });

  it("does not duplicate completed lessons", () => {
    const once = markLessonComplete(
      createEmptyProgress(),
      "m1-l1-what-techs-do"
    );
    const twice = markLessonComplete(once, "m1-l1-what-techs-do");
    expect(twice.completedLessonIds).toEqual(["m1-l1-what-techs-do"]);
  });

  it("calculates completion percentage", () => {
    const progress = markLessonComplete(
      createEmptyProgress(),
      "m1-l1-what-techs-do"
    );
    expect(getProgressPercent(progress, 3)).toBe(33);
  });

  it("resets saved progress", () => {
    saveProgress(
      storage,
      markLessonComplete(createEmptyProgress(), "m1-l1-what-techs-do")
    );
    resetProgress(storage);
    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });
});
