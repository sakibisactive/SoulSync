import React from 'react';
import { Sparkles, Cpu, Lock, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <div className="glass-panel p-10 rounded-3xl border border-slate-800 space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider">
          System Architecture & Algorithm
        </span>
        <h1 className="text-4xl font-extrabold text-white font-outfit">About SoulSync Platform</h1>
        <p className="text-slate-400 text-base leading-relaxed">
          SoulSync is a production-quality, compatibility-based partner matching web platform engineered with the MERN stack (MongoDB, Express, React 19, Node.js) and TypeScript.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
          <Cpu className="w-8 h-8 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">5D Compatibility Score</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Formula: 35% Personality Cosine Similarity + 25% Jaccard Interest Index + 20% Lifestyle Alignment + 10% Age Penalty Decay + 10% Haversine Geo Distance.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
          <Layers className="w-8 h-8 text-rose-400" />
          <h3 className="text-xl font-bold text-white">Production Stack</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            React 19 + Vite frontend, Redux Toolkit & RTK Query, TailwindCSS, Express.js REST API with Socket.IO real-time presence.
          </p>
        </div>
      </div>
    </div>
  );
};
