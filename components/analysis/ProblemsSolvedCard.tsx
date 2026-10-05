'use client';
import { useMemo, useState } from 'react';
import type { LeetCodeProfile } from '@/types/leetcode';
import type { DateRange, SolvedProblem } from '@/types/analysis';
import { analyzeProblemsSolved } from '@/lib/analytics/problemAnalyzer';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

function formatSolveDateTime(timestampStr?: string): string {
  if (!timestampStr) return '—';
  const ts = parseInt(timestampStr, 10);
  if (isNaN(ts)) return '—';
  const d = new Date(ts * 1000);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}/${month}/${year} • ${timePart}`;
}

export type SortField = 'difficulty' | 'date' | 'number' | 'name';
export type SortDirection = 'low' | 'high';

function extractProblemNumber(p: SolvedProblem): number {
  if (p.questionNumber) {
    const parsed = parseInt(p.questionNumber.replace(/\D/g, ''), 10);
    if (!isNaN(parsed)) return parsed;
  }
  const match = p.title.match(/^(\d+)\./);
  if (match) {
    const parsed = parseInt(match[1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

function extractProblemName(p: SolvedProblem): string {
  return p.title.replace(/^\d+\.\s*/, '').trim().toLowerCase();
}

function sortProblemList(
  problems: SolvedProblem[],
  field: SortField,
  direction: SortDirection
): SolvedProblem[] {
  // Always create a shallow copy to never mutate original array
  const list = [...problems];

  switch (field) {
    case 'date':
      return list.sort((a, b) => {
        const tsA = parseInt(a.solvedDate || '0', 10);
        const tsB = parseInt(b.solvedDate || '0', 10);
        return direction === 'low' ? tsA - tsB : tsB - tsA;
      });

    case 'number':
      return list.sort((a, b) => {
        const nA = extractProblemNumber(a);
        const nB = extractProblemNumber(b);
        if (nA !== nB) {
          return direction === 'low' ? nA - nB : nB - nA;
        }
        return a.title.localeCompare(b.title);
      });

    case 'name':
      return list.sort((a, b) => {
        const nameA = extractProblemName(a);
        const nameB = extractProblemName(b);
        return direction === 'low' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });

    case 'difficulty':
    default: {
      const diffRank: Record<string, number> =
        direction === 'low'
          ? { Easy: 1, Medium: 2, Hard: 3 }
          : { Hard: 1, Medium: 2, Easy: 3 };

      return list.sort((a, b) => {
        const diff = (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2);
        if (diff !== 0) return diff;
        const tsA = parseInt(a.solvedDate || '0', 10);
        const tsB = parseInt(b.solvedDate || '0', 10);
        return tsB - tsA;
      });
    }
  }
}

export default function ProblemsSolvedCard({
  profile,
  dateRange,
}: {
  profile: LeetCodeProfile;
  dateRange: DateRange;
}) {
  const result = useMemo(() => analyzeProblemsSolved(profile, dateRange), [profile, dateRange]);
  const { analysis } = result;

  const [sortField, setSortField] = useState<SortField>('difficulty');
  const [sortDirection, setSortDirection] = useState<SortDirection>('low');

  // Filter problems into difficulty sets
  const rawEasyProblems = useMemo(
    () => analysis.recentInPeriod.filter((p) => p.difficulty === 'Easy'),
    [analysis.recentInPeriod]
  );
  const rawMediumProblems = useMemo(
    () => analysis.recentInPeriod.filter((p) => p.difficulty === 'Medium'),
    [analysis.recentInPeriod]
  );
  const rawHardProblems = useMemo(
    () => analysis.recentInPeriod.filter((p) => p.difficulty === 'Hard'),
    [analysis.recentInPeriod]
  );

  // Difficulty counts (preserved from period data)
  const easyCount = analysis.isAllTime ? analysis.easySolved : rawEasyProblems.length;
  const mediumCount = analysis.isAllTime ? analysis.mediumSolved : rawMediumProblems.length;
  const hardCount = analysis.isAllTime ? analysis.hardSolved : rawHardProblems.length;
  const totalCount = analysis.isAllTime
    ? analysis.totalInPeriod
    : rawEasyProblems.length + rawMediumProblems.length + rawHardProblems.length;

  const difficultyCards = [
    {
      label: 'Easy',
      count: easyCount,
      color: 'text-emerald-500 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Medium',
      count: mediumCount,
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Hard',
      count: hardCount,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
  ];

  // In difficulty mode: group by difficulty (Low: Easy -> Medium -> Hard, High: Hard -> Medium -> Easy)
  const isDifficultyGrouped = sortField === 'difficulty';

  // In unified sort mode (Date & Time, Problem Number, Problem Name):
  // The ENTIRE visible list follows the selected sort order directly, not partitioned by difficulty
  const unifiedSortedProblems = useMemo(() => {
    if (isDifficultyGrouped) return [];
    return sortProblemList(analysis.recentInPeriod, sortField, sortDirection);
  }, [analysis.recentInPeriod, sortField, sortDirection, isDifficultyGrouped]);

  // In difficulty mode, keep problems in each group sorted with newest first
  const sortedEasyProblems = useMemo(
    () => sortProblemList(rawEasyProblems, 'date', 'high'),
    [rawEasyProblems]
  );
  const sortedMediumProblems = useMemo(
    () => sortProblemList(rawMediumProblems, 'date', 'high'),
    [rawMediumProblems]
  );
  const sortedHardProblems = useMemo(
    () => sortProblemList(rawHardProblems, 'date', 'high'),
    [rawHardProblems]
  );

  const easyGroup = {
    difficulty: 'Easy' as const,
    title: 'Easy Problems',
    count: sortedEasyProblems.length,
    problems: sortedEasyProblems,
    color: 'text-emerald-500 dark:text-emerald-400',
    emptyMessage: 'No Easy problems solved in this period.',
  };

  const mediumGroup = {
    difficulty: 'Medium' as const,
    title: 'Medium Problems',
    count: sortedMediumProblems.length,
    problems: sortedMediumProblems,
    color: 'text-amber-500 dark:text-amber-400',
    emptyMessage: 'No Medium problems solved in this period.',
  };

  const hardGroup = {
    difficulty: 'Hard' as const,
    title: 'Hard Problems',
    count: sortedHardProblems.length,
    problems: sortedHardProblems,
    color: 'text-red-500 dark:text-red-400',
    emptyMessage: 'No Hard problems solved in this period.',
  };

  // Group ordering based on Low (Easy -> Hard) vs High (Hard -> Easy)
  const difficultyGroups = useMemo(() => {
    if (sortDirection === 'high') {
      return [hardGroup, mediumGroup, easyGroup];
    }
    return [easyGroup, mediumGroup, hardGroup];
  }, [sortDirection, easyGroup, mediumGroup, hardGroup]);

  // Label description for active sort
  const activeSortDescription = useMemo(() => {
    if (sortField === 'difficulty') {
      return sortDirection === 'low'
        ? 'Difficulty: Easy → Medium → Hard'
        : 'Difficulty: Hard → Medium → Easy';
    }
    if (sortField === 'date') {
      return sortDirection === 'low'
        ? 'Date & Time: Oldest → Newest'
        : 'Date & Time: Newest → Oldest';
    }
    if (sortField === 'number') {
      return sortDirection === 'low'
        ? 'Problem Number: Lowest → Highest'
        : 'Problem Number: Highest → Lowest';
    }
    if (sortField === 'name') {
      return sortDirection === 'low' ? 'Problem Name: A → Z' : 'Problem Name: Z → A';
    }
    return '';
  }, [sortField, sortDirection]);

  const renderProblemRow = (p: SolvedProblem, i: number, showDifficultyBadge = false) => {
    const cleanTitle = p.title.replace(/^\d+\.\s*/, '');
    const displayName = p.questionNumber ? `${p.questionNumber}. ${cleanTitle}` : p.title;
    const formattedDateTime = formatSolveDateTime(p.solvedDate);

    return (
      <div
        key={`${p.slug || p.title}-${p.solvedDate || i}`}
        className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 rounded-lg bg-card-hover/30 border border-border/60 hover:border-border hover:bg-card-hover transition-colors gap-1 sm:gap-4"
      >
        <div className="font-medium text-foreground flex items-center gap-2 flex-wrap">
          <span className="text-muted/60 select-none">•</span>
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {displayName}
            </a>
          ) : (
            <span>{displayName}</span>
          )}

          {showDifficultyBadge && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                p.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
                  : p.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
              }`}
            >
              {p.difficulty}
            </span>
          )}
        </div>
        <div className="text-sm text-muted whitespace-nowrap">
          <span className="hidden sm:inline text-muted/60 mr-2">—</span>
          {formattedDateTime}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          📊 Problems You Solved
        </h3>
      </div>
      <p className="text-sm text-muted mb-6">{analysis.periodLabel}</p>

      {/* Total Solved Count */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-foreground mb-1">{totalCount}</div>
        <div className="text-sm text-muted">Problems Solved</div>
      </div>

      {/* Difficulty breakdown cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {difficultyCards.map(({ label, count, color, bgColor, borderColor }) => (
          <div
            key={label}
            className={`${bgColor} border ${borderColor} rounded-xl p-4 text-center transition-all`}
          >
            <div className={`text-3xl font-bold ${color}`}>{count}</div>
            <div className="text-sm text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* ─── Sort By Control: Field Dropdown + Compact [ ↑ ] [ ↓ ] Arrow Buttons ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60">
        <div className="text-sm font-medium text-muted">
          All problems ({totalCount})
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Field Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-muted">Sort By:</span>
            <div className="relative">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-border bg-card hover:bg-card-hover text-foreground text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus:border-accent shadow-2xs"
              >
                <option value="difficulty">Difficulty</option>
                <option value="date">Date & Time</option>
                <option value="number">Problem Number</option>
                <option value="name">Problem Name</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Compact Arrow Direction Controls [ ↑ ] [ ↓ ] */}
          <div className="inline-flex items-center p-0.5 sm:p-1 rounded-xl bg-card border border-border/80 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setSortDirection('low')}
              title={`Ascending (${
                sortField === 'difficulty'
                  ? 'Easy → Medium → Hard'
                  : sortField === 'date'
                  ? 'Oldest → Newest'
                  : sortField === 'number'
                  ? 'Lowest → Highest'
                  : 'A → Z'
              })`}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                sortDirection === 'low'
                  ? 'bg-gradient-to-r from-accent to-accent/90 text-white shadow-sm shadow-accent/25 border border-accent/40 scale-[1.03]'
                  : 'text-muted hover:text-foreground hover:bg-card-hover/80 border border-transparent'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSortDirection('high')}
              title={`Descending (${
                sortField === 'difficulty'
                  ? 'Hard → Medium → Easy'
                  : sortField === 'date'
                  ? 'Newest → Oldest'
                  : sortField === 'number'
                  ? 'Highest → Lowest'
                  : 'Z → A'
              })`}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                sortDirection === 'high'
                  ? 'bg-gradient-to-r from-accent to-accent/90 text-white shadow-sm shadow-accent/25 border border-accent/40 scale-[1.03]'
                  : 'text-muted hover:text-foreground hover:bg-card-hover/80 border border-transparent'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Problem Lists: Difficulty Grouped OR Unified Sorted Order ─── */}
      {isDifficultyGrouped ? (
        /* Difficulty Grouped Mode (Easy → Medium → Hard, or Hard → Medium → Easy) */
        <div className="space-y-6">
          {difficultyGroups.map((group) => (
            <div key={group.difficulty} className="space-y-3">
              <h4 className={`text-lg font-semibold ${group.color}`}>
                {group.title} — {group.count}
              </h4>

              {group.problems.length === 0 ? (
                <div className="text-sm text-muted py-2 px-3 rounded-lg bg-card-hover/20 border border-border/40 italic">
                  {group.emptyMessage}
                </div>
              ) : (
                <div className="space-y-2">
                  {group.problems.map((p, i) => renderProblemRow(p, i, false))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Unified Global Sort Mode (Date & Time, Problem Number, Problem Name) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">
              All Problems — {unifiedSortedProblems.length}
            </h4>
            <span className="text-xs text-muted font-medium">
              Sorted by {activeSortDescription}
            </span>
          </div>

          {unifiedSortedProblems.length === 0 ? (
            <div className="text-sm text-muted py-4 px-3 rounded-lg bg-card-hover/20 border border-border/40 italic text-center">
              No problems found in this period.
            </div>
          ) : (
            <div className="space-y-2">
              {unifiedSortedProblems.map((p, i) => renderProblemRow(p, i, true))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
