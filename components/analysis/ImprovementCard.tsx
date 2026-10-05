'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import { analyzeImprovements } from '@/lib/analytics/improvementAnalyzer';

export default function ImprovementCard({ profile }: { profile: LeetCodeProfile }) {
  const result = useMemo(() => analyzeImprovements(profile), [profile]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        📚 Areas to Improve
      </h3>
      
      {result.areasToImprove.length === 0 ? (
        <p className="text-muted text-sm">No significant areas to improve identified yet. Great job!</p>
      ) : (
        <div className="space-y-4">
          {result.areasToImprove.map((area, idx) => (
            <div key={idx} className="bg-background/80 border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-amber-500 dark:text-amber-400">{area.topic}</h4>
                <span className="text-xs text-muted bg-card border border-border px-2 py-0.5 rounded">{area.currentLevel}</span>
              </div>
              <p className="text-sm text-foreground/90 mb-2">{area.reason}</p>
              <div className="text-xs text-muted flex gap-2 items-start mt-3 pt-3 border-t border-border">
                <span className="text-emerald-500">💡</span>
                <span>{area.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
