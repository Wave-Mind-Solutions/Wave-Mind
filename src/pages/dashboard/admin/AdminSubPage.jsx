import { useState, useEffect } from 'react';
// Removed
import { 
  Briefcase, 
  List, 
  Users, 
  ChevronRight, 
  Filter, 
  Search, 
  Clock, 
  Globe, 
  Smartphone, 
  Cpu, 
  Palette, 
  CheckCircle, 
  AlertCircle,
  X,
  UserPlus,
  Zap,
  Download,
  Folder,
  FileCode,
  Layout,
  Activity,
  Shield,
  TrendingUp,
  FileText
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getAllRequirements, getAllProjects, getDevelopers, updateProject, assignTeam, getAllDeliverables, getLeads, exportLeadsExcel } from '../../../services/adminService';
import { getAllTimeEntries, approveTimeEntry } from '../../../services/timeService';
import toast from 'react-hot-toast';

const TYPE_ICON_MAP = { web: Globe, app: Smartphone, ai: Cpu, designer: Palette };
const TYPE_COLOR_MAP = { 
  web: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
  app: 'bg-purple-500/10 text-purple-500 border-purple-500/20', 
  ai: 'bg-orange-500/10 text-orange-500 border-orange-500/20', 
  designer: 'bg-pink-500/10 text-pink-500 border-pink-500/20' 
};

const AdminSubPage = ({ title, type }) => {
  const [items, setItems] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(null); // project object
  const [taskModal, setTaskModal] = useState(null); // project object
  const [newTask, setNewTask] = useState({ title: '', deadline: '', developerId: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedDevs, setSelectedDevs] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleApproveTime = async (id, status) => {
    try {
      await approveTimeEntry(id, status);
      setItems(prev => prev.map(item => item._id === id ? { ...item, status } : item));
      toast.success(`Time log marked as "${status}"`);
    } catch (err) {
      toast.error('Failed to update time log status.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (type === 'requirements') res = await getAllRequirements();
        else if (type === 'projects' || type === 'reports') res = await getAllProjects();
        else if (type === 'team') res = await getDevelopers();
        else if (type === 'assets') res = await getAllDeliverables();
        else if (type === 'leads') res = await getLeads();
        else if (type === 'time') res = await getAllTimeEntries();
        setItems(res?.data || []);

        if (type === 'projects' || type === 'reports') {
          const devRes = await getDevelopers();
          setDevelopers(devRes.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const icon = type === 'requirements' ? <List size={22} /> : type === 'projects' ? <Briefcase size={22} /> : <Users size={22} />;

  const filtered = items.filter(item => {
    const term = search.toLowerCase();
    if (type === 'requirements') return item.title?.toLowerCase().includes(term) || item.clientId?.fullName?.toLowerCase().includes(term);
    if (type === 'projects') return item.title?.toLowerCase().includes(term);
    if (type === 'team') return item.fullName?.toLowerCase().includes(term) || item.developerType?.toLowerCase().includes(term);
    if (type === 'assets') return item.fileName?.toLowerCase().includes(term) || item.projectId?.title?.toLowerCase().includes(term) || item.uploadedBy?.fullName?.toLowerCase().includes(term);
    if (type === 'leads') return item.name?.toLowerCase().includes(term) || item.contact?.toLowerCase().includes(term) || item.requirement?.toLowerCase().includes(term);
    if (type === 'time') return item.userId?.fullName?.toLowerCase().includes(term) || item.taskId?.title?.toLowerCase().includes(term) || item.projectId?.title?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term);
    return true;
  });

  const handleProjectUpdate = async () => {
    if (!editingProject) return;
    try {
      await updateProject(editingProject._id, { status: editingProject.status, progress: editingProject.progress });
      setItems(prev => prev.map(p => p._id === editingProject._id ? editingProject : p));
      toast.success('Project updated successfully!');
      setEditingProject(null);
    } catch {
      toast.error('Update failed.');
    }
  };

  const handleAssignTeam = async () => {
    if (selectedDevs.length === 0) {
      toast.error('Please select at least one developer.');
      return;
    }
    setBtnLoading(true);
    try {
      const res = await assignTeam({ projectId: assignModal._id, developerIds: selectedDevs });
      setItems(prev => prev.map(p => p._id === assignModal._id ? res.data : p));
      toast.success('Team assigned successfully! 🚀');
      setAssignModal(null);
      setSelectedDevs([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed.');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.developerId) {
      toast.error('Please fill in task title and assigned dev.');
      return;
    }
    setBtnLoading(true);
    try {
      const adminService = await import('../../../services/adminService');
      await adminService.createTask({
        projectId: taskModal._id,
        ...newTask
      });
      toast.success('Task created and assigned!');
      setTaskModal(null);
      setNewTask({ title: '', deadline: '', developerId: '' });
    } catch (err) {
      toast.error('Failed to create task.');
    } finally {
      setBtnLoading(false);
    }
  };

  const reqStatusColor = {
    'Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'In Review': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Converted': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <DashboardLayout role="admin" title={title}>
      <div className="max-w-[1400px] mx-auto space-y-6 selection:bg-blue-500/30">
        
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div 
              
              
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Layout size={12} />
              Administrative Interface
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              {title} <span className="text-blue-600 dark:text-blue-500">Control</span>
            </h1>
          </div>

          <div className="relative group w-full lg:w-[450px] flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder={`Scan ${type} stream...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-8 py-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500/50 transition-all text-sm font-black text-gray-900 dark:text-white placeholder:text-gray-400 tracking-wide uppercase tracking-[0.1em] shadow-sm"
              />
            </div>
            {type === 'leads' && (
              <button
                onClick={async () => {
                  try {
                    await exportLeadsExcel();
                    toast.success('Excel file downloaded! 📥');
                  } catch (err) {
                    toast.error('Export failed.');
                  }
                }}
                className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 shadow-lg active:scale-95"
              >
                <Download size={18} /> Download Excel
              </button>
            )}
          </div>
        </div>

        {/* Analytics Section for Reports */}
        {type === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div   className="premium-glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] -mr-16 -mt-16" />
              <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">Financial Velocity</h4>
              <div className="flex items-end gap-3 h-32 mb-8">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i}    className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl shadow-lg" />
                ))}
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">₹{(items.reduce((acc, curr) => acc + (curr.budget || 0), 0)).toLocaleString()}</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-4 flex items-center gap-2"><TrendingUp size={12}/> +12.4% Influx</p>
            </div>
            
            <div    className="premium-glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -mr-16 -mt-16" />
              <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">Workload Distribution</h4>
              <div className="space-y-6">
                {['Planning', 'In Progress', 'In Review', 'Completed'].map((s) => {
                  const count = items.filter(p => p.status === s).length;
                  const pct = items.length ? (count / items.length) * 100 : 0;
                  return (
                    <div key={s} className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-gray-400 dark:text-gray-500">{s}</span>
                        <span className="text-gray-900 dark:text-white">{count} Units</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/5">
                        <div    className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div    className="premium-glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-[40px] -mr-16 -mt-16" />
              <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">System Optimization</h4>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100 dark:text-white/5" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={364}    className="text-emerald-500" />
                  </svg>
                   <span className="absolute text-2xl font-black text-gray-900 dark:text-white tracking-tighter">85%</span>
                </div>
              </div>
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                <Zap size={14} className="text-yellow-500" /> Operational Efficiency
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-72 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 premium-glass rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
             <div className="relative z-10 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-200 dark:border-white/10 shadow-xl">
                  <Activity size={48} className="text-gray-300 dark:text-gray-700" />
                </div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase tracking-[0.05em]">Stream Idle</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
                  No operational data detected in the {type} frequency. Initialize a new uplink to populate this node.
                </p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item, idx) => {
              // Requirement card
              if (type === 'requirements') return (
                <div 
                  key={idx} 
                   
                   
                  
                  onClick={() => setSelectedDetail(item)}
                  
                  className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-8 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-blue-600/10 transition-all duration-700" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border ${reqStatusColor[item.status] || 'bg-gray-100 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">{item.title}</h3>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-6">Origin: {item.clientId?.fullName || 'External Entity'}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider line-clamp-3 leading-relaxed mb-6 opacity-80">{item.description}</p>
                  </div>

                  <div className="mt-auto space-y-6 relative z-10">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg">
                        ₹{(item.budget || 0).toLocaleString()}
                      </span>
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border ${
                        item.priority === 'Extreme' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10' : 
                        item.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                        'bg-gray-100 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/5'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(item.techStack || []).slice(0, 3).map(t => (
                        <span key={t} className="px-3 py-1.5 bg-white dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-xl text-[8px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 group-hover:border-blue-500/20 transition-colors">
                          {t}
                        </span>
                      ))}
                      {(item.techStack || []).length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 rounded-xl text-[8px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/5">
                          +{(item.techStack || []).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              // Project card
              if (type === 'projects' || type === 'reports') return (
                <div 
                  key={idx} 
                   
                   
                  
                  onClick={() => setSelectedDetail(item)}
                  
                  className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-8 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-indigo-600/10 transition-all duration-700" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <span className="px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                      {item.status}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">{item.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.assignedTeam?.length > 0 ? (
                        item.assignedTeam.slice(0, 3).map((dev, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl text-[8px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 group-hover:border-indigo-500/30 transition-colors">
                            {dev.fullName.split(' ')[0]}
                          </span>
                        ))
                      ) : (
                        <div className="px-4 py-2 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center gap-2">
                          <AlertCircle size={14} className="text-orange-500" />
                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Awaiting Unit Deployment</span>
                        </div>
                      )}
                      {(item.assignedTeam?.length || 0) > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 rounded-xl text-[8px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/5">
                          +{(item.assignedTeam?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                      <span>Workstream Velocity</span><span className="text-indigo-600 dark:text-indigo-400">{item.progress}% SYNC</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden border border-gray-200 dark:border-white/5 shadow-inner">
                      <div 
                         
                         
                        
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 relative z-10 pt-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingProject({ ...item }); }}
                      className="py-4 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 transition-all active:scale-95 shadow-md"
                    >
                      Sync
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAssignModal(item); setSelectedDevs(item.assignedTeam?.map(d => d._id) || []); }}
                      className="py-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
                    >
                      <UserPlus size={16} /> Team
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTaskModal(item); }}
                      className="py-4 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Zap size={16} /> Task
                    </button>
                  </div>
                </div>
              );

              // Team/Developer card
              if (type === 'team') {
                const DevIcon = TYPE_ICON_MAP[item.developerType] || Users;
                const colorClass = TYPE_COLOR_MAP[item.developerType] || 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10';
                return (
                  <div 
                    key={idx} 
                     
                     
                    
                    className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-8 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-blue-600/10 transition-all duration-700" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform border`}>
                        <DevIcon size={28} />
                      </div>
                      <span className="px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 shadow-xl flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Operational Node
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter group-hover:text-blue-600 transition-colors">{item.fullName}</h3>
                      <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{item.email}</p>
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="px-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center gap-5 group-hover:border-blue-500/30 transition-colors shadow-sm">
                        <div className={`p-2.5 rounded-xl ${colorClass} border`}>
                          <DevIcon size={18} />
                        </div>
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">{item.developerType || 'Specialist'} Infrastructure</span>
                      </div>
                      
                      <button className="w-full py-4 bg-gradient-to-r from-[#1e293b] to-[#0f172a] dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 group/btn shadow-md">
                        Operational Intel <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Asset/Deliverable card
              if (type === 'assets') return (
                <div 
                  key={idx} 
                   
                   
                  
                  className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-8 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-[60px] -mr-20 -mt-20" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Folder size={22} />
                    </div>
                    <span className="px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 shadow-xl">
                      {item.fileType?.toUpperCase() || 'DATA'} Asset
                    </span>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors truncate leading-tight">{item.fileName}</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                      <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] truncate">Vault: {item.projectId?.title || 'System Core'}</p>
                    </div>
                  </div>

                  <div className="relative z-10 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 flex items-center gap-4 shadow-sm group-hover:bg-gray-50 dark:group-hover:bg-white/10 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base font-black shadow-xl">
                      {item.uploadedBy?.fullName?.split(' ').map(n=>n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">Source Specialist</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.uploadedBy?.fullName || 'Root Admin'}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Timestamp</span>
                      <span className="text-xs font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <a href={item.fileUrl} target="_blank" rel="noreferrer"
                      className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:shadow-lg transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 shadow-md">
                      <Download size={18} /> Pull Asset
                    </a>
                  </div>
                </div>
              );

              // Lead card
              if (type === 'leads') return (
                <div 
                  key={idx} 
                  className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-8 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-blue-600/10 transition-all duration-700" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Users size={22} />
                    </div>
                    <span className="px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20 shadow-xl">
                      Lead Entity
                    </span>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">{item.name}</h3>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-6">Contact: {item.contact}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider line-clamp-3 leading-relaxed opacity-80">{item.requirement}</p>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Received On</span>
                      <span className="text-xs font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              );

              // Time Entry card
              if (type === 'time') return (
                <div 
                  key={idx} 
                  className="premium-glass rounded-3xl p-7 border border-gray-100 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex flex-col gap-6 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-emerald-600/10 transition-all duration-700" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Clock size={22} />
                    </div>
                    <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border ${
                      item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      item.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter group-hover:text-emerald-600 transition-colors leading-tight truncate">{item.taskId?.title || 'System Task'}</h3>
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4 truncate">Project: {item.projectId?.title || 'Core Nexus'}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider line-clamp-3 leading-relaxed mb-4 opacity-80">{item.description}</p>
                  </div>

                  <div className="relative z-10 p-5 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base font-black shadow-xl">
                        {item.userId?.fullName?.split(' ').map(n=>n[0]).join('') || 'DV'}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">Developer</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.userId?.fullName || 'Specialist Unit'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">Hours Logged</p>
                      <p className="text-base font-black text-emerald-500 tracking-tight">{item.hours} hrs</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Log Date</span>
                      <span className="text-xs font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {item.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveTime(item._id, 'Approved')}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-md"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleApproveTime(item._id, 'Rejected')}
                          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all active:scale-95 shadow-md"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
              return null;
            })}
          </div>
        )}

        {/* Assignment Modal */}
        
          {assignModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <div    onClick={() => setAssignModal(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
              <div   
                className="premium-glass w-full max-w-2xl rounded-[4rem] p-10 md:p-14 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                
                <div className="flex justify-between items-center mb-12 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 uppercase tracking-[0.05em]">Assemble Special Ops Team</h3>
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">Project: <span className="text-blue-600 dark:text-blue-400">{assignModal.title}</span></p>
                  </div>
                  <button onClick={() => setAssignModal(null)} className="w-14 h-14 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl text-gray-400 flex items-center justify-center transition-all"><X size={28} /></button>
                </div>

                <div className="space-y-10 relative z-10">
                  <div className="max-h-[450px] overflow-y-auto pr-6 space-y-4 custom-scrollbar">
                    {developers.map(dev => {
                      const DevIcon = TYPE_ICON_MAP[dev.developerType] || Users;
                      const isSelected = selectedDevs.includes(dev._id);
                      return (
                        <div 
                          key={dev._id} 
                          
                          onClick={() => {
                            if (isSelected) setSelectedDevs(prev => prev.filter(id => id !== dev._id));
                            else setSelectedDevs(prev => [...prev, dev._id]);
                          }}
                          className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between group shadow-sm ${isSelected ? 'bg-blue-600/10 border-blue-600/40 shadow-blue-600/5' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-blue-500/30'}`}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-2xl ${isSelected ? 'bg-blue-600 text-white border-white/20' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10 group-hover:text-blue-600'}`}>
                              <DevIcon size={28} />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 dark:text-white text-base tracking-tighter">{dev.fullName}</p>
                              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-1">{dev.developerType || 'Specialist'} UNIT</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div   className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white dark:border-gray-900">
                              <CheckCircle className="text-white" size={18} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-10 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-2">Team Config</span>
                      <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{selectedDevs.length} Units Active</span>
                    </div>
                    <button 
                      onClick={handleAssignTeam}
                      disabled={btnLoading}
                      className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl transition-all disabled:opacity-60 flex items-center gap-4 shadow-xl active:scale-95"
                    >
                      {btnLoading ? <span className="w-6 h-6 border-3 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" /> : <Zap size={20} className="fill-current" />}
                      Initialize Deployment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        

        {/* Detail View Modal */}
        
          {selectedDetail && (
            <div className="fixed inset-0 z-[105] flex items-center justify-center p-6">
              <div    onClick={() => setSelectedDetail(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
              <div   
                className="premium-glass w-full max-w-3xl rounded-[4rem] p-12 md:p-16 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-60 -mt-60" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-14">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-[0.05em]">{type === 'requirements' ? 'Data Ingestion' : 'Operational'} Intel</h3>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-3 ml-0.5">Configuration Manifest • Matrix Node V3</p>
                    </div>
                    <button onClick={() => setSelectedDetail(null)} className="w-16 h-16 hover:bg-gray-100 dark:hover:bg-white/10 rounded-[1.8rem] text-gray-400 flex items-center justify-center transition-all shadow-xl"><X size={32} /></button>
                  </div>
                  
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-4">Objective Identifier</h4>
                      <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{selectedDetail.title}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] shadow-sm">
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-6">Current Node Status</h4>
                        <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border ${type === 'requirements' ? reqStatusColor[selectedDetail.status] : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-indigo-600/5'}`}>
                          {selectedDetail.status}
                        </span>
                      </div>
                      <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] shadow-sm">
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-6">{type === 'requirements' ? 'Allocated Resource' : 'Operational Flux'}</h4>
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{type === 'requirements' ? `₹${(selectedDetail.budget || 0).toLocaleString()}` : `${selectedDetail.progress}% Sync`}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Description Manifest</h4>
                      <div className="p-10 bg-gray-50 dark:bg-black/20 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-inner">
                        <p className="text-base text-gray-600 dark:text-gray-400 font-bold leading-relaxed italic opacity-80 uppercase tracking-wide text-[13px]">{selectedDetail.description || 'No description manifest provided for this node.'}</p>
                      </div>
                    </div>

                    {(selectedDetail.techStack || []).length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Technology Stack Matrix</h4>
                        <div className="flex flex-wrap gap-4">
                          {selectedDetail.techStack.map(t => (
                            <span key={t} className="px-6 py-3 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-xl">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-12 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center text-3xl font-black shadow-2xl border-4 border-white dark:border-gray-900 rotate-3">
                          {selectedDetail.clientId?.fullName?.[0] || 'X'}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-2">Entity Source</h4>
                          <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{selectedDetail.clientId?.fullName || 'External Client'}</p>
                          <p className="text-xs font-black text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest">{selectedDetail.clientId?.email || ''}</p>
                        </div>
                      </div>
                      {type === 'projects' && (
                        <button onClick={() => { setSelectedDetail(null); setEditingProject({ ...selectedDetail }); }} className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl active:scale-95 transition-all shadow-xl">
                          Modify Parameters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        

        {/* Edit Project Modal */}
        
          {editingProject && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <div    onClick={() => setEditingProject(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
              <div   
                className="premium-glass w-full max-w-lg rounded-[4rem] p-12 md:p-16 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-[0.05em]">Modify Node</h3>
                    <button onClick={() => setEditingProject(null)} className="w-14 h-14 hover:bg-gray-100 dark:hover:bg-white/10 rounded-[1.8rem] text-gray-400 flex items-center justify-center transition-all"><X size={28} /></button>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <div className="flex justify-between mb-6">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">Runtime Progress</p>
                        <p className="text-xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{editingProject.progress}%</p>
                      </div>
                      <input type="range" min="0" max="100" value={editingProject.progress}
                        onChange={e => setEditingProject(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                        className="w-full h-2.5 bg-gray-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner" />
                    </div>
                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] ml-1">Operational Status</p>
                      <select 
                        value={editingProject.status} 
                        onChange={e => setEditingProject(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-sm font-black text-gray-900 dark:text-white outline-none focus:border-blue-500/50 transition-all uppercase tracking-[0.2em] appearance-none shadow-sm"
                      >
                        {['Planning', 'In Progress', 'In Review', 'Completed', 'Paused'].map(s => <option key={s} className="bg-white dark:bg-gray-900">{s}</option>)}
                      </select>
                    </div>
                    <button onClick={handleProjectUpdate}
                      className="w-full py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] hover:shadow-2xl active:scale-95 transition-all mt-6 shadow-xl">
                      Commit Node Modifications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        

        {/* Task Assignment Modal */}
        
          {taskModal && (
            <div className="fixed inset-0 z-[115] flex items-center justify-center p-6">
              <div    onClick={() => setTaskModal(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
              <div   
                className="premium-glass w-full max-w-lg rounded-[4rem] p-12 md:p-16 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-[0.05em]">Deploy Task Signal</h3>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">Specialist Unit Ingestion</p>
                    </div>
                    <button onClick={() => setTaskModal(null)} className="w-14 h-14 hover:bg-gray-100 dark:hover:bg-white/10 rounded-[1.8rem] text-gray-400 flex items-center justify-center transition-all shadow-xl"><X size={28} /></button>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] ml-2">Task Objective Identifier</label>
                      <input type="text" placeholder="e.g. CORE-SYSTEM-INITIALIZATION" value={newTask.title}
                        onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-sm font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:border-indigo-500/50 outline-none transition-all shadow-sm" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] ml-2">Assigned Specialist Unit</label>
                      <select value={newTask.developerId} onChange={e => setNewTask(prev => ({ ...prev, developerId: e.target.value }))}
                        className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-sm font-black text-gray-900 dark:text-white focus:border-indigo-500/50 outline-none appearance-none transition-all shadow-sm">
                        <option value="" className="bg-white dark:bg-gray-900">Select Specialist Node</option>
                        {(taskModal.assignedTeam || []).map(dev => (
                          <option key={dev._id} value={dev._id} className="bg-white dark:bg-gray-900">{dev.fullName} — {dev.developerType?.toUpperCase()} OPS</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] ml-2">Operational Deadline</label>
                      <input type="date" value={newTask.deadline} onChange={e => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-sm font-black text-gray-900 dark:text-white focus:border-indigo-500/50 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] shadow-sm" />
                    </div>

                    <button onClick={handleCreateTask} disabled={btnLoading}
                      className="w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6">
                      {btnLoading ? <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : 'Execute Signal Deployment 🚀'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        

      </div>
    </DashboardLayout>
  );
};

export default AdminSubPage;
