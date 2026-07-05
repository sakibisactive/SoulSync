import React, { useState } from 'react';
import { useGetMatchesQuery } from '../../redux/services/matchApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, CheckCircle2, ChevronRight, X, Compass, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MatchResultsPage: React.FC = () => {
  const { data, isLoading } = useGetMatchesQuery({});
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> Top 20 Algorithm Matches
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-outfit">
            Compatibility Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Engineered matches sorted by Cosine, Jaccard, Lifestyle, and Location vectors.
          </p>
        </div>
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Computing compatibility matrices...</p>
        </div>
      ) : data?.matches?.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Computed Matches Yet</h3>
          <p className="text-slate-400 text-sm mt-1">Visit the Discover page to calculate your top compatibility scores.</p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Go to Discover <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.matches?.map((match: any, idx: number) => (
            <motion.div
              key={match.candidateId || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    match.profile?.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={match.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-outfit">
                    {match.user?.name}, {match.profile?.age}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {match.profile?.city || 'City'}, {match.profile?.country || 'Country'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                    Rank #{idx + 1} Candidate
                  </span>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Overall Score</span>
                  <span className="text-rose-400 font-extrabold">{match.compatibilityScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${match.compatibilityScore}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedMatch(match)}
                className="mt-6 w-full py-2.5 rounded-xl glass-card hover:bg-slate-800 text-xs font-bold text-indigo-300 border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
              >
                View 5D Sub-Score Breakdown <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5D Sub-Score Breakdown Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-lg w-full space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedMatch.profile?.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={selectedMatch.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h2 className="text-xl font-bold text-white font-outfit">{selectedMatch.user?.name}</h2>
                  <p className="text-xs text-rose-400 font-bold">{selectedMatch.compatibilityScore}% Total Compatibility</p>
                </div>
              </div>

              {/* Sub-Scores List */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🧠 Personality Vector (35% Weight)</span>
                    <span className="text-indigo-400">{selectedMatch.breakdown?.personality || 85}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${selectedMatch.breakdown?.personality || 85}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>⚽ Interest Overlap (25% Weight)</span>
                    <span className="text-rose-400">{selectedMatch.breakdown?.interest || 70}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${selectedMatch.breakdown?.interest || 70}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🌱 Lifestyle Choice Alignment (20% Weight)</span>
                    <span className="text-emerald-400">{selectedMatch.breakdown?.lifestyle || 90}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${selectedMatch.breakdown?.lifestyle || 90}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🎂 Age Range Preference (10% Weight)</span>
                    <span className="text-amber-400">{selectedMatch.breakdown?.age || 100}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${selectedMatch.breakdown?.age || 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>📍 Geo-Location Distance (10% Weight)</span>
                    <span className="text-purple-400">{selectedMatch.breakdown?.location || 80}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedMatch.breakdown?.location || 80}%` }} />
                  </div>
                </div>
              </div>

              <Link
                to={`/chat`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                Start Direct Conversation
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
