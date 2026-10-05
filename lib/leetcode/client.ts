import { LeetCodeProfile, LeetCodeApiResponse, RecentSubmission, TagProblemCount } from '@/types/leetcode';
import { USER_PROFILE_QUERY, RECENT_SUBMISSIONS_QUERY, SUBMISSION_CALENDAR_QUERY, USER_CONTEST_RANKING_QUERY, RECENT_AC_SUBMISSIONS_QUERY, QUESTION_DIFFICULTY_QUERY } from './queries';

// Rate Limiting Config
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 3;
const CACHE_TTL = 300000; // 5 minutes

class TokenBucket {
  private tokens: number = MAX_REQUESTS_PER_WINDOW;
  private lastRefill: number = Date.now();

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    if (timePassed > RATE_LIMIT_WINDOW) {
      this.tokens = MAX_REQUESTS_PER_WINDOW;
      this.lastRefill = now;
    }
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }
    
    // Wait until next window
    const now = Date.now();
    const timeToWait = RATE_LIMIT_WINDOW - (now - this.lastRefill);
    await new Promise((resolve) => setTimeout(resolve, timeToWait));
    this.refill();
    this.tokens--;
  }
}

const bucket = new TokenBucket();

// Cache Setup
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();

async function executeGraphQL(query: string, variables: Record<string, any>, retries = 1): Promise<any> {
  const cacheKey = JSON.stringify({ query, variables });
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  await bucket.acquire();

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error('RATE_LIMITED');
      throw new Error(`NETWORK_ERROR: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      if (data.errors.some((e: any) => e.message?.toLowerCase().includes('not found'))) {
        throw new Error('USER_NOT_FOUND');
      }
      throw new Error('API_ERROR');
    }

    cache.set(cacheKey, { data: data.data, timestamp: Date.now() });
    return data.data;
  } catch (error: any) {
    if (retries > 0 && error.message.startsWith('NETWORK_ERROR')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return executeGraphQL(query, variables, retries - 1);
    }
    throw error;
  }
}

export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeApiResponse> {
  try {
    const [profileData, recentSubs, calendarData, contestData] = await Promise.all([
      executeGraphQL(USER_PROFILE_QUERY, { username }).catch(e => { throw e; }),
      executeGraphQL(RECENT_SUBMISSIONS_QUERY, { username, limit: 20 }).catch(() => ({ recentSubmissionList: [] })),
      executeGraphQL(SUBMISSION_CALENDAR_QUERY, { username }).catch(() => ({ matchedUser: { submissionCalendar: "{}" } })),
      executeGraphQL(USER_CONTEST_RANKING_QUERY, { username }).catch(() => ({ userContestRanking: null }))
    ]);

    const matchedUser = profileData?.matchedUser;
    
    if (!matchedUser) {
      return {
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'LeetCode user not found' }
      };
    }

    const allQuestionsCount = profileData.allQuestionsCount || [];
    const getCountByDifficulty = (difficulty: string) => 
      allQuestionsCount.find((q: any) => q.difficulty === difficulty)?.count || 0;

    const easyTotal = getCountByDifficulty('Easy');
    const mediumTotal = getCountByDifficulty('Medium');
    const hardTotal = getCountByDifficulty('Hard');
    const totalQuestions = getCountByDifficulty('All');

    const acSubmissionNum = matchedUser.submitStats?.acSubmissionNum || [];
    const getSolvedByDifficulty = (difficulty: string) => 
      acSubmissionNum.find((q: any) => q.difficulty === difficulty)?.count || 0;

    const easySolved = getSolvedByDifficulty('Easy');
    const mediumSolved = getSolvedByDifficulty('Medium');
    const hardSolved = getSolvedByDifficulty('Hard');
    const totalSolved = getSolvedByDifficulty('All');

    // Parse tag counts
    const tagsData = matchedUser.tagProblemCounts || {};
    const tags: TagProblemCount[] = [
      ...(tagsData.advanced || []),
      ...(tagsData.intermediate || []),
      ...(tagsData.fundamental || [])
    ];

    // Parse calendar
    let submissionCalendar = {};
    try {
      if (calendarData?.matchedUser?.submissionCalendar) {
         submissionCalendar = JSON.parse(calendarData.matchedUser.submissionCalendar);
      }
    } catch (e) {
      // ignore
    }

    const rawSubs: RecentSubmission[] = recentSubs?.recentSubmissionList || [];
    const enrichedRecentSubs = await enrichSubmissionsWithQuestionInfo(rawSubs);

    const profile: LeetCodeProfile = {
      username,
      avatarUrl: matchedUser.profile?.userAvatar,
      ranking: matchedUser.profile?.ranking,
      reputation: matchedUser.profile?.reputation,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalQuestions,
      easyTotal,
      mediumTotal,
      hardTotal,
      recentSubmissions: enrichedRecentSubs,
      submissionCalendar,
      tagProblemCounts: tags,
      contestRating: contestData?.userContestRanking?.rating,
      contestAttended: contestData?.userContestRanking?.attendedContestsCount,
      profileUrl: `https://leetcode.com/${username}`
    };

    return {
      success: true,
      profile
    };
  } catch (error: any) {
    let code = 'UNKNOWN_ERROR';
    if (error.message === 'USER_NOT_FOUND' || error.message === 'RATE_LIMITED') {
      code = error.message;
    } else if (error.message.startsWith('NETWORK_ERROR')) {
      code = 'NETWORK_ERROR';
    }

    return {
      success: false,
      error: { code, message: error.message || 'An unknown error occurred while fetching LeetCode profile' }
    };
  }
}

interface QuestionInfo {
  questionFrontendId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

let questionMapCache: Map<string, QuestionInfo> | null = null;
let questionMapTimestamp = 0;
const QUESTION_MAP_TTL = 86400000; // 24 hours

export async function getLeetCodeQuestionMap(): Promise<Map<string, QuestionInfo>> {
  if (questionMapCache && Date.now() - questionMapTimestamp < QUESTION_MAP_TTL) {
    return questionMapCache;
  }

  try {
    const res = await fetch('https://leetcode.com/api/problems/all/', {
      headers: {
        'Referer': 'https://leetcode.com',
      },
    });
    if (res.ok) {
      const data = await res.json();
      const map = new Map<string, QuestionInfo>();
      const diffMap: Record<number, 'Easy' | 'Medium' | 'Hard'> = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard',
      };

      for (const pair of data.stat_status_pairs || []) {
        if (pair.stat?.question__title_slug) {
          map.set(pair.stat.question__title_slug, {
            questionFrontendId: String(pair.stat.frontend_question_id),
            title: pair.stat.question__title,
            difficulty: diffMap[pair.difficulty?.level] || 'Medium',
          });
        }
      }
      questionMapCache = map;
      questionMapTimestamp = Date.now();
      return map;
    }
  } catch (err) {
    console.error('Failed to fetch full question map from LeetCode API:', err);
  }

  return questionMapCache || new Map();
}

export async function enrichSubmissionsWithQuestionInfo(
  submissions: RecentSubmission[]
): Promise<RecentSubmission[]> {
  if (!submissions || submissions.length === 0) return [];

  const map = await getLeetCodeQuestionMap();

  const enriched: RecentSubmission[] = [];
  for (const sub of submissions) {
    const info = map.get(sub.titleSlug);
    if (info) {
      enriched.push({
        ...sub,
        questionFrontendId: info.questionFrontendId,
        difficulty: info.difficulty,
      });
    } else {
      // Fallback to individual question GraphQL query
      try {
        const queryData = await executeGraphQL(QUESTION_DIFFICULTY_QUERY, { titleSlug: sub.titleSlug });
        const q = queryData?.question;
        enriched.push({
          ...sub,
          questionFrontendId: q?.questionFrontendId ? String(q.questionFrontendId) : undefined,
          difficulty: q?.difficulty || undefined,
        });
      } catch {
        enriched.push(sub);
      }
    }
  }
  return enriched;
}

export async function fetchRecentSubmissions(username: string): Promise<RecentSubmission[]> {
  try {
    const data = await executeGraphQL(RECENT_SUBMISSIONS_QUERY, { username, limit: 20 });
    const raw: RecentSubmission[] = data?.recentSubmissionList || [];
    return await enrichSubmissionsWithQuestionInfo(raw);
  } catch (error) {
    return [];
  }
}

/** Fetches accepted-only submissions (public, no auth). Returns id, title, titleSlug, timestamp. */
export async function fetchRecentAcceptedSubmissions(
  username: string,
  limit: number = 20
): Promise<{ id: string; title: string; titleSlug: string; timestamp: string; questionFrontendId?: string }[]> {
  try {
    const data = await executeGraphQL(RECENT_AC_SUBMISSIONS_QUERY, { username, limit });
    const raw: { id: string; title: string; titleSlug: string; timestamp: string }[] = data?.recentAcSubmissionList || [];
    const map = await getLeetCodeQuestionMap();
    return raw.map(item => ({
      ...item,
      questionFrontendId: map.get(item.titleSlug)?.questionFrontendId,
    }));
  } catch {
    return [];
  }
}

/** Fetches the difficulty of a single problem by its titleSlug (public, no auth). */
export async function fetchQuestionDifficulty(titleSlug: string): Promise<string | null> {
  const map = await getLeetCodeQuestionMap();
  const info = map.get(titleSlug);
  if (info?.difficulty) return info.difficulty;

  try {
    const data = await executeGraphQL(QUESTION_DIFFICULTY_QUERY, { titleSlug });
    return data?.question?.difficulty || null;
  } catch {
    return null;
  }
}

/**
 * Fetches accepted submissions and enriches each unique problem with its difficulty.
 * Deduplicates by titleSlug (keeps the most recent submission per problem).
 * This is rate-limited by the token bucket, so we batch difficulty lookups.
 */
export async function fetchSolvedProblemsWithDifficulty(
  username: string,
  limit: number = 50
): Promise<{ title: string; titleSlug: string; difficulty: string; timestamp: string }[]> {
  const acSubs = await fetchRecentAcceptedSubmissions(username, limit);
  if (acSubs.length === 0) return [];

  // Deduplicate by titleSlug — keep the most recent submission
  const uniqueMap = new Map<string, typeof acSubs[0]>();
  for (const sub of acSubs) {
    const existing = uniqueMap.get(sub.titleSlug);
    if (!existing || parseInt(sub.timestamp, 10) > parseInt(existing.timestamp, 10)) {
      uniqueMap.set(sub.titleSlug, sub);
    }
  }

  const uniqueSubs = Array.from(uniqueMap.values());

  // Fetch difficulty for each unique problem — batched with rate limiting
  const results: { title: string; titleSlug: string; difficulty: string; timestamp: string }[] = [];
  for (const sub of uniqueSubs) {
    const difficulty = await fetchQuestionDifficulty(sub.titleSlug);
    results.push({
      title: sub.title,
      titleSlug: sub.titleSlug,
      difficulty: difficulty || 'Unknown',
      timestamp: sub.timestamp,
    });
  }

  return results;
}

