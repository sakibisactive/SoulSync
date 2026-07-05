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

  // Smart Logo Destination based on User Authentication & Role
  const logoTarget = !isAuthenticated
    ? '/'
    : user?.role === 'Admin'
    ? '/admin'
    : '/discover';

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-pink-500/20 shadow-xl shadow-pink-500/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo - Links to /admin for Admin, /discover for User, / for Guest */}
            <Link to={logoTarget} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-400 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
                </div>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-pink-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent tracking-tight font-outfit">
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
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive('/discover')
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span className="hidden md:inline">Discover</span>
                    </Link>

                    <Link
                      to="/matches"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive('/matches')
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 shadow-lg shadow-pink-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span className="hidden md:inline">Top Matches</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/likes"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/likes')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Saved</span>
                </Link>

                <Link
                  to="/chat"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/chat')
                      ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-lg shadow-pink-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-pink-500/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span className="hidden md:inline">Chat</span>
                </Link>

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive('/admin')
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                        : 'text-cyan-300 hover:text-white hover:bg-cyan-500/10'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}

                {/* VIP Upgrade Checkout Trigger */}
                {user?.role !== 'Admin' && (
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-all hover:scale-105"
                  >
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">VIP Membership</span>
                  </button>
                )}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 border-l border-pink-500/20 text-slate-300 hover:text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-500 p-0.5 shadow-md">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-pink-300">
                      {user?.name ? user.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-pink-400 transition-colors rounded-lg hover:bg-pink-500/10"
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
                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-pink-300 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all hover:scale-105"
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
