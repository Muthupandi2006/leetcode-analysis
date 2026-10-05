import type { SimilarityResult, SimilarityMatch } from '@/types/analysis';

function normalizeCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function calculateSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.split(' '));
  const tokensB = new Set(b.split(' '));
  
  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return intersection.size / union.size;
}

export function analyzeCodeSimilarity(
  submissions: {code: string; problemTitle: string}[], 
  references: {code: string; source: string}[]
): SimilarityResult {
  
  if (!submissions || submissions.length === 0 || !references || references.length === 0) {
    return {
      hasEnoughData: false,
      totalAnalyzed: 0,
      matchCount: 0,
      results: []
    };
  }

  const results: SimilarityMatch[] = [];
  let matchCount = 0;

  for (const sub of submissions) {
    const normSub = normalizeCode(sub.code);
    
    for (const ref of references) {
      const normRef = normalizeCode(ref.code);
      const score = calculateSimilarity(normSub, normRef);
      
      const percentage = Math.round(score * 100);
      let label = 'Very Low';
      if (percentage > 20 && percentage <= 40) label = 'Low';
      else if (percentage > 40 && percentage <= 60) label = 'Moderate';
      else if (percentage > 60 && percentage <= 80) label = 'High';
      else if (percentage > 80) label = 'Very High';

      if (percentage > 60) matchCount++;

      results.push({
        problemTitle: sub.problemTitle,
        label: ref.source,
        similarityScore: percentage,
        structuralScore: percentage, // simplified for now
      });
    }
  }

  return {
    hasEnoughData: true,
    totalAnalyzed: submissions.length,
    matchCount,
    results: results.sort((a, b) => b.similarityScore - a.similarityScore)
  };
}
