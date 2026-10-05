import type { LeetCodeProfile } from '@/types/leetcode';
import type { DifficultyResult, DateRange } from '@/types/analysis';
import { analyzeProblemsSolved } from './problemAnalyzer';

export function analyzeDifficulty(profile: LeetCodeProfile, dateRange: DateRange): DifficultyResult {
  const { analysis } = analyzeProblemsSolved(profile, dateRange);
  const total = analysis.totalInPeriod;

  if (total === 0) {
    return {
      easy: { count: 0, percentage: 0 },
      medium: { count: 0, percentage: 0 },
      hard: { count: 0, percentage: 0 },
      total: 0
    };
  }

  const easyCount = analysis.easySolved;
  const mediumCount = analysis.mediumSolved;
  const hardCount = analysis.hardSolved;

  return {
    easy: { count: easyCount, percentage: Math.round((easyCount / total) * 100) },
    medium: { count: mediumCount, percentage: Math.round((mediumCount / total) * 100) },
    hard: { count: hardCount, percentage: Math.round((hardCount / total) * 100) },
    total
  };
}
