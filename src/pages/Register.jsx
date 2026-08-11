import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, UserPlus, ShieldCheck, Code, Sparkles, ArrowRight,
  Rocket, Palette, Cpu, Smartphone, Globe, CheckCircle, Star,
  Zap, Heart, Coffee, Award, Box, Layers, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import SEOHead from '../components/SEOHead';

const ROLE_HOME = {
  client: '/dashboard/client',
  developer: '/dashboard/dev',
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    developerType: '',
  });

  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (formData.role === 'developer' && !formData.developerType) {
      toast.error('Please select your developer specialization.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        developerType: formData.role === 'developer' ? formData.developerType : '',
      };
      const res = await register(payload);
      toast.success('Registration successful! Check your email for OTP. 🎉');
      
      // Store email for verification page
      localStorage.setItem('verify_email', formData.email);
      
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    { id: 'web', label: 'Web Dev', icon: Globe, gradient: 'from-blue-500 to-cyan-500', desc: 'React, Next.js' },
    { id: 'app', label: 'App Dev', icon: Smartphone, gradient: 'from-purple-500 to-pink-500', desc: 'iOS, Android' },
    { id: 'ai', label: 'AI/ML', icon: Cpu, gradient: 'from-emerald-500 to-teal-500', desc: 'LLMs, Vision' },
    { id: 'designer', label: 'Design', icon: Palette, gradient: 'from-orange-500 to-amber-500', desc: 'UI/UX, Figma' },
  ];

  const benefits = [
    { icon: Zap, text: 'Lightning fast deployment', color: 'text-blue-500' },
    { icon: ShieldCheck, text: 'Enterprise grade security', color: 'text-emerald-500' },
    { icon: Rocket, text: 'Scale with confidence', color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden premium-gradient-bg transition-colors duration-700">
      <SEOHead
        title="Register – Start Building Your Project"
        description="Create your WaveMind Solutions account. Join as a client or developer to start building premium digital products."
        canonicalPath="/register"
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

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">

          {/* Left Side - Brand Context */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex lg:col-span-2 flex-col space-y-10"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Evolution of Creation
                </span>
              </motion.div>

              <h2 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
                Join the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Future</span> of Product Building
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                WaveMind bridges the gap between vision and reality. Start building with the world's most advanced agency platform.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Snippet */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-blue-500 text-blue-500" />)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                "WaveMind isn't just a tool, it's the partner we needed to scale our infrastructure globally."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <div>
                  <p className="text-sm font-bold dark:text-white">Alex Rivera</p>
                  <p className="text-xs text-gray-500">CEO, CloudPulse</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 max-w-2xl mx-auto w-full"
          >
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

              <div className="relative rounded-[2.2rem] premium-glass shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500" />
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:scale-110">
                          <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Join the elite network of creators</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'client', developerType: '' })}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${formData.role === 'client'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Client
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'developer' })}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${formData.role === 'developer'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                      >
                        Developer
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Specific Selection */}
                    <AnimatePresence mode="wait">
                      {formData.role === 'developer' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                        >
                          {specializations.map((spec) => (
                            <button
                              key={spec.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, developerType: spec.id })}
                              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${formData.developerType === spec.id
                                  ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                                  : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}
                            >
                              <div className={`w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-gradient-to-br ${spec.gradient}`}>
                                <spec.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.developerType === spec.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                                }`}>
                                {spec.label}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Inputs */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                          <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                          <input
                            type="text"
                            required
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative group">
                          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                          <input
                            type="email"
                            required
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile / Phone Number *</label>
                        <div className="relative group">
                          <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                          <input
                            type="tel"
                            required
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                          <input
                            type="password"
                            required
                            minLength={6}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                        <div className="relative group">
                          <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirm' ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
                          <input
                            type="password"
                            required
                            onFocus={() => setFocusedField('confirm')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl premium-input dark:text-[#f8fafc] placeholder:text-gray-500/70"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.4rem] text-white font-bold text-base hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden mt-4"
                      >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="relative z-10">Start Your Journey</span>
                          <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-10 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Already have an account?{' '}
                      <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 decoration-2">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
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

export default Register;