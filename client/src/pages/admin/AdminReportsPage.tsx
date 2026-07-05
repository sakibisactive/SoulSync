import React from 'react';
import { useGetReportsQuery, useResolveReportMutation } from '../../redux/services/adminApi';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetReportsQuery({});
  const [resolveReport] = useResolveReportMutation();

  const handleResolve = async (reportId: string) => {
    try {
      await resolveReport({ reportId, status: 'resolved' }).unwrap();
      refetch();
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-400" /> Moderation Reports Queue
        </h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading reports...</div>
      ) : data?.reports?.length === 0 ? (
        <div className="glass-panel p-10 text-center border border-slate-800 rounded-3xl text-slate-400 text-sm">
          No pending safety reports in queue.
        </div>
      ) : (
        <div className="space-y-4">
          {data?.reports?.map((report: any) => (
            <div key={report._id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Reason: {report.reason}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Reporter: {report.reporter?.name} | Reported User: {report.reportedUser?.name}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                  Status: {report.status}
                </span>
              </div>
              {report.status !== 'resolved' && (
                <button
                  onClick={() => handleResolve(report._id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
