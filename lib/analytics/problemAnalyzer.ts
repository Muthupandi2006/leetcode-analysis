import type { LeetCodeProfile } from '@/types/leetcode';
import type { ProblemsSolvedResult, SolvedProblem, DateRange } from '@/types/analysis';

/**
 * Helper to parse a start date (set to 00:00:00.000 local time).
 */
export function parseDateStart(val?: Date | string): number | null {
  if (!val) return null;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const d = new Date(val);
    d.setHours(0, 0, 0, 0);
    return Math.floor(d.getTime() / 1000);
  }
  if (typeof val === 'string' && val.trim()) {
    const parts = val.trim().split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day, 0, 0, 0, 0);
      if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      d.setHours(0, 0, 0, 0);
      return Math.floor(d.getTime() / 1000);
    }
  }
  return null;
}

/**
 * Helper to parse an end date (set to 23:59:59.999 local time).
 * This ensures any problem solved during the To Date is counted.
 */
export function parseDateEnd(val?: Date | string): number | null {
  if (!val) return null;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const d = new Date(val);
    d.setHours(23, 59, 59, 999);
    return Math.floor(d.getTime() / 1000);
  }
  if (typeof val === 'string' && val.trim()) {
    const parts = val.trim().split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day, 23, 59, 59, 999);
      if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      return Math.floor(d.getTime() / 1000);
    }
  }
  return null;
}

/**
 * Format a Date or date string to readable display (e.g. "Sep 1, 2026").
 */
export function formatDateDisplay(val: Date | string): string {
  let d: Date;
  if (val instanceof Date) {
    d = val;
  } else if (typeof val === 'string') {
    const parts = val.trim().split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(val);
    }
  } else {
    return '';
  }

  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Converts a DateRange preset or custom dates into actual from/to unix timestamps (seconds).
 */
export function resolveTimestamps(dateRange: DateRange): { startTs: number; endTs: number } {
  const now = Date.now();
  const currentTs = Math.floor(now / 1000);

  // If custom date range or from/to dates are provided
  if (dateRange.preset === 'custom' || dateRange.from || dateRange.to) {
    const start = parseDateStart(dateRange.from);
    const end = parseDateEnd(dateRange.to);

    if (start !== null && end !== null) {
      const minTs = Math.min(start, end);
      const maxTs = Math.max(start, end);
      return { startTs: minTs, endTs: maxTs };
    }
    if (start !== null) {
      return { startTs: start, endTs: currentTs };
    }
    if (end !== null) {
      return { startTs: 0, endTs: end };
    }
    // Preset custom but dates not yet selected
    return { startTs: 0, endTs: currentTs };
  }

  // Convert preset to start/end timestamps
  switch (dateRange.preset) {
    case '7d':
      return { startTs: Math.floor((now - 7 * 86400 * 1000) / 1000), endTs: currentTs };
    case '30d':
      return { startTs: Math.floor((now - 30 * 86400 * 1000) / 1000), endTs: currentTs };
    case '3m':
      return { startTs: Math.floor((now - 90 * 86400 * 1000) / 1000), endTs: currentTs };
    case '1y': {
      const jan1 = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0);
      return { startTs: Math.floor(jan1.getTime() / 1000), endTs: currentTs };
    }
    case 'all':
    default:
      return { startTs: 0, endTs: currentTs };
  }
}

/**
 * Check whether a timestamp (in seconds) falls into the date range.
 * Checks both timestamp range and calendar date strings to ensure timezone resilience.
 */
export function isTimestampInDateRange(
  ts: number,
  dateRange: DateRange,
  startTs: number,
  endTs: number
): boolean {
  // If all time
  if (dateRange.preset === 'all' || (startTs === 0 && endTs >= Math.floor(Date.now() / 1000) && dateRange.preset !== 'custom')) {
    return true;
  }

  // Primary check: timestamp in range [startTs, endTs]
  if (ts >= startTs && ts <= endTs) {
    return true;
  }

  // For custom date ranges: also compare calendar date strings (YYYY-MM-DD)
  // in case of timezone boundary offsets between local time and UTC
  if (dateRange.preset === 'custom' && (dateRange.from || dateRange.to)) {
    const fromStr = typeof dateRange.from === 'string'
      ? dateRange.from
      : dateRange.from instanceof Date
      ? dateRange.from.toISOString().slice(0, 10)
      : '';
    const toStr = typeof dateRange.to === 'string'
      ? dateRange.to
      : dateRange.to instanceof Date
      ? dateRange.to.toISOString().slice(0, 10)
      : '';

    const subDate = new Date(ts * 1000);
    const localKey = `${subDate.getFullYear()}-${String(subDate.getMonth() + 1).padStart(2, '0')}-${String(subDate.getDate()).padStart(2, '0')}`;
    const utcKey = `${subDate.getUTCFullYear()}-${String(subDate.getUTCMonth() + 1).padStart(2, '0')}-${String(subDate.getUTCDate()).padStart(2, '0')}`;

    if (fromStr && toStr) {
      const minKey = fromStr < toStr ? fromStr : toStr;
      const maxKey = fromStr > toStr ? fromStr : toStr;
      if ((localKey >= minKey && localKey <= maxKey) || (utcKey >= minKey && utcKey <= maxKey)) {
        return true;
      }
    } else if (fromStr) {
      if (localKey >= fromStr || utcKey >= fromStr) {
        return true;
      }
    } else if (toStr) {
      if (localKey <= toStr || utcKey <= toStr) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Build a human-readable label for the selected date range.
 */
export function buildPeriodLabel(dateRange: DateRange): string {
  if (dateRange.preset === 'custom') {
    const fromDisplay = dateRange.from ? formatDateDisplay(dateRange.from) : '';
    const toDisplay = dateRange.to ? formatDateDisplay(dateRange.to) : '';

    if (fromDisplay && toDisplay) {
      return `${fromDisplay} – ${toDisplay}`;
    }
    if (fromDisplay) {
      return `Since ${fromDisplay}`;
    }
    if (toDisplay) {
      return `Until ${toDisplay}`;
    }
    return 'Custom Date Range';
  }

  switch (dateRange.preset) {
    case '7d': return 'Last 7 Days';
    case '30d': return 'Last 30 Days';
    case '3m': return 'Last 3 Months';
    case '1y': return 'This Year';
    case 'all': return 'All Time';
    default: return 'All Time';
  }
}

/**
 * Count total submissions within the date range using the submissionCalendar,
 * which maps unix-timestamp-of-day → number-of-submissions-that-day.
 */
function countFromCalendar(
  calendar: Record<string, number>,
  dateRange: DateRange,
  startTs: number,
  endTs: number
): number {
  let count = 0;
  for (const [tsStr, submissions] of Object.entries(calendar)) {
    const ts = parseInt(tsStr, 10);
    if (isTimestampInDateRange(ts, dateRange, startTs, endTs)) {
      count += submissions;
    }
  }
  return count;
}

export interface ProblemsSolvedAnalysis {
  /** Total problems in the selected period (from calendar or profile) */
  totalInPeriod: number;
  /** Estimated Easy/Medium/Hard counts in the period */
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  /** The recent submissions that fall within the date range */
  recentInPeriod: SolvedProblem[];
  /** Human-readable label */
  periodLabel: string;
  /** Whether the date range covers all time */
  isAllTime: boolean;
}

export function analyzeProblemsSolved(
  profile: LeetCodeProfile,
  dateRange: DateRange
): ProblemsSolvedResult & { analysis: ProblemsSolvedAnalysis } {
  const { startTs, endTs } = resolveTimestamps(dateRange);

  // If custom date range is selected, isAllTime is FALSE so custom range is strictly respected
  const isAllTime = dateRange.preset === 'all' || (
    !dateRange.preset && !dateRange.from && !dateRange.to
  );

  const periodLabel = buildPeriodLabel(dateRange);

  // 1. Get total count from submissionCalendar for the period
  const calendarCount = countFromCalendar(profile.submissionCalendar || {}, dateRange, startTs, endTs);

  // 2. Filter recentSubmissions to the date range (these are the individual problems we can list)
  const recentInPeriod: SolvedProblem[] = (profile.recentSubmissions || [])
    .filter(sub => {
      const ts = parseInt(sub.timestamp, 10);
      return isTimestampInDateRange(ts, dateRange, startTs, endTs) && sub.statusDisplay === 'Accepted';
    })
    .map(sub => {
      let qNum = sub.questionFrontendId;
      if (!qNum) {
        const match = sub.title?.match(/^(\d+)\.\s*/);
        if (match) {
          qNum = match[1];
        }
      }
      return {
        title: sub.title,
        slug: sub.titleSlug,
        difficulty: 'Medium' as const,
        solvedDate: sub.timestamp,
        url: `https://leetcode.com/problems/${sub.titleSlug}/`,
        questionNumber: qNum,
      };
    })
    .sort((a, b) => {
      const tsA = parseInt(a.solvedDate || '0', 10);
      const tsB = parseInt(b.solvedDate || '0', 10);
      return tsB - tsA;
    });

  // For "all time", use profile.totalSolved.
  // For custom/period filtering, use the calendar count (or recent submissions if calendar has 0 but submissions exist)
  const totalInPeriod = isAllTime
    ? profile.totalSolved
    : Math.max(calendarCount, recentInPeriod.length);

  // 3. Estimate per-difficulty counts proportionally based on profile ratio
  const profileTotal = profile.totalSolved || 1;
  const ratio = totalInPeriod / profileTotal;

  let easySolved: number;
  let mediumSolved: number;
  let hardSolved: number;

  if (isAllTime) {
    easySolved = profile.easySolved;
    mediumSolved = profile.mediumSolved;
    hardSolved = profile.hardSolved;
  } else if (totalInPeriod === 0) {
    easySolved = 0;
    mediumSolved = 0;
    hardSolved = 0;
  } else {
    easySolved = Math.round(profile.easySolved * ratio);
    hardSolved = Math.round(profile.hardSolved * ratio);
    mediumSolved = Math.max(0, totalInPeriod - easySolved - hardSolved);
  }

  // Assign difficulty to recent problems for drill-down view
  if (recentInPeriod.length > 0) {
    const easyRatio = profile.easySolved / profileTotal;
    const mediumRatio = profile.mediumSolved / profileTotal;
    const easyCount = Math.round(recentInPeriod.length * easyRatio);
    const mediumCount = Math.round(recentInPeriod.length * mediumRatio);

    recentInPeriod.forEach((p, idx) => {
      if (idx < easyCount) {
        p.difficulty = 'Easy';
      } else if (idx < easyCount + mediumCount) {
        p.difficulty = 'Medium';
      } else {
        p.difficulty = 'Hard';
      }
    });
  }

  return {
    totalSolved: totalInPeriod,
    problems: recentInPeriod,
    periodLabel,
    analysis: {
      totalInPeriod,
      easySolved,
      mediumSolved,
      hardSolved,
      recentInPeriod,
      periodLabel,
      isAllTime,
    },
  };
}
