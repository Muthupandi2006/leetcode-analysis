'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { analyzeTimeTaken } from '@/lib/analytics/timeAnalyzer';

export default function TimeTakenCard() {
  const result = useMemo(() => analyzeTimeTaken([]), []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-center">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        ⏱️ Time Taken
      </h3>
      
      {!result.hasTimerData ? (
        <div className="text-center py-4 bg-background/80 rounded-xl p-4 border border-border">
          <p className="text-muted mb-3 text-sm">
            Start using the built-in timer to track your solving time accurately.
          </p>
          <Link href="/timer" className="inline-block bg-accent hover:bg-accent-hover text-white dark:text-background text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs">
            Go to Timer →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/80 rounded-xl p-3 border border-border text-center">
              <div className="text-xs text-muted mb-1">Average</div>
              <div className="text-lg font-bold text-foreground">{result.averageTime ? formatTime(result.averageTime) : '—'}</div>
            </div>
            <div className="bg-background/80 rounded-xl p-3 border border-border text-center">
              <div className="text-xs text-muted mb-1">Fastest</div>
              <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400">{result.fastestProblem ? formatTime(result.fastestProblem.duration) : '—'}</div>
            </div>
            <div className="bg-background/80 rounded-xl p-3 border border-border text-center">
              <div className="text-xs text-muted mb-1">Longest</div>
              <div className="text-lg font-bold text-amber-500 dark:text-amber-400">{result.longestProblem ? formatTime(result.longestProblem.duration) : '—'}</div>
            </div>
          </div>
          {result.sessions.length > 0 && (
            <p className="text-xs text-muted">{result.sessions.length} sessions recorded</p>
          )}
        </div>
      )}
    </div>
  );
}
