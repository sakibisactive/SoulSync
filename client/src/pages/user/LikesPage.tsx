import React from 'react';
import { useGetMyLikesQuery } from '../../redux/services/matchApi';
import { Bookmark, Heart, Sparkles, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LikesPage: React.FC = () => {
  const { data, isLoading } = useGetMyLikesQuery({});

  return (
    <div className="space-y-8">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800">
        <h1 className="text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-amber-400" /> Bookmarks & Liked Profiles
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage profiles you saved or liked during discovery.</p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading saved likes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.likesGiven?.map((item: any) => (
            <div key={item._id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">{item.receiver?.name || 'User'}</h3>
                <p className="text-xs text-slate-400">{item.receiver?.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                  {item.isSaved ? '📌 Saved Bookmark' : '💖 Liked Profile'}
                </span>
              </div>
              <Link
                to="/chat"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
              >
                Chat
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
