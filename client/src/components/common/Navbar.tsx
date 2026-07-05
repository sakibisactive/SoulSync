import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { Heart, Sparkles, User, MessageSquare, Shield, LogOut, Compass, Bookmark, Crown } from 'lucide-react';
import { SubscriptionModal } from '../profile/SubscriptionModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSubscription, setShowSubscription] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight font-outfit">
                SoulSync
              </span>
            </Link>

            {/* Navigation Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-3">
                {/* HIDE DISCOVER & TOP MATCHES FOR ADMIN USER ROLE */}
                {user?.role !== 'Admin' && (
                  <>
                    <Link
                      to="/discover"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/discover')
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-indigo-400" />
                      <span className="hidden md:inline">Discover</span>
                    </Link>

                    <Link
                      to="/matches"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/matches')
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span className="hidden md:inline">Top Matches</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/likes"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/likes')
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Saved</span>
                </Link>

                <Link
                  to="/chat"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/chat')
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">Chat</span>
                </Link>

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}

                {/* VIP Upgrade Checkout Trigger */}
                {user?.role !== 'Admin' && (
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-amber-500/20 hover:opacity-90 transition-opacity"
                  >
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">VIP Membership</span>
                  </button>
                )}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300 hover:text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-indigo-400">
                    {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800/50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              !isLandingPage && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Subscription Fake Payment Checkout Modal */}
      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
};
