import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, X, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TimeLoggingModal = ({ isOpen, onClose, taskId, taskTitle }) => {
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hours || !description) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      const token = localStorage.getItem('wm_token');
      await axios.post(`${import.meta.env.VITE_API_URL}/time/log`, {
        taskId,
        hours: parseFloat(hours),
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Time logged successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log time');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log Time</h3>
                <p className="text-xs text-gray-500">{taskTitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hours Worked</label>
              <input
                type="number"
                step="0.1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g., 2.5"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description of Work</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on?"
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-white resize-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Entry</>}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TimeLoggingModal;
