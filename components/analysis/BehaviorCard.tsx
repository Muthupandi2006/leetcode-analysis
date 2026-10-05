'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import type { DateRange } from '@/types/analysis';
import { analyzeBehavior } from '@/lib/analytics/behaviorAnalyzer';

export default function BehaviorCard({ profile, dateRange }: { profile: LeetCodeProfile; dateRange: DateRange }) {
  const result = useMemo(() => analyzeBehavior(profile, dateRange), [profile, dateRange]);

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-l-emerald-500';
      case 'suggestion': return 'border-l-amber-500';
      default: return 'border-l-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        🧠 How You Solve
      </h3>
      
      {result.insights.length === 0 ? (
        <div className="text-muted italic">Not enough data to generate insights.</div>
      ) : (
        <div className="space-y-3">
          {result.insights.map((insight, idx) => (
            <div key={idx} className={`bg-background/80 rounded-xl p-4 border border-border border-l-4 ${getBorderColor(insight.type)}`}>
              <p className="text-sm text-foreground">{insight.message}</p>
              <span className="text-xs text-muted mt-1 block">{insight.category}</span>
            </div>
          ))}
          <p className="text-xs text-muted mt-2">Based on {result.dataSource} data</p>
        </div>
      )}
    </div>
  );
}
