import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-2 text-sm text-muted">
        <p>Built with ❤️ for the coding community</p>
        <p>CodeLens © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
