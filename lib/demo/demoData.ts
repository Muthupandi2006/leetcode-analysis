import type { LeetCodeProfile, RecentSubmission, TagProblemCount } from '@/types/leetcode';
import type { TimerSession } from '@/types/analysis';

export const DEMO_PROFILE: LeetCodeProfile = {
  username: 'demo_user',
  avatarUrl: undefined,
  ranking: 152847,
  totalSolved: 247,
  easySolved: 98,
  mediumSolved: 112,
  hardSolved: 37,
  totalQuestions: 3150,
  easyTotal: 800,
  mediumTotal: 1650,
  hardTotal: 700,
  profileUrl: 'https://leetcode.com/u/demo_user/',
  contestRating: 1523,
  contestAttended: 12,
  recentSubmissions: [
    { title: 'Score of Parentheses', titleSlug: 'score-of-parentheses', questionFrontendId: '856', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 7200), statusDisplay: 'Accepted', lang: 'typescript' },
    { title: 'Valid Parenthesis String', titleSlug: 'valid-parenthesis-string', questionFrontendId: '678', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 86400), statusDisplay: 'Accepted', lang: 'python3' },
    { title: 'Binary Watch', titleSlug: 'binary-watch', questionFrontendId: '401', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 172800), statusDisplay: 'Accepted', lang: 'java' },
    { title: 'Two Sum', titleSlug: 'two-sum', questionFrontendId: '1', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 259200), statusDisplay: 'Accepted', lang: 'cpp' },
    { title: 'Longest Palindromic Substring', titleSlug: 'longest-palindromic-substring', questionFrontendId: '5', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 345600), statusDisplay: 'Accepted', lang: 'javascript' },
    { title: 'Zigzag Conversion', titleSlug: 'zigzag-conversion', questionFrontendId: '6', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 432000), statusDisplay: 'Accepted', lang: 'python3' },
    { title: 'Reverse Integer', titleSlug: 'reverse-integer', questionFrontendId: '7', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 518400), statusDisplay: 'Accepted', lang: 'rust' },
    { title: 'String to Integer (atoi)', titleSlug: 'string-to-integer-atoi', questionFrontendId: '8', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 604800), statusDisplay: 'Accepted', lang: 'go' },
    { title: 'Palindrome Number', titleSlug: 'palindrome-number', questionFrontendId: '9', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 691200), statusDisplay: 'Accepted', lang: 'csharp' },
    { title: 'Regular Expression Matching', titleSlug: 'regular-expression-matching', questionFrontendId: '10', difficulty: 'Hard', timestamp: String(Math.floor(Date.now() / 1000) - 777600), statusDisplay: 'Accepted', lang: 'typescript' },
    { title: 'Container With Most Water', titleSlug: 'container-with-most-water', questionFrontendId: '11', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 864000), statusDisplay: 'Accepted', lang: 'python3' },
    { title: 'Integer to Roman', titleSlug: 'integer-to-roman', questionFrontendId: '12', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 950400), statusDisplay: 'Accepted', lang: 'kotlin' },
    { title: 'Roman to Integer', titleSlug: 'roman-to-integer', questionFrontendId: '13', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 1036800), statusDisplay: 'Accepted', lang: 'java' },
    { title: 'Longest Common Prefix', titleSlug: 'longest-common-prefix', questionFrontendId: '14', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 1123200), statusDisplay: 'Accepted', lang: 'typescript' },
    { title: '3Sum', titleSlug: '3sum', questionFrontendId: '15', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 1209600), statusDisplay: 'Accepted', lang: 'python3' },
    { title: '3Sum Closest', titleSlug: '3sum-closest', questionFrontendId: '16', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 1296000), statusDisplay: 'Accepted', lang: 'java' },
    { title: 'Letter Combinations of a Phone Number', titleSlug: 'letter-combinations-of-a-phone-number', questionFrontendId: '17', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 1382400), statusDisplay: 'Accepted', lang: 'cpp' },
    { title: '4Sum', titleSlug: '4sum', questionFrontendId: '18', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 1468800), statusDisplay: 'Accepted', lang: 'javascript' },
    { title: 'Remove Nth Node From End of List', titleSlug: 'remove-nth-node-from-end-of-list', questionFrontendId: '19', difficulty: 'Medium', timestamp: String(Math.floor(Date.now() / 1000) - 1555200), statusDisplay: 'Accepted', lang: 'go' },
    { title: 'Valid Parentheses', titleSlug: 'valid-parentheses', questionFrontendId: '20', difficulty: 'Easy', timestamp: String(Math.floor(Date.now() / 1000) - 1641600), statusDisplay: 'Accepted', lang: 'typescript' },
  ],
  submissionCalendar: Object.fromEntries(
    [1, 2, 3, 5, 10, 12, 15, 20, 25, 30, 45, 60, 90, 120, 150].map(d => [
      String(Math.floor(Date.now() / 1000) - 86400 * d),
      [2, 4, 1, 5, 3, 2, 7, 1, 4, 2, 6, 3, 5, 2, 8][
        [1, 2, 3, 5, 10, 12, 15, 20, 25, 30, 45, 60, 90, 120, 150].indexOf(d)
      ],
    ])
  ),
  tagProblemCounts: [
    { tagName: 'Array', tagSlug: 'array', problemsSolved: 45 },
    { tagName: 'String', tagSlug: 'string', problemsSolved: 32 },
    { tagName: 'Hash Table', tagSlug: 'hash-table', problemsSolved: 28 },
    { tagName: 'Tree', tagSlug: 'tree', problemsSolved: 22 },
    { tagName: 'Math', tagSlug: 'math', problemsSolved: 18 },
    { tagName: 'Dynamic Programming', tagSlug: 'dynamic-programming', problemsSolved: 15 },
    { tagName: 'Binary Search', tagSlug: 'binary-search', problemsSolved: 14 },
    { tagName: 'Sorting', tagSlug: 'sorting', problemsSolved: 12 },
    { tagName: 'Greedy', tagSlug: 'greedy', problemsSolved: 11 },
    { tagName: 'Stack', tagSlug: 'stack', problemsSolved: 10 },
    { tagName: 'Linked List', tagSlug: 'linked-list', problemsSolved: 9 },
    { tagName: 'Graph', tagSlug: 'graph', problemsSolved: 8 },
    { tagName: 'Backtracking', tagSlug: 'backtracking', problemsSolved: 6 },
    { tagName: 'Queue', tagSlug: 'queue', problemsSolved: 5 },
    { tagName: 'Bit Manipulation', tagSlug: 'bit-manipulation', problemsSolved: 4 },
  ],
};

export const DEMO_TIMER_SESSIONS: TimerSession[] = [
  { problemTitle: 'Two Sum', activeDuration: 300, pauseDuration: 0, status: 'completed', startedAt: new Date(Date.now() - 7200000).toISOString(), endedAt: new Date(Date.now() - 6900000).toISOString() },
  { problemTitle: 'Add Two Numbers', activeDuration: 1200, pauseDuration: 300, status: 'completed', startedAt: new Date(Date.now() - 86400000).toISOString(), endedAt: new Date(Date.now() - 84900000).toISOString() },
  { problemTitle: 'Longest Substring Without Repeating Characters', activeDuration: 1800, pauseDuration: 600, status: 'completed', startedAt: new Date(Date.now() - 172800000).toISOString(), endedAt: new Date(Date.now() - 170400000).toISOString() },
  { problemTitle: 'Median of Two Sorted Arrays', activeDuration: 3600, pauseDuration: 1200, status: 'completed', startedAt: new Date(Date.now() - 259200000).toISOString(), endedAt: new Date(Date.now() - 254400000).toISOString() },
  { problemTitle: 'Longest Palindromic Substring', activeDuration: 2400, pauseDuration: 0, status: 'completed', startedAt: new Date(Date.now() - 345600000).toISOString(), endedAt: new Date(Date.now() - 343200000).toISOString() },
  { problemTitle: 'Zigzag Conversion', activeDuration: 1500, pauseDuration: 150, status: 'completed', startedAt: new Date(Date.now() - 432000000).toISOString(), endedAt: new Date(Date.now() - 430350000).toISOString() },
  { problemTitle: 'Reverse Integer', activeDuration: 600, pauseDuration: 0, status: 'completed', startedAt: new Date(Date.now() - 518400000).toISOString(), endedAt: new Date(Date.now() - 517800000).toISOString() },
  { problemTitle: 'String to Integer (atoi)', activeDuration: 900, pauseDuration: 60, status: 'completed', startedAt: new Date(Date.now() - 604800000).toISOString(), endedAt: new Date(Date.now() - 603840000).toISOString() },
];

export const DEMO_CODE_SUBMISSIONS = [
  { problemTitle: 'Two Sum', code: 'function twoSum(nums: number[], target: number): number[] {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}' },
  { problemTitle: 'Valid Parentheses', code: 'function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ")": "(", "]": "[", "}": "{" };\n  for (const c of s) {\n    if (map[c]) {\n      if (stack.pop() !== map[c]) return false;\n    } else stack.push(c);\n  }\n  return stack.length === 0;\n}' },
];

export function isDemoMode(username: string): boolean {
  return username === 'demo';
}
