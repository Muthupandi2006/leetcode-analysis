import type { TimerSession, TimeTakenResult } from '@/types/analysis';

export function analyzeTimeTaken(sessions: TimerSession[]): TimeTakenResult {
  if (!sessions || sessions.length === 0) {
    return {
      hasTimerData: false,
      sessions: []
    };
  }

  let totalDuration = 0;
  let minDuration = Infinity;
  let maxDuration = 0;
  let fastestTitle = '';
  let longestTitle = '';

  sessions.forEach(session => {
    totalDuration += session.activeDuration;
    if (session.activeDuration < minDuration) {
      minDuration = session.activeDuration;
      fastestTitle = session.problemTitle;
    }
    if (session.activeDuration > maxDuration) {
      maxDuration = session.activeDuration;
      longestTitle = session.problemTitle;
    }
  });

  return {
    hasTimerData: true,
    sessions,
    averageTime: Math.round(totalDuration / sessions.length),
    fastestProblem: minDuration !== Infinity ? { title: fastestTitle, duration: minDuration } : undefined,
    longestProblem: maxDuration > 0 ? { title: longestTitle, duration: maxDuration } : undefined,
  };
}
