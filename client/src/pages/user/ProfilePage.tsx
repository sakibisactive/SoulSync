import React, { useState } from 'react';
import { useGetMeQuery } from '../../redux/services/authApi';
import { useDeleteMyAccountMutation } from '../../redux/services/profileApi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Heart, Edit3, MapPin, Briefcase, GraduationCap, CheckCircle2, Facebook, Instagram, MessageCircle, PhoneCall, Crown, Trash2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: meData, isLoading } = useGetMeQuery({});
  const [deleteMyAccount, { isLoading: isDeleting }] = useDeleteMyAccountMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    if (user?.role === 'Admin') {
      setDeleteError('Admin accounts cannot be self-deleted to maintain platform administration.');
      return;
    }

    try {
      await deleteMyAccount().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err: any) {
      setDeleteError(err?.data?.message || 'Failed to delete account.');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Loading your profile...</div>;
  }

  const profile = meData?.profile;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img
            src={
              profile?.photos?.[0]?.url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
            }
            alt={user?.name}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-xl"
          />

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl font-extrabold text-white font-outfit">{user?.name}</h1>
              {user?.isVerified && (
                <span title="Verified Badge">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                </span>
              )}
              {profile?.membershipTier && profile.membershipTier !== 'Free' && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-white" /> {profile.membershipTier} Member
                </span>
              )}
            </div>

            <p className="text-slate-400 text-xs flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {profile?.city || 'City'}, {profile?.country || 'Country'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300 pt-1">
              {profile?.occupation && (
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {profile.occupation}
                </span>
              )}
              {profile?.education && (
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> {profile.education}
                </span>
              )}
            </div>
          </div>

          <Link
            to="/edit-profile"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Link>
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">About Me</span>
          <p className="text-slate-300 text-sm italic leading-relaxed">
            "{profile?.bio || 'No bio written yet. Click Edit Profile to add your story!'}"
          </p>
        </div>

        {/* Social Media Links */}
        {profile?.socialLinks && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Connected Accounts</span>
            <div className="flex flex-wrap gap-2">
              {profile.socialLinks.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {profile.socialLinks.instagram && (
                <span className="px-3 py-1.5 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 text-xs font-semibold flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5" /> Instagram: {profile.socialLinks.instagram}
                </span>
              )}
              {profile.socialLinks.snapchat && (
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" /> Snapchat: {profile.socialLinks.snapchat}
                </span>
              )}
              {profile.socialLinks.whatsapp && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" /> WhatsApp: {profile.socialLinks.whatsapp}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Selected Hobbies */}
        {profile?.interests?.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Selected Hobbies</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((item: any) => (
                <span
                  key={item._id || item.name}
                  className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold"
                >
                  #{item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone: Account Deletion (Every user except Master Admin) */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Account Security</span>
            <p className="text-[11px] text-slate-500">
              {user?.role === 'Admin'
                ? 'Master Admin accounts are protected against self-deletion.'
                : 'Permanently delete your account and remove all profile data.'}
            </p>
          </div>

          {user?.role !== 'Admin' && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete My Account
            </button>
          )}
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 rounded-3xl border border-rose-500/30 max-w-md w-full relative space-y-6 shadow-2xl"
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-white font-outfit">Delete Your Account?</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This action is permanent and cannot be undone. All your matches, chat messages, liked profiles, and personality data will be completely deleted from SoulSync.
                </p>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20"
                >
                  {isDeleting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Permanently Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
