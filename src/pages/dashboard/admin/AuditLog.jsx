import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Search, Filter, Calendar, User,
  Activity, ArrowUpRight, Download, ChevronLeft,
  ChevronRight, Database, Shield, Zap, AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getAllLogs } from '../../../services/activityService';
import { format } from 'date-fns';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ actionType: '', entityType: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAllLogs({
        page,
        limit: 15,
        ...filter,
        search: searchTerm
      });
      setLogs(res.logs || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filter, searchTerm]);

  const getActionColor = (type) => {
    const colors = {
      'CREATE': 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-xl',
      'UPDATE': 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-xl',
      'DELETE': 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20 shadow-xl',
      'LOGIN': 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-xl',
      'STATUS_CHANGE': 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-xl',
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10';
  };

  const getEntityIcon = (type) => {
    const icons = {
      'Project': Database,
      'Task': ClipboardList,
      'User': User,
      'Auth': Shield,
      'Requirement': Zap,
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout role="admin" title="Operational Audit Ledger">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1400px] mx-auto space-y-10 selection:bg-blue-500/30"
      >
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Event Influx', value: total, icon: Activity, color: 'from-blue-600 to-indigo-600', sub: 'Total Records' },
            { label: 'Integrity', value: '100%', icon: Shield, color: 'from-emerald-500 to-teal-500', sub: 'Verified Logs' },
            { label: 'Retention', value: '365D', icon: Database, color: 'from-purple-500 to-pink-500', sub: 'Archives' },
            { label: 'Status', value: 'LIVE', icon: Zap, color: 'from-orange-500 to-amber-500', sub: 'Real-time Feed' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="premium-glass p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:opacity-10 transition-all duration-700`} />
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                    {stat.value === 'LIVE' ? (
                      <>Live <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" /></>
                    ) : stat.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Actions */}
        <motion.div variants={itemVariants} className="premium-glass p-8 rounded-[3.5rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -mr-60 -mt-60" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
              <div className="relative group w-full md:w-[450px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Scan system matrix query..."
                  className="w-full pl-16 pr-8 py-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 focus:border-blue-500/50 outline-none transition-all text-sm font-black text-gray-900 dark:text-white placeholder:text-gray-400 tracking-wide uppercase tracking-[0.1em] shadow-sm"
                  onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="w-full md:w-auto bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] px-10 py-5 text-gray-600 dark:text-gray-400 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 shadow-sm"
                onChange={(e) => setFilter({ ...filter, actionType: e.target.value })}
              >
                <option value="" className="bg-white dark:bg-gray-900">Global Stream</option>
                <option value="CREATE" className="bg-white dark:bg-gray-900">Creation Events</option>
                <option value="UPDATE" className="bg-white dark:bg-gray-900">Update Events</option>
                <option value="DELETE" className="bg-white dark:bg-gray-900">Deletion Events</option>
                <option value="STATUS_CHANGE" className="bg-white dark:bg-gray-900">Status Modulations</option>
              </select>
            </div>

            <button className="w-full lg:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-2xl transition-all active:scale-95 group/btn shadow-xl">
              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" /> Export Archives
            </button>
          </div>
        </motion.div>

        {/* Logs Table Area */}
        <motion.div variants={itemVariants} className="premium-glass rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left relative z-10 border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                  <th className="px-12 py-10 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Origin Specialist</th>
                  <th className="px-12 py-10 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Operation</th>
                  <th className="px-12 py-10 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Matrix Sector</th>
                  <th className="px-12 py-10 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Event Payload</th>
                  <th className="px-12 py-10 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Runtime Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                <>
                  {loading ? (
                    Array(6).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-12 py-12">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                            <div className="space-y-3 flex-grow">
                              <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg w-1/4" />
                              <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-lg w-1/6 opacity-50" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-12 py-32 text-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-200 dark:border-white/10 shadow-inner">
                          <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 opacity-50" />
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-widest">No Operational Telemetry</h4>
                        <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Historical system activity will be manifested here.</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, idx) => (
                      <tr
                        key={log._id}



                        className="hover:bg-blue-50/30 dark:hover:bg-white/5 transition-all group/row cursor-default"
                      >
                        <td className="px-12 py-10 whitespace-nowrap">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-gray-100 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-black shadow-2xl group-hover/row:scale-110 group-hover/row:rotate-3 transition-all duration-500">
                              {log.userId?.fullName?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="text-base font-black text-gray-900 dark:text-white tracking-tighter group-hover/row:text-blue-600 transition-colors">{log.userId?.fullName || 'System Core'}</p>
                              <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1">{log.userId?.role || 'Root Admin'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-10 whitespace-nowrap">
                          <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border shadow-2xl transition-all ${getActionColor(log.actionType)}`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td className="px-12 py-10 whitespace-nowrap">
                          <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-blue-600 dark:text-blue-400 shadow-sm group-hover/row:shadow-lg transition-all">
                              {getEntityIcon(log.entityType)}
                            </div>
                            <span>{log.entityType} Node</span>
                          </div>
                        </td>
                        <td className="px-12 py-10 max-w-md">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-bold leading-relaxed tracking-tight group-hover/row:text-gray-900 dark:group-hover/row:text-gray-200 transition-colors line-clamp-2 uppercase tracking-[0.05em] text-[11px]">"{log.description}"</p>
                        </td>
                        <td className="px-12 py-10 whitespace-nowrap">
                          <div className="flex flex-col text-right">
                            <span className="text-[11px] font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-[0.1em]">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-500/80 uppercase tracking-[0.3em] mt-2">{format(new Date(log.createdAt), 'HH:mm:ss')} SYNC</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                </>
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-10 bg-gray-50/50 dark:bg-white/2 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Manifesting {(page - 1) * 15 + 1}—{Math.min(page * 15, total)} OF {total} Operational Telemetry Entries</p>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90 border border-gray-200 dark:border-white/10 shadow-lg"
              >
                <ChevronLeft size={28} />
              </button>

              <div className="w-16 h-16 bg-gradient-to-br from-[#1e293b] to-[#0f172a] dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl border border-gray-800 dark:border-gray-100">
                {page}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * 15 >= total}
                className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90 border border-gray-200 dark:border-white/10 shadow-lg"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AuditLog;
