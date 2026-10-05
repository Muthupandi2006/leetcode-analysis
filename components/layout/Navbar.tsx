"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DateTimeDisplay } from "@/components/layout/DateTimeDisplay";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent transition-colors">
          <BarChart3 className="w-6 h-6 text-accent" />
          <span>CodeLens</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-sm font-medium text-muted hover:text-foreground">How It Works</Link>
          <Link href="/#for-students" className="text-sm font-medium text-muted hover:text-foreground">For Students</Link>
          <Link href="/#for-mentors" className="text-sm font-medium text-muted hover:text-foreground">For Mentors</Link>
        </nav>

        {/* Top-Right Section on Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <DateTimeDisplay />
          <ThemeToggle />
          <Link 
            href="/analyze" 
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white dark:text-background font-semibold rounded-lg text-sm transition-colors shadow-xs"
          >
            Analyze Profile
          </Link>
        </div>

        {/* Top-Right Section on Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <DateTimeDisplay className="hidden sm:inline-flex" showIcon={false} />
          <ThemeToggle />
          <button 
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link href="/#how-it-works" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>How It Works</Link>
          <Link href="/#for-students" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>For Students</Link>
          <Link href="/#for-mentors" className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>For Mentors</Link>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-medium text-muted">Current Time (IST)</span>
            <DateTimeDisplay />
          </div>

          <Link 
            href="/analyze" 
            className="block w-full text-center px-4 py-2 bg-accent hover:bg-accent-hover text-white dark:text-background font-semibold rounded-lg text-sm transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Analyze Profile
          </Link>
        </div>
      )}
    </header>
  );
}
