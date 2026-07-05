import React from 'react';
import { Heart, Github, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="font-bold text-white text-lg tracking-tight font-outfit">SoulSync</span>
            <span className="text-slate-500 text-xs">© 2026 MERN Compatibility Platform</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> About & Matching Algorithm
            </Link>
            <a
              href="https://github.com/sakibisactive/Partner-Matching-Web-Platform.git"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
