'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import { analyzeStrengths } from '@/lib/analytics/strengthAnalyzer';

export default function StrongAreasCard({ profile }: { profile: LeetCodeProfile }) {
  const result = useMemo(() => analyzeStrengths(profile), [profile]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        💪 Strong Areas
      </h3>
      
      {result.strongAreas.length === 0 ? (
        <p className="text-muted text-sm">Keep solving more problems to identify your strong areas.</p>
      ) : (
        <div className="space-y-4">
          {result.strongAreas.map((s, idx) => (
            <div key={idx} className="bg-background/80 border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">{s.topic}</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 font-medium">
                  {Math.round(s.score)}/100
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
              </div>
              <p className="text-sm text-muted">{s.evidence}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
