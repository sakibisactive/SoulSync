import React from 'react';
import {
  useGetAllUsersQuery,
  useBanUserMutation,
  useVerifyUserMutation,
  useDeleteUserMutation,
} from '../../redux/services/adminApi';
import { Shield, CheckCircle2, UserX, Trash2, ShieldCheck } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [banUser] = useBanUserMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleBan = async (id: string) => {
    try {
      await banUser(id).unwrap();
      refetch();
    } catch (e) {}
  };

  const handleVerify = async (id: string) => {
    try {
      await verifyUser(id).unwrap();
      refetch();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-outfit">User Management</h1>
          <p className="text-xs text-slate-400">Ban, verify, or remove user accounts.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading user table...</div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                {data?.users?.map((u: any) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {u.name}
                      <span className="block text-[10px] text-slate-500 font-normal">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.status === 'banned' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <span className="text-slate-600">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(u._id)}
                        disabled={u.isVerified}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold disabled:opacity-40"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleBan(u._id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.status === 'banned'
                            ? 'bg-emerald-600/20 text-emerald-300'
                            : 'bg-rose-600/20 text-rose-300'
                        }`}
                      >
                        {u.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
