export type AnalysisOption =
  | 'problems-solved'
  | 'time-taken'
  | 'difficulty'
  | 'behavior'
  | 'ai-help'
  | 'similarity'
  | 'strong-areas'
  | 'improvement-areas'
  | 'career';

export interface AnalysisOptionInfo {
  id: AnalysisOption;
  emoji: string;
  title: string;
  description: string;
}

export interface DateRange {
  preset?: '7d' | '30d' | '3m' | '1y' | 'all' | 'custom';
  from?: Date | string;
  to?: Date | string;
}

// --- Problems Solved ---

export interface ProblemsSolvedResult {
  totalSolved: number;
  problems: SolvedProblem[];
  periodLabel: string;
}

export interface SolvedProblem {
  title: string;
  slug?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solvedDate?: string;
  tags?: string[];
  url?: string;
  questionNumber?: string;
}

// --- Difficulty ---

export interface DifficultyResult {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
  total: number;
}

// --- Time Taken ---

export interface TimeTakenResult {
  hasTimerData: boolean;
  averageTime?: number; // seconds
  fastestProblem?: { title: string; duration: number };
  longestProblem?: { title: string; duration: number };
  byDifficulty?: Record<string, number>;
  byTopic?: Record<string, number>;
  sessions: TimerSession[];
}

export interface TimerSession {
  problemTitle: string;
  startedAt: string;
  endedAt?: string;
  activeDuration: number; // seconds
  pauseDuration: number; // seconds
  status: string;
}

// --- Behavior ---

export interface BehaviorResult {
  insights: BehaviorInsight[];
  dataSource: 'profile' | 'app' | 'combined';
}

export interface BehaviorInsight {
  category: string;
  message: string;
  type: 'positive' | 'neutral' | 'suggestion';
}

// --- AI Help ---

export interface AIHelpResult {
  overallLikelihood: number; // 0-100
  label: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  signals: AISignal[];
  disclaimer: string;
  analyzedCount: number;
  flaggedCount: number;
  hasEnoughData: boolean;
}

export interface AISignal {
  name: string;
  description: string;
  weight: number;
  detected: boolean;
}

// --- Code Similarity ---

export interface SimilarityResult {
  totalAnalyzed: number;
  matchCount: number;
  results: SimilarityMatch[];
  hasEnoughData: boolean;
}

export interface SimilarityMatch {
  problemTitle: string;
  similarityScore: number;
  structuralScore: number;
  label: string;
}

// --- Strong Areas ---

export interface StrengthResult {
  strongAreas: TopicStrength[];
}

export interface TopicStrength {
  topic: string;
  score: number; // 0-100
  evidence: string;
  problemCount: number;
  avgDifficulty: string;
}

// --- Areas to Improve ---

export interface ImprovementResult {
  areasToImprove: TopicImprovement[];
}

export interface TopicImprovement {
  topic: string;
  reason: string;
  suggestion: string;
  currentLevel: string;
}

// --- Career ---

export interface CareerResult {
  recommendations: CareerRecommendation[];
  disclaimer: string;
}

export interface CareerRecommendation {
  field: string;
  matchPercentage: number;
  reasoning: string;
  relevantTopics: string[];
}
