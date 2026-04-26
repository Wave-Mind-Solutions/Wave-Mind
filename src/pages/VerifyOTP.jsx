import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthData } = useAuth();
  
  const email = location.state?.email || localStorage.getItem('verify_email');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: otpCode
      });

      if (res.data.success) {
        setSuccess('Account verified successfully! Redirecting...');
        localStorage.removeItem('verify_email');
        
        const ROLE_HOME = {
          client: '/dashboard/client',
          admin: '/dashboard/admin',
          developer: '/dashboard/dev',
        };

        // Auto-login after verification
        setTimeout(() => {
          setAuthData(res.data.token, res.data.user);
          navigate(ROLE_HOME[res.data.user.role] || '/dashboard/client');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    try {
      await api.post('/auth/resend-otp', { email });
      setSuccess('New OTP sent to your email.');
      setResendCooldown(60);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen premium-gradient-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-700">
      {/* Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] filter animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] filter animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] filter animate-blob animation-delay-4000" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl shadow-blue-500/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit code to <span className="font-semibold text-gray-900 dark:text-[#f8fafc]">{email}</span>
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="premium-glass py-10 px-4 sm:rounded-3xl sm:px-10 shadow-2xl">
          <form className="space-y-8" onSubmit={handleVerify}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold premium-input dark:text-[#f8fafc] rounded-xl outline-none"
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm border border-red-100"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3 text-emerald-700 text-sm border border-emerald-100"
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                {success}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-sm font-bold text-white hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-sm font-medium text-gray-500 hover:text-primary-600 disabled:text-gray-300 flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
