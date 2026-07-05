import React from 'react';
import {
  useGetAdminAnalyticsQuery,
  useGetAllUsersQuery,
  useGetReportsQuery,
} from '../../redux/services/adminApi';
import { Users, ShieldAlert, Sparkles, CheckCircle2, UserX, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { data: analyticsData } = useGetAdminAnalyticsQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: reportsData } = useGetReportsQuery({});

  const stats = analyticsData?.analytics || {
    totalUsers: usersData?.count || 0,
    activeUsers: usersData?.users?.filter((u: any) => u.status === 'active')?.length || 0,
    bannedUsers: usersData?.users?.filter((u: any) => u.status === 'banned')?.length || 0,
    totalMatches: 24,
    pendingReports: reportsData?.count || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider">
            Admin Moderation Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-white font-outfit mt-2">Platform Control Center</h1>
          <p className="text-slate-400 text-sm">Monitor user registrations, ban accounts, resolve reports, and review analytics.</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.totalUsers}</span>
            <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.activeUsers}</span>
            <p className="text-xs text-slate-400 font-medium">Active Accounts</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.bannedUsers}</span>
            <p className="text-xs text-slate-400 font-medium">Banned Accounts</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-outfit">{stats.pendingReports}</span>
            <p className="text-xs text-slate-400 font-medium">Reports Pending</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors space-y-2 group"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Manage Users →</h3>
          <p className="text-xs text-slate-400">Ban, unban, grant verified badges, or delete user profiles.</p>
        </Link>

        <Link
          to="/admin/reports"
          className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-rose-500/50 transition-colors space-y-2 group"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">Moderation Queue →</h3>
          <p className="text-xs text-slate-400">Review reported profiles and resolve safety flags.</p>
        </Link>

        <Link
          to="/admin/interests"
          className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-colors space-y-2 group"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Manage Interest Tags →</h3>
          <p className="text-xs text-slate-400">Add or remove system interest tags for Jaccard matching.</p>
        </Link>
      </div>
    </div>
  );
};
