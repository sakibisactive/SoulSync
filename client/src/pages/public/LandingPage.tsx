import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck, Zap, MessageSquare, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-600/30 via-rose-500/20 to-amber-500/10 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-rose-400" /> AI-Powered 5D Compatibility Algorithm
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight font-outfit"
          >
            Find Your True Match Powered by{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Mathematical Compatibility
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            SoulSync analyzes 50 personality dimensions, interest overlaps, lifestyle alignment, age goals, and geo-proximity to calculate real compatibility scores.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 hover:opacity-95 shadow-xl shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Free Matching <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-200 glass-card hover:bg-slate-800/80 border border-slate-700/60 transition-all flex items-center justify-center gap-2"
            >
              Demo Accounts Login
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cosine Personality Score</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              35% weight powered by vector cosine similarity over 50 Likert-scale psychological questions.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Jaccard Interest Index</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              25% weight calculating set intersection over shared hobbies, passions, and life activities.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Socket.IO Real-Time Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant messaging, typing status, presence tracking, and mutual match triggers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breakdown Metrics */}
      <section className="glass-panel p-10 rounded-3xl border border-slate-800 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white font-outfit">The 100% Compatibility Weight Breakdown</h2>
          <p className="text-slate-400 text-sm mt-2">Engineered for production accuracy and deep alignment</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-indigo-400">35%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Personality</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-rose-400">25%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Interests</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-emerald-400">20%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Lifestyle</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-amber-400">10%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Age Preference</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 col-span-2 md:col-span-1">
            <span className="text-3xl font-extrabold text-purple-400">10%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Location Haversine</p>
          </div>
        </div>
      </section>
    </div>
  );
};
