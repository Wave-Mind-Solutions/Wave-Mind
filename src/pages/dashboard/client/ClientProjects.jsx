import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, AlertCircle, Filter, ArrowRight, Search, Layout, RefreshCw, IndianRupee, Calendar } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getMyProjects } from '../../../services/clientService';
import toast from 'react-hot-toast';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProjects = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // ── Source of Truth: MongoDB via /api/projects ──────────────────────
      // We do NOT merge localStorage here. If the project is not in MongoDB,
      // it does not appear here. localStorage is only for pre-filling the form.
      const res = await getMyProjects();
      const apiProjects = res.projects || res.data || [];
      setProjects(apiProjects);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to load your projects. Please check your connection and try again.');
      }
      console.error('[CLIENT PROJECTS] Load failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleRefresh = () => {
    loadProjects(true);
    toast.success('Refreshing projects...');
  };

  // All status values that can come from MongoDB
  const statuses = ['All', 'In Review', 'Approved', 'In Progress', 'On Hold', 'Completed', 'Rejected'];

  const filtered = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const term = searchQuery.toLowerCase();
    const matchesSearch = !term ||
      (p.title || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term) ||
      (p.projectType || '').toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Completed':   'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      'In Review':   'text-amber-500  bg-amber-500/10  border-amber-500/20',
      'Approved':    'text-blue-500   bg-blue-500/10   border-blue-500/20',
      'In Progress': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      'On Hold':     'text-orange-500 bg-orange-500/10 border-orange-500/20',
      'Rejected':    'text-red-500    bg-red-500/10    border-red-500/20',
    };
    return colors[status] || 'text-gray-500 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10';
  };

  const getProgressColor = (status) => {
    if (status === 'Completed') return 'from-emerald-500 to-teal-500';
    if (status === 'Rejected')  return 'from-red-500 to-red-600';
    if (status === 'On Hold')   return 'from-orange-500 to-amber-500';
    return 'from-blue-600 to-indigo-600';
  };

  const formatBudget = (val) => {
    if (!val) return '—';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  return (
    <DashboardLayout role="client" title="My Projects">
      <div className="max-w-[1400px] mx-auto space-y-10 selection:bg-blue-500/30">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Layout size={12} />
              Project Portfolio
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              Manage Your <span className="text-blue-600 dark:text-blue-500">Submitted Projects</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest max-w-xl opacity-80">
              Track real-time progress from MongoDB. Data is live and synchronized with the admin portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-72">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest placeholder:text-gray-400"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-500/50 transition-all shadow-sm cursor-pointer"
              title="Refresh from database"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin text-blue-500' : ''} />
            </button>

            <Link
              to="/dashboard/client/submit"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all text-center whitespace-nowrap"
            >
              + Submit New Request
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center mb-10 overflow-x-auto pb-4">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 mr-4">
            <Filter size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Filter by Status</span>
          </div>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border shadow-lg cursor-pointer ${filter === s
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-blue-600/30'
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 premium-glass rounded-[4rem] border border-red-200 dark:border-red-500/20 shadow-2xl">
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <AlertCircle size={48} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Failed to Load Projects</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{error}</p>
              <button
                onClick={() => loadProjects()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 premium-glass rounded-[4rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-200 dark:border-white/10 shadow-xl">
                <Briefcase size={48} className="text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                {filter !== 'All' ? `No "${filter}" Projects` : 'No Submitted Projects'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
                {filter !== 'All'
                  ? 'Try a different status filter or submit a new request.'
                  : 'Submit your first project request via the AI Chatbot or the Project Requirement form!'}
              </p>
              <Link to="/dashboard/client/submit" className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all">
                Submit Project Requirement
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filtered.map((project, i) => (
              <div
                key={project._id || i}
                className="premium-glass rounded-[3.5rem] p-8 border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden group flex flex-col justify-between gap-6 relative"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-[50px] -mr-20 -mt-20 group-hover:bg-blue-600/20 transition-all duration-700" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 text-white">
                    <Briefcase size={24} />
                  </div>
                  <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </div>

                <div className="relative z-10 flex-grow space-y-2">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed opacity-90">
                    {project.projectType}{project.businessIndustry ? ` · ${project.businessIndustry}` : ''}
                  </p>
                  {project.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                    <span>Project Progress</span>
                    <span className="text-blue-600 dark:text-blue-400">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-gray-200 dark:border-white/5 shadow-inner">
                    <div
                      style={{ width: `${project.progress || 0}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(project.status)} transition-all duration-500`}
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 relative z-10 text-xs gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <IndianRupee size={12} />
                    {formatBudget(project.budget)}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar size={12} />
                    {project.timeline || '—'}
                  </span>
                  {project.adminNotes && (
                    <p className="w-full text-[11px] text-blue-600 dark:text-blue-400 font-semibold italic mt-1">
                      Admin note: {project.adminNotes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientProjects;
