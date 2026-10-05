/**
 * Runtime test script for the Problems You Solved feature.
 * Run with: npx tsx scratch/test-problems-solved.ts
 */

// Import the analyzer and demo data directly
import { analyzeProblemsSolved } from '../lib/analytics/problemAnalyzer';
import { DEMO_PROFILE } from '../lib/demo/demoData';
import type { DateRange } from '../types/analysis';

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (e: any) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   ${e.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

console.log('=== Testing Problems You Solved Feature ===\n');
console.log(`Demo profile: totalSolved=${DEMO_PROFILE.totalSolved}, easy=${DEMO_PROFILE.easySolved}, medium=${DEMO_PROFILE.mediumSolved}, hard=${DEMO_PROFILE.hardSolved}`);
console.log(`Recent submissions: ${DEMO_PROFILE.recentSubmissions.length}`);
console.log(`Calendar entries: ${Object.keys(DEMO_PROFILE.submissionCalendar).length}`);
console.log('');

// TEST 1: All Time
test('TEST 1: All Time — uses profile totals', () => {
  const dateRange: DateRange = { preset: 'all' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  console.log(`   totalInPeriod=${result.analysis.totalInPeriod}, easy=${result.analysis.easySolved}, medium=${result.analysis.mediumSolved}, hard=${result.analysis.hardSolved}`);
  
  assert(result.analysis.totalInPeriod === 247, `Expected total=247, got ${result.analysis.totalInPeriod}`);
  assert(result.analysis.easySolved === 98, `Expected easy=98, got ${result.analysis.easySolved}`);
  assert(result.analysis.mediumSolved === 112, `Expected medium=112, got ${result.analysis.mediumSolved}`);
  assert(result.analysis.hardSolved === 37, `Expected hard=37, got ${result.analysis.hardSolved}`);
  assert(result.analysis.periodLabel === 'All Time', `Expected 'All Time', got '${result.analysis.periodLabel}'`);
  assert(result.analysis.isAllTime === true, `Expected isAllTime=true`);
});

// TEST 2: This Year
test('TEST 2: This Year (1y) — uses calendar counts', () => {
  const dateRange: DateRange = { preset: '1y' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  console.log(`   totalInPeriod=${result.analysis.totalInPeriod}, easy=${result.analysis.easySolved}, medium=${result.analysis.mediumSolved}, hard=${result.analysis.hardSolved}`);
  
  assert(result.analysis.totalInPeriod > 0, `Expected total > 0, got ${result.analysis.totalInPeriod}`);
  assert(result.analysis.easySolved >= 0, `Expected easy >= 0`);
  assert(result.analysis.mediumSolved >= 0, `Expected medium >= 0`);
  assert(result.analysis.hardSolved >= 0, `Expected hard >= 0`);
  // Sum should equal total
  const sum = result.analysis.easySolved + result.analysis.mediumSolved + result.analysis.hardSolved;
  assert(sum === result.analysis.totalInPeriod, `Expected E+M+H=${sum} to equal total=${result.analysis.totalInPeriod}`);
  assert(result.analysis.periodLabel === 'This Year', `Expected 'This Year', got '${result.analysis.periodLabel}'`);
});

// TEST 3: Last 7 Days
test('TEST 3: Last 7 Days (7d) — smaller count, fewer recent subs', () => {
  const dateRange: DateRange = { preset: '7d' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  console.log(`   totalInPeriod=${result.analysis.totalInPeriod}, recentInPeriod=${result.analysis.recentInPeriod.length}`);
  
  assert(result.analysis.totalInPeriod > 0, `Expected total > 0`);
  assert(result.analysis.totalInPeriod < 247, `Expected total < 247 (all time), got ${result.analysis.totalInPeriod}`);
  assert(result.analysis.periodLabel === 'Last 7 Days', `Expected 'Last 7 Days'`);
  
  // Recent subs within 7 days should be fewer than all 20
  assert(result.analysis.recentInPeriod.length <= 20, `Expected <= 20 recent`);
  assert(result.analysis.recentInPeriod.length > 0, `Expected > 0 recent subs in 7 days`);
});

// TEST 4: Last 30 Days
test('TEST 4: Last 30 Days (30d) — intermediate count', () => {
  const dateRange: DateRange = { preset: '30d' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  console.log(`   totalInPeriod=${result.analysis.totalInPeriod}, recentInPeriod=${result.analysis.recentInPeriod.length}`);
  
  assert(result.analysis.totalInPeriod > 0, `Expected total > 0`);
  assert(result.analysis.periodLabel === 'Last 30 Days', `Expected 'Last 30 Days'`);
});

// TEST 5: Difficulty drill-down — Easy filter works
test('TEST 5: Difficulty drill-down — Easy problems filtered correctly', () => {
  const dateRange: DateRange = { preset: 'all' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  const easyProblems = result.analysis.recentInPeriod.filter(p => p.difficulty === 'Easy');
  const mediumProblems = result.analysis.recentInPeriod.filter(p => p.difficulty === 'Medium');
  const hardProblems = result.analysis.recentInPeriod.filter(p => p.difficulty === 'Hard');
  
  console.log(`   recentInPeriod total=${result.analysis.recentInPeriod.length}, easy=${easyProblems.length}, medium=${mediumProblems.length}, hard=${hardProblems.length}`);
  
  // All problems should have a valid difficulty
  const totalAssigned = easyProblems.length + mediumProblems.length + hardProblems.length;
  assert(totalAssigned === result.analysis.recentInPeriod.length, `Expected all ${result.analysis.recentInPeriod.length} to be assigned, got ${totalAssigned}`);
  
  // Each category should have at least some problems
  assert(easyProblems.length > 0, `Expected some Easy problems, got ${easyProblems.length}`);
  assert(mediumProblems.length > 0, `Expected some Medium problems, got ${mediumProblems.length}`);
  assert(hardProblems.length > 0, `Expected some Hard problems, got ${hardProblems.length}`);
});

// TEST 6: Empty range — date range with no data
test('TEST 6: Empty range — far future dates', () => {
  const futureDate = new Date('2099-01-01');
  const dateRange: DateRange = { preset: 'custom', from: futureDate, to: new Date('2099-12-31') };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  console.log(`   totalInPeriod=${result.analysis.totalInPeriod}, recentInPeriod=${result.analysis.recentInPeriod.length}`);
  
  assert(result.analysis.totalInPeriod === 0, `Expected total=0 for future dates, got ${result.analysis.totalInPeriod}`);
  assert(result.analysis.recentInPeriod.length === 0, `Expected 0 recent subs for future dates`);
  assert(result.analysis.easySolved === 0, `Expected easy=0`);
  assert(result.analysis.mediumSolved === 0, `Expected medium=0`);
  assert(result.analysis.hardSolved === 0, `Expected hard=0`);
});

// TEST 7: Result shape — backward compatibility
test('TEST 7: Result shape — has both ProblemsSolvedResult fields and analysis', () => {
  const dateRange: DateRange = { preset: 'all' };
  const result = analyzeProblemsSolved(DEMO_PROFILE, dateRange);
  
  // ProblemsSolvedResult shape
  assert(typeof result.totalSolved === 'number', 'Missing totalSolved');
  assert(Array.isArray(result.problems), 'Missing problems array');
  assert(typeof result.periodLabel === 'string', 'Missing periodLabel');
  
  // Enhanced analysis shape
  assert(result.analysis !== undefined, 'Missing analysis');
  assert(typeof result.analysis.totalInPeriod === 'number', 'Missing analysis.totalInPeriod');
  assert(typeof result.analysis.easySolved === 'number', 'Missing analysis.easySolved');
  assert(typeof result.analysis.mediumSolved === 'number', 'Missing analysis.mediumSolved');
  assert(typeof result.analysis.hardSolved === 'number', 'Missing analysis.hardSolved');
  assert(Array.isArray(result.analysis.recentInPeriod), 'Missing analysis.recentInPeriod');
});

// TEST 8: Date range change resets — verify different presets give different counts
test('TEST 8: Different presets give different totals', () => {
  const allTime = analyzeProblemsSolved(DEMO_PROFILE, { preset: 'all' });
  const last7d = analyzeProblemsSolved(DEMO_PROFILE, { preset: '7d' });
  const last30d = analyzeProblemsSolved(DEMO_PROFILE, { preset: '30d' });
  
  console.log(`   allTime=${allTime.analysis.totalInPeriod}, 30d=${last30d.analysis.totalInPeriod}, 7d=${last7d.analysis.totalInPeriod}`);
  
  assert(allTime.analysis.totalInPeriod >= last30d.analysis.totalInPeriod, 
    `All time (${allTime.analysis.totalInPeriod}) should be >= 30d (${last30d.analysis.totalInPeriod})`);
  assert(last30d.analysis.totalInPeriod >= last7d.analysis.totalInPeriod, 
    `30d (${last30d.analysis.totalInPeriod}) should be >= 7d (${last7d.analysis.totalInPeriod})`);
});

console.log('\n=== Tests Complete ===');
