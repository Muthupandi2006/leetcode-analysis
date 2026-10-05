const fs = require('fs');
const path = require('path');

const root = 'c:/Users/nmuth/OneDrive/Documents/leetcode-project';

const dirs = [
  'app/analyze',
  'app/analyze/[username]',
  'components/profile',
  'components/analysis',
  'types'
];

dirs.forEach(d => fs.mkdirSync(path.join(root, d), { recursive: true }));

const files = {
  'types/analysis.ts': `
export type AnalysisOption = 'problems-solved' | 'time-taken' | 'difficulty' | 'behavior' | 'ai-help' | 'similarity' | 'strong-areas' | 'improvement-areas' | 'career';

export type DateRange = {
  preset?: '7d' | '30d' | '3m' | '1y' | 'all' | 'custom';
  from?: Date;
  to?: Date;
};
  `,
  'app/analyze/page.tsx': `
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function URLInputPage() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regex = /leetcode\\.com\\/(u\\/)?([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    
    if (match && match[2]) {
      setError('');
      router.push(\`/analyze/\${match[2]}\`);
    } else {
      setError('Please enter a valid LeetCode profile URL.');
    }
  };

  const isValid = /leetcode\\.com\\/(u\\/)?([a-zA-Z0-9_-]+)/.test(url);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300 p-4">
      <div className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Understand Your Coding.<br/><span className="text-emerald-500">Improve Your Future.</span></h1>
        <p className="text-center text-gray-400 mb-8">Paste your LeetCode profile URL to get started.</p>
        
        <form onSubmit={validateAndSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://leetcode.com/u/username/"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={!isValid && url.length > 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium rounded-xl px-4 py-3 flex items-center justify-center transition-colors group"
          >
            Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/analyze/demo" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
            Or try the demo &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
  `,
  'app/analyze/[username]/page.tsx': `
'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
import type { AnalysisOption, DateRange } from '@/types/analysis';

type Step = 'loading' | 'profile' | 'results';

export default function AnalyzePage(props: { params: Promise<{ username: string }> }) {
  const { username } = use(props.params);
  
  const [step, setStep] = useState<Step>('loading');
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOption[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ preset: 'all' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (username === 'demo') {
          setTimeout(() => {
            setProfile({ username: 'demo', avatar: '', totalSolved: 342, easy: 120, medium: 180, hard: 42, ranking: 154320 });
            setStep('profile');
          }, 1000);
          return;
        }

        const res = await fetch(\`/api/leetcode/profile?username=\${username}\`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();
        setProfile(data);
        setStep('profile');
      } catch (err: any) {
        setError({ code: '404', message: err.message || 'Failed to fetch profile' });
        setStep('loading');
      }
    };

    fetchProfile();
  }, [username]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep('results');
    }, 800);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-300 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error Finding Profile</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <Link href="/analyze" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg inline-block">
            Try Another Username
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-300 p-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Loading your LeetCode profile...</h2>
        <p className="text-gray-400">Fetching available profile and activity data</p>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileCard profile={profile} />
          
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">What do you want to check?</h2>
            <AnalysisSelector selectedOptions={selectedOptions} onSelectionChange={setSelectedOptions} />
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-4">Time Period</h3>
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleAnalyze}
              disabled={selectedOptions.length === 0 || isAnalyzing}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium rounded-xl px-8 py-3 flex items-center justify-center transition-colors"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Analyze \\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-white">Your Analysis</h1>
          <button onClick={() => setStep('profile')} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {selectedOptions.includes('problems-solved') && <ProblemsSolvedCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('time-taken') && <TimeTakenCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('difficulty') && <DifficultyCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('behavior') && <BehaviorCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('ai-help') && <AIHelpCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('similarity') && <SimilarityCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('strong-areas') && <StrongAreasCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('improvement-areas') && <ImprovementCard profile={profile} dateRange={dateRange} />}
          {selectedOptions.includes('career') && <CareerCard profile={profile} dateRange={dateRange} />}
        </div>
      </div>
    </div>
  );
}
  `,
  'components/profile/ProfileCard.tsx': `
'use client';
import { User } from 'lucide-react';

export default function ProfileCard({ profile }: { profile: any }) {
  if (!profile) return null;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center space-x-6">
      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-gray-500" />
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span>Profile found 👋</span>
        </h2>
        <a href={\`https://leetcode.com/u/\${profile.username}\`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">
          @{profile.username}
        </a>
        <div className="flex space-x-4 mt-3 text-sm">
          <div className="text-gray-400"><span className="text-white font-medium">{profile.totalSolved}</span> Solved</div>
          <div className="text-emerald-500">{profile.easy} Easy</div>
          <div className="text-amber-500">{profile.medium} Medium</div>
          <div className="text-red-500">{profile.hard} Hard</div>
        </div>
      </div>
    </div>
  );
}
  `,
  'components/analysis/AnalysisSelector.tsx': `
'use client';
import type { AnalysisOption } from '@/types/analysis';

const OPTIONS: { id: AnalysisOption; emoji: string; title: string; desc: string }[] = [
  { id: 'problems-solved', emoji: '📊', title: 'Problems You Solved', desc: 'See how many problems were solved during a selected period' },
  { id: 'time-taken', emoji: '⏱️', title: 'Time Taken', desc: 'See how much time you spend solving problems' },
  { id: 'difficulty', emoji: '📈', title: 'Problem Difficulty', desc: 'See the Easy / Medium / Hard distribution' },
  { id: 'behavior', emoji: '🧠', title: 'How You Solve', desc: 'Understand solving patterns and coding behavior' },
  { id: 'ai-help', emoji: '🤖', title: 'Possible AI Help', desc: 'Estimate signals that may suggest AI assistance' },
  { id: 'similarity', emoji: '🔍', title: 'Code Similarity', desc: 'Compare code with accessible reference solutions' },
  { id: 'strong-areas', emoji: '💪', title: 'Strong Areas', desc: 'Identify topics where you perform well' },
  { id: 'improvement-areas', emoji: '📚', title: 'Areas to Improve', desc: 'Identify topics that may need more practice' },
  { id: 'career', emoji: '🎯', title: 'Career Suggestions', desc: 'Discover fields that match your coding strengths' },
];

export default function AnalysisSelector({ selectedOptions, onSelectionChange }: { selectedOptions: AnalysisOption[], onSelectionChange: (o: AnalysisOption[]) => void }) {
  const toggle = (id: AnalysisOption) => {
    if (selectedOptions.includes(id)) onSelectionChange(selectedOptions.filter(x => x !== id));
    else onSelectionChange([...selectedOptions, id]);
  };

  const toggleAll = () => {
    if (selectedOptions.length === OPTIONS.length) onSelectionChange([]);
    else onSelectionChange(OPTIONS.map(o => o.id));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={toggleAll} className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
          {selectedOptions.length === OPTIONS.length ? 'Clear All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {OPTIONS.map(opt => {
          const isSelected = selectedOptions.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={\`cursor-pointer border rounded-xl p-4 transition-all \${isSelected ? 'bg-emerald-950/30 border-emerald-500' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}\`}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <h3 className={\`font-medium mb-1 \${isSelected ? 'text-emerald-400' : 'text-white'}\`}>{opt.title}</h3>
              <p className="text-sm text-gray-400">{opt.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
  `,
  'components/analysis/DateRangePicker.tsx': `
'use client';
import type { DateRange } from '@/types/analysis';

export default function DateRangePicker({ dateRange, onDateRangeChange }: { dateRange: DateRange, onDateRangeChange: (r: DateRange) => void }) {
  const presets: { id: DateRange['preset']; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '3m', label: 'Last 3 Months' },
    { id: '1y', label: 'This Year' },
    { id: 'all', label: 'All Data' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => onDateRangeChange({ preset: p.id })}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors \${dateRange.preset === p.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}\`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => onDateRangeChange({ preset: 'custom' })}
          className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors \${dateRange.preset === 'custom' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}\`}
        >
          Custom
        </button>
      </div>
      {dateRange.preset === 'custom' && (
        <div className="flex items-center space-x-4">
          <input type="date" className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
          <span className="text-gray-500">to</span>
          <input type="date" className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
        </div>
      )}
    </div>
  );
}
  `,
  'components/analysis/ProblemsSolvedCard.tsx': `
'use client';
export default function ProblemsSolvedCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
        📊 Problems You Solved
        <span className="ml-3 bg-emerald-950 text-emerald-400 text-xs px-2 py-1 rounded-full">Total: 24</span>
      </h3>
      <div className="text-4xl font-bold text-white mb-6">24 <span className="text-base font-normal text-gray-400">Problems Solved</span></div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Problem</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3 rounded-tr-lg">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="px-4 py-3 font-medium text-white">Two Sum</td>
              <td className="px-4 py-3"><span className="text-emerald-400">Easy</span></td>
              <td className="px-4 py-3">Oct 12, 2023</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="px-4 py-3 font-medium text-white">Add Two Numbers</td>
              <td className="px-4 py-3"><span className="text-amber-400">Medium</span></td>
              <td className="px-4 py-3">Oct 14, 2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
  `,
  'components/analysis/DifficultyCard.tsx': `
'use client';
export default function DifficultyCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-6">📈 Problem Difficulty</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-emerald-400 font-medium">Easy</span>
            <span className="text-gray-400">12 (50%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-amber-400 font-medium">Medium</span>
            <span className="text-gray-400">10 (41%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '41%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400 font-medium">Hard</span>
            <span className="text-gray-400">2 (9%)</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '9%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
  `,
  'components/analysis/TimeTakenCard.tsx': `
'use client';
import Link from 'next/link';
export default function TimeTakenCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  const hasData = false;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col h-full">
      <h3 className="text-lg font-medium text-white mb-4">⏱️ Time Taken</h3>
      {hasData ? (
        <div>Data here</div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
          <p className="text-gray-400 mb-4 text-sm">Start using the built-in timer to track your solving time accurately.</p>
          <Link href="/timer" className="text-emerald-500 font-medium hover:text-emerald-400 text-sm">
            Go to Timer &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
  `,
  'components/analysis/BehaviorCard.tsx': `
'use client';
import { Zap, RefreshCw } from 'lucide-react';
export default function BehaviorCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">🧠 How You Solve</h3>
      <div className="space-y-4">
        <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex items-start space-x-3">
          <Zap className="w-5 h-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium">Consistent Submissions</p>
            <p className="text-gray-400 text-xs mt-1">You often solve problems in 1-2 attempts. Great precision!</p>
          </div>
        </div>
        <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex items-start space-x-3">
          <RefreshCw className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium">Revisiting Hard Problems</p>
            <p className="text-gray-400 text-xs mt-1">Consider returning to Hard problems after a few days to reinforce concepts.</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-right">Based on profile data</p>
    </div>
  );
}
  `,
  'components/analysis/AIHelpCard.tsx': `
'use client';
export default function AIHelpCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">🤖 Possible AI Help</h3>
      <div className="mb-4">
        <div className="text-4xl font-bold text-red-500 mb-1">82% <span className="text-lg font-normal">High</span></div>
        <p className="text-sm text-gray-400">Flagged: 47 / 500 problems</p>
      </div>
      <ul className="text-sm text-gray-300 space-y-2 mb-6">
        <li>• Unusually fast completion times</li>
        <li>• Perfect first attempts on hard problems</li>
      </ul>
      <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg text-xs text-amber-500/80">
        ⚠️ This is an estimate based on available coding signals, not proof of AI usage.
      </div>
    </div>
  );
}
  `,
  'components/analysis/SimilarityCard.tsx': `
'use client';
export default function SimilarityCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full">
      <h3 className="text-lg font-medium text-white mb-4">🔍 Code Similarity</h3>
      <p className="text-sm text-gray-400 mb-4">Submit code through our platform to enable similarity analysis.</p>
      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-white font-medium">Possible Code Match: 31 / 500</p>
      </div>
    </div>
  );
}
  `,
  'components/analysis/StrongAreasCard.tsx': `
'use client';
export default function StrongAreasCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">💪 Strong Areas</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-white">
            <span>Arrays & Hashing</span>
            <span className="text-emerald-400">92%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">High accuracy and fast solve times.</p>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1 text-white">
            <span>Two Pointers</span>
            <span className="text-emerald-400">85%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Consistently optimal solutions.</p>
        </div>
      </div>
    </div>
  );
}
  `,
  'components/analysis/ImprovementCard.tsx': `
'use client';
export default function ImprovementCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">📚 Areas to Improve</h3>
      <div className="space-y-4">
        <div className="border-l-2 border-amber-500 pl-4 py-1">
          <h4 className="text-sm font-medium text-white">Dynamic Programming</h4>
          <p className="text-xs text-gray-400 mt-1">You often take longer on 2D DP problems.</p>
          <p className="text-xs text-emerald-500 mt-1">Suggestion: Practice classical knapsack variations.</p>
        </div>
        <div className="border-l-2 border-amber-500 pl-4 py-1">
          <h4 className="text-sm font-medium text-white">Graphs</h4>
          <p className="text-xs text-gray-400 mt-1">Lower success rate on shortest path problems.</p>
          <p className="text-xs text-emerald-500 mt-1">Suggestion: Review Dijkstra's algorithm.</p>
        </div>
      </div>
    </div>
  );
}
  `,
  'components/analysis/CareerCard.tsx': `
'use client';
export default function CareerCard({ profile, dateRange }: { profile: any, dateRange: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">🎯 Career Suggestions</h3>
      <div className="space-y-4 mb-6">
        <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-white">Backend Development</h4>
            <span className="text-emerald-500 font-bold">87% Match</span>
          </div>
          <p className="text-xs text-gray-400">Strong system design fundamentals and database optimization patterns.</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 text-center">Based on coding patterns, not a career prediction</p>
    </div>
  );
}
  `
};

for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, filePath), content.trim() + '\\n', 'utf8');
}
console.log('Generated all files successfully.');
