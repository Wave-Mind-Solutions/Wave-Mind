import { useState, useEffect } from 'react';
import {
  Users, Calendar, ArrowUpRight, Search, ChevronDown, ChevronUp,
  FileText, AlertCircle, CheckCircle2, Clock, Briefcase, Star,
  Mail, Phone, IndianRupee, Code, RefreshCw, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getClientRequests, getMyProjects } from '../../../services/devService';
import toast from 'react-hot-toast';

// ── Helpers ─────────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:   { label: 'Pending Review', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  'In Review': { label: 'In Review',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  Converted: { label: 'Project Active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  Rejected:  { label: 'Rejected',      color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const priorityConfig = {
  Extreme: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: '🔴' },
  High:    { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', icon: '🟠' },
  Medium:  { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '🔵' },
  Low:     { color: 'text-gray-400 bg-white/5 border-white/10', icon: '⚪' },
};

const projectStatusColor = {
  'Planning':    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'In Progress': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'In Review':   'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Completed':   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Paused':      'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

// ── Timeline Steps ───────────────────────────────────────────────────────────
const TimelineStep = ({ step, label, sublabel, done, active }) => (
  <div className="flex items-start gap-3 flex-1">
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
        done   ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
        active ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' :
                 'bg-white/5 border-white/10 text-gray-600'
      }`}>
        {done ? <CheckCircle2 size={16} /> : step}
      </div>
      <div className="w-px flex-1 bg-white/5 mt-1 min-h-[20px]" />
    </div>
    <div className="pb-4">
      <div className={`text-xs font-black ${done ? 'text-emerald-400' : active ? 'text-blue-400' : 'text-gray-600'}`}>{label}</div>
      {sublabel && <div className="text-[9px] text-gray-600 mt-0.5 font-medium">{sublabel}</div>}
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const DevClientRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getClientRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load client requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // Filter logic
  const filtered = requests.filter(({ project, requirement }) => {
    const term = search.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(term) ||
      (requirement?.title || '').toLowerCase().includes(term) ||
      (project.clientId?.fullName || '').toLowerCase().includes(term);

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && project.status === 'In Progress';
    if (filterStatus === 'completed') return matchesSearch && project.status === 'Completed';
    if (filterStatus === 'with-req') return matchesSearch && !!requirement;
    return matchesSearch;
  });

  // Pipeline stats
  const stats = {
    total: requests.length,
    withReq: requests.filter(r => r.requirement).length,
    active: requests.filter(r => r.project.status === 'In Progress').length,
    completed: requests.filter(r => r.project.status === 'Completed').length,
  };

  return (
    <DashboardLayout role="developer" title="Client Requests">
      <div className="space-y-7">

        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
                <Users size={22} className="text-white" />
              </div>
              Client Request Pipeline
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-medium ml-13">
              View original client requirements linked to your assigned projects. Read-only visibility into the client–admin–developer workflow.
            </p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects',       value: stats.total,     icon: Briefcase,   color: 'from-blue-600 to-indigo-600', glow: 'shadow-blue-600/20' },
            { label: 'With Requirements',    value: stats.withReq,   icon: FileText,    color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
            { label: 'Active Projects',       value: stats.active,    icon: Clock,       color: 'from-violet-600 to-purple-600', glow: 'shadow-violet-600/20' },
            { label: 'Completed Projects',    value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
          ].map((s, i) => (
            <div key={i} className="premium-glass rounded-2xl p-5 border border-white/10 flex items-center gap-4 group hover:-translate-y-0.5 transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg ${s.glow} group-hover:scale-110 transition-transform shrink-0`}>
                <s.icon size={20} />
              </div>
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{s.label}</div>
                <div className="text-xl font-black text-white">{loading ? '—' : s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by project, client, or requirement…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-sm font-medium"
            />
          </div>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Done' },
              { id: 'with-req', label: 'With Req.' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >{tab.label}</button>
            ))}
          </div>
          <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Request Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 premium-glass rounded-3xl border border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <AlertCircle size={36} className="text-gray-600" />
            </div>
            <div className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No requests found</div>
            <div className="text-sm text-gray-600 mt-2">
              {search ? 'Try a different search term.' : 'Client requests appear here once admin assigns you to a project.'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(({ project, requirement }) => {
              const isExpanded = expandedId === project._id;
              const reqStatus = statusConfig[requirement?.status] || statusConfig.Pending;
              const priority = priorityConfig[requirement?.priority] || priorityConfig.Medium;

              return (
                <div
                  key={project._id}
                  className={`premium-glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.1)]' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Card Header — always visible */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : project._id)}
                    className="w-full p-5 text-left"
                  >
                    <div className="flex items-start gap-4 flex-wrap">
                      {/* Client Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-blue-600/20 shrink-0">
                        {project.clientId?.fullName?.[0]?.toUpperCase() || 'C'}
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="text-base font-black text-white tracking-tight">{project.title}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[10px] text-gray-500 font-medium">
                                {project.clientId?.fullName || 'Client'} · Requested {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${projectStatusColor[project.status] || 'text-gray-400 bg-white/5 border-white/10'}`}>
                              {project.status}
                            </span>
                            {requirement && (
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${priority.color}`}>
                                {priority.icon} {requirement.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick facts row */}
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          {project.deadline && (
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                              <Calendar size={12} className="text-blue-400" />
                              Deadline: {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                          {requirement?.budget > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-black">
                              <IndianRupee size={11} />
                              {requirement.budget.toLocaleString()}
                            </div>
                          )}
                          {!requirement && (
                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
                              No requirement attached
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-blue-400 w-10 text-right">{project.progress}%</span>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 transition-all shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-5 pb-7 border-t border-white/5">
                      <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left: Client & Requirement */}
                        <div className="space-y-6">
                          {/* Client Info */}
                          <div>
                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <Users size={12} /> Client Information
                            </div>
                            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                                  {project.clientId?.fullName?.[0]?.toUpperCase() || 'C'}
                                </div>
                                <div>
                                  <div className="text-sm font-black text-white">{project.clientId?.fullName || 'Unknown Client'}</div>
                                  <div className="text-[9px] text-gray-500 mt-0.5">Project Client</div>
                                </div>
                              </div>
                              {project.clientId?.email && (
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                  <Mail size={12} className="text-blue-400 shrink-0" />
                                  <span>{project.clientId.email}</span>
                                </div>
                              )}
                              {project.clientId?.phone && (
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                  <Phone size={12} className="text-emerald-400 shrink-0" />
                                  <span>{project.clientId.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Original Requirement */}
                          {requirement ? (
                            <div>
                              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <FileText size={12} /> Original Client Request
                              </div>
                              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 space-y-4">
                                <div>
                                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Request Title</div>
                                  <div className="text-sm font-black text-white">{requirement.title}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Description</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">{requirement.description}</div>
                                </div>
                                {requirement.adminNotes && (
                                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
                                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Admin Notes</div>
                                    <div className="text-xs text-gray-400">{requirement.adminNotes}</div>
                                  </div>
                                )}
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${reqStatus.color}`}>
                                    {reqStatus.label}
                                  </span>
                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${priority.color}`}>
                                    {requirement.priority} Priority
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-dashed border-white/10 text-center">
                              <FileText size={28} className="text-gray-700 mx-auto mb-3" />
                              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Requirement Attached</div>
                              <div className="text-[9px] text-gray-700 mt-1">This project was created without a formal requirement document.</div>
                            </div>
                          )}
                        </div>

                        {/* Right: Project Pipeline + Budget */}
                        <div className="space-y-6">
                          {/* Pipeline Timeline */}
                          <div>
                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <ArrowUpRight size={12} /> Request Pipeline
                            </div>
                            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                              <div className="space-y-0">
                                <TimelineStep
                                  step="1" label="Client Submitted Request"
                                  sublabel={requirement ? new Date(requirement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                  done={!!requirement} active={!requirement}
                                />
                                <TimelineStep
                                  step="2" label="Admin Reviewed & Approved"
                                  sublabel={requirement?.status === 'Converted' ? 'Requirement converted to project' : requirement?.status || 'Pending review'}
                                  done={requirement?.status === 'Converted'}
                                  active={requirement?.status === 'In Review'}
                                />
                                <TimelineStep
                                  step="3" label="Project Created & Assigned"
                                  sublabel={new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  done={true} active={false}
                                />
                                <TimelineStep
                                  step="4" label="Development In Progress"
                                  sublabel={`${project.progress}% complete`}
                                  done={project.status === 'Completed'}
                                  active={project.status === 'In Progress'}
                                />
                                <TimelineStep
                                  step="5" label="Project Delivered"
                                  sublabel={project.status === 'Completed' ? 'Successfully delivered' : 'Pending completion'}
                                  done={project.status === 'Completed'}
                                  active={false}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Budget & Tech Stack */}
                          {requirement && (
                            <div className="space-y-4">
                              {requirement.budget > 0 && (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Project Budget</div>
                                  <div className="text-2xl font-black text-emerald-400">₹{requirement.budget.toLocaleString()}</div>
                                  <div className="text-[9px] text-emerald-500/60 mt-0.5">Client's approved budget</div>
                                </div>
                              )}

                              {requirement.techStack?.length > 0 && (
                                <div>
                                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Code size={12} /> Requested Tech Stack
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {requirement.techStack.map(t => (
                                      <span key={t} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:border-white/20 transition-colors">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex gap-3 pt-2">
                            <Link
                              to="/dashboard/dev/chat"
                              className="flex-1 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                            >
                              <MessageSquare size={14} /> Chat
                            </Link>
                            <Link
                              to="/dashboard/dev/projects"
                              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                            >
                              <Briefcase size={14} /> Projects
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DevClientRequests;
