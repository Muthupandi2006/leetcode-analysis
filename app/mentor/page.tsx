'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Trash2, BarChart2, Activity, Target, Settings, X } from 'lucide-react';

interface Student {
  username: string;
  lastAnalyzed?: string;
}

export default function MentorPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentUrl, setNewStudentUrl] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mentor_students');
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse students');
      }
    }
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('mentor_students', JSON.stringify(newStudents));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const url = newStudentUrl.trim();
    if (!url) return;

    let username = url;
    // Extract username from URL if necessary
    if (url.includes('leetcode.com/u/')) {
      username = url.split('leetcode.com/u/')[1].replace('/', '');
    } else if (url.includes('leetcode.com/')) {
      username = url.split('leetcode.com/')[1].replace('/', '');
    }

    if (!students.find(s => s.username === username)) {
      saveStudents([...students, { username }]);
    }
    setNewStudentUrl('');
  };

  const handleRemoveStudent = (username: string) => {
    saveStudents(students.filter(s => s.username !== username));
  };

  const handleReviewSelect = (type: string) => {
    if (selectedStudent) {
      router.push(`/analyze/${selectedStudent}?review=${type}`);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span role="img" aria-label="mentor">👥</span> Mentor Dashboard
          </h1>
          <p className="text-muted text-lg">Analyze and track your students' LeetCode progress.</p>
        </header>

        <form onSubmit={handleAddStudent} className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newStudentUrl}
              onChange={(e) => setNewStudentUrl(e.target.value)}
              placeholder="Enter LeetCode username or URL..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white dark:text-background px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <UserPlus className="w-5 h-5" /> Add Student
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Students</h2>
          
          {students.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted shadow-xs">
              No students added yet. Add a student's LeetCode URL above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map(student => (
                <div key={student.username} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{student.username}</h3>
                      <div className="text-sm text-muted">
                        {student.lastAnalyzed ? `Last analyzed: ${student.lastAnalyzed}` : 'Never analyzed'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student.username)}
                      className="text-muted hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Remove student"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(student.username)}
                    className="w-full bg-card hover:bg-card-hover text-foreground py-2 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 border border-border cursor-pointer"
                  >
                    <BarChart2 className="w-4 h-4 text-accent" /> Analyze
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Type Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Select Analysis Type for <span className="text-accent">{selectedStudent}</span></h2>
              <button onClick={() => setSelectedStudent(null)} className="text-muted hover:text-foreground cursor-pointer p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <button onClick={() => handleReviewSelect('quick')} className="w-full text-left bg-background hover:bg-card-hover p-5 rounded-xl border border-border hover:border-accent/50 transition-all flex items-start gap-4 cursor-pointer">
                <div className="bg-blue-500/20 text-blue-500 dark:text-blue-400 p-3 rounded-lg"><Activity className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Quick Review</h3>
                  <p className="text-muted text-sm mt-1">Problems Solved + Difficulty. Good for a quick check-in.</p>
                </div>
              </button>

              <button onClick={() => handleReviewSelect('progress')} className="w-full text-left bg-background hover:bg-card-hover p-5 rounded-xl border border-border hover:border-accent/50 transition-all flex items-start gap-4 cursor-pointer">
                <div className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 p-3 rounded-lg"><Target className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Progress Review</h3>
                  <p className="text-muted text-sm mt-1">Includes Strong Areas & Areas to Improve. Ideal for weekly syncs.</p>
                </div>
              </button>

              <button onClick={() => handleReviewSelect('detailed')} className="w-full text-left bg-background hover:bg-card-hover p-5 rounded-xl border border-border hover:border-accent/50 transition-all flex items-start gap-4 cursor-pointer">
                <div className="bg-purple-500/20 text-purple-500 dark:text-purple-400 p-3 rounded-lg"><BarChart2 className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Detailed Review</h3>
                  <p className="text-muted text-sm mt-1">Comprehensive analysis including recent submissions and tags.</p>
                </div>
              </button>
              
              <button onClick={() => handleReviewSelect('custom')} className="w-full text-left bg-background hover:bg-card-hover p-5 rounded-xl border border-border hover:border-accent/50 transition-all flex items-start gap-4 cursor-pointer">
                <div className="bg-card-hover text-muted p-3 rounded-lg border border-border"><Settings className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Custom Analysis</h3>
                  <p className="text-muted text-sm mt-1">Open the full analysis page to select exactly what you want.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
