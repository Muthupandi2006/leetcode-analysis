export interface LeetCodeProfile {
  username: string;
  avatarUrl?: string;
  ranking?: number;
  reputation?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  recentSubmissions: RecentSubmission[];
  submissionCalendar: Record<string, number>; // unix timestamp -> count
  tagProblemCounts: TagProblemCount[];
  contestRating?: number;
  contestAttended?: number;
  profileUrl: string;
}

export interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
  questionFrontendId?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
}

export interface TagProblemCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeApiResponse {
  success: boolean;
  profile?: LeetCodeProfile;
  error?: {
    code: string;
    message: string;
  };
}
