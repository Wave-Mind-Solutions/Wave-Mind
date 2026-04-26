import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, AlertCircle, Users, Filter, ArrowRight, User, Search, Layout } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getMyProjects } from '../../../services/clientService';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMyProjects()
      .then(res => setProjects(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ['All', 'Planning', 'In Progress', 'In Review', 'Completed', 'Paused'];
  
  const filtered = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      'In Review': 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
      'Paused': 'text-gray-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10',
      'In Progress': 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      'Planning': 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
    };
    return colors[status] || 'text-blue-600 bg-blue-500/10';
  };

  return (
    <DashboardLayout role="client" title="My Projects">
      <div className="max-w-[1400px] mx-auto space-y-10 selection:bg-blue-500/30">
        
        {/* Portfolio Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div 
              
              
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Layout size={12} />
              Project Portfolio
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              Manage Your <span className="text-blue-600 dark:text-blue-500">Workstreams</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest max-w-xl opacity-80">
              Track real-time progress, manage deliverables, and synchronize with your assigned specialist units.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-80">
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
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center mb-10 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 mr-4">
            <Filter size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Stream Status</span>
          </div>
          {statuses.map(s => (
            <button 
              key={s} 
              
              
              onClick={() => setFilter(s)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border shadow-lg ${
                filter === s 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-blue-600/30' 
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div 
            
            
            className="text-center py-32 premium-glass rounded-[4rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-200 dark:border-white/10 shadow-xl">
                <Briefcase size={48} className="text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">No Workstreams Identified</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
                Adjust your filtration parameters or initiate a new mission requirement to populate your portfolio.
              </p>
              <Link to="/dashboard/client/submit" className="inline-block mt-10 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all">
                Submit New Signal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            
              {filtered.map((project, i) => (
                <div 
                  key={project._id || i}
                  
                  
                  
                  
                  
                  className="premium-glass rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden group flex flex-col gap-10 relative"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-[50px] -mr-20 -mt-20 group-hover:bg-blue-600/20 transition-all duration-700" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 text-white">
                      <Briefcase size={28} />
                    </div>
                    <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">{project.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-3 leading-relaxed opacity-80 uppercase tracking-wide text-[11px]">{project.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                      <span>Operational Efficiency</span>
                      <span className="text-blue-600 dark:text-blue-400">{project.progress}% SYNC</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden border border-gray-200 dark:border-white/5 shadow-inner">
                      <div
                        
                        
                        
                        className={`h-full rounded-full bg-gradient-to-r ${project.status === 'Completed' ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-indigo-600'} shadow-[0_0_15px_rgba(37,99,235,0.4)]`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/10 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {project.assignedTeam?.length > 0 ? (
                          project.assignedTeam.slice(0, 3).map((dev, idx) => (
                            <div key={idx} className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-gray-800 border-2 border-white dark:border-gray-950 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                              {dev.fullName?.[0] || 'D'}
                            </div>
                          ))
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-[10px] font-black text-gray-400">
                            ?
                          </div>
                        )}
                        {(project.assignedTeam?.length || 0) > 3 && (
                          <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-white dark:border-gray-950 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                            +{(project.assignedTeam?.length || 0) - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Units Assigned</span>
                    </div>
                    {project.deadline && (
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Node Expiration</span>
                        <span className="text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest">{new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  {project.status === 'Completed' && (
                    <div 
                      
                      
                      className="absolute bottom-6 right-10 flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-[0.3em] bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 shadow-2xl backdrop-blur-md"
                    >
                      <CheckCircle size={16} /> Archive Finalized
                    </div>
                  )}
                </div>
              ))}
            
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientProjects;
