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
        <button onClick={toggleAll} className="text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer">
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
              className={`cursor-pointer border rounded-xl p-4 transition-all shadow-xs ${
                isSelected
                  ? 'bg-accent/15 border-accent shadow-xs'
                  : 'bg-card border-border hover:border-border-hover hover:bg-card-hover'
              }`}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <h3 className={`font-medium mb-1 ${isSelected ? 'text-accent font-semibold' : 'text-foreground'}`}>{opt.title}</h3>
              <p className="text-sm text-muted">{opt.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
