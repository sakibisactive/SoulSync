import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Zap, MessageSquare, ArrowRight, Shield } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // If user is already logged in, redirect directly to their main dashboard
  if (isAuthenticated && user) {
    if (user.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/discover" replace />;
  }

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
            <Sparkles className="w-4 h-4 text-rose-400" /> AI-Powered 5D Compatibility & Hobbies Matching
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
            SoulSync analyzes 50 personality dimensions, comprehensive world hobbies, lifestyle alignment, age goals, and Haversine geo-distance to calculate real compatibility scores.
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
              Sign In to SoulSync
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
            <h3 className="text-xl font-bold text-white mb-2">All World Hobbies Options</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              25% Jaccard Index calculating set intersection across comprehensive global hobby choices without manual typing.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Social & Direct Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect directly via Socket.IO real-time chat or optional Facebook, Instagram, Snapchat, and WhatsApp handles.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
