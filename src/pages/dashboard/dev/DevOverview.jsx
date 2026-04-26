import { useState, useEffect } from 'react';
// Removed framer-motion
import { Briefcase, CheckCircle, Clock, FileCode, FileText, Upload, AlertCircle, Code, Image as ImageIcon, CheckCircle2, Circle, Timer, User, X, Globe, Smartphone, Cpu, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { getMyTasks, updateTaskStatus, getMyDeliverables } from '../../../services/devService';
import toast from 'react-hot-toast';

const DevOverview = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadModal, setUploadModal] = useState(null); // task object
  const [uploadFile, setUploadFile] = useState(null);
  const [fileType, setFileType] = useState('code');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([getMyTasks(), getMyDeliverables()])
      .then(([taskRes, delRes]) => {
        setTasks(taskRes.data || []);
        setDeliverables(delRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const upcomingDeadlines = tasks.filter(t => t.deadline && new Date(t.deadline) > new Date() && t.status !== 'Completed').length;

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      toast.success(`Task marked as "${status}"`);
    } catch { toast.error('Failed to update task.'); }
  };

  const handleUpload = async (taskId, projectId) => {
    if (!uploadFile) { toast.error('Please select a file.'); return; }
    setUploading(true);
    setUploadProgress(0);
    const fd = new FormData();
    fd.append('file', uploadFile);
    if (taskId) fd.append('taskId', taskId);
    if (projectId) fd.append('projectId', projectId);
    fd.append('fileType', fileType);
    try {
      await import('../../../services/devService').then(s => s.uploadDeliverable(fd, setUploadProgress));
      toast.success('File uploaded successfully! 🚀');
      setUploadModal(null);
      setUploadFile(null);
      setUploadProgress(0);
      // Refresh deliverables count/list
      getMyDeliverables().then(res => setDeliverables(res.data || []));
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 className="text-green-500" size={18} />;
    if (status === 'In Progress') return <Timer className="text-blue-500" size={18} />;
    return <Circle className="text-gray-300" size={18} />;
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    if (status === 'In Progress') return 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DV';

  return (
    <DashboardLayout role="developer" title="Developer Dashboard">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Matrix', value: loading ? '—' : String(tasks.length), icon: Briefcase, gradient: 'from-blue-600 to-indigo-600', glow: 'shadow-[0_0_30px_rgba(37,99,235,0.2)]' },
            { label: 'Units Delivered', value: loading ? '—' : `${completedTasks}/${tasks.length}`, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
            { label: 'Priority Signals', value: loading ? '—' : String(upcomingDeadlines), icon: AlertCircle, gradient: 'from-orange-500 to-rose-500', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]' },
          ].map((stat, i) => (
            <div key={i}   
              
              className="p-8 premium-glass rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-6 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white ${stat.glow} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Task Management */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <Briefcase className="text-blue-500 w-5 h-5" />
                  </div>
                  Assigned Operations
                </h2>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 ml-14">Active Workstreams</div>
              </div>
              <Link to="/dashboard/dev/projects" className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">View Full Log</Link>
            </div>

            {loading ? (
              <div className="space-y-6">{Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />)}</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-24 premium-glass rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Briefcase size={32} className="text-gray-700" />
                  </div>
                  <div className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">System Idle</div>
                  <div className="text-sm text-gray-500 mt-2">No active tasks assigned in the current cycle</div>
                </div>
              </div>
            ) : (
              <div className="premium-glass border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                <table className="w-full text-left relative z-10">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operational Unit</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Deadline</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Synchronization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">{getStatusIcon(task.status)}</div>
                            <div>
                              <span className={`text-lg font-black tracking-tight ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white group-hover:text-blue-400'} transition-colors`}>{task.title}</span>
                              {task.projectId?.title && (
                                <button 
                                  onClick={() => setSelectedProject(task.projectId)}
                                  className="block text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1.5 hover:text-white transition-colors"
                                >
                                  {task.projectId.title}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {['Not Started', 'In Progress', 'Completed'].map((s) => (
                              <button key={s} onClick={() => handleStatusChange(task._id, s)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${task.status === s ? getStatusColor(s) : 'bg-white/5 text-gray-600 border-white/5 hover:border-white/10 hover:text-gray-400'}`}>
                                {s === 'Completed' ? 'Synced' : s}
                              </button>
                            ))}
                            <button 
                              
                              
                              onClick={() => setUploadModal(task)}
                              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all border border-blue-500/50"
                              title="Upload Deliverable"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile card */}
            <div className="premium-glass border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-full" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl border-2 border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {initials}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight">{user?.fullName || '…'}</h3>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-500/20 capitalize">
                    {user?.developerType || 'Core Developer'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-4 font-medium lowercase tracking-wide group-hover:text-gray-400 transition-colors">{user?.email}</div>
              </div>
            </div>

            {/* Deliverables upload */}
            <div className="premium-glass rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 tracking-tight relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <Upload className="text-blue-500 w-5 h-5" />
                </div>
                Asset Repository
              </h3>
              
              <div className="grid grid-cols-1 gap-5 relative z-10">
                {[
                  { id: 'code', label: 'Source Modules', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { id: 'design', label: 'Visual Assets', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { id: 'reports', label: 'Technical Docs', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                ].map((type) => (
                  <div key={type.id} className="group/item bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${type.bg} flex items-center justify-center group-hover/item:scale-110 transition-transform`}>
                      <type.icon size={20} className={type.color} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/item:text-white transition-colors">{type.label}</div>
                      <div className="text-[9px] text-gray-600 font-bold uppercase mt-0.5">Encrypted Node</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/dashboard/dev/tools" className="relative z-10 block w-full mt-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1">
                Open Command Center
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Project Details Modal */}
      
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div 
               
               
               
              onClick={() => setSelectedProject(null)} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <div 
               
               
              
              className="premium-glass w-full max-w-2xl rounded-[3rem] p-12 md:p-16 shadow-2xl relative z-10 border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Mission Briefing</h3>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Assigned Protocol Metadata</div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={20} /></button>
              </div>

              <div className="space-y-10 relative z-10">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Operational Title</h4>
                  <div className="text-2xl font-black text-white tracking-tight">{selectedProject.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Current Status</h4>
                    <span className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">{selectedProject.status}</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Synchronization</h4>
                    <div className="flex items-center gap-5">
                      <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                      </div>
                      <span className="text-sm font-black text-white">{selectedProject.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Termination Date</h4>
                    <div className="text-sm font-black text-gray-300">{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline set'}</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Valuation</h4>
                    <div className="text-sm font-black text-emerald-400 tracking-wide">₹{(selectedProject.budget || 0).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Mission Objective</h4>
                  <div className="text-sm text-gray-400 leading-relaxed font-medium tracking-wide">{selectedProject.description || 'No detailed briefing available.'}</div>
                </div>

                {selectedProject.techStack?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Verified Tech Stack</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedProject.techStack.map(t => (
                        <span key={t} className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Tasks Section */}
                <div className="pt-10 border-t border-white/10">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Sub-Routine Registry</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                    {tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).length > 0 ? (
                      tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).map(task => (
                        <div key={task._id} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group/task hover:bg-white/[0.06] hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${task.status === 'Completed' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'}`} />
                            <div>
                              <div className={`text-base font-black tracking-tight ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white'}`}>{task.title}</div>
                              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">{task.status}</div>
                            </div>
                          </div>
                          <button 
                            
                            
                            onClick={(e) => { e.stopPropagation(); setUploadModal(task); }} 
                            className="w-10 h-10 bg-white/5 text-blue-500 rounded-xl border border-white/10 flex items-center justify-center opacity-0 group-hover/task:opacity-100 transition-all">
                            <Upload size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-dashed border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">No synchronized sub-routines</div>
                    )}
                  </div>
                </div>

                {/* Final Project Upload */}
                <div className="pt-10 border-t border-white/10">
                  <div 
                    
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-blue-600/20 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <h4 className="text-lg font-black tracking-tight mb-1">Final Deployment</h4>
                      <div className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-80">Submit complete project bundle</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setUploadModal({ title: 'Final Project Submission', projectId: selectedProject }); }}
                      className="relative z-10 px-8 py-3.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl">
                      Execute Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      
      
        {uploadModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <div    onClick={() => setUploadModal(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
             <div   
               className="premium-glass w-full max-w-lg rounded-[3rem] p-12 md:p-16 shadow-2xl relative z-10 border border-white/10 overflow-hidden"
             >
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
               
               <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
                   <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                     <Upload className="text-blue-500 w-6 h-6" />
                   </div>
                   Asset Dispatch
                 </h3>
                 <button onClick={() => setUploadModal(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={20} /></button>
               </div>

               <div className="space-y-8 relative z-10">
                 <div>
                   <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Operational Target</div>
                   <div className="text-lg font-black text-white tracking-tight">{uploadModal.title}</div>
                 </div>

                 <div>
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block">Classification</label>
                   <div className="grid grid-cols-3 gap-3">
                     {['code', 'design', 'report'].map(t => (
                       <button key={t} type="button" onClick={() => setFileType(t)}
                         className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${fileType === t ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/20' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-gray-400'}`}>
                         {t}
                       </button>
                     ))}
                   </div>
                 </div>

                 <label className="w-full border-2 border-dashed border-white/10 bg-white/[0.02] rounded-[2rem] p-10 flex flex-col items-center gap-5 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
                      <Upload size={32} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-black text-gray-400 block group-hover:text-white transition-colors">{uploadFile ? uploadFile.name : 'Select Node Payload'}</span>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1 block">Maximum 100MB per unit</span>
                    </div>
                    <input type="file" className="hidden" onChange={e => setUploadFile(e.target.files[0])} />
                 </label>

                 {uploadProgress > 0 && (
                   <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest">
                       <span>Uploading Payload</span>
                       <span>{uploadProgress}%</span>
                     </div>
                     <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                       <div   className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                     </div>
                   </div>
                 )}

                 <button onClick={() => handleUpload(uploadModal._id, uploadModal.projectId?._id || uploadModal.projectId)} disabled={uploading || !uploadFile}
                   className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed">
                   {uploading ? 'Dispatching...' : 'Execute Transmission'}
                 </button>
               </div>
             </div>
          </div>
        )}
      
    </DashboardLayout>
  );
};

export default DevOverview;
