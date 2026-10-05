'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { DEMO_PROFILE, isDemoMode } from '@/lib/demo/demoData';
import type { AnalysisOption, DateRange } from '@/types/analysis';
import type { LeetCodeProfile } from '@/types/leetcode';
import ProfileCard from '@/components/profile/ProfileCard';
import AnalysisSelector from '@/components/analysis/AnalysisSelector';
import DateRangePicker from '@/components/analysis/DateRangePicker';
import ProblemsSolvedCard from '@/components/analysis/ProblemsSolvedCard';
import DifficultyCard from '@/components/analysis/DifficultyCard';
import TimeTakenCard from '@/components/analysis/TimeTakenCard';
import BehaviorCard from '@/components/analysis/BehaviorCard';
import AIHelpCard from '@/components/analysis/AIHelpCard';
import SimilarityCard from '@/components/analysis/SimilarityCard';
import StrongAreasCard from '@/components/analysis/StrongAreasCard';
import ImprovementCard from '@/components/analysis/ImprovementCard';
import CareerCard from '@/components/analysis/CareerCard';

type Step = 'loading' | 'profile' | 'results';

export default function AnalyzePage(props: { params: Promise<{ username: string }> }) {
  const { username } = React.use(props.params);

  const [step, setStep] = useState<Step>('loading');
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOption[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ preset: 'all' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isDemoMode(username)) {
          await new Promise(r => setTimeout(r, 1200));
          setProfile(DEMO_PROFILE);
          setStep('profile');
          return;
        }

        const res = await fetch(`/api/leetcode/profile?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
          setStep('profile');
        } else {
          setError({
            code: data.error?.code || 'UNKNOWN',
            message: data.error?.message || 'Could not load this profile. Please check the username and try again.',
          });
        }
      } catch {
        setError({
          code: 'NETWORK_ERROR',
          message: 'Unable to connect. Please check your internet connection and try again.',
        });
      }
    };

    fetchProfile();
  }, [username]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep('results');
    }, 600);
  };

  // --- Error state ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Could Not Load Profile</h2>
          <p className="text-muted mb-6">{error.message}</p>
          <Link href="/analyze" className="bg-accent hover:bg-accent-hover text-white dark:text-background px-6 py-2.5 rounded-xl inline-block font-semibold transition-colors shadow-xs">
            Try Another Username
          </Link>
        </div>
      </div>
    );
  }

  // --- Loading state ---
  if (step === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading your LeetCode profile...</h2>
        <p className="text-muted">Fetching available profile and activity data</p>
        {isDemoMode(username) && (
          <span className="mt-4 text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20 font-medium">
            Demo Mode
          </span>
        )}
      </div>
    );
  }

  // --- Profile + Options (Page 3) ---
  if (step === 'profile' && profile) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {isDemoMode(username) && (
            <div className="bg-amber-500/10 text-amber-500 text-sm px-4 py-2 rounded-lg border border-amber-500/20 text-center font-medium">
              🎮 Demo Mode — This data is simulated for demonstration purposes
            </div>
          )}

          <ProfileCard profile={profile} />

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">What do you want to check?</h2>
            <p className="text-muted mb-4 text-sm">Select the analyses you want. We&apos;ll only show what you choose.</p>
            <AnalysisSelector selectedOptions={selectedOptions} onSelectionChange={setSelectedOptions} />
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-xs">
            <h3 className="text-lg font-medium text-foreground mb-4">📅 Time Period</h3>
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleAnalyze}
              disabled={selectedOptions.length === 0 || isAnalyzing}
              className="bg-accent hover:bg-accent-hover disabled:bg-card-hover disabled:text-muted text-white dark:text-background font-semibold rounded-xl px-8 py-3 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isAnalyzing ? 'Analyzing...' : `Analyze ${selectedOptions.length} ${selectedOptions.length === 1 ? 'option' : 'options'} →`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Results (Page 4) ---
  if (step === 'results' && profile) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {isDemoMode(username) && (
            <div className="bg-amber-500/10 text-amber-500 text-sm px-4 py-2 rounded-lg border border-amber-500/20 text-center font-medium">
              🎮 Demo Mode — This data is simulated for demonstration purposes
            </div>
          )}

          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Analysis</h1>
              <p className="text-sm text-muted mt-1">{selectedOptions.length} analysis modules for {profile.username}</p>
            </div>
            <button onClick={() => setStep('profile')} className="flex items-center text-muted hover:text-foreground transition-colors text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Change selections
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>📅 Time Period Filter</span>
            </h3>
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {selectedOptions.includes('problems-solved') && (
              <div className="md:col-span-2">
                <ProblemsSolvedCard profile={profile} dateRange={dateRange} />
              </div>
            )}
            {selectedOptions.includes('difficulty') && <DifficultyCard profile={profile} dateRange={dateRange} />}
            {selectedOptions.includes('time-taken') && <TimeTakenCard />}
            {selectedOptions.includes('behavior') && (
              <div className="md:col-span-2">
                <BehaviorCard profile={profile} dateRange={dateRange} />
              </div>
            )}
            {selectedOptions.includes('ai-help') && <AIHelpCard profile={profile} />}
            {selectedOptions.includes('similarity') && <SimilarityCard />}
            {selectedOptions.includes('strong-areas') && <StrongAreasCard profile={profile} />}
            {selectedOptions.includes('improvement-areas') && <ImprovementCard profile={profile} />}
            {selectedOptions.includes('career') && (
              <div className="md:col-span-2">
                <CareerCard profile={profile} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
