import type { LeetCodeProfile } from '@/types/leetcode';
import type { ImprovementResult, TopicImprovement } from '@/types/analysis';

export function analyzeImprovements(profile: LeetCodeProfile): ImprovementResult {
  if (!profile.tagProblemCounts || profile.tagProblemCounts.length === 0) {
    return { areasToImprove: [] };
  }

  const allTags = profile.tagProblemCounts;

  const sortedTags = [...allTags]
    .filter(tag => tag.problemsSolved > 0)
    .sort((a, b) => a.problemsSolved - b.problemsSolved);
    
  const weakTags = sortedTags.slice(0, 5);

  const areasToImprove: TopicImprovement[] = weakTags.map(tag => {
    return {
      topic: tag.tagName,
      reason: `You have fewer ${tag.tagName} problems compared to your other topics (${tag.problemsSolved} solved).`,
      suggestion: `Try starting with basic ${tag.tagName} problems to build confidence.`,
      currentLevel: 'Beginner' // Required field
    };
  });

  return { areasToImprove };
}
