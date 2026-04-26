import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Briefcase, Users, Layers, TrendingUp, Play, ChevronRight, Filter, Clock, Edit3, MessageSquare, Globe, Smartphone, Cpu, Palette, X, Download, FileSpreadsheet, ArrowRight, Search, Star, Activity, CheckCircle, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ProjectTimeline from '../../../components/dashboard/ProjectTimeline';
import { getAllRequirements, getAllProjects, getDevelopers, updateProject as updateProjectAPI, convertRequirement } from '../../../services/adminService';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOverview = () => {
  const [requirements, setRequirements] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    Promise.all([getAllRequirements(), getAllProjects(), getDevelopers()])
      .then(([reqRes, projRes, devRes]) => {
        setRequirements(reqRes.data || []);
        setActiveProjects(projRes.data || []);
        setDevelopers(devRes.data || []);
      })
      .catch(err => { console.error(err); toast.error('Failed to load dashboard data.'); })
      .finally(() => setLoading(false));
  }, []);

  const handleConvert = async (req) => {
    setConverting(req._id);
    try {
      await convertRequirement({ requirementId: req._id, title: req.title, description: req.description, budget: req.budget, clientId: req.clientId?._id });
      toast.success(`"${req.title}" converted to project! ✅`);
      setRequirements(prev => prev.map(r => r._id === req._id ? { ...r, status: 'Converted' } : r));
      const updatedProjects = await getAllProjects();
      setActiveProjects(updatedProjects.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed.');
    } finally {
      setConverting(null);
    }
  };

  const handleProjectUpdate = async () => {
    if (!editingProject) return;
    try {
      await updateProjectAPI(editingProject._id, { status: editingProject.status, progress: editingProject.progress });
      setActiveProjects(prev => prev.map(p => p._id === editingProject._id ? editingProject : p));
      toast.success('Project updated successfully!');
      setEditingProject(null);
    } catch {
      toast.error('Update failed.');
    }
  };

  const pendingReqs = requirements.filter(r => r.status === 'Pending').length;
  const activeCount = activeProjects.filter(p => p.status !== 'Completed').length;

  const unitStats = [
    { role: 'Web Dev', icon: Globe, count: developers.filter(d => d.developerType === 'web').length, color: 'from-blue-500 to-cyan-500' },
    { role: 'App Dev', icon: Smartphone, count: developers.filter(d => d.developerType === 'app').length, color: 'from-purple-500 to-pink-500' },
    { role: 'AI Eng', icon: Cpu, count: developers.filter(d => d.developerType === 'ai').length, color: 'from-orange-500 to-amber-500' },
    { role: 'Designer', icon: Palette, count: developers.filter(d => d.developerType === 'designer').length, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <DashboardLayout role="admin" title="Admin Control Center">
      <div className="max-w-[1400px] mx-auto space-y-6 selection:bg-blue-500/30">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'System Queue', value: loading ? '—' : pendingReqs, icon: List, color: 'from-orange-500 to-amber-500', desc: 'Unassigned Requests' },
            { label: 'Active Streams', value: loading ? '—' : activeCount, icon: Briefcase, color: 'from-blue-600 to-indigo-600', desc: 'Running Projects' },
            { label: 'Leads Pipeline', value: 'VIEW', icon: Users, color: 'from-indigo-500 to-purple-600', desc: 'Chatbot Leads', link: '/dashboard/admin/leads' },
            { label: 'Growth Vector', value: loading ? '—' : requirements.length, icon: TrendingUp, color: 'from-purple-600 to-pink-600', desc: 'Total Pipeline' },
          ].map((stat, i) => (
            <Link key={i} to={stat.link || '#'}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                className="premium-glass rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden group cursor-pointer"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:opacity-20 transition-all`} />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-600 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${stat.color} bg-opacity-10 dark:bg-opacity-20 rounded-lg text-white font-black text-[10px] uppercase tracking-widest`}>
                      <TrendingUp size={12} />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Requirement Management */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <List size={20} className="text-orange-500" />
                  </div>
                  Client Requirements
                </h2>
                <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mt-1 ml-12">Pipeline Ingestion</p>
              </div>
              <Link to="/dashboard/admin/requirements" className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2 group">
                <Filter size={14} className="group-hover:rotate-12 transition-transform" /> Browse All
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse border border-gray-200 dark:border-white/5" />) :
               requirements.length === 0 ? (
                <div className="text-center py-20 premium-glass rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-xs">No active submissions</p>
                </div>
              ) : requirements.slice(0, 4).map((req, i) => (
                <motion.div 
                  key={req._id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedRequirement(req)}
                  className="premium-glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all group relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400 font-black text-lg shadow-inner group-hover:scale-105 transition-transform">
                          {req.clientId?.fullName?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-gray-900 dark:text-white text-base tracking-tight group-hover:text-blue-500 transition-colors">{req.title}</h4>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-lg ${
                            req.priority === 'Extreme' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            req.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          }`}>
                            {req.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                          <span className="text-blue-600 dark:text-blue-400">{req.clientId?.fullName || 'Unknown Client'}</span>
                          <span className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/5"><Layers size={12} className="text-indigo-500" /> {req.techStack?.slice(0, 2).join(', ') || 'Global Stack'}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">₹{(req.budget || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                        req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                        req.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/10'
                      }`}>
                        {req.status}
                      </span>
                      {req.status !== 'Converted' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleConvert(req); }} 
                          disabled={converting === req._id}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                          {converting === req._id ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play size={12} className="fill-white" />}
                          Initialize
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Project Monitoring Table */}
            <div className="pt-10 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <Briefcase size={20} className="text-blue-500" />
                    </div>
                    Active Monitoring
                  </h2>
                  <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mt-1 ml-12">Runtime Oversight</p>
                </div>
                <Link to="/dashboard/admin/projects" className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2 group">
                  <Globe size={14} className="group-hover:rotate-12 transition-transform" /> Global View
                </Link>
              </div>

              <div className="premium-glass border border-gray-100 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                        <th className="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Project Entity</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Real-time Status</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Timeline</th>
                        <th className="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {loading ? (
                        <tr><td colSpan={4} className="px-10 py-16 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Synchronizing Data...</td></tr>
                      ) : activeProjects.length === 0 ? (
                        <tr><td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-black uppercase tracking-widest">No Active Workstreams</td></tr>
                      ) : activeProjects.slice(0, 5).map((p) => (
                        <tr key={p._id} onClick={() => setSelectedProject(p)} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                          <td className="px-8 py-4">
                            <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight group-hover:text-blue-500 transition-colors">{p.title}</p>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-md text-[8px] font-black uppercase tracking-widest mt-1 inline-block border border-gray-200 dark:border-white/5">{p.clientId?.fullName || 'External Client'}</span>
                          </td>
                          <td className="px-8 py-4 min-w-[180px]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                                p.status === 'Paused' ? 'bg-red-500/10 text-red-500' : 
                                'bg-blue-500/10 text-blue-500'
                              }`}>
                                {p.status}
                              </span>
                              <span className="text-[9px] font-black text-gray-900 dark:text-white">{p.progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${p.progress}%` }} 
                                transition={{ duration: 1, ease: "circOut" }}
                                className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} shadow-[0_0_10px_rgba(37,99,235,0.3)]`} 
                              />
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                              <Clock size={12} className="text-blue-500" /> {p.deadline ? new Date(p.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '∞'}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <button onClick={(e) => { e.stopPropagation(); setEditingProject({ ...p }); }}
                              className="w-8 h-8 bg-gray-100 dark:bg-white/5 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-500 flex items-center justify-center transition-all group/btn shadow-md">
                              <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            {/* Specialist Units */}
            <div className="premium-glass rounded-3xl p-7 shadow-xl relative overflow-hidden border border-gray-100 dark:border-white/10 group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight"><Users className="text-blue-500" size={20} /> Specialist Units</h3>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1 ml-8">Operational Divisions</p>
                </div>
                <Link to="/dashboard/admin/team" className="px-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white text-[9px] font-black uppercase tracking-widest transition-all">Hub Access</Link>
              </div>

              <div className="grid grid-cols-2 gap-5 relative z-10">
                {unitStats.map((unit, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer group/unit shadow-lg"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${unit.color} flex items-center justify-center mb-4 shadow-xl group-hover/unit:scale-105 transition-transform`}>
                      <unit.icon size={20} className="text-white" />
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1 tracking-tight">{unit.role}</h4>
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-3">
                      <span>Deployment</span>
                      <span className="text-blue-500 dark:text-blue-400 font-black">{unit.count} Units</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Comms Link */}
            <div className="premium-glass p-7 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Direct Chat Hub</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-6 leading-relaxed uppercase tracking-wider">Execute high-priority synchronization across all organizational workstreams.</p>
                <Link to="/dashboard/admin/chat"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 group">
                  Activate Sync Hub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProject(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="premium-glass w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Oversight Update</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Project: {editingProject.title}</p>
                  </div>
                  <button onClick={() => setEditingProject(null)} className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-400 flex items-center justify-center transition-all"><X size={20} /></button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Progress</p>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">{editingProject.progress}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={editingProject.progress}
                      onChange={e => setEditingProject(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Status</p>
                    <select 
                      value={editingProject.status} 
                      onChange={e => setEditingProject(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-black text-gray-900 dark:text-white outline-none uppercase tracking-widest appearance-none focus:border-blue-500 transition-all"
                    >
                      {['Planning', 'In Progress', 'In Review', 'Completed', 'Paused'].map(s => <option key={s} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{s}</option>)}
                    </select>
                  </div>
                  
                  <button onClick={handleProjectUpdate}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                    Commit Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Requirement Detail Modal */}
      <AnimatePresence>
        {selectedRequirement && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRequirement(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="premium-glass w-full max-w-2xl rounded-[4rem] p-10 md:p-14 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40" />
              <div className="absolute top-0 right-0 p-8 relative z-10">
                <button onClick={() => setSelectedRequirement(null)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl text-gray-400 transition-all"><X size={24} /></button>
              </div>
              
              <div className="space-y-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-black shadow-inner">
                    {selectedRequirement.clientId?.fullName?.[0] || '?'}
                  </div>
                  <div>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-500 mb-3 inline-block border border-gray-100 dark:border-white/5">Requirement Detail</span>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">{selectedRequirement.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Budget</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{(selectedRequirement.budget || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Priority</p>
                    <p className={`text-xl font-black ${selectedRequirement.priority === 'Extreme' ? 'text-red-500' : 'text-orange-500'}`}>{selectedRequirement.priority}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Status</p>
                    <p className="text-xl font-black text-gray-700 dark:text-gray-400">{selectedRequirement.status}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase tracking-widest text-[10px] text-gray-500">Description Manifest</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-white/2 p-6 rounded-3xl border border-gray-100 dark:border-white/5 italic">{selectedRequirement.description}</p>
                </div>

                {selectedRequirement.techStack?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white text-[10px] uppercase tracking-widest text-gray-500">Technology Matrix</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequirement.techStack.map(tech => (
                        <span key={tech} className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-lg">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-10 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Entity Source</p>
                    <p className="font-black text-gray-900 dark:text-white tracking-tight">{selectedRequirement.clientId?.fullName}</p>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <Mail size={12} className="text-blue-500" />
                        {selectedRequirement.email || selectedRequirement.clientId?.email || '—'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <Phone size={12} className="text-blue-500" />
                        {selectedRequirement.phone || selectedRequirement.clientId?.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  {selectedRequirement.status !== 'Converted' && (
                    <button onClick={() => { handleConvert(selectedRequirement); setSelectedRequirement(null); }}
                      className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-600/40 transition-all flex items-center gap-3 active:scale-95">
                      Convert to Project <Play size={16} className="fill-white" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="premium-glass w-full max-w-2xl rounded-[4rem] p-10 md:p-14 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40" />
              <div className="absolute top-0 right-0 p-8 relative z-10">
                <button onClick={() => setSelectedProject(null)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl text-gray-400 transition-all"><X size={24} /></button>
              </div>
              
              <div className="space-y-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-bold shadow-inner">
                    <Briefcase size={36} />
                  </div>
                  <div>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-500 mb-3 inline-block border border-gray-100 dark:border-white/5">Project Details</span>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">{selectedProject.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Progress</p>
                    <p className="text-xl font-black text-blue-600 dark:text-blue-400">{selectedProject.progress}%</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Status</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{selectedProject.status}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Budget</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{(selectedProject.budget || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase tracking-widest text-[10px] text-gray-500">Description Manifest</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-white/2 p-6 rounded-3xl border border-gray-100 dark:border-white/5 italic">{selectedProject.description || 'No description provided.'}</p>
                </div>

                {selectedProject.assignedTeam?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white text-[10px] uppercase tracking-widest text-gray-500">Assigned Specialist Unit</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.assignedTeam.map(dev => (
                        <div key={dev._id} className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg">
                            {dev.fullName[0]}
                          </div>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">{dev.fullName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-10 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Operational Deadline</p>
                      <p className="font-black text-red-500 flex items-center gap-2 tracking-tight">
                        <Clock size={16} /> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Contact Details</p>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{selectedProject.email || selectedProject.clientId?.email || '—'}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{selectedProject.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={async () => {
                        const token = localStorage.getItem('wm_token');
                        window.open(`${import.meta.env.VITE_API_URL}/export/project/${selectedProject._id}/pdf?token=${token}`, '_blank');
                      }}
                      className="px-6 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-2 group"
                    >
                      <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Pull Asset
                    </button>
                    <button onClick={() => { setEditingProject({ ...selectedProject }); setSelectedProject(null); }}
                      className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 shadow-xl">
                      Sync Progress
                    </button>
                  </div>
                </div>

                {/* Project Timeline Section */}
                <div className="pt-10 border-t border-gray-100 dark:border-white/10">
                  <ProjectTimeline projectId={selectedProject._id} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminOverview;
