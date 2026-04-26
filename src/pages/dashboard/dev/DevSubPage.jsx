import { useState, useEffect } from 'react';
// Removed framer-motion
import { Briefcase, Terminal, Cpu, ChevronRight, Search, Clock, CheckCircle2, AlertCircle, Code, Upload, X, FileUp, IndianRupee, Globe, Smartphone, Palette } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getMyTasks, updateTaskStatus, uploadDeliverable, getMyDeliverables, getMyProjects } from '../../../services/devService';
import toast from 'react-hot-toast';

const DevSubPage = ({ title, type }) => {
  const [items, setItems] = useState([]);
  const [tasks, setTasks] = useState([]); // added for project-task link
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadModal, setUploadModal] = useState(null); // task object
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileType, setFileType] = useState('code');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'projects') {
          const [projRes, taskRes] = await Promise.all([getMyProjects(), getMyTasks()]);
          setItems(projRes.data || []);
          setTasks(taskRes.data || []);
        } else if (type === 'tasks') {
          const res = await getMyTasks();
          setItems(res.data || []);
        } else if (type === 'tools') {
          const res = await getMyDeliverables();
          setDeliverables(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      setItems(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      toast.success(`Task marked as "${status}"`);
    } catch {
      toast.error('Failed to update task.');
    }
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
      await uploadDeliverable(fd, setUploadProgress);
      toast.success('File uploaded successfully! 🚀');
      setUploadModal(null);
      setUploadFile(null);
      setUploadProgress(0);
      // Refresh deliverables
      const res = await getMyDeliverables();
      setDeliverables(res.data || []);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filtered = (type === 'projects' || type === 'tasks' ? items : deliverables).filter(item => {
    const term = search.toLowerCase();
    if (type === 'projects' || type === 'tasks') return item.title?.toLowerCase().includes(term) || item.projectId?.title?.toLowerCase().includes(term);
    return item.fileName?.toLowerCase().includes(term);
  });

  const statusColor = { 
    'Planning': 'text-blue-400 bg-blue-500/10 border-blue-500/20', 
    'In Progress': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', 
    'Completed': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
    'Paused': 'text-orange-400 bg-orange-500/10 border-orange-500/20' 
  };

  return (
    <DashboardLayout role="developer" title={title}>
      <div className="space-y-10 animate-fadeIn">
        
        {/* Search bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
          <div className="relative group w-full md:w-[450px]">
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="text" placeholder={`Scan for ${type}...`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-sm font-medium backdrop-blur-xl relative z-10"
            />
          </div>
          <div className="px-6 py-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-blue-500/20 shadow-lg">
            Active Nodes: {filtered.length}
          </div>
        </div>

        {/* Task / Deliverable List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div  
            className="text-center py-32 premium-glass rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                <AlertCircle size={48} className="text-gray-700" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Transmission Null</h3>
              <div className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">No synchronized {type} found in the current cycle</div>
            </div>
          </div>
        ) : type === 'projects' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((project, idx) => (
              <div key={project._id}   
                
                onClick={() => setSelectedProject(project)}
                className="premium-glass rounded-[3rem] p-10 border border-white/10 shadow-2xl flex flex-col gap-8 group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase size={28} />
                  </div>
                  <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${statusColor[project.status] || 'bg-white/5 text-gray-500 border-white/10'}`}>{project.status}</span>
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Partner: {project.clientId?.fullName || 'Protocol Restricted'}</div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <span>Synchronization</span><span className="text-blue-400">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div   className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <Clock size={16} className="text-blue-500" /> Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Continuous'}
                  </div>
                  <button className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-xl">
                    <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : type === 'tasks' ? (
          // Tasks View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((task, idx) => (
              <div key={task._id}   
                
                className="premium-glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-600/10 transition-all" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-blue-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform"><Terminal size={18} /></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operational Task</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-lg ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{task.status}</span>
                </div>
                
                <div className="relative z-10">
                   <h4 className="text-base font-black text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2">{task.title}</h4>
                  <div className="text-[10px] text-gray-500 font-black mt-2 uppercase tracking-[0.2em]">{task.projectId?.title || 'General Routine'}</div>
                </div>
                
                <div className="flex items-center gap-5 py-4 border-y border-white/5 my-2 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Termination Date</span>
                    <span className="text-xs font-black text-gray-300">{task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Eternal Flow'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[10px] font-black text-gray-400 outline-none uppercase tracking-[0.2em] focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {['Not Started', 'In Progress', 'Completed', 'On Hold'].map(s => <option key={s} value={s} className="bg-[#0f172a] text-white">{s}</option>)}
                  </select>
                  <button 
                    
                    
                    onClick={() => setUploadModal(task)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all border border-blue-500/50"
                  >
                    <Upload size={16} /> Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Deliverables (tools type)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filtered.map((file, idx) => (
              <div key={file._id}   
                
                className="premium-glass rounded-[3rem] p-10 border border-white/10 shadow-2xl flex flex-col gap-8 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Code size={28} />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 shadow-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-black border border-white/10">
                      {file.uploadedBy?.fullName?.split(' ').map(n=>n[0]).join('') || 'U'}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{file.uploadedBy?.fullName || 'Matrix System'}</span>
                  </div>
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-xl font-black text-white mb-2 truncate tracking-tight group-hover:text-blue-400 transition-colors">{file.fileName}</h3>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Project: {file.projectId?.title || 'Core Engine'}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Asset Metadata</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{file.fileType} • {new Date(file.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <a 
                    
                    
                    href={file.fileUrl} target="_blank" rel="noreferrer"
                    className="w-14 h-14 bg-white/5 border border-white/10 text-blue-500 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center justify-center group-hover:shadow-blue-600/20"
                  >
                    <Terminal size={22} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div    onClick={() => { setUploadModal(null); setUploadFile(null); setUploadProgress(0); }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <div   
              className="premium-glass w-full max-w-lg rounded-[3rem] p-12 md:p-16 shadow-2xl relative z-10 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h3 className="text-xl font-black text-white flex items-center gap-4 tracking-tight">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <FileUp size={24} className="text-blue-500" />
                  </div>
                  Asset Dispatch
                </h3>
                <button onClick={() => { setUploadModal(null); setUploadFile(null); setUploadProgress(0); }}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={20} /></button>
              </div>

              <div className="space-y-8 relative z-10">
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Operational Target</div>
                   <div className="text-base font-black text-white tracking-tight">{uploadModal.title}</div>
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

                <button
                  onClick={() => handleUpload(uploadModal._id, uploadModal.projectId?._id || uploadModal.projectId)}
                  disabled={uploading || !uploadFile}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Dispatching…</>
                  ) : (
                    <><FileUp size={18} /> Execute Transmission</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tools CTA */}
        {type === 'tools' && (
          <div 
            
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-600/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -mr-48 -mt-48" />
            <div className="relative z-10">
               <h3 className="text-xl font-black tracking-tight mb-2">New Payload Deployment</h3>
              <div className="text-blue-100 font-bold uppercase tracking-widest opacity-80 max-w-md text-xs">Submit mission critical assets to the primary command nexus.</div>
            </div>
            <button onClick={() => toast('Please select an active operation from your dashboard to dispatch assets.')}
              className="relative z-10 px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-50 transition-all flex items-center gap-4 group">
              <Upload size={18} className="group-hover:-translate-y-1 transition-transform" /> Execute Dispatch
            </button>
          </div>
        )}

        {/* Project Detail Modal */}
        
          {selectedProject && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <div    onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
              <div 
                 
                 
                
                className="premium-glass w-full max-w-2xl rounded-[3rem] p-12 md:p-16 shadow-2xl relative z-10 border border-white/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                
                <div className="flex justify-between items-center mb-12 relative z-10">
                  <div>
                     <h3 className="text-xl font-black text-white mb-2 tracking-tight">Mission Briefing</h3>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Operational Protocol Metadata</div>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={20} /></button>
                </div>

                <div className="space-y-10 relative z-10">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Operational Title</h4>
                     <div className="text-lg font-black text-white tracking-tight">{selectedProject.title}</div>
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
                      <div className="text-sm font-black text-gray-300 flex items-center gap-3"><Clock size={16} className="text-blue-500" /> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Active Flow'}</div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Valuation Index</h4>
                      <div className="text-sm font-black text-emerald-400 tracking-wide flex items-center gap-2"><IndianRupee size={16} /> {(selectedProject.budget || 0).toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Mission Objective</h4>
                    <div className="text-sm text-gray-400 leading-relaxed font-medium tracking-wide italic">{selectedProject.description || 'Primary objective: Deliver high-integrity code modules within the tactical framework.'}</div>
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

                  {/* Tasks Section */}
                  <div className="pt-10 border-t border-white/10">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Sub-Routine Registry</h4>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                      {tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).length > 0 ? (
                        tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).map(task => (
                          <div key={task._id} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group/task hover:bg-white/[0.06] hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${task.status === 'Completed' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'}`} />
                              <div>
                                 <div className={`text-sm font-black tracking-tight ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white'}`}>{task.title}</div>
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
                         <h4 className="text-base font-black tracking-tight mb-1">Final Deployment</h4>
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
        

      </div>
    </DashboardLayout>
  );
};

export default DevSubPage;
