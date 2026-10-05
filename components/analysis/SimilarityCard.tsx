'use client';
import { useMemo } from 'react';
import { analyzeCodeSimilarity } from '@/lib/analytics/similarityAnalyzer';

export default function SimilarityCard() {
  const result = useMemo(() => analyzeCodeSimilarity([], []), []);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        🔍 Code Similarity
      </h3>
      
      {!result.hasEnoughData ? (
        <p className="text-sm text-muted bg-background/80 p-3 rounded-lg border border-border">
          Submit code through our platform to enable similarity analysis against reference solutions.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted">Possible Matches</span>
            <span className="text-foreground font-bold">{result.matchCount} / {result.totalAnalyzed}</span>
          </div>
          {result.results.map((match, idx) => (
            <div key={idx} className="bg-background/80 border border-border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">{match.problemTitle}</span>
                <span className="text-xs text-amber-500 font-semibold">{Math.round(match.similarityScore * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
