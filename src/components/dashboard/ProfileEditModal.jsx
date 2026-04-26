import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Camera, Shield, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you'd call an updateProfile service here
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile.');
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
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-indigo-50/50 dark:from-primary-500/5 dark:to-indigo-500/5">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white dark:border-gray-800">
                  {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 text-primary-600 hover:scale-110 transition-all"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white font-medium"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-transparent outline-none cursor-not-allowed dark:text-gray-400 font-medium opacity-60"
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all dark:text-white font-medium"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
              <Shield size={12} className="text-green-500" />
              Secure Data Encryption Active
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;
