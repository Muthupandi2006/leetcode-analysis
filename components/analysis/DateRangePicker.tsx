'use client';

import React from 'react';
import type { DateRange } from '@/types/analysis';
import { formatDateDisplay } from '@/lib/analytics/problemAnalyzer';

function toDateInputValue(val?: Date | string): string {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return '';
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: DateRange;
  onDateRangeChange: (r: DateRange) => void;
}) {
  const presets: { id: DateRange['preset']; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '3m', label: 'Last 3 Months' },
    { id: '1y', label: 'This Year' },
    { id: 'all', label: 'All Data' },
  ];

  const fromValue = toDateInputValue(dateRange.from);
  const toValue = toDateInputValue(dateRange.to);

  const handlePresetClick = (presetId: DateRange['preset']) => {
    onDateRangeChange({
      preset: presetId,
      from: undefined,
      to: undefined,
    });
  };

  const handleCustomClick = () => {
    onDateRangeChange({
      preset: 'custom',
      from: dateRange.from,
      to: dateRange.to,
    });
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onDateRangeChange({
      preset: 'custom',
      from: val || undefined,
      to: dateRange.to,
    });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onDateRangeChange({
      preset: 'custom',
      from: dateRange.from,
      to: val || undefined,
    });
  };

  const isCustom = dateRange.preset === 'custom';
  const hasCustomDates = isCustom && (fromValue || toValue);

  return (
    <div className="space-y-4">
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const isActive = dateRange.preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetClick(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-accent text-white font-semibold shadow-xs'
                  : 'bg-card border border-border text-foreground hover:bg-card-hover'
              }`}
            >
              {p.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleCustomClick}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            isCustom
              ? 'bg-accent text-white font-semibold shadow-xs'
              : 'bg-card border border-border text-foreground hover:bg-card-hover'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom Date Inputs */}
      {isCustom && (
        <div className="pt-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="from-date" className="text-xs font-medium text-muted">
                From:
              </label>
              <input
                id="from-date"
                type="date"
                value={fromValue}
                onChange={handleFromChange}
                max={toValue || undefined}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
              />
            </div>

            <span className="text-muted text-sm font-medium">to</span>

            <div className="flex items-center gap-2">
              <label htmlFor="to-date" className="text-xs font-medium text-muted">
                To:
              </label>
              <input
                id="to-date"
                type="date"
                value={toValue}
                onChange={handleToChange}
                min={fromValue || undefined}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* Range summary display */}
          {hasCustomDates && (
            <div className="flex items-center gap-2 text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg w-fit">
              <span>📅</span>
              <span className="font-medium">
                {fromValue && toValue
                  ? `Filtering: ${formatDateDisplay(fromValue)} to ${formatDateDisplay(toValue)} (inclusive)`
                  : fromValue
                  ? `Filtering from ${formatDateDisplay(fromValue)} onwards`
                  : `Filtering up to ${formatDateDisplay(toValue)}`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
