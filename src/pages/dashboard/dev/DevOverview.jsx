import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Briefcase, CheckCircle, Clock, FileText, Upload, AlertCircle, Code,
  Image as ImageIcon, CheckCircle2, Circle, Timer, X, ChevronRight,
  TrendingUp, Zap, Activity, Bell, Star, Users, Calendar, BarChart2,
  ArrowUpRight, Download, RefreshCw, MessageSquare, FileCode, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyTasks, updateTaskStatus, getMyDeliverables, uploadDeliverable,
  getMyProjects, getDashboardStats, getClientRequests
} from '../../../services/devService';
import { logTime } from '../../../services/timeService';
import toast from 'react-hot-toast';

// ─── Urgency helpers ────────────────────────────────────────────────────────
const getUrgency = (deadline, status) => {
  if (status === 'Completed') return null;
  if (!deadline) return null;
  const diff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'overdue';
  if (diff < 1) return 'today';
  if (diff < 3) return 'soon';
  return null;
};

const urgencyConfig = {
  overdue: { label: 'OVERDUE', color: 'text-red-400 bg-red-500/10 border-red-500/30', dot: 'bg-red-500' },
  today:   { label: 'DUE TODAY', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-500' },
  soon:    { label: 'DUE SOON', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500' },
};

const priorityConfig = {
  Extreme: 'text-red-400 bg-red-500/10 border-red-500/20',
  High:    'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Medium:  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Low:     'text-gray-400 bg-white/5 border-white/10',
};

// ─── Sub-components ─────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, gradient, glow, loading }) => (
  <div className={`p-6 premium-glass rounded-2xl border border-white/10 shadow-2xl flex items-center gap-5 group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}>
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white ${glow} group-hover:scale-110 transition-transform duration-500 shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5">{label}</div>
      <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
        {loading ? <div className="w-12 h-6 bg-white/10 rounded animate-pulse" /> : value}
      </div>
      {sub && <div className="text-[9px] text-gray-600 mt-0.5 font-medium">{sub}</div>}
    </div>
  </div>
);

const UrgencyBanner = ({ tasks }) => {
  const urgent = tasks.filter(t => getUrgency(t.deadline, t.status));
  if (!urgent.length) return null;
  const overdue = urgent.filter(t => getUrgency(t.deadline, t.status) === 'overdue').length;
  const today   = urgent.filter(t => getUrgency(t.deadline, t.status) === 'today').length;
  return (
    <div className="premium-glass rounded-2xl border border-red-500/20 p-5 bg-red-500/5 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <AlertCircle size={20} className="text-red-400" />
        </div>
        <div>
          <div className="text-sm font-black text-red-400">Attention Required</div>
          <div className="text-[10px] text-gray-500 font-medium">
            {overdue > 0 && `${overdue} overdue`}{overdue > 0 && today > 0 && ' · '}{today > 0 && `${today} due today`}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 ml-2">
        {urgent.slice(0, 4).map(t => {
          const u = getUrgency(t.deadline, t.status);
          const cfg = urgencyConfig[u];
          return (
            <span key={t._id} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
              {t.title.length > 20 ? t.title.slice(0, 20) + '…' : t.title}
            </span>
          );
        })}
        {urgent.length > 4 && <span className="px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 bg-white/5 border border-white/10">+{urgent.length - 4} more</span>}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const DevOverview = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [clientRequests, setClientRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadModal, setUploadModal] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileType, setFileType] = useState('code');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [timeModal, setTimeModal] = useState(null);
  const [logHours, setLogHours] = useState('');
  const [logDescription, setLogDescription] = useState('');
  const [loggingTime, setLoggingTime] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-progress' | 'overdue'
  const [clientReqOpen, setClientReqOpen] = useState(null);

  // Real-time notification state
  const [newNotifications, setNewNotifications] = useState([]);

  const fetchAll = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [taskRes, delRes, projRes, statsRes, crRes] = await Promise.all([
        getMyTasks(),
        getMyDeliverables(),
        getMyProjects(),
        getDashboardStats(),
        getClientRequests(),
      ]);
      setTasks(taskRes.data || []);
      setDeliverables(delRes.data || []);
      setProjects(projRes.data || []);
      setStats(statsRes.data || null);
      setClientRequests(crRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Socket listener for real-time task_assigned notification
  useEffect(() => {
    const trySocket = async () => {
      try {
        const { default: SocketService } = await import('../../../services/SocketService');
        const socket = SocketService.getSocket?.();
        if (!socket) return;
        const handler = (data) => {
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#1e293b] border border-blue-500/30 shadow-2xl rounded-2xl p-4 flex gap-3 items-start`}>
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
                <Bell size={18} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm">New Task Assigned</p>
                <p className="text-xs text-gray-400 mt-0.5">{data?.message || 'A new task has been assigned to you.'}</p>
              </div>
            </div>
          ), { duration: 6000 });
          setNewNotifications(prev => [{ id: Date.now(), ...data }, ...prev.slice(0, 9)]);
          fetchAll(true);
        };
        socket.on('task_assigned', handler);
        return () => socket.off('task_assigned', handler);
      } catch { /* Socket not available */ }
    };
    trySocket();
  }, [fetchAll]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      if (stats) {
        setStats(prev => ({
          ...prev,
          completed: status === 'Completed' ? prev.completed + 1 : prev.completed,
          inProgress: status === 'In Progress' ? prev.inProgress + 1 : prev.inProgress,
        }));
      }
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
      await uploadDeliverable(fd, setUploadProgress);
      toast.success('Deliverable uploaded successfully! 🚀');
      setUploadModal(null);
      setUploadFile(null);
      setUploadProgress(0);
      getMyDeliverables().then(res => setDeliverables(res.data || []));
    } catch { toast.error('Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleLogTime = async () => {
    if (!logHours || isNaN(logHours) || Number(logHours) <= 0) { toast.error('Please enter valid hours.'); return; }
    if (!logDescription.trim()) { toast.error('Please describe your work.'); return; }
    setLoggingTime(true);
    try {
      await logTime({ taskId: timeModal._id, hours: Number(logHours), description: logDescription.trim(), date: new Date(), billable: true });
      toast.success('Hours logged successfully! ⏱️');
      setTimeModal(null); setLogHours(''); setLogDescription('');
      fetchAll(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to log hours.'); }
    finally { setLoggingTime(false); }
  };

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 className="text-emerald-500" size={16} />;
    if (status === 'In Progress') return <Timer className="text-blue-500" size={16} />;
    return <Circle className="text-gray-500" size={16} />;
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'In Progress') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  // Filter tasks by active tab
  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'in-progress') return t.status === 'In Progress';
    if (activeTab === 'overdue') return getUrgency(t.deadline, t.status) === 'overdue';
    return true;
  });

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DV';
  const completionRate = stats?.totalTasks > 0 ? Math.round((stats.completed / stats.totalTasks) * 100) : 0;

  return (
    <DashboardLayout role="developer" title="Developer Dashboard">
      <div className="space-y-7">

        {/* Header Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-blue-400">{user?.fullName?.split(' ')[0] || 'Developer'}</span> 👋
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {stats && ` · ${stats.inProgress} task${stats.inProgress !== 1 ? 's' : ''} in progress`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {newNotifications.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                <Bell size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{newNotifications.length} new</span>
              </div>
            )}
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Syncing…' : 'Sync'}
            </button>
            <Link to="/dashboard/dev/tasks" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20">
              View All Tasks
            </Link>
          </div>
        </div>

        {/* Urgency Banner */}
        {!loading && <UrgencyBanner tasks={tasks} />}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Tasks"    value={stats?.totalTasks ?? '—'}        icon={Briefcase}   gradient="from-blue-600 to-indigo-600"    glow="shadow-[0_0_20px_rgba(37,99,235,0.3)]"   loading={loading} />
          <StatCard label="In Progress"    value={stats?.inProgress ?? '—'}        icon={Timer}       gradient="from-violet-600 to-purple-600"   glow="shadow-[0_0_20px_rgba(139,92,246,0.3)]"  loading={loading} />
          <StatCard label="Completed"      value={stats?.completed ?? '—'}         icon={CheckCircle2} gradient="from-emerald-500 to-teal-500"  glow="shadow-[0_0_20px_rgba(16,185,129,0.3)]"  loading={loading} />
          <StatCard label="Hours This Week" value={stats ? `${stats.totalHoursThisWeek}h` : '—'} icon={Clock} gradient="from-amber-500 to-orange-500" glow="shadow-[0_0_20px_rgba(245,158,11,0.3)]" loading={loading} />
          <StatCard label="Deliverables"   value={stats?.totalDeliverables ?? '—'} icon={Upload}      gradient="from-pink-500 to-rose-500"       glow="shadow-[0_0_20px_rgba(236,72,153,0.3)]"  loading={loading} />
          <StatCard
            label="Completion Rate" 
            value={loading ? '—' : `${completionRate}%`}
            sub={!loading && stats?.overdue > 0 ? `${stats.overdue} overdue` : undefined}
            icon={TrendingUp} gradient="from-cyan-500 to-blue-500" glow="shadow-[0_0_20px_rgba(6,182,212,0.3)]" loading={loading} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Task Management — Left Panel */}
          <div className="xl:col-span-8 space-y-5">

            {/* Projects Row */}
            {!loading && projects.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                  Active Projects ({projects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <button
                      key={project._id}
                      onClick={() => setSelectedProject(project)}
                      className="premium-glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all text-left group relative overflow-hidden hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-600/10 transition-all" />
                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black text-white group-hover:text-blue-400 transition-colors truncate">{project.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                            {project.clientId?.fullName || 'Client'} · {project.status}
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                          project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-white/5 text-gray-500 border-white/10'
                        }`}>{project.status}</div>
                      </div>
                      <div className="mt-4 space-y-1.5 relative z-10">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-blue-400">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Task Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 flex-wrap gap-3">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
                  Assigned Tasks ({tasks.length})
                </h2>
                {/* Tab filter */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'in-progress', label: 'In Progress' },
                    { id: 'overdue', label: 'Overdue' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >{tab.label}</button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16 premium-glass rounded-2xl border border-white/10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Briefcase size={28} className="text-gray-600" />
                  </div>
                  <div className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    {activeTab === 'all' ? 'No tasks assigned yet' : `No ${activeTab.replace('-', ' ')} tasks`}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTasks.map(task => {
                    const urgency = getUrgency(task.deadline, task.status);
                    return (
                      <div
                        key={task._id}
                        className={`premium-glass rounded-2xl border transition-all group ${
                          urgency === 'overdue' ? 'border-red-500/20 bg-red-500/5 hover:border-red-500/30' :
                          urgency === 'today'   ? 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/30' :
                          urgency === 'soon'    ? 'border-yellow-500/15 hover:border-yellow-500/20' :
                          'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="p-4 flex items-center gap-4 flex-wrap">
                          {/* Status icon */}
                          <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 shrink-0">
                            {getStatusIcon(task.status)}
                          </div>

                          {/* Task info */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-black tracking-tight ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white group-hover:text-blue-400'} transition-colors`}>
                              {task.title}
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              {task.projectId?.title && (
                                <button onClick={() => setSelectedProject(task.projectId)} className="text-[9px] text-indigo-400 font-black uppercase tracking-widest hover:text-white transition-colors">
                                  {task.projectId.title}
                                </button>
                              )}
                              {task.priority && (
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${priorityConfig[task.priority]}`}>
                                  {task.priority}
                                </span>
                              )}
                              {urgency && (
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${urgencyConfig[urgency].color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${urgencyConfig[urgency].dot}`} />
                                  {urgencyConfig[urgency].label}
                                </span>
                              )}
                              {task.deadline && (
                                <span className="text-[9px] text-gray-600 font-medium">
                                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Status selector */}
                            <select
                              value={task.status}
                              onChange={e => handleStatusChange(task._id, e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-black text-gray-400 outline-none uppercase tracking-widest focus:border-blue-500/50 transition-all cursor-pointer appearance-none"
                            >
                              {['Not Started', 'In Progress', 'Completed'].map(s => (
                                <option key={s} value={s} className="bg-[#0f172a] text-white">{s}</option>
                              ))}
                            </select>
                            {/* Log time */}
                            <button
                              onClick={() => setTimeModal(task)}
                              className="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-emerald-500/20 hover:border-emerald-500"
                              title="Log Time"
                            >
                              <Clock size={15} />
                            </button>
                            {/* Upload deliverable */}
                            <button
                              onClick={() => setUploadModal(task)}
                              className="w-9 h-9 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-blue-500/20 hover:border-blue-500"
                              title="Upload Deliverable"
                            >
                              <Upload size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-5">

            {/* Developer Profile Card */}
            <div className="premium-glass border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center gap-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl border-2 border-white/10 group-hover:scale-105 transition-transform duration-500">
                  {initials}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white tracking-tight">{user?.fullName || '…'}</h3>
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-500/20 capitalize">
                    {user?.developerType || 'Core Developer'}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2 font-medium">{user?.email}</div>
              </div>
              {/* Progress ring visualization */}
              {stats && (
                <div className="relative z-10 w-full bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    <span>Completion Rate</span>
                    <span className="text-emerald-400">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { label: 'Done', value: stats.completed, color: 'text-emerald-400' },
                      { label: 'Active', value: stats.inProgress, color: 'text-blue-400' },
                      { label: 'Pending', value: stats.notStarted, color: 'text-gray-400' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className={`text-base font-black ${s.color}`}>{s.value}</div>
                        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client Requests Panel */}
            <div className="premium-glass rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Users size={15} className="text-amber-400" />
                  </div>
                  Client Requests
                </h3>
                <Link to="/dashboard/dev/client-requests" className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-5 space-y-3">
                    {Array(2).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
                  </div>
                ) : clientRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No linked requests</div>
                    <div className="text-[9px] text-gray-700 mt-1">Client requests appear once admin assigns you to a project</div>
                  </div>
                ) : (
                  clientRequests.slice(0, 4).map(({ project, requirement }) => (
                    <button
                      key={project._id}
                      onClick={() => setClientReqOpen(clientReqOpen === project._id ? null : project._id)}
                      className="w-full p-4 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {project.clientId?.fullName?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black text-white truncate">{project.title}</div>
                          <div className="text-[9px] text-gray-500 mt-0.5">
                            {project.clientId?.fullName || 'Client'} · {project.status}
                          </div>
                          {clientReqOpen === project._id && requirement && (
                            <div className="mt-3 space-y-2 text-left">
                              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Client's Original Request</div>
                              <div className="text-[10px] text-gray-300 leading-relaxed line-clamp-3">{requirement.description}</div>
                              <div className="flex gap-2 flex-wrap mt-2">
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">
                                  Budget: ₹{(requirement.budget || 0).toLocaleString()}
                                </span>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded border ${priorityConfig[requirement.priority] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                                  {requirement.priority} Priority
                                </span>
                              </div>
                              {requirement.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {requirement.techStack.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-[8px] font-black uppercase rounded border border-white/10">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          {clientReqOpen === project._id && !requirement && (
                            <div className="mt-2 text-[9px] text-gray-600 italic">No original requirement attached to this project.</div>
                          )}
                        </div>
                        <ChevronRight size={14} className={`text-gray-600 transition-transform shrink-0 mt-1 ${clientReqOpen === project._id ? 'rotate-90' : ''}`} />
                      </div>
                    </button>
                  ))
                )}
              </div>
              {clientRequests.length > 4 && (
                <div className="p-3 border-t border-white/5">
                  <Link to="/dashboard/dev/client-requests" className="text-center block text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                    +{clientRequests.length - 4} more requests
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="premium-glass rounded-2xl border border-white/10 shadow-xl p-5">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Zap size={13} className="text-yellow-400" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Log Time', icon: Clock, color: 'emerald', action: () => tasks.length > 0 ? setTimeModal(tasks.find(t => t.status === 'In Progress') || tasks[0]) : toast('No tasks to log time for.') },
                  { label: 'Upload File', icon: Upload, color: 'blue', action: () => tasks.length > 0 ? setUploadModal(tasks.find(t => t.status === 'In Progress') || tasks[0]) : toast('No tasks to upload to.') },
                  { label: 'View Projects', icon: Briefcase, color: 'purple', link: '/dashboard/dev/projects' },
                  { label: 'View Chat', icon: MessageSquare, color: 'indigo', link: '/dashboard/dev/chat' },
                ].map((action) => {
                  const colorMap = {
                    emerald: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border-emerald-500/20 hover:border-emerald-500',
                    blue:    'bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border-blue-500/20 hover:border-blue-500',
                    purple:  'bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white border-purple-500/20 hover:border-purple-500',
                    indigo:  'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border-indigo-500/20 hover:border-indigo-500',
                  };
                  const Wrapper = action.link ? Link : 'button';
                  return (
                    <Wrapper
                      key={action.label}
                      to={action.link}
                      onClick={action.action}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center group ${colorMap[action.color]}`}
                    >
                      <action.icon size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{action.label}</span>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            {/* Recent Deliverables */}
            {deliverables.length > 0 && (
              <div className="premium-glass rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <FileCode size={15} className="text-rose-400" />
                    </div>
                    Recent Deliverables
                  </h3>
                  <Link to="/dashboard/dev/tools" className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
                    All →
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {deliverables.slice(0, 3).map(file => (
                    <div key={file._id} className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                        {file.fileType === 'code' ? <Code size={14} className="text-blue-400" /> :
                         file.fileType === 'design' ? <ImageIcon size={14} className="text-purple-400" /> :
                         <FileText size={14} className="text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-black text-white truncate">{file.fileName}</div>
                        <div className="text-[9px] text-gray-600 mt-0.5">{file.fileType} · {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                      <a href={file.fileUrl} target="_blank" rel="noreferrer"
                        className="w-7 h-7 bg-white/5 hover:bg-blue-600 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/5"
                      >
                        <Download size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Project Detail Modal ──────────────────────────────────────────── */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="premium-glass w-full max-w-2xl rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{selectedProject.title}</h3>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Project Details</div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Status</div>
                  <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">{selectedProject.status}</span>
                </div>
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Progress</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style={{ width: `${selectedProject.progress}%` }} />
                    </div>
                    <span className="text-sm font-black text-white">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Client</div>
                  <div className="text-sm font-black text-gray-300">{selectedProject.clientId?.fullName || 'N/A'}</div>
                  <div className="text-[9px] text-gray-600">{selectedProject.clientId?.email || ''}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Deadline</div>
                  <div className="text-sm font-black text-gray-300">
                    {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline set'}
                  </div>
                </div>
              </div>

              {selectedProject.description && (
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Description</div>
                  <div className="text-sm text-gray-400 leading-relaxed">{selectedProject.description}</div>
                </div>
              )}

              {selectedProject.budget > 0 && (
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Budget</div>
                  <div className="text-sm font-black text-emerald-400">₹{(selectedProject.budget || 0).toLocaleString()}</div>
                </div>
              )}

              {selectedProject.techStack?.length > 0 && (
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map(t => (
                      <span key={t} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks in this project */}
              {tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).length > 0 && (
                <div className="pt-5 border-t border-white/10">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Tasks in this Project</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.filter(t => (t.projectId?._id || t.projectId) === selectedProject._id).map(task => (
                      <div key={task._id} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between group/t hover:bg-white/[0.06] hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <div className={`text-xs font-black ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white'}`}>{task.title}</div>
                            <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-0.5">{task.status}</div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover/t:opacity-100 transition-all">
                          <button onClick={e => { e.stopPropagation(); setTimeModal(task); }} className="w-8 h-8 bg-white/5 text-emerald-500 rounded-lg border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><Clock size={13} /></button>
                          <button onClick={e => { e.stopPropagation(); setUploadModal(task); }} className="w-8 h-8 bg-white/5 text-blue-500 rounded-lg border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Upload size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final upload CTA */}
              <div className="pt-5 border-t border-white/10">
                <button
                  onClick={() => { setUploadModal({ title: 'Final Project Submission', projectId: selectedProject }); }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> Submit Final Deliverable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Modal ──────────────────────────────────────────────────── */}
      {uploadModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div onClick={() => { setUploadModal(null); setUploadFile(null); setUploadProgress(0); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="premium-glass w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />

            <div className="flex justify-between items-center mb-7 relative z-10">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center"><Upload className="text-blue-500" size={18} /></div>
                Upload Deliverable
              </h3>
              <button onClick={() => { setUploadModal(null); setUploadFile(null); setUploadProgress(0); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={16} /></button>
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Task / Project</div>
                <div className="text-sm font-black text-white">{uploadModal.title}</div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">File Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['code', 'design', 'report'].map(t => (
                    <button key={t} type="button" onClick={() => setFileType(t)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${fileType === t ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/20' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-gray-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="w-full border-2 border-dashed border-white/10 bg-white/[0.02] rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
                  <Upload size={24} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-gray-400 block group-hover:text-white transition-colors">
                    {uploadFile ? uploadFile.name : 'Click to Select File'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1 block">Max 100MB</span>
                </div>
                <input type="file" className="hidden" onChange={e => setUploadFile(e.target.files[0])} />
              </label>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-blue-400 uppercase tracking-widest">
                    <span>Uploading</span><span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleUpload(uploadModal._id, uploadModal.projectId?._id || uploadModal.projectId)}
                disabled={uploading || !uploadFile}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</> : <><Upload size={16} /> Upload File</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Time Log Modal ────────────────────────────────────────────────── */}
      {timeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div onClick={() => { setTimeModal(null); setLogHours(''); setLogDescription(''); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="premium-glass w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />

            <div className="flex justify-between items-center mb-7 relative z-10">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center"><Clock className="text-emerald-500" size={18} /></div>
                Log Hours
              </h3>
              <button onClick={() => { setTimeModal(null); setLogHours(''); setLogDescription(''); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10"><X size={16} /></button>
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Task</div>
                <div className="text-sm font-black text-white">{timeModal.title}</div>
                {timeModal.projectId?.title && <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">{timeModal.projectId.title}</div>}
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">Hours Worked</label>
                <input
                  type="number" step="0.25" min="0" placeholder="e.g. 2.5"
                  value={logHours} onChange={e => setLogHours(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">What did you work on?</label>
                <textarea
                  rows="3" placeholder="Describe your progress and work done..."
                  value={logDescription} onChange={e => setLogDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button onClick={handleLogTime} disabled={loggingTime}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loggingTime ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Logging…</> : <><Clock size={16} /> Record Hours</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DevOverview;
