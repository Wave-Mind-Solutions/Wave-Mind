import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Cpu, IndianRupee, FileText, CheckCircle,
  AlertCircle, Zap, TrendingUp, Shield, Sparkles,
  Layers, Target, Clock, ArrowRight, Lightbulb,
  DollarSign, Code, Briefcase, Star, Award,
  User, Mail, Phone, Edit3, X, ShoppingCart, Layout, Gift, Tag, Check, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ProfileEditModal from '../../../components/dashboard/ProfileEditModal';
import { useAuth } from '../../../context/AuthContext';
import { submitRequirement } from '../../../services/clientService';
import { analyzeProjectWithGemini } from '../../../services/geminiService';
import {
  getPricingForCategory,
  validateBudget,
  getBudgetPresetOptions,
  formatINR,
  OFFICIAL_WEBSITE_PRICING
} from '../../../config/pricingConfig';
import toast from 'react-hot-toast';

const PROJECT_TYPES = [
  'Business Website',
  'E-commerce',
  'Portfolio',
  'Blog',
  'Education Website',
  'Booking / Service Website',
  'Custom Website / Web App'
];

const DEFAULT_FEATURES = [
  'Payment Gateway',
  'Cart & Wishlist',
  'Admin Dashboard',
  'AI Chatbot',
  'User Login & Auth',
  'Order Tracking',
  'WhatsApp Integration',
  'SEO Optimization',
  'Push Notifications'
];

const DEFAULT_SERVICES = [
  'SEO',
  'Domain & Hosting',
  'Website Maintenance',
  'Digital Marketing',
  'AI Integration',
  'Payment Gateway Integration',
  'WhatsApp API Integration'
];

const TIMELINE_OPTIONS = [
  'ASAP',
  'Within 1 month',
  '1–3 months',
  'Flexible'
];

const SubmitRequirement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFromAiChat, setIsFromAiChat] = useState(false);
  const [aiBannerDismissed, setAiBannerDismissed] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    projectType: 'E-commerce',
    businessType: '',
    requiredFeatures: [],
    designRequirement: 'Custom Design',
    budget: '',
    timeline: 'Within 1 month',
    additionalServices: [],
    description: '',
    priority: 'Medium',
    techStack: [],
  });

  const [featureInput, setFeatureInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Pre-fill user profile and AI Chatbot extracted requirements on mount
  useEffect(() => {
    // 1. Account Info
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.fullName || user.name || user.displayName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }

    // 2. Extracted AI Chatbot Requirements
    const pendingRaw = sessionStorage.getItem('wavemind_pending_project_request') || localStorage.getItem('wavemind_pending_project_request');
    if (pendingRaw) {
      try {
        const parsed = JSON.parse(pendingRaw);
        setIsFromAiChat(true);

        const projectTypeVal = parsed.websiteType || parsed.projectType || 'Business Website';
        const catPricing = getPricingForCategory(projectTypeVal);
        const businessVal = parsed.businessIndustry || parsed.businessType || 'General Business';
        const goalVal = parsed.projectGoal ? `\n• Goal / Purpose: ${parsed.projectGoal}` : '';
        const featuresVal = Array.isArray(parsed.features) && parsed.features.length > 0
          ? parsed.features
          : ['Contact Form', 'Admin Dashboard', 'WhatsApp Integration', 'SEO'];
        const designVal = parsed.designPreference || parsed.designRequirement || 'Custom Design';
        const rawBudget = (parsed.budget || catPricing.min.toString()).toString().replace(/[^\d]/g, '');
        const budgetVal = Number(rawBudget) >= catPricing.min ? rawBudget : catPricing.min.toString();
        const timelineVal = parsed.timeline || 'Within 1 month';
        const servicesVal = Array.isArray(parsed.additionalServices) && parsed.additionalServices.length > 0
          ? parsed.additionalServices
          : ['SEO'];

        const autoTitle = `${projectTypeVal} - ${businessVal} Project`;
        const autoDesc = `AI Chatbot Extracted Requirements:\n• Project Type: ${projectTypeVal}\n• Business / Industry: ${businessVal}${goalVal}\n• Features Needed: ${featuresVal.join(', ')}\n• Design Preference: ${designVal}\n• Target Budget: ₹${budgetVal}\n• Expected Timeline: ${timelineVal}\n• Additional Services: ${servicesVal.join(', ')}`;

        setFormData(prev => ({
          ...prev,
          title: prev.title || autoTitle,
          projectType: projectTypeVal,
          businessType: businessVal,
          requiredFeatures: featuresVal,
          designRequirement: designVal,
          budget: budgetVal,
          timeline: timelineVal,
          additionalServices: servicesVal,
          description: prev.description || autoDesc,
          email: user?.email || prev.email || '',
          name: user?.fullName || user?.name || prev.name || '',
          phone: user?.phone || parsed.phone || parsed.contact || prev.phone || ''
        }));
      } catch (e) {
        console.error('Failed to parse pending AI project request:', e);
      }
    }
  }, [user]);

  const handleToggleFeature = (feat) => {
    setFormData(prev => {
      const exists = prev.requiredFeatures.includes(feat);
      return {
        ...prev,
        requiredFeatures: exists
          ? prev.requiredFeatures.filter(f => f !== feat)
          : [...prev.requiredFeatures, feat]
      };
    });
  };

  const handleAddCustomFeature = (e) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      if (!formData.requiredFeatures.includes(featureInput.trim())) {
        setFormData(prev => ({
          ...prev,
          requiredFeatures: [...prev.requiredFeatures, featureInput.trim()]
        }));
      }
      setFeatureInput('');
    }
  };

  const handleToggleService = (srv) => {
    setFormData(prev => {
      const exists = prev.additionalServices.includes(srv);
      return {
        ...prev,
        additionalServices: exists
          ? prev.additionalServices.filter(s => s !== srv)
          : [...prev.additionalServices, srv]
      };
    });
  };

  const handleAddCustomService = (e) => {
    if (e.key === 'Enter' && serviceInput.trim()) {
      e.preventDefault();
      if (!formData.additionalServices.includes(serviceInput.trim())) {
        setFormData(prev => ({
          ...prev,
          additionalServices: [...prev.additionalServices, serviceInput.trim()]
        }));
      }
      setServiceInput('');
    }
  };

  const handleAiAnalysis = async () => {
    if (!formData.description && !formData.title) {
      toast.error('Please provide a project description or title for AI analysis.');
      return;
    }
    setAiAnalyzing(true);
    try {
      const suggestions = await analyzeProjectWithGemini({
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        priority: formData.priority,
        techStack: formData.requiredFeatures,
      });
      toast.success('AI insights generated! Check your project plan below.');
    } catch (err) {
      toast.error(err.message || 'AI analysis failed. Please try again.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.name || !formData.email || !formData.phone || !formData.budget) {
      toast.error('Please complete all required fields (Title, Name, Email, Mobile Number, Budget).');
      return;
    }

    const cleanPhoneDigits = formData.phone.toString().replace(/[^\d]/g, '');
    if (cleanPhoneDigits.length < 10) {
      toast.error('Please enter a valid mobile number (minimum 10 digits).');
      return;
    }

    const currentCat = getPricingForCategory(formData.projectType);
    const numericBudget = Number(formData.budget.toString().replace(/[^\d]/g, '')) || 0;
    const checkVal = validateBudget(formData.projectType, numericBudget);

    if (!checkVal.isValid) {
      toast.error(`Minimum budget for ${currentCat.label} is ${formatINR(currentCat.min)}.`);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Submitting project request...');

    try {
      // Build the payload — DO NOT send userId/clientId from frontend.
      // Backend always extracts clientId from the verified JWT (req.user._id).
      const payload = {
        title: formData.title,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        businessIndustry: formData.businessType || formData.businessIndustry || '',
        projectGoal: formData.projectGoal || '',
        requiredFeatures: formData.requiredFeatures,
        designRequirement: formData.designRequirement,
        budget: numericBudget,
        timeline: formData.timeline,
        additionalServices: formData.additionalServices,
        description: formData.description,
      };

      // ── CRITICAL: API call is NOT wrapped in its own try/catch.
      // If it fails (401, 400, 500, network error), the error propagates
      // to the outer catch below and is shown to the user.
      // The UI must NEVER show success if the DB save failed.
      const result = await submitRequirement(payload);

      // ── At this point, MongoDB has confirmed the save ─────────────────────
      // Only NOW do we save to localStorage — as a reference/cache, NOT source of truth.
      // The project ID from MongoDB is stored so we can reference it later.
      const savedProject = result?.project || {};
      const localRef = {
        id: savedProject._id || savedProject.id || ('ref_' + Date.now()),
        dbId: savedProject._id || savedProject.id || null,
        title: formData.title,
        projectType: formData.projectType,
        budget: numericBudget,
        status: savedProject.status || 'In Review',
        submittedAt: new Date().toISOString(),
        _savedToMongoDB: true, // Flag: this was successfully saved to DB
      };

      const existing = JSON.parse(localStorage.getItem('wavemind_submitted_requirements') || '[]');
      existing.unshift(localRef);
      localStorage.setItem('wavemind_submitted_requirements', JSON.stringify(existing.slice(0, 20))); // keep max 20

      // Clear chatbot draft data (it's been submitted)
      sessionStorage.removeItem('wavemind_pending_project_request');
      localStorage.removeItem('wavemind_pending_project_request');

      toast.dismiss(loadingToast);
      toast.success('Project submitted successfully!');
      setSubmittedSuccess(true);

    } catch (err) {
      toast.dismiss(loadingToast);

      // Show real, user-safe error messages based on HTTP status
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      let userMessage;
      if (status === 401) {
        userMessage = 'Your session has expired. Please log in again.';
      } else if (status === 400) {
        userMessage = serverMsg || 'Please check your form details and try again.';
      } else if (status === 403) {
        userMessage = 'Access denied. Please ensure you are logged in as a client.';
      } else if (status === 409) {
        userMessage = 'A similar project was already submitted recently. Please wait a moment and try again.';
      } else if (status >= 500) {
        userMessage = 'Our server is temporarily unavailable. Please try again in a few minutes.';
      } else if (!navigator.onLine) {
        userMessage = 'You appear to be offline. Please check your internet connection.';
      } else {
        userMessage = serverMsg || 'Unable to submit your project request. Please try again.';
      }

      toast.error(userMessage);
      console.error('[PROJECT SUBMIT ERROR]', { status, serverMsg, err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="client" title="Submit Project Request">
      <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
        {submittedSuccess ? (
          /* Success Screen (Requirement 9) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-gray-900 border border-purple-500/30 shadow-2xl text-center font-sans space-y-6"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 shadow-xl">
              <div className="w-full h-full bg-white dark:bg-[#0b081c] rounded-[22px] flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                🎉 Your project request has been submitted successfully!
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto font-medium leading-relaxed">
                Our development team will review your requirements and contact you shortly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-left max-w-md mx-auto space-y-2 text-xs">
              <p className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                Submitted Request Details:
              </p>
              <p className="text-gray-700 dark:text-gray-200"><strong>Title:</strong> {formData.title}</p>
              <p className="text-gray-700 dark:text-gray-200"><strong>Type:</strong> {formData.projectType}</p>
              <p className="text-gray-700 dark:text-gray-200"><strong>Budget:</strong> ₹{formData.budget}</p>
              <p className="text-gray-700 dark:text-gray-200"><strong>Email:</strong> {formData.email}</p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard/client/projects')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                View My Projects
              </button>

              <button
                onClick={() => navigate('/agent-ai')}
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                Return to AI Assistant
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Project Requirement Form */
          <div className="space-y-6">
            {/* Confirmation Banner (Requirement 6) */}
            {isFromAiChat && !aiBannerDismissed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-pink-900/60 border border-purple-500/40 backdrop-blur-xl shadow-2xl text-white relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200 shrink-0 mt-0.5 shadow-md">
                      <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        Great! 🚀 We've filled your project request based on our conversation.
                      </h4>
                      <p className="text-xs sm:text-sm text-purple-200/90 mt-1 leading-relaxed">
                        Please review the details below, make any changes if needed, and submit your request.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAiBannerDismissed(true)}
                    className="text-purple-300/80 hover:text-white transition-colors p-1"
                    title="Dismiss banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Form Container */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-purple-500/20 shadow-2xl space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-white dark:bg-[#0b081c] rounded-[14px] flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    Project Requirement Form
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Review and customize your project specifications before submitting to our engineering team.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. USER ACCOUNT INFO (Requirement 5) */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    1. Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="+91 98765 43210 (Required)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PROJECT CLASSIFICATION (Requirement 4) */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    2. Project Category & Industry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., E-commerce Clothing Store"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Project Type *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      >
                        {PROJECT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Business / Industry
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Clothing, Healthcare, Real Estate, Education"
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        Design Requirement
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Custom Design, Figma Reference, Minimalist"
                        value={formData.designRequirement}
                        onChange={(e) => setFormData({ ...formData, designRequirement: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. REQUIRED FEATURES & SERVICES */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    3. Required Features & Services
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Select Required Features:
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {DEFAULT_FEATURES.map(feat => {
                        const isSelected = formData.requiredFeatures.includes(feat);
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => handleToggleFeature(feat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400'
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{feat}</span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                      placeholder="Add custom feature and press Enter..."
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={handleAddCustomFeature}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Additional Services:
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {DEFAULT_SERVICES.map(srv => {
                        const isSelected = formData.additionalServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => handleToggleService(srv)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                              }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{srv}</span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                      placeholder="Add custom service and press Enter..."
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={handleAddCustomService}
                    />
                  </div>
                </div>

                {/* 4. BUDGET & TIMELINE */}
                {(() => {
                  const activeCategory = getPricingForCategory(formData.projectType);
                  const currentBudgetNum = Number((formData.budget || '0').toString().replace(/[^\d]/g, '')) || 0;
                  const budgetCheck = validateBudget(formData.projectType, currentBudgetNum);
                  const presets = getBudgetPresetOptions(formData.projectType);
                  const isBelowMin = currentBudgetNum > 0 && currentBudgetNum < activeCategory.min;

                  // Percentage for progress slider
                  const rangeSpan = Math.max(1, activeCategory.max - activeCategory.min);
                  const progressPct = Math.min(100, Math.max(0, ((currentBudgetNum - activeCategory.min) / rangeSpan) * 100));

                  return (
                    <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          4. Official Website Price Matrix & Budget Selection
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                          {activeCategory.label} Baseline
                        </span>
                      </div>

                      {/* Official Category Pricing Baseline Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80">
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Minimum Budget</span>
                          <span className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5 block">{formatINR(activeCategory.min)}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">Hard entry baseline</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider block">Recommended Budget</span>
                          <span className="text-lg font-black text-purple-700 dark:text-purple-200 mt-0.5 block">{formatINR(activeCategory.recommended)}</span>
                          <span className="text-[11px] text-purple-600/80 dark:text-purple-300/80">Standard feature package</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80">
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">Premium Projects</span>
                          <span className="text-lg font-black text-gray-900 dark:text-white mt-0.5 block">Up to {formatINR(activeCategory.max)}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">Advanced custom scope</span>
                        </div>
                      </div>

                      {/* Budget Selector Box */}
                      <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                              Estimated Project Budget (₹ INR) *
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">₹</span>
                              <input
                                type="number"
                                required
                                min={activeCategory.min}
                                className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border font-bold text-base text-gray-900 dark:text-white focus:outline-none transition-all ${
                                  isBelowMin
                                    ? 'border-red-500 text-red-600 focus:border-red-600 ring-2 ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-purple-500'
                                }`}
                                placeholder={`Min: ${activeCategory.min}`}
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              />
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                              Minimum budget for {activeCategory.label}: <strong className="text-purple-600 dark:text-purple-300">{formatINR(activeCategory.min)}</strong>
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                              Expected Launch Timeline
                            </label>
                            <select
                              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 font-medium text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                              value={formData.timeline}
                              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            >
                              {TIMELINE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Budget Preset Chips */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Select Budget Preset:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {presets.map(pVal => {
                              const isSelected = currentBudgetNum === pVal;
                              return (
                                <button
                                  key={pVal}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, budget: pVal.toString() })}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-purple-400'
                                  }`}
                                >
                                  {formatINR(pVal)} {pVal === activeCategory.min && '(Min)'} {pVal === activeCategory.recommended && '(Rec)'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Price Range Visual Progress Bar Indicator */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                            <span>{formatINR(activeCategory.min)} (Min)</span>
                            <span className="text-purple-600 dark:text-purple-300 font-extrabold">{formatINR(activeCategory.recommended)} (Recommended)</span>
                            <span>{formatINR(activeCategory.max)}+ (Premium)</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 transition-all duration-300 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Live Minimum Budget Warning Box */}
                        {isBelowMin && (
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <div>
                              <strong className="block font-bold">⚠️ Minimum budget threshold warning</strong>
                              Minimum budget is {formatINR(activeCategory.min)} for {activeCategory.label}. Please adjust your budget before submitting.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 5. DESCRIPTION */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    5. Full Project Details & Description
                  </h3>
                  <div>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Describe your project goals, target audience, reference sites, or special requests..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON (Enforces budget validation) */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-4">
                  {(() => {
                    const cat = getPricingForCategory(formData.projectType);
                    const bNum = Number((formData.budget || '0').toString().replace(/[^\d]/g, '')) || 0;
                    const isSubmitDisabled = loading || !formData.title || !formData.email || bNum < cat.min;

                    return (
                      <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
                          isSubmitDisabled
                            ? 'bg-gray-400 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:scale-105 active:scale-95 cursor-pointer'
                        }`}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Submitting Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Project Request</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubmitRequirement;
