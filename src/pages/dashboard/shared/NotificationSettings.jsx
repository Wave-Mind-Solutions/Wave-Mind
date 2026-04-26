import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Mail, Clock, CheckCircle, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const NotificationSettings = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');

  const [settings, setSettings] = useState({
    projectUpdates: true,
    taskAssignments: true,
    meetingReminders: true,
    marketingEmails: false,
  });

  useEffect(() => {
    if (user?.notificationSettings) {
      setSettings(user.notificationSettings);
    }
  }, [user]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/settings`,
        { notificationSettings: settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(true);
        // Update local user context
        login(response.data.token || token, response.data.user);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <DashboardLayout role={user?.role} title="Security & Protocols">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-10"
      >
        <div className="premium-glass rounded-[3rem] p-10 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          
          <div className="flex items-center gap-6 mb-12 pb-10 border-b border-white/5 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Transmission Feed</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Configure your neural notification parameters</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Updates */}
              {[
                { key: 'projectUpdates', label: 'Operational Sync', desc: 'Sync state changes for active projects', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { key: 'taskAssignments', label: 'Task Allocation', desc: 'New sub-routine assignment alerts', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { key: 'meetingReminders', label: 'Temporal Drift', desc: 'Pre-sync alerts for scheduled meets', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { key: 'marketingEmails', label: 'Core Broadcasts', desc: 'System-wide feature deployments', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-500/10' }
              ].map((item) => (
                <motion.div key={item.key} variants={itemVariants} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-wider">{item.label}</p>
                        <p className="text-[10px] font-black text-gray-600 mt-1 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(item.key)}
                      className={`w-14 h-7 rounded-full transition-all relative ${settings[item.key] ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}
                    >
                      <motion.div
                        animate={{ x: settings[item.key] ? 32 : 4 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-xl"
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle className="w-5 h-5" /> {error}
              </motion.div>
            )}

            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 disabled:opacity-50 border border-blue-400/30"
              >
                {loading ? 'Encrypting...' : success ? <><CheckCircle className="w-5 h-5" /> Protocol Saved</> : <><Save className="w-5 h-5" /> Synchronize</>}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="premium-glass rounded-[3rem] p-10 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          
          <div className="flex items-center gap-6 mb-12 pb-10 border-b border-white/5 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-600/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Encryption Layer</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Multi-factor biometric simulation and link protection</p>
            </div>
          </div>

          <div className="relative z-10">
            {!user?.isTwoFactorEnabled ? (
              <div className="p-10 rounded-[2rem] bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all" />
                <h4 className="text-xl font-black text-white mb-4 tracking-tight">Identity Verification Disabled</h4>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-relaxed max-w-xl">Enhance your node security by requiring a secondary verification token during core synchronization.</p>
                <button 
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/2fa-setup`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setQrCode(res.data.qrCode);
                    setTwoFactorSecret(res.data.secret);
                    setShow2FAModal(true);
                  }}
                  className="mt-10 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all border border-indigo-400/30"
                >
                  Activate Secure Link
                </button>
              </div>
            ) : (
              <div className="p-10 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 shadow-2xl flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tight">Neural Shield Active</h4>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">High-integrity link established and monitored</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors border border-red-500/20 px-6 py-3 rounded-xl bg-red-500/5">Terminate Protocol</button>
              </div>
            )}
          </div>
        </div>

        {/* 2FA Verification Modal */}
        <AnimatePresence>
          {show2FAModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShow2FAModal(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="premium-glass w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative z-10 border border-white/10 overflow-hidden text-center"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight relative z-10">Neural Authentication</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-10 relative z-10">Scan the node token with your authenticator</p>
                
                <div className="flex justify-center mb-10 relative z-10">
                  <div className="p-4 bg-white rounded-[2rem] border-4 border-indigo-500/30 shadow-2xl group hover:scale-105 transition-transform duration-500">
                    <img src={qrCode} alt="QR Code" className="w-56 h-56 rounded-xl" />
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 text-left px-2">Verification Code</p>
                  <input 
                    type="text" 
                    placeholder="000 000"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                    className="w-full px-4 py-6 bg-white/5 border border-white/10 rounded-[1.5rem] mb-10 text-center text-3xl font-black text-white tracking-[0.5em] outline-none focus:border-indigo-500/50 transition-all placeholder-gray-800"
                  />
                </div>

                <div className="flex gap-4 relative z-10">
                  <button 
                    onClick={() => setShow2FAModal(false)}
                    className="flex-1 py-5 bg-white/5 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      await axios.post(`${import.meta.env.VITE_API_URL}/auth/2fa-enable`, {
                        token: twoFactorToken
                      }, { headers: { Authorization: `Bearer ${token}` } });
                      setShow2FAModal(false);
                      window.location.reload();
                    }}
                    className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all border border-indigo-400/30"
                  >
                    Verify Node
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
