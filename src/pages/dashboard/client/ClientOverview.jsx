import { useState, useEffect } from 'react';
// Removed framer-motion
import {
  Briefcase, Clock, CheckCircle, MessageSquare,
  TrendingUp, AlertCircle, FileText, ArrowRight,
  Star, Zap, Shield, Calendar, Users, DollarSign,
  Activity, Award, Sparkles, ChevronRight, Search, Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ProfileEditModal from '../../../components/dashboard/ProfileEditModal';
import { useAuth } from '../../../context/AuthContext';
import { getMyProjects, getProjectStats } from '../../../services/clientService';

const ClientOverview = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ── Source of Truth: MongoDB only — no localStorage mixing ──────────
        const [projRes, statsRes] = await Promise.all([
          getMyProjects().catch(() => ({ projects: [], data: [] })),
          getProjectStats().catch(() => ({ stats: null }))
        ]);

        const apiProjs = projRes.projects || projRes.data || [];
        setProjects(apiProjs);

        // Use server-side stats if available; fall back to client-side from project list
        if (statsRes?.stats) {
          setStats(statsRes.stats);
        } else {
          // Fallback: compute from project list (no localStorage)
          const s = {
            totalProjects: apiProjs.length,
            inReview: apiProjs.filter(p => p.status === 'In Review').length,
            approved: apiProjs.filter(p => p.status === 'Approved').length,
            inProgress: apiProjs.filter(p => p.status === 'In Progress').length,
            completed: apiProjs.filter(p => p.status === 'Completed').length,
            totalBudget: apiProjs.reduce((sum, p) => sum + (p.budget || 0), 0),
            activeProjects: apiProjs.filter(p => !['Completed', 'Rejected'].includes(p.status)).length,
          };
          setStats(s);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use server-side stats; fall back gracefully while loading
  const activeProjects = stats?.activeProjects ?? projects.filter(p => !['Completed', 'Rejected'].includes(p.status)).length;
  const completedProjects = stats?.completed ?? projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = stats?.inProgress ?? projects.filter(p => p.status === 'In Progress').length;
  const inReviewProjects = stats?.inReview ?? projects.filter(p => p.status === 'In Review').length;
  const totalBudget = stats?.totalBudget ?? projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const completionRate = stats?.totalProjects > 0
    ? Math.round((completedProjects / stats.totalProjects) * 100)
    : 0;

  const statCards = [
    {
      label: 'Mission Load',
      value: loading ? '—' : activeProjects,
      icon: Briefcase,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Active Operations'
    },
    {
      label: 'Runtime',
      value: loading ? '—' : inProgressProjects,
      icon: Clock,
      gradient: 'from-purple-500 to-pink-500',
      description: 'In Progress'
    },
    {
      label: 'Archive',
      value: loading ? '—' : completedProjects,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Delivered Assets'
    },
    {
      label: 'Pending Review',
      value: loading ? '—' : inReviewProjects,
      icon: MessageSquare,
      gradient: 'from-orange-500 to-amber-500',
      description: 'Awaiting Admin'
    },
  ];


  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      'In Review': 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
      'Paused': 'text-gray-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10',
      'In Progress': 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      'Pending': 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
    };
    return colors[status] || 'text-blue-600 bg-blue-500/10';
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'WM';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <DashboardLayout role="client" title="Client Overview">
      <div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-[1400px] mx-auto space-y-10 selection:bg-blue-500/30"
      >
        {/* Welcome Banner */}
        <div
          variants={itemVariants}
          className="relative overflow-hidden premium-glass rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-white/10 group"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-60 -mt-60 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex-1">
              <div 
                
                
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
              >
                <Sparkles className="w-3 h-3" />
                Authorized Access Node
              </div>
              <h1
                className="text-3xl md:text-4xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white leading-none"
              >
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'there'}</span>! 👋
              </h1>
              <p
                className="text-gray-500 dark:text-gray-400 text-base font-bold max-w-xl leading-relaxed uppercase tracking-wide opacity-80"
              >
                Monitoring your digital infrastructure and project workstreams in real-time synchronization.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-5">
                <Link
                  to="/dashboard/client/submit"
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all flex items-center gap-3"
                >
                  New Requirement 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dashboard/client/projects"
                  className="px-10 py-5 bg-gray-100 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl"
                >
                  Project Library 
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div
              
              
              
              className="hidden xl:block relative"
            >
              <div className="absolute inset-0 bg-blue-600/30 blur-[100px] rounded-full animate-pulse" />
              <div className="relative w-48 h-48 bg-gradient-to-br from-gray-900 to-black dark:from-white/10 dark:to-white/5 rounded-[3.5rem] flex items-center justify-center shadow-2xl border border-white/10 rotate-6 group-hover:rotate-12 transition-transform duration-700">
                <Activity className="w-20 h-20 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              variants={itemVariants}
              
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative premium-glass rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 text-white`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 group-hover:text-blue-500 transition-colors">
                    <TrendingUp size={16} />
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter leading-none">
                    {loading ? (
                      <div className="w-16 h-12 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl" />
                    ) : (
                      String(stat.value).padStart(2, '0')
                    )}
                  </h3>
                  <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-1 uppercase tracking-widest group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Recent Projects */}
            <div variants={itemVariants} className="premium-glass rounded-[3.5rem] p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tighter">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    Active Workstreams
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-black uppercase tracking-[0.3em] ml-16">System Runtime Status</p>
                </div>
                <Link
                  to="/dashboard/client/projects"
                  className="px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all group shadow-xl"
                >
                  Browse Global
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-6 relative z-10">
                
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse border border-gray-200 dark:border-white/5" />
                    ))
                  ) : projects.length === 0 ? (
                    <div
                      
                      
                      className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10"
                    >
                      <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-white/10">
                        <Briefcase size={32} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Workstreams Idle</p>
                      <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest">Awaiting command uplink...</p>
                    </div>
                  ) : (
                    projects.slice(0, 3).map((project, i) => (
                      <div
                        key={project._id || i}
                        
                        
                        
                        
                        className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer group hover:shadow-2xl hover:border-blue-500/20"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{project.title}</h4>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                              <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                                <Users size={14} className="text-blue-600" />
                                {project.assignedTeam?.length || 0} Specialists
                              </span>
                              {project.deadline && (
                                <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                                  <Calendar size={14} className="text-indigo-600" />
                                  {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${getStatusColor(project.status)}`}>
                            {project.status}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Synchronization Progress</span>
                            <span className="text-blue-600 dark:text-blue-400">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-gray-200 dark:border-white/5">
                            <div
                              
                              
                              
                              className={`h-full rounded-full bg-gradient-to-r ${project.status === 'Completed' ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-indigo-600'} shadow-[0_0_15px_rgba(37,99,235,0.4)]`}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                
              </div>
            </div>

            {/* Recent Submissions */}
            <div variants={itemVariants} className="premium-glass rounded-[3.5rem] p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tighter">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    Ingestion Pipeline
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-black uppercase tracking-[0.3em] ml-16">Active Signals</p>
                </div>
              </div>

              <div className="space-y-4">
                
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse border border-gray-200 dark:border-white/5" />
                    ))
                  ) : projects.length === 0 ? (
                    <div
                      className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10"
                    >
                      <div className="w-20 h-20 bg-indigo-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/10">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Pipeline Empty</p>
                      <Link
                        to="/dashboard/client/submit"
                        className="inline-block mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                      >
                        Transmit New Signal
                      </Link>
                    </div>
                  ) : (
                    projects.slice(0, 5).map((project, i) => (
                      <div
                        key={project._id || i}
                        className="group flex items-center justify-between p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-500/20 transition-all cursor-pointer shadow-sm hover:shadow-xl"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 ${
                            project.status === 'Pending' || project.status === 'In Review' ? 'bg-orange-500/20 text-orange-500' :
                            project.status === 'Approved' || project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-500' :
                            project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-500'
                          }`}>
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 dark:text-white text-base tracking-tight group-hover:text-indigo-600 transition-colors">{project.title}</h4>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
                              <span className="flex items-center gap-2">
                                <Clock size={12} className="text-gray-400" />
                                {new Date(project.createdAt || project.updatedAt || Date.now()).toLocaleDateString()}
                              </span>
                              {project.budget && (
                                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                                  <DollarSign size={12} />
                                  ₹{project.budget.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    ))
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-10">
            {/* Portfolio Status Card */}
            <div variants={itemVariants} className="relative overflow-hidden premium-glass rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/10 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700 -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] -ml-24 -mb-24" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl text-white">
                    <Award size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">Portfolio Node</h3>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Asset Distribution</p>
                  </div>
                </div>

                <div className="space-y-8 mb-10">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-4">
                      <span className="text-gray-400 dark:text-gray-500">Operational Yield</span>
                      <span className="text-blue-600 dark:text-white">{completionRate}% SUCCESS</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 border border-gray-200 dark:border-white/5 overflow-hidden shadow-inner">
                      <div
                        
                        
                        
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                      <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{activeProjects}</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivered</span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{completedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Stake</span>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-500 tracking-tighter">₹{totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/dashboard/client/projects"
                  className="block w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 dark:text-gray-900 text-white text-center font-black text-[10px] uppercase tracking-widest rounded-3xl hover:shadow-2xl transition-all active:scale-95 shadow-xl"
                >
                  Global Analytics Hub
                </Link>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div variants={itemVariants} className="premium-glass rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">Command Node</h3>
              </div>

              <div className="space-y-4">
                {[
                  { to: "/dashboard/client/submit", icon: FileText, title: "Mission Uplink", desc: "Launch Operations", bg: "bg-blue-600/10", text: "text-blue-600" },
                  { to: "/dashboard/client/chat", icon: MessageSquare, title: "Direct Comms", desc: "Specialist Sync", bg: "bg-indigo-600/10", text: "text-indigo-600" },
                  { to: "/dashboard/client/payments", icon: DollarSign, title: "Ledger Access", desc: "Billing & Invoices", bg: "bg-emerald-600/10", text: "text-emerald-600" },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex items-center justify-between p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-blue-500/20 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl`}>
                        <action.icon className={`w-7 h-7 ${action.text}`} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white text-base tracking-tight">{action.title}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1">{action.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:translate-x-2 group-hover:text-blue-600 dark:group-hover:text-white transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Message */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3.5rem] p-10 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10">
                <h4 className="text-lg font-black text-white tracking-tighter mb-4 flex items-center gap-3">
                  <Shield size={24} />
                  Enterprise Secure
                </h4>
                <p className="text-[10px] font-black text-indigo-100 leading-relaxed uppercase tracking-[0.2em] mb-8 opacity-80">
                  Your organizational data is protected by WaveMind's advanced matrix encryption protocol.
                </p>
                <button className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest group">
                  Global Security Audit <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Overview Card */}
        <div 
          variants={itemVariants} 
          className="premium-glass rounded-[4rem] p-12 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -mr-60 -mt-60" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-3xl opacity-30" />
                <div className="relative w-32 h-32 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black border-4 border-white dark:border-white/20 rotate-3 group-hover:rotate-6 transition-transform shadow-2xl">
                  {initials}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter group-hover:text-blue-600 transition-colors">{user?.fullName || '…'}</h4>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="px-5 py-2 bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-blue-500/20 shadow-lg">Executive Node</span>
                  <span className="px-5 py-2 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-emerald-500/20 shadow-lg flex items-center gap-2">
                    <Shield size={12} /> Verified Entity
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3">Linked Uplink</p>
                <p className="text-lg font-black text-gray-700 dark:text-gray-300 tracking-tight">{user?.email || '…'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-3">Signal Contact</p>
                <p className="text-lg font-black text-gray-700 dark:text-gray-300 tracking-tight">{user?.phone || 'NOT LINKED'}</p>
              </div>
            </div>

            <button
              
              
              onClick={() => setIsProfileModalOpen(true)}
              className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95"
            >
              Update Credentials <Edit3 size={16} />
            </button>
          </div>
        </div>

        {/* Profile Edit Modal */}
        <ProfileEditModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientOverview;
