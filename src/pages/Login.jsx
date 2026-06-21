import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, ArrowRight, Shield, Zap, Users, Moon, Sun, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEOHead from '../components/SEOHead';

const ROLE_HOME = {
  client: '/dashboard/client',
  admin: '/dashboard/admin',
  developer: '/dashboard/dev',
};

const Login = () => {
  const navigate = useNavigate();
  const { login, saveSession } = useAuth();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // 2FA States
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      
      if (response.requires2FA) {
        setRequires2FA(true);
        setUserId(response.userId);
        toast.success('Two-factor authentication required.');
      } else if (response.requiresVerification && response.user?.role !== 'admin') {
        toast.error('Account not verified. Redirecting to verification...');
        localStorage.setItem('verify_email', response.email);
        navigate('/verify-otp', { state: { email: response.email } });
      } else {
        toast.success('Welcome back! Redirecting...');
        navigate(ROLE_HOME[response.user?.role] || '/dashboard/client');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-2fa-login', {
        userId,
        token: twoFactorToken
      });
      
      if (res.data.success) {
        saveSession(res.data.token, res.data.user);
        toast.success('Verification successful!');
        navigate(ROLE_HOME[res.data.user.role] || '/dashboard/client');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "Secure Access" },
    { icon: Zap, text: "Fast Portal" },
    { icon: Users, text: "Team Access" }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 premium-gradient-bg transition-colors duration-700 overflow-hidden">
      <SEOHead
        title="Login – Access Your Dashboard"
        description="Log in to your WaveMind Solutions dashboard. Manage projects, track progress, and collaborate with your development team."
        canonicalPath="/login"
        noIndex={true}
      />

      {/* Animated Background - Consistent with Home Page */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/backgrounds/auth-bg.png" 
            alt="Auth Background" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />

        {/* Animated Orbs - GPU Optimized */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] will-change-transform transform-gpu animate-blob animation-delay-4000" />
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-24 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-lg border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
      >
        <ArrowRight className="w-4 h-4 rotate-180 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Back</span>
      </Link>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl overflow-hidden shadow-xl mb-4 group hover:rotate-6 transition-transform duration-500">
            <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            WaveMind Solutions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <div className="relative rounded-[2.2rem] premium-glass shadow-2xl overflow-hidden p-8 md:p-10">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                {requires2FA ? <ShieldAlert className="w-3 h-3 text-red-500" /> : <Sparkles className="w-3 h-3 text-blue-500" />}
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  {requires2FA ? 'Security Verification' : 'Portal Access'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {requires2FA ? 'Enter Security Code' : 'Welcome Back'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {requires2FA ? 'Please enter the 6-digit code from your authenticator app.' : 'Enter credentials to enter your space'}
              </p>
            </div>

            {/* Forms */}
            {requires2FA ? (
              <form onSubmit={handle2FAVerify} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Authenticator Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    autoFocus
                    className="w-full px-6 py-5 rounded-3xl bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 text-center text-3xl font-black tracking-[1em] outline-none transition-all dark:text-white"
                    placeholder="000000"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || twoFactorToken.length !== 6}
                    className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.4rem] text-white font-bold text-base hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Verify & Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequires2FA(false)}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                    <input
                      type="email"
                      required
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Keep me logged in
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.4rem] text-white font-bold text-base hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Sign Into Portal</span>
                      <LogIn size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  )}
                </button>
              </form>
            )}



            <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                New here?{' '}
                <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 decoration-2">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-8 mt-10"
        >
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <f.icon size={14} className="text-blue-500" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{f.text}</span>
            </div>
          ))}
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

export default Login;