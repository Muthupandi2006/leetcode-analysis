'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DateTimeDisplayProps {
  className?: string;
  showIcon?: boolean;
}

export function DateTimeDisplay({ className = '', showIcon = true }: DateTimeDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [dateTimeStr, setDateTimeStr] = useState<{ date: string; time: string }>({
    date: '',
    time: '',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      try {
        // Format date: e.g. "05 Oct 2026"
        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        // Format time: e.g. "09:35 PM"
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const dateParts = dateFormatter.format(now); // "05 Oct 2026"
        const timeParts = timeFormatter.format(now); // "09:35 PM"

        setDateTimeStr({
          date: dateParts,
          time: timeParts,
        });
      } catch (e) {
        // Fallback to local time formatting if timezone is not recognized
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hourStr = String(hours).padStart(2, '0');

        setDateTimeStr({
          date: `${day} ${month} ${year}`,
          time: `${hourStr}:${minutes} ${ampm}`,
        });
      }
    };

    updateDateTime();
    setMounted(true);

    // Update every second for real-time precision
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-9 px-3 rounded-xl border border-border bg-card/40 flex items-center gap-2 animate-pulse ${className}`}
        aria-hidden="true"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-border" />
        <div className="w-32 h-3 rounded bg-border" />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/70 hover:bg-card hover:border-border-hover text-xs transition-colors duration-200 select-none shadow-xs font-mono ${className}`}
      title="Current Date & Time (IST)"
      aria-label={`Current Date and Time: ${dateTimeStr.date} ${dateTimeStr.time} IST`}
    >
      {showIcon && <Clock className="w-3.5 h-3.5 text-accent shrink-0" />}
      <span className="text-muted tracking-tight whitespace-nowrap">{dateTimeStr.date}</span>
      <span className="text-border font-sans font-light">|</span>
      <span className="text-foreground font-semibold tracking-tight whitespace-nowrap">{dateTimeStr.time}</span>
      <span className="text-[10px] text-accent/80 font-sans font-medium uppercase tracking-wider hidden xl:inline">IST</span>
    </div>
  );
}
