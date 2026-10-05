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
    const regex = /leetcode\.com\/(u\/)?([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    
    if (match && match[2]) {
      setError('');
      router.push(`/analyze/${match[2]}`);
    } else {
      setError('Please enter a valid LeetCode profile URL.');
    }
  };

  const isValid = /leetcode\.com\/(u\/)?([a-zA-Z0-9_-]+)/.test(url);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Understand Your Coding.<br/><span className="text-accent">Improve Your Future.</span></h1>
        <p className="text-center text-muted mb-8">Paste your LeetCode profile URL to get started.</p>
        
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
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={!isValid && url.length > 0}
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-card-hover disabled:text-muted text-white dark:text-background font-semibold rounded-xl px-4 py-3 flex items-center justify-center transition-colors group cursor-pointer shadow-xs"
          >
            Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/analyze/demo" className="text-sm text-muted hover:text-accent transition-colors">
            Or try the demo &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
