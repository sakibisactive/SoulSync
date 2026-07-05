import React from 'react';
import { useGetMeQuery } from '../../redux/services/authApi';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, GraduationCap, Edit3, CheckCircle2, Heart, Sparkles, Sliders } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { data, isLoading } = useGetMeQuery({});

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
        Loading profile...
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={
              profile?.photos?.[0]?.url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
            }
            alt={user?.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />

          <div className="space-y-2 text-center sm:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl font-extrabold text-white font-outfit">
                {user?.name}, {profile?.age || 24}
              </h1>
              {user?.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-4 h-4 text-rose-400" /> {profile?.city || 'New York'}, {profile?.country || 'USA'}
            </p>

            <p className="text-slate-300 text-sm italic max-w-xl">
              "{profile?.bio || 'No bio written yet. Click Edit Profile to express your story!'}"
            </p>
          </div>

          <Link
            to="/edit-profile"
            className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile & 50 Qs
          </Link>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lifestyle Choices */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" /> Lifestyle Attributes
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Smoking</span>
              <span className="font-semibold text-slate-200">{profile?.lifestyle?.smoking || 'Never'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Drinking</span>
              <span className="font-semibold text-slate-200">{profile?.lifestyle?.drinking || 'Socially'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Exercise</span>
              <span className="font-semibold text-slate-200">{profile?.lifestyle?.exercise || 'Sometimes'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Diet</span>
              <span className="font-semibold text-slate-200">{profile?.lifestyle?.diet || 'Anything'}</span>
            </div>
          </div>
        </div>

        {/* Interests & Personality Status */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" /> Passions & Personality Vector
          </h3>

          <div>
            <span className="text-xs text-slate-400 block mb-2">Selected Interests:</span>
            {profile?.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: any) => (
                  <span
                    key={interest._id || interest.name}
                    className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold"
                  >
                    #{interest.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No interest tags added yet.</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">50-Question Questionnaire Progress:</span>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>{profile?.personalityAnswers?.length || 0} / 50 Questions Answered</span>
              <span>{profile?.personalityAnswers?.length >= 50 ? '100% Complete' : 'Incomplete'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
