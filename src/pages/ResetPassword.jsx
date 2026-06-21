import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ChevronLeft, KeyRound, CheckCircle, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { resetPassword as resetPasswordAPI } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import SEOHead from '../components/SEOHead';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordAPI(token, password);
      setSuccess('Your password has been successfully reset.');
      toast.success('Password updated successfully! 🚀');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 premium-gradient-bg transition-colors duration-700 overflow-hidden">
      <SEOHead
        title="Reset Password – Complete Recovery"
        description="Establish your new secure password for WaveMind Solutions."
        canonicalPath="/reset-password"
        noIndex={true}
      />

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/backgrounds/auth-bg.png" 
            alt="Auth Background" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob animation-delay-4000" />
      </div>

      {/* Back Button */}
      <Link
        to="/login"
        className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-lg border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Back to Login</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <div className="relative rounded-[2.2rem] premium-glass shadow-2xl overflow-hidden p-8 md:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl overflow-hidden shadow-xl mb-6 group hover:rotate-6 transition-transform duration-500">
                <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">New <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Credentials</span></h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                Define a strong, secure new password for your account.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                      <input
                        type="password"
                        required
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirm' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                      <input
                        type="password"
                        required
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.4rem] text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10">Reset Password</span>
                        <KeyRound size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center gap-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                    <p className="text-emerald-500 text-sm font-semibold">
                      {success} Redirecting to login...
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-5 px-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.4rem] text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    Go to Login
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-blue-500" />
                WaveMind Security Protocol Active
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
