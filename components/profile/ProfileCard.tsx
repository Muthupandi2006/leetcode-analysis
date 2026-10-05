'use client';
import type { LeetCodeProfile } from '@/types/leetcode';

export default function ProfileCard({ profile }: { profile: LeetCodeProfile }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xs">
      <div className="relative">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.username} className="w-20 h-20 rounded-xl object-cover bg-border" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-card-hover border border-border flex items-center justify-center text-muted text-2xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-muted text-sm font-medium">Profile found 👋</span>
        </div>
        <div>
          <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-foreground hover:text-accent transition-colors">
            {profile.username}
          </a>
        </div>
        <div className="text-sm text-muted">
          Rank: {profile.ranking ? profile.ranking.toLocaleString() : 'N/A'}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{profile.totalSolved}</div>
          <div className="text-xs text-muted uppercase tracking-wider">Solved</div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <span className="text-emerald-500 font-bold">{profile.easySolved}</span>
            <span className="text-[10px] text-emerald-500/80 uppercase font-medium">Easy</span>
          </div>
          <div className="flex flex-col items-center bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <span className="text-amber-500 font-bold">{profile.mediumSolved}</span>
            <span className="text-[10px] text-amber-500/80 uppercase font-medium">Med</span>
          </div>
          <div className="flex flex-col items-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <span className="text-red-500 font-bold">{profile.hardSolved}</span>
            <span className="text-[10px] text-red-500/80 uppercase font-medium">Hard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
