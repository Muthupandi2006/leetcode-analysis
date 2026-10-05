'use client';
import { useMemo } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import { analyzeCareer } from '@/lib/analytics/careerRecommendationEngine';

export default function CareerCard({ profile }: { profile: LeetCodeProfile }) {
  const result = useMemo(() => analyzeCareer(profile), [profile]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        🎯 Career Suggestions
      </h3>
      
      {result.recommendations.length === 0 ? (
        <p className="text-muted text-sm">Not enough data to provide career recommendations.</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-background/80 border border-border rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-foreground">{rec.field}</h4>
                  <span className="text-sm text-accent font-bold">{Math.round(rec.matchPercentage)}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full" 
                    style={{ width: `${rec.matchPercentage}%` }} 
                  />
                </div>
                <p className="text-sm text-muted mb-2">{rec.reasoning}</p>
                {rec.relevantTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-2">
                    {rec.relevantTopics.map((topic, i) => (
                      <span key={i} className="text-xs bg-card border border-border text-muted px-2 py-0.5 rounded">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-start gap-2 text-xs text-muted mt-4 bg-background p-3 rounded-lg border border-border">
            <span>ℹ️</span>
            <p>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
