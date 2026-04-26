import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, AlertCircle, PlusCircle, 
  RefreshCw, MessageSquare, Upload, ArrowRight
} from 'lucide-react';
import { getProjectTimeline } from '../../services/activityService';
import { format } from 'date-fns';

const ProjectTimeline = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!projectId) return;
      try {
        const res = await getProjectTimeline(projectId);
        setLogs(res.logs || []);
      } catch (err) {
        console.error('Error fetching timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [projectId]);

  const getTimelineIcon = (actionType) => {
    switch (actionType) {
      case 'CREATE': return <PlusCircle className="w-5 h-5 text-green-500" />;
      case 'UPDATE': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'STATUS_CHANGE': return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'UPLOAD': return <Upload className="w-5 h-5 text-orange-500" />;
      case 'COMMENT': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          Workstream Chronology
        </h3>
        <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl font-black uppercase tracking-widest animate-pulse">
          Live Sync
        </span>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-7 top-2 bottom-0 w-px bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent opacity-30" />

        <div className="space-y-10">
          <AnimatePresence mode='wait'>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-8 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shrink-0" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-5 bg-white/5 rounded-lg w-1/3" />
                    <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                  </div>
                </div>
              ))
            ) : logs.length === 0 ? (
              <div className="text-center py-16 bg-white/2 rounded-[2.5rem] border border-dashed border-white/10">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-700 opacity-50" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">No historical data found.</p>
                <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Awaiting system events...</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex gap-8 group"
                >
                  {/* Icon Container */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#1e293b] border border-white/10 shadow-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {getTimelineIcon(log.actionType)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 premium-glass p-7 rounded-[2rem] shadow-xl border border-white/5 group-hover:border-white/10 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                          {log.userId?.fullName || 'System Core'}
                        </span>
                        <span className="text-[9px] px-3 py-1 bg-white/5 text-gray-500 border border-white/5 rounded-lg font-black uppercase tracking-widest">
                          {log.actionType}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      {log.description}
                    </p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                        {log.metadata.status && (
                          <span className="text-[9px] bg-blue-600/10 text-blue-500 border border-blue-600/20 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-lg">
                            Status Influx: {log.metadata.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
