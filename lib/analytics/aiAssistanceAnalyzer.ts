import type { LeetCodeProfile } from '@/types/leetcode';
import type { TimerSession, AIHelpResult, AISignal } from '@/types/analysis';

export function analyzeAIAssistance(profile: LeetCodeProfile, sessions: TimerSession[]): AIHelpResult {
  const disclaimer = 'This is an estimate based on available coding signals, not proof of AI usage. Many factors can influence these patterns.';

  if (!profile.recentSubmissions || profile.recentSubmissions.length < 5) {
    return {
      hasEnoughData: false,
      overallLikelihood: 0,
      label: 'Very Low',
      signals: [],
      analyzedCount: profile.recentSubmissions ? profile.recentSubmissions.length : 0,
      flaggedCount: 0,
      disclaimer
    };
  }

  let likelihoodScore = 25; 
  const signals: AISignal[] = [];

  let rapidSubmissions = 0;
  for (let i = 0; i < profile.recentSubmissions.length - 1; i++) {
    const curr = parseInt(profile.recentSubmissions[i].timestamp, 10);
    const next = parseInt(profile.recentSubmissions[i+1].timestamp, 10);
    if (curr - next < 60) { 
      rapidSubmissions++;
    }
  }

  if (rapidSubmissions > 2) {
    likelihoodScore += 30;
    signals.push({
      name: 'Unusually Fast Solving',
      description: 'Multiple submissions within seconds of each other.',
      weight: 30,
      detected: true
    });
  } else {
    signals.push({
      name: 'Normal Solving Pace',
      description: 'Time between submissions appears typical for manual coding.',
      weight: 0,
      detected: false
    });
  }

  let label: AIHelpResult['label'] = 'Very Low';
  if (likelihoodScore > 20 && likelihoodScore <= 40) label = 'Low';
  else if (likelihoodScore > 40 && likelihoodScore <= 60) label = 'Moderate';
  else if (likelihoodScore > 60 && likelihoodScore <= 80) label = 'High';
  else if (likelihoodScore > 80) label = 'Very High';

  return {
    hasEnoughData: true,
    overallLikelihood: Math.min(likelihoodScore, 100),
    label,
    signals,
    analyzedCount: profile.recentSubmissions.length,
    flaggedCount: rapidSubmissions,
    disclaimer
  };
}
