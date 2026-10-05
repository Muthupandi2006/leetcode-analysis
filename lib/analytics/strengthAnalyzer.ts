import type { LeetCodeProfile } from '@/types/leetcode';
import type { StrengthResult, TopicStrength } from '@/types/analysis';

export function analyzeStrengths(profile: LeetCodeProfile): StrengthResult {
  if (!profile.tagProblemCounts || profile.tagProblemCounts.length === 0) {
    return { strongAreas: [] };
  }

  const allTags = profile.tagProblemCounts;

  const sortedTags = [...allTags].sort((a, b) => b.problemsSolved - a.problemsSolved);
  const topTags = sortedTags.slice(0, 8);

  const strongAreas: TopicStrength[] = topTags.map(tag => {
    return {
      topic: tag.tagName,
      score: tag.problemsSolved * 10, // simplified score
      problemCount: tag.problemsSolved,
      evidence: `Solved ${tag.problemsSolved} ${tag.tagName} problems.`,
      avgDifficulty: 'Medium' // simplified placeholder
    };
  });

  return { strongAreas };
}
