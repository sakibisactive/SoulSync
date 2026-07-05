import React, { useState } from 'react';
import { useDiscoverUsersQuery, useLikeUserMutation, useSaveUserMutation } from '../../redux/services/matchApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Sparkles, Filter, MapPin, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(50);
  const [gender, setGender] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('compatibility');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const { data, isLoading, refetch } = useDiscoverUsersQuery({
    minAge,
    maxAge,
    gender: gender || undefined,
    sortBy,
  });

  const [likeUser] = useLikeUserMutation();
  const [saveUser] = useSaveUserMutation();

  const handleLike = async (receiverId: string, name: string) => {
    try {
      const res = await likeUser(receiverId).unwrap();
      setActiveNotification(
        res.isMutualMatch
          ? `🎉 It's a Mutual Match with ${name}!`
          : `💖 Liked ${name}'s profile!`
      );
      setTimeout(() => setActiveNotification(null), 3000);
      refetch();
    } catch (e) {}
  };

  const handleSave = async (targetUserId: string, name: string) => {
    try {
      await saveUser(targetUserId).unwrap();
      setActiveNotification(`📌 Saved ${name} to bookmarks`);
      setTimeout(() => setActiveNotification(null), 3000);
    } catch (e) {}
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            {activeNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-outfit flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-400" /> Discover Matches
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse potential partners ranked by 5D compatibility algorithms.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Gender:</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              <option value="compatibility">Compatibility Score</option>
              <option value="newest">Newest First</option>
              <option value="distance">Nearest Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Discover Profile Feed Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Computing compatibility vectors...</p>
        </div>
      ) : data?.users?.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Profiles Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try relaxing your search age or gender filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.users?.map((item: any) => (
            <motion.div
              key={item.candidateId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group shadow-xl"
            >
              {/* Photo Banner */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={
                    item.profile.photos?.[0]?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={item.user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                {/* Compatibility Score Badge */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-rose-500/40 text-rose-400 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
                  {item.compatibilityScore}% Match
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-extrabold text-white flex items-center gap-2 font-outfit">
                    {item.user.name}, {item.profile.age}
                    {item.user.isVerified && (
                      <span title="Verified Badge">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.profile.city || 'New York'}, {item.profile.country || 'USA'}
                  </p>
                </div>
              </div>

              {/* Profile Bio & Attributes */}
              <div className="p-6 space-y-4 flex-grow">
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  "{item.profile.bio || 'Passionate about meaningful connections, travel, and lifestyle balance.'}"
                </p>

                {/* Details Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 font-medium">
                  {item.profile.occupation && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-indigo-400" /> {item.profile.occupation}
                    </span>
                  )}
                  {item.profile.education && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-amber-400" /> {item.profile.education}
                    </span>
                  )}
                </div>

                {/* Interests Chips */}
                {item.profile.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.profile.interests.slice(0, 3).map((interest: any) => (
                      <span
                        key={interest._id || interest.name}
                        className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold"
                      >
                        #{interest.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
                <button
                  onClick={() => handleSave(item.candidateId, item.user.name)}
                  className="p-3 rounded-2xl glass-card hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors border border-slate-700/60"
                  title="Save Profile"
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleLike(item.candidateId, item.user.name)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" /> Like Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
