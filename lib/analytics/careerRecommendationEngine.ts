import type { LeetCodeProfile } from '@/types/leetcode';
import type { CareerResult, CareerRecommendation } from '@/types/analysis';

export function analyzeCareer(profile: LeetCodeProfile): CareerResult {
  const disclaimer = 'These suggestions are based on your coding patterns and are meant to inspire exploration, not define your career path.';
  
  if (!profile.tagProblemCounts || profile.tagProblemCounts.length === 0) {
    return { recommendations: [], disclaimer };
  }

  const allTags = profile.tagProblemCounts;

  const tagCounts: Record<string, number> = {};
  allTags.forEach(t => { tagCounts[t.tagName.toLowerCase()] = t.problemsSolved; });

  const scoreField = (keywords: string[]) => {
    let score = 0;
    keywords.forEach(kw => {
      score += tagCounts[kw.toLowerCase()] || 0;
    });
    return score;
  };

  const fields = [
    { name: 'Backend Dev', keywords: ['tree', 'graph', 'hash table', 'database', 'system design'] },
    { name: 'Frontend Dev', keywords: ['string', 'array', 'dom'] },
    { name: 'Data Engineering', keywords: ['sorting', 'hash table', 'array', 'sql'] },
    { name: 'ML/AI', keywords: ['math', 'dynamic programming', 'matrix'] },
    { name: 'Full Stack', keywords: ['tree', 'graph', 'string', 'array', 'hash table'] },
    { name: 'DevOps/Cloud', keywords: ['networking', 'systems', 'design'] },
    { name: 'Competitive Programming', keywords: ['advanced', 'dynamic programming', 'graph', 'tree', 'trie'] }
  ];

  let maxScore = 1;
  const scoredFields = fields.map(f => {
    const score = scoreField(f.keywords);
    if (score > maxScore) maxScore = score;
    return { name: f.name, score, keywords: f.keywords };
  });

  const recommendations: CareerRecommendation[] = scoredFields
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(f => ({
      field: f.name,
      matchPercentage: Math.min(100, Math.round((f.score / maxScore) * 100)),
      reasoning: `Based on your proficiency in relevant topics.`,
      relevantTopics: f.keywords
    }));

  return { recommendations, disclaimer };
}
