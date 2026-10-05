'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import type { DateRange } from '@/types/analysis';
import { analyzeDifficulty } from '@/lib/analytics/difficultyAnalyzer';

export default function DifficultyCard({ profile, dateRange }: { profile: LeetCodeProfile; dateRange: DateRange }) {
  const result = useMemo(() => analyzeDifficulty(profile, dateRange), [profile, dateRange]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        📊 Difficulty Breakdown
      </h3>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-emerald-500 font-medium">Easy</span>
            <span className="text-muted">{result.easy.count} ({Math.round(result.easy.percentage)}%)</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.easy.percentage}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-amber-500 font-medium">Medium</span>
            <span className="text-muted">{result.medium.count} ({Math.round(result.medium.percentage)}%)</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.medium.percentage}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-500 font-medium">Hard</span>
            <span className="text-muted">{result.hard.count} ({Math.round(result.hard.percentage)}%)</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${result.hard.percentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
