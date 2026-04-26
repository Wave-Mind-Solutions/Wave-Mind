import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Cpu, IndianRupee, FileText, CheckCircle,
  AlertCircle, Zap, TrendingUp, Shield, Sparkles,
  Layers, Target, Clock, ArrowRight, Lightbulb,
  DollarSign, Code, Briefcase, Star, Award,
  User, Mail, Phone, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ProfileEditModal from '../../../components/dashboard/ProfileEditModal';
import { useAuth } from '../../../context/AuthContext';
import { submitRequirement } from '../../../services/clientService';
import toast from 'react-hot-toast';

const SubmitRequirement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    priority: 'Medium',
    techStack: [],
    email: '',
    phone: '',
    // timeline: '',
    deliverables: [],
  });
  const [techInput, setTechInput] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [activeSection, setActiveSection] = useState('details');

  // Pre-fill email and phone from user profile
  useState(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleAiAnalysis = () => {
    if (!formData.description) {
      toast.error('Please describe your project first for AI analysis.');
      return;
    }
    setAiAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiSuggestions({
        techStack: ['React 18', 'Node.js', 'MongoDB', 'TailwindCSS', 'Cloudinary'],
        recommendedApproach: 'Microservices Architecture with REST API + JWT Authentication',
        estimatedComplexity: 'Medium-High',
        suggestedBudgetRange: '₹80,000 - ₹1,20,000',
        timeEstimate: '4-6 weeks',
        riskFactors: ['Third-party integrations', 'Payment gateway setup'],
        optimizationTips: ['Implement caching for better performance', 'Use CDN for media assets']
      });
      setAiAnalyzing(false);
      toast.success('AI analysis complete! Check the suggestions panel.');
    }, 2500);
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (t) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(x => x !== t)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Submitting your requirement...');

    try {
      await submitRequirement({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        priority: formData.priority,
        techStack: formData.techStack,
        timeline: formData.timeline,
        email: formData.email,
        phone: formData.phone,
      });

      toast.dismiss(loadingToast);
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-bold">Requirement Submitted! 🚀</p>
              <p className="text-xs">Our team will review it within 24 hours.</p>
            </div>
          </div>
        ),
        { duration: 5000 }
      );

      navigate('/dashboard/client');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { label: 'Low', color: 'bg-blue-500', icon: '😌' },
    { label: 'Medium', color: 'bg-yellow-500', icon: '🤔' },
    { label: 'High', color: 'bg-orange-500', icon: '⚡' },
    { label: 'Extreme', color: 'bg-red-500', icon: '🔥' }
  ];

  const timelineOptions = ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', '3+ months'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <DashboardLayout role="client" title="Submit Requirement">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="relative">
            {/* Progress Steps */}
            <div className="mb-10 px-4">
              <div className="flex items-center justify-between max-w-md mx-auto sm:mx-0">
                {['details', 'technical', 'review'].map((step, idx) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${activeSection === step
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] scale-110 rotate-3'
                        : 'bg-white/5 dark:bg-white/5 text-gray-400 border border-white/10'
                        }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < 2 && (
                      <div className={`w-12 sm:w-20 h-0.5 mx-2 rounded-full transition-all duration-700 ${idx < 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-white/10'
                        }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] -ml-24 -mb-24" />

              <div className="relative z-10">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Share Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vision</span>
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Tell us about your project and we'll help bring it to life</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Project Title */}
                  <motion.div variants={itemVariants} className="group">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium"
                      placeholder="e.g., E-Commerce Mobile App with Admin Panel"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </motion.div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        <Mail className="w-4 h-4 text-blue-500" />
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        <Phone className="w-4 h-4 text-blue-500" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.div variants={itemVariants} className="group">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Project Description *
                    </label>
                    <div className="relative">
                      <textarea
                        rows="6"
                        required
                        className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium resize-none"
                        placeholder="Describe your project goals, target audience, key features, and any specific requirements..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                        <button
                        type="button"
                        
                        
                        onClick={handleAiAnalysis}
                        disabled={aiAnalyzing}
                        className="absolute bottom-4 right-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-xs font-bold"
                      >
                        {aiAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Cpu className="w-4 h-4" />
                            AI Insights
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Budget and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        <IndianRupee className="w-4 h-4 text-blue-500" />
                        Budget (INR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium"
                        placeholder="e.g., 50000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </motion.div>

                    {/* <div variants={itemVariants}>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        <Clock className="w-4 h-4" />
                        Expected Timeline
                      </label>
                      <select
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all text-gray-900 font-medium cursor-pointer"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      >
                        <option value="">Select timeline</option>
                        {timelineOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div> */}
                  </div>

                  {/* Priority Level */}
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      Priority Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {priorities.map(p => (
                        <button
                          key={p.label}
                          type="button"
                          
                          
                          onClick={() => setFormData({ ...formData, priority: p.label })}
                          className={`relative py-4 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden border ${formData.priority === p.label
                            ? 'border-transparent text-white shadow-xl shadow-blue-500/20'
                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                          <div className={`absolute inset-0 ${formData.priority === p.label ? p.color : 'bg-transparent'} transition-opacity`} />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <span className="text-lg">{p.icon}</span>
                            {p.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      <Code className="w-4 h-4 text-blue-500" />
                      Tech Stack Preferences
                    </label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl premium-input dark:text-[#f8fafc] font-medium"
                      placeholder="Type technology and press Enter (e.g., React, Python, AWS...)"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={addTech}
                    />
                    
                      {formData.techStack.length > 0 && (
                        <div
                          
                          
                          
                          className="flex flex-wrap gap-2 mt-4"
                        >
                          {formData.techStack.map(t => (
                           <span
                              key={t}
                              
                              
                              
                              className="group flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-500/20"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTech(t)}
                                className="hover:text-red-500 transition-colors ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    variants={itemVariants}
                    className="pt-6 border-t border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <Shield className="w-4 h-4" />
                        <span>Your information is secure and encrypted</span>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        
                        
                        className="relative group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Requirement
                              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions Panel */}
          <motion.div variants={itemVariants} className="relative">
            <div className="premium-glass rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative border border-white/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-[60px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tight text-white">AI Assistant</h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Advanced Analysis</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {aiSuggestions ? (
                    <div
                      key="suggestions"
                      
                      
                      
                      className="space-y-5"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-400 uppercase tracking-wider mb-3">
                          <Lightbulb className="w-3 h-3" />
                          Recommended Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.techStack.map(t => (
                            <span key={t} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium border border-white/5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
                          <DollarSign className="w-3 h-3" />
                          Budget Estimate
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-indigo-300 bg-clip-text text-transparent">
                          {aiSuggestions.suggestedBudgetRange}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
                          <Clock className="w-3 h-3" />
                          Time Estimate
                        </div>
                        <p className="text-sm font-semibold">{aiSuggestions.timeEstimate}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">
                          <AlertCircle className="w-3 h-3" />
                          Risk Factors
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {aiSuggestions.riskFactors.map(risk => (
                            <li key={risk} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-yellow-400 rounded-full" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        
                        
                        onClick={() => {
                          const newTechStack = [...new Set([...formData.techStack, ...aiSuggestions.techStack])];
                          setFormData(prev => ({ ...prev, techStack: newTechStack }));
                          toast.success(`${aiSuggestions.techStack.length} technologies added to your stack!`);
                        }}
                        className="w-full mt-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Apply All Suggestions
                      </button>
                    </div>
                  ) : (
                    <div
                      key="placeholder"
                      
                      
                      
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Ready for AI insights?</p>
                      <p className="text-xs text-gray-500">
                        Describe your project above and click "AI Analyze" for intelligent recommendations
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Tips and Statistics */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="premium-glass rounded-[2rem] p-6 border border-amber-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 shadow-inner">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wider text-xs">Pro Tip</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    The more detailed your requirements, the more accurate our quotes and faster our delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="premium-glass rounded-[2rem] p-6 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Success Metrics</h4>
              </div>
              <div className="space-y-5 relative z-10">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                    <span className="text-gray-400">Quality Score</span>
                    <span className="text-green-500">98%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div
                      
                      
                      
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                    <span className="text-gray-400">On-Time Delivery</span>
                    <span className="text-blue-500">94%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div
                      
                      
                      
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-glass rounded-[2rem] p-6 border border-purple-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] text-purple-500 font-black uppercase tracking-[0.2em]">Trusted globally</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">500+ Clients</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-widest">Across 25+ countries</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Profile Overview Card (Quick Edit) */}
      <div 
        
        
        
        className="mt-12 premium-glass rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-blue-600/10" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl border-2 border-white/20 rotate-3 transition-transform group-hover:rotate-6">
                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'WM'}
              </div>
            </div>
            <div>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{user?.fullName || 'Client User'}</h4>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-blue-500/20 shadow-sm">Premium Client</span>
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-emerald-500/20 shadow-sm">Verified Account</span>
              </div>
            </div>
          </div>
 
          <div className="flex flex-wrap items-center gap-10 lg:gap-16">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-white/5 flex items-center justify-center text-blue-500 border border-white/10 shadow-xl">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email Address</p>
                <p className="text-base font-bold text-gray-700 dark:text-gray-200">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-white/5 flex items-center justify-center text-indigo-500 border border-white/10 shadow-xl">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Phone Number</p>
                <p className="text-base font-bold text-gray-700 dark:text-gray-200">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
 
          <button
            
            
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2rem] font-black text-sm transition-all shadow-2xl shadow-blue-600/20 dark:shadow-white/10 group/btn active:scale-95"
          >
            <Edit3 size={20} className="group-hover/btn:rotate-12 transition-transform" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default SubmitRequirement;
