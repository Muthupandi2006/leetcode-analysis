'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import { analyzeAIAssistance } from '@/lib/analytics/aiAssistanceAnalyzer';

export default function AIHelpCard({ profile }: { profile: LeetCodeProfile }) {
  const result = useMemo(() => analyzeAIAssistance(profile, []), [profile]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        🤖 Possible AI Help
      </h3>
      
      {!result.hasEnoughData ? (
        <div className="text-sm text-muted mb-4 bg-background/80 p-3 rounded-lg border border-border">
          We need more activity data to estimate this accurately. Use the built-in timer and submit code through our platform to enable this analysis.
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground">AI Assistance Likelihood</span>
            <span className={`font-bold ${result.overallLikelihood > 70 ? 'text-red-500' : result.overallLikelihood > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {result.overallLikelihood}% — {result.label}
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${result.overallLikelihood > 70 ? 'bg-red-500' : result.overallLikelihood > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
              style={{ width: `${result.overallLikelihood}%` }} 
            />
          </div>
          {result.signals.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs text-muted uppercase tracking-wider">Signals Analyzed</p>
              {result.signals.map((signal, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={signal.detected ? 'text-amber-500' : 'text-muted'}>{signal.detected ? '⚠' : '✓'}</span>
                  <span className="text-muted">{signal.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-amber-500/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
        <span>⚠️</span>
        <p>{result.disclaimer}</p>
      </div>
    </div>
  );
}
