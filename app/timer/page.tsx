'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Trash2 } from 'lucide-react';

interface LocalSession {
  id: string;
  problemTitle: string;
  activeDuration: number;
  pauseDuration: number;
  status: 'completed' | 'discarded';
}

export default function TimerPage() {
  const [problemTitle, setProblemTitle] = useState('');
  const [status, setStatus] = useState<'ready' | 'running' | 'paused'>('ready');
  const [activeDuration, setActiveDuration] = useState(0); // in ms
  const [pauseDuration, setPauseDuration] = useState(0); // in ms
  const [completedSessions, setCompletedSessions] = useState<LocalSession[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;

        if (status === 'running') {
          setActiveDuration((prev) => prev + delta);
        } else if (status === 'paused') {
          setPauseDuration((prev) => prev + delta);
        }
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const handleStart = () => {
    if (!problemTitle.trim()) {
      alert('Please enter a problem name or URL first.');
      return;
    }
    setStatus('running');
    lastTickRef.current = Date.now();
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleResume = () => {
    setStatus('running');
    lastTickRef.current = Date.now();
  };

  const handleFinish = () => {
    const session: LocalSession = {
      id: crypto.randomUUID(),
      problemTitle,
      activeDuration,
      pauseDuration,
      status: 'completed',
    };
    setCompletedSessions((prev) => [session, ...prev]);
    resetTimer();
  };

  const handleDiscard = () => {
    resetTimer();
  };

  const resetTimer = () => {
    setStatus('ready');
    setActiveDuration(0);
    setPauseDuration(0);
    setProblemTitle('');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground text-center">Problem Timer</h1>

        <div className="bg-card rounded-2xl p-8 border border-border space-y-8 shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Problem Name or URL</label>
            <input
              type="text"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              disabled={status !== 'ready'}
              placeholder="e.g. Two Sum"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 transition-colors"
            />
          </div>

          <div className="text-center space-y-4">
            <div className="text-sm font-medium text-muted uppercase tracking-wider">
              {status === 'ready' && 'Ready'}
              {status === 'running' && <span className="text-accent font-semibold">Running</span>}
              {status === 'paused' && <span className="text-amber-500 font-semibold">Paused</span>}
            </div>
            
            <div className="text-6xl md:text-8xl font-mono text-foreground font-bold tracking-tight">
              {formatTime(activeDuration)}
            </div>

            {pauseDuration > 0 && (
              <div className="text-sm text-muted font-mono">
                Paused: {formatTime(pauseDuration)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {status === 'ready' ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white dark:text-background px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-5 h-5" /> Start
              </button>
            ) : (
              <>
                {status === 'running' ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    <Pause className="w-5 h-5" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white dark:text-background px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-5 h-5" /> Resume
                  </button>
                )}
                
                <button
                  onClick={handleFinish}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <Square className="w-5 h-5" /> Finish
                </button>
                
                <button
                  onClick={handleDiscard}
                  className="flex items-center gap-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 px-6 py-3 rounded-full font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" /> Discard
                </button>
              </>
            )}
          </div>
        </div>

        {completedSessions.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border space-y-4 shadow-xs">
            <h2 className="text-xl font-bold text-foreground">Recent Sessions</h2>
            <div className="space-y-3">
              {completedSessions.map(session => (
                <div key={session.id} className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                  <div className="font-medium text-foreground">{session.problemTitle}</div>
                  <div className="flex gap-4 text-sm font-mono text-muted">
                    <span>Active: {formatTime(session.activeDuration)}</span>
                    {session.pauseDuration > 0 && <span>Pause: {formatTime(session.pauseDuration)}</span>}
                    <span className="text-accent uppercase font-semibold">{session.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
