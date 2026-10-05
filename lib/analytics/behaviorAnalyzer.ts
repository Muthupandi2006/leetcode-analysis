import type { LeetCodeProfile } from '@/types/leetcode';
import type { BehaviorResult, BehaviorInsight, DateRange } from '@/types/analysis';
import { resolveTimestamps, isTimestampInDateRange } from './problemAnalyzer';

export function analyzeBehavior(profile: LeetCodeProfile, dateRange: DateRange): BehaviorResult {
  const insights: BehaviorInsight[] = [];
  
  if (!profile.submissionCalendar || Object.keys(profile.submissionCalendar).length === 0) {
    insights.push({
      category: 'Consistency',
      type: 'neutral',
      message: 'Not enough data to analyze your solving consistency.'
    });
    return { insights, dataSource: 'profile' };
  }

  const { startTs, endTs } = resolveTimestamps(dateRange);
  const calendar = profile.submissionCalendar;

  const dayCounts: Record<number, number> = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
  let activeDays = 0;
  let maxDay = -1;
  let maxCount = -1;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (const [timestamp, count] of Object.entries(calendar)) {
    const ts = parseInt(timestamp, 10);
    if (!isTimestampInDateRange(ts, dateRange, startTs, endTs)) {
      continue;
    }

    activeDays++;
    const date = new Date(ts * 1000);
    const day = date.getDay();
    dayCounts[day] += count;
    if (dayCounts[day] > maxCount) {
      maxCount = dayCounts[day];
      maxDay = day;
    }
  }

  if (activeDays === 0) {
    insights.push({
      category: 'Activity',
      type: 'neutral',
      message: 'No problem-solving activity recorded in this selected date range.'
    });
    return { insights, dataSource: 'profile' };
  }
  
  if (activeDays > 10) {
    insights.push({
      category: 'Consistency',
      type: 'positive',
      message: `You solve problems consistently, with activity on ${activeDays} days recorded in this period.`
    });
  } else {
    insights.push({
      category: 'Habit Building',
      type: 'suggestion',
      message: `Activity recorded on ${activeDays} day${activeDays === 1 ? '' : 's'} in this period. Try to solve problems on more days to build a consistent habit.`
    });
  }

  if (maxDay !== -1 && maxCount > 0) {
    insights.push({
      category: 'Peak Activity',
      type: 'neutral',
      message: `You've been most active on ${dayNames[maxDay]}s.`
    });
  }

  return { insights, dataSource: 'profile' };
}
