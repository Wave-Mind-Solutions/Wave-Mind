import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, Volume2, VolumeX, RotateCcw,
  Trash2, ArrowRight, ThumbsUp, ThumbsDown, Code, Workflow,
  Smartphone, Briefcase, Bot, User, ArrowDown, Send,
  Mic, Paperclip, X, Zap, MessageSquare, Share2, Bookmark,
  ChevronDown, ChevronUp, Maximize2, Minimize2, Settings,
  Sliders, Cpu, Layers, Globe, SlidersHorizontal, RefreshCw, History, Play,
  ShoppingCart, Layout, FileText, GraduationCap, Calendar, Gift
} from 'lucide-react';
import ChatInput from './ChatInput';
import ThreadHistoryModal from './ThreadHistoryModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getPricingForCategory,
  validateBudget,
  calculateProjectPrice,
  formatINR
} from '../../config/pricingConfig';
import {
  getOrCreateConversation,
  sendAuthChatMessage,
  sendGuestChatMessage,
  getUserConversations
} from '../../services/chatService';

const AI_MODELS = [
  { id: 'gemini-1.5', name: 'Gemini 1.5 Pro / Flash', provider: 'Google AI', badge: 'Active' },
  { id: 'gpt-4o', name: 'GPT-4o Enterprise', provider: 'OpenAI', badge: 'Fastest' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: 'Creative' }
];

const QUICK_PROMPTS = [
  { label: '💻 I want to make a website', prompt: 'I want to make a website' },
  { label: '📱 I want to build a mobile app', prompt: 'I want to build a mobile app' },
  { label: '🤖 Integrate AI Chatbot & RAG', prompt: 'Can you help me build a custom AI chatbot for my business?' },
  { label: '💰 Pricing & Cost Estimate', prompt: 'What are your pricing packages and cost estimates?' },
  { label: '🏢 Kolkata HQ & Contact Info', prompt: 'Who is WaveMind Solutions? Kolkata address and contact details' },
  { label: '📜 SLA & Code Ownership', prompt: 'What SLA and security warranty do you provide?' }
];

const SUGGESTED_CARDS = [
  {
    id: 'web-app',
    icon: Code,
    title: 'Build a Web Application',
    desc: 'Design & code a high-performance React website with modern UI/UX',
    prompt: 'I want to make a website',
    gradient: 'from-purple-600 via-indigo-600 to-blue-500'
  },
  {
    id: 'workflow',
    icon: Workflow,
    title: 'Automate Workflows',
    desc: 'Integrate AI LLM agents & CRM data pipelines to save time',
    prompt: 'What AI automation solutions does WaveMind offer to streamline business operations?',
    gradient: 'from-pink-600 via-purple-600 to-indigo-600'
  },
  {
    id: 'mobile-app',
    icon: Smartphone,
    title: 'Mobile App Strategy',
    desc: 'Architect a cross-platform iOS & Android mobile app experience',
    prompt: 'I want to build a mobile app',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-500'
  },
  {
    id: 'pricing',
    icon: Briefcase,
    title: 'Pricing & Cost Estimate',
    desc: 'Calculate project pricing tiers, delivery timeline & engagement model',
    prompt: 'What are WaveMind\'s pricing packages and engagement models for new projects?',
    gradient: 'from-amber-500 via-orange-600 to-rose-500'
  }
];

// ============================================================
// SYSTEM CONFIGURATION
// ============================================================
const DIRECT_API_KEY = 'AIzaSyAqlvab1e0I-Ri4_TbG5l0T5gYJJ8jjAjk'; // PASTE YOUR API KEY HERE
const DIRECT_API_PROVIDER = 'gemini';

const SYSTEM_API_KEY = DIRECT_API_KEY.trim() ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
  '';

const SYSTEM_API_PROVIDER = DIRECT_API_KEY.trim() ? DIRECT_API_PROVIDER :
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) ? 'openai' : 'gemini');

// ============================================================
// CATEGORY-SPECIFIC FLOW CONFIGURATION
// ============================================================
const WEBSITE_FLOW_CONFIG = {
  "Business Website": {
    label: "Business Website",
    industryQuestion: "What type of business is the website for?",
    industryOptions: ['Restaurant', 'Real Estate', 'IT Company', 'Consulting', 'Construction', 'Manufacturing', 'Agency', 'Local Business', 'Healthcare', 'Other'],
    goalQuestion: "What is the main goal of your website?",
    goalOptions: ['Generate leads', 'Showcase services', 'Get customer inquiries', 'Build brand presence', 'Get WhatsApp inquiries', 'Get bookings'],
    featureQuestion: "What features would you like?",
    featureOptions: ['Services', 'Contact Form', 'Testimonials', 'WhatsApp Integration', 'Team Section', 'Portfolio/Projects', 'Gallery', 'Google Maps', 'Blog', 'Appointment/Inquiry Form', 'Admin Dashboard', 'SEO'],
    designQuestion: "Do you already have a design/reference website, or should our team create the design?",
    designOptions: ['Our team should create custom design', 'I have a reference website / Figma', 'Minimalist & modern style'],
    servicesOptions: ['Domain & Hosting', 'SEO', 'Website Maintenance', 'Digital Marketing', 'AI Integration', 'No extra services needed']
  },
  "E-commerce": {
    label: "E-commerce",
    industryQuestion: "What type of products will you sell?",
    industryOptions: ['Clothing', 'Electronics', 'Grocery', 'Food', 'Cosmetics', 'Furniture', 'Jewelry', 'Digital Products', 'Other'],
    goalQuestion: null, // E-commerce skips goal question to proceed directly to features
    featureQuestion: "What e-commerce features do you need?",
    featureOptions: ['Online Payment', 'Product Management', 'User Login/Signup', 'Shopping Cart', 'Wishlist', 'Order Tracking', 'Coupons', 'Product Reviews', 'Admin Dashboard', 'Inventory Management', 'WhatsApp Integration', 'AI Shopping Assistant'],
    designQuestion: "Do you need a custom design or do you have a reference website?",
    designOptions: ['Custom unique design', 'I have a reference store design', 'Template-based rapid launch'],
    servicesOptions: ['Domain & Hosting', 'SEO', 'Payment Gateway Setup', 'Website Maintenance', 'Digital Marketing', 'No extra services needed']
  },
  "Portfolio": {
    label: "Portfolio",
    industryQuestion: "What type of portfolio are you building?",
    industryOptions: ['Developer', 'Designer', 'Photographer', 'Student', 'Freelancer', 'Artist', 'Creator', 'Professional', 'Other'],
    goalQuestion: "What is the main goal of your portfolio?",
    goalOptions: ['Get a job', 'Get freelance clients', 'Showcase my projects', 'Build my personal brand', 'Attract clients', 'Showcase my skills'],
    featureQuestion: "What sections would you like in your portfolio?",
    featureOptions: ['Hero / Introduction', 'About Me', 'Skills', 'Projects', 'Experience', 'Education', 'Resume / CV', 'Certifications', 'Testimonials', 'Services', 'Contact', 'Blog', 'Social Links', 'GitHub Integration', 'LinkedIn Integration'],
    designQuestion: "What type of design would you prefer?",
    designOptions: ['Clean & Professional', 'Modern & Minimal', 'Creative', 'Interactive', '3D / Animated', 'Cyberpunk', 'Glassmorphism', 'Custom'],
    referenceQuestion: "Do you have a reference portfolio website?",
    referenceOptions: ['I have a reference link', 'Our team should suggest', 'Custom design from scratch'],
    servicesOptions: ['Domain & Hosting', 'SEO', 'Website Maintenance', 'Resume PDF generator', 'No extra services needed']
  },
  "Blog": {
    label: "Blog",
    industryQuestion: "What will your blog be about?",
    industryOptions: ['Technology', 'Education', 'Travel', 'Food', 'Lifestyle', 'Finance', 'News', 'Personal', 'Business', 'Other'],
    goalQuestion: "How will you publish content?",
    goalOptions: ['Only me', 'Multiple authors', 'Guest writers', 'Not decided'],
    featureQuestion: "What features would you like?",
    featureOptions: ['Categories', 'Search', 'Blog Editor', 'Author Profiles', 'Comments', 'Newsletter', 'Social Sharing', 'Image/Video Upload', 'SEO', 'Related Posts', 'Tags', 'Admin Dashboard', 'Analytics'],
    designQuestion: "Do you need a custom design or do you have a reference website?",
    designOptions: ['Custom magazine design', 'Clean minimalist blog', 'I have reference site'],
    servicesOptions: ['Domain & Hosting', 'SEO', 'Content Support', 'Website Maintenance', 'Digital Marketing', 'No extra services needed']
  },
  "Education": {
    label: "Education",
    industryQuestion: "What type of education platform are you planning?",
    industryOptions: ['Coaching Institute', 'School', 'College', 'Online Courses', 'Tutor', 'LMS', 'Training Institute', 'Other'],
    goalQuestion: "What should students/users be able to do?",
    goalOptions: ['View Courses', 'Buy Courses', 'Watch Recorded Classes', 'Attend Live Classes', 'Download Notes', 'Take Quizzes', 'Track Progress', 'Get Certificates', 'Contact Teachers'],
    featureQuestion: "What features do you need?",
    featureOptions: ['Student Login', 'Teacher Login', 'Admin Dashboard', 'Course Management', 'Video Lessons', 'Live Classes', 'Online Payment', 'Quiz/Exam System', 'Certificates', 'Progress Tracking', 'Notifications', 'AI Tutor', 'Study Materials'],
    designQuestion: "Do you already have a design/reference website?",
    designOptions: ['Custom LMS design', 'Modern academy layout', 'I have reference site'],
    servicesOptions: ['Domain & Hosting', 'Payment Gateway Integration', 'AI Tutor Integration', 'SEO', 'Website Maintenance', 'No extra services needed']
  },
  "Booking/Service Website": {
    label: "Booking/Service Website",
    industryQuestion: "What type of service will customers book?",
    industryOptions: ['Salon', 'Doctor/Clinic', 'Hotel', 'Restaurant', 'Consultant', 'Gym/Fitness', 'Event', 'Repair Service', 'Home Service', 'Other'],
    goalQuestion: "How should customers make a booking?",
    goalOptions: ['Select Date & Time', 'Select Service', 'Select Staff/Provider', 'Request Booking', 'Instant Booking'],
    featureQuestion: "What features do you need?",
    featureOptions: ['Service Listing', 'Calendar', 'Time Slots', 'Online Booking', 'Online Payment', 'Booking Confirmation', 'Cancellation', 'Customer Login', 'Staff Dashboard', 'Admin Dashboard', 'Email Notifications', 'SMS Notifications', 'WhatsApp Notifications', 'Google Calendar Integration'],
    designQuestion: "Do you already have a design/reference website?",
    designOptions: ['Custom booking portal design', 'Sleek mobile-first layout', 'I have reference site'],
    servicesOptions: ['Domain & Hosting', 'Payment Gateway Integration', 'WhatsApp API Integration', 'SEO', 'Website Maintenance', 'No extra services needed']
  },
  "Custom Website": {
    label: "Custom Website",
    conceptQuestion: "Tell me about your website idea. What do you want the website to do?",
    goalQuestion: "What type of users will use your website?",
    goalOptions: ['End customers (B2C)', 'Business clients (B2B)', 'Internal employees', 'Multi-role portal', 'Other'],
    featureQuestion: "What are the main features you need?",
    featureOptions: ['Custom User Dashboards', 'Admin Panel', 'Real-time Chat', 'API Integration', 'Custom Workflows', 'AI Assistant', 'Database Sync', 'Payment Processing'],
    designQuestion: "Do you have any reference website or preferred design style?",
    designOptions: ['SaaS Modern UI', 'Futuristic / Glassmorphism', 'Corporate / Clean', 'Custom Figma design'],
    servicesOptions: ['Domain & Hosting', 'SEO', 'AI LLM Integration', 'Maintenance & Support', 'Digital Marketing', 'No extra services needed']
  }
};

// ============================================================
// SALES CONVERSATION STATE MANAGEMENT
// ============================================================
class SalesConversation {
  constructor() {
    this.reset();
  }

  reset() {
    this.stage = 'initial'; // initial, website_type, step_1_industry, step_2_goal, step_3_features, step_4_design, step_4b_reference, step_5_budget, step_6_timeline, step_7_services, lead_ready
    this.collectedData = {
      websiteType: null,
      businessIndustry: null,
      projectGoal: null,
      features: [],
      designRequirement: null,
      referenceDesign: null,
      budget: null,
      timeline: null,
      additionalServices: [],
      description: ''
    };
  }

  getNextQuestion(userInput) {
    const lowerInput = userInput.toLowerCase().trim();

    const categoryMappings = [
      { key: 'Business Website', aliases: ['business website', 'business'] },
      { key: 'E-commerce', aliases: ['e-commerce', 'ecommerce', 'online store', 'shop'] },
      { key: 'Portfolio', aliases: ['portfolio', 'resume'] },
      { key: 'Blog', aliases: ['blog', 'magazine', 'news portal'] },
      { key: 'Education', aliases: ['education', 'education website', 'lms', 'school', 'course', 'coaching'] },
      { key: 'Booking/Service Website', aliases: ['booking/service website', 'booking', 'service website', 'appointment', 'salon'] },
      { key: 'Custom Website', aliases: ['custom website', 'custom', 'saas', 'web app'] }
    ];

    // Initial trigger check
    if (this.stage === 'initial') {
      if (lowerInput.includes('website') || lowerInput.includes('web') ||
        lowerInput.includes('site') || lowerInput.includes('make a website') ||
        lowerInput.includes('build a website') || lowerInput.includes('create a website') ||
        lowerInput.includes('need a website') || lowerInput.includes('want a website')) {

        this.stage = 'website_type';
        return {
          text: "Absolutely! 🚀 What type of website are you looking to build?",
          options: [
            'Business Website',
            'E-commerce',
            'Portfolio',
            'Blog',
            'Education',
            'Booking/Service Website',
            'Custom Website'
          ],
          stage: 'website_type'
        };
      }
    }

    // Explicit category switch request at any point mid-conversation
    if (this.stage !== 'initial') {
      for (const cat of categoryMappings) {
        if (cat.aliases.some(alias => lowerInput === alias || lowerInput === `i want a ${alias}` || lowerInput === `i want an ${alias}` || lowerInput === `change to ${alias}`)) {
          this.switchCategory(cat.key);
          return this.getStep1Question(cat.key);
        }
      }
    }

    // Process conversation steps
    switch (this.stage) {
      case 'website_type': {
        const matched = categoryMappings.find(c =>
          c.aliases.some(alias => lowerInput === alias || lowerInput.includes(alias))
        );

        if (matched) {
          this.switchCategory(matched.key);
          return this.getStep1Question(matched.key);
        }

        return {
          text: "Please select one of the following website options:",
          options: [
            'Business Website',
            'E-commerce',
            'Portfolio',
            'Blog',
            'Education',
            'Booking/Service Website',
            'Custom Website'
          ],
          stage: 'website_type'
        };
      }

      case 'step_1_industry': {
        this.collectedData.businessIndustry = userInput;
        const currentCat = this.collectedData.websiteType || 'Business Website';
        const flow = WEBSITE_FLOW_CONFIG[currentCat] || WEBSITE_FLOW_CONFIG['Business Website'];

        // E-commerce skips goal question and goes directly to features
        if (!flow.goalQuestion) {
          this.stage = 'step_3_features';
          return {
            text: flow.featureQuestion,
            options: flow.featureOptions,
            stage: 'step_3_features'
          };
        }

        this.stage = 'step_2_goal';
        return {
          text: flow.goalQuestion,
          options: flow.goalOptions,
          stage: 'step_2_goal'
        };
      }

      case 'step_2_goal': {
        this.collectedData.projectGoal = userInput;
        this.stage = 'step_3_features';
        const currentCat = this.collectedData.websiteType || 'Business Website';
        const flow = WEBSITE_FLOW_CONFIG[currentCat] || WEBSITE_FLOW_CONFIG['Business Website'];

        return {
          text: flow.featureQuestion,
          options: flow.featureOptions,
          stage: 'step_3_features'
        };
      }

      case 'step_3_features': {
        const currentCat = this.collectedData.websiteType || 'Business Website';
        const flow = WEBSITE_FLOW_CONFIG[currentCat] || WEBSITE_FLOW_CONFIG['Business Website'];

        const isFinished = lowerInput.includes('done') ||
          lowerInput.includes('finish') ||
          lowerInput.includes('that\'s all') ||
          lowerInput.includes('no more') ||
          lowerInput.includes('done adding');

        if (!isFinished) {
          if (!this.collectedData.features.includes(userInput)) {
            this.collectedData.features.push(userInput);
          }

          // Filter out already selected features from CATEGORY-SPECIFIC feature options ONLY
          const remainingOptions = flow.featureOptions.filter(
            opt => !this.collectedData.features.includes(opt)
          );

          const doneLabel = currentCat === 'Portfolio' ? 'Done adding sections' : 'Done adding features';
          const optionsList = [...remainingOptions, doneLabel];

          return {
            text: `Added "${userInput}". Are there any other features or sections you'd like to add?\n\n(Type or click '${doneLabel}' when finished)`,
            options: optionsList,
            stage: 'step_3_features'
          };
        }

        this.stage = 'step_4_design';
        return {
          text: flow.designQuestion,
          options: flow.designOptions,
          stage: 'step_4_design'
        };
      }

      case 'step_4_design': {
        this.collectedData.designRequirement = userInput;
        const currentCat = this.collectedData.websiteType || 'Business Website';
        const flow = WEBSITE_FLOW_CONFIG[currentCat] || WEBSITE_FLOW_CONFIG['Business Website'];

        // Portfolio has a specific reference question step
        if (flow.referenceQuestion) {
          this.stage = 'step_4b_reference';
          return {
            text: flow.referenceQuestion,
            options: flow.referenceOptions,
            stage: 'step_4b_reference'
          };
        }

        this.stage = 'step_5_budget';
        return this.getBudgetQuestion(currentCat);
      }

      case 'step_4b_reference': {
        this.collectedData.referenceDesign = userInput;
        this.stage = 'step_5_budget';
        const currentCat = this.collectedData.websiteType || 'Portfolio';
        return this.getBudgetQuestion(currentCat);
      }

      case 'step_5_budget': {
        const selectedType = this.collectedData.websiteType || 'Business Website';
        const checkValidation = validateBudget(selectedType, userInput);

        if (!checkValidation.isValid) {
          return {
            text: `The minimum development price for a **${checkValidation.category.label}** at WaveMind Solutions is **${formatINR(checkValidation.minRequired)}**. Your current budget of ${userInput} is below the minimum required for this project.\n\n**Suggested minimum budget: ${formatINR(checkValidation.minRequired)}**\n\nPlease reply with a valid budget equal to or greater than ${formatINR(checkValidation.minRequired)}.`,
            options: [
              formatINR(checkValidation.minRequired),
              formatINR(checkValidation.category.recommended),
              formatINR(checkValidation.category.max)
            ],
            stage: 'step_5_budget'
          };
        }

        const numericVal = Number(userInput.toString().replace(/[^\d]/g, '')) || checkValidation.minRequired;
        this.collectedData.budget = formatINR(numericVal);
        this.stage = 'step_6_timeline';
        return {
          text: "When would you like to launch the project?",
          options: ['ASAP', 'Within 1 month', '1–3 months', 'Flexible'],
          stage: 'step_6_timeline'
        };
      }

      case 'step_6_timeline': {
        this.collectedData.timeline = userInput;
        this.stage = 'step_7_services';
        const currentCat = this.collectedData.websiteType || 'Business Website';
        const flow = WEBSITE_FLOW_CONFIG[currentCat] || WEBSITE_FLOW_CONFIG['Business Website'];

        return {
          text: "Would you also like help with domain & hosting, SEO, maintenance, digital marketing, or other services?",
          options: flow.servicesOptions,
          stage: 'step_7_services'
        };
      }

      case 'step_7_services': {
        if (!lowerInput.includes('no') && !lowerInput.includes('none') && !lowerInput.includes('done')) {
          if (!this.collectedData.additionalServices.includes(userInput)) {
            this.collectedData.additionalServices.push(userInput);
          }
        }
        this.stage = 'lead_ready';
        return this.generateLeadConversion();
      }

      case 'lead_ready': {
        if (lowerInput.includes('yes') || lowerInput.includes('register') ||
          lowerInput.includes('login') || lowerInput.includes('create') ||
          lowerInput.includes('submit') || lowerInput.includes('sign up')) {
          return {
            text: "Great! 🚀 Please register or log in to your account and submit your project request.\n\nI've already collected the details from our conversation, so your requirement form will be automatically filled for you.\n\nYou'll only need to review the information and submit it.\n\nOur development team will then review your project and contact you to discuss the requirements and final quotation.",
            stage: 'lead_ready',
            cta: { label: 'Create Project Request', path: '/register' }
          };
        }
        return this.generateLeadConversion();
      }

      default:
        return null;
    }
  }

  switchCategory(newCategory) {
    this.collectedData = {
      websiteType: newCategory,
      businessIndustry: null,
      projectGoal: null,
      features: [],
      designRequirement: null,
      referenceDesign: null,
      budget: null,
      timeline: null,
      additionalServices: [],
      description: ''
    };
    this.stage = 'step_1_industry';
  }

  getStep1Question(projectType) {
    const flow = WEBSITE_FLOW_CONFIG[projectType] || WEBSITE_FLOW_CONFIG['Business Website'];

    if (projectType === 'Custom Website') {
      return {
        text: flow.conceptQuestion,
        stage: 'step_1_industry'
      };
    }

    return {
      text: flow.industryQuestion,
      options: flow.industryOptions,
      stage: 'step_1_industry'
    };
  }

  getBudgetQuestion(projectType) {
    const pricingCat = getPricingForCategory(projectType);
    return {
      text: `What is your approximate budget for your ${pricingCat.label}?\n\n• **Minimum budget:** ${formatINR(pricingCat.min)}\n• **Recommended budget:** ${formatINR(pricingCat.recommended)}\n• **Premium scope:** Up to ${formatINR(pricingCat.max)}\n\n(Please specify your target budget amount)`,
      options: [
        formatINR(pricingCat.min),
        formatINR(pricingCat.recommended),
        formatINR(pricingCat.max)
      ],
      stage: 'step_5_budget'
    };
  }

  generateLeadConversion() {
    const currentCat = this.collectedData.websiteType || 'Business Website';
    const calcResult = calculateProjectPrice({
      websiteType: currentCat,
      pagesCount: 6,
      designComplexity: this.collectedData.designRequirement || 'Professional',
      features: this.collectedData.features || [],
      animationComplexity: 'Basic animations',
      backendComplexity: 'Basic backend'
    });

    const estCostFormatted = formatINR(calcResult.estimatedCost);

    const response = {
      text: `### Estimated Project Cost
**${estCostFormatted}** (${calcResult.level} Package)

**Recommended Range: ${calcResult.recommendedRangeText}**

> Based on your project specifications for **${calcResult.category.label}**, requested features (${this.collectedData.features.length} items), and design requirements, the estimated development cost is **${estCostFormatted}**.

📋 **Project Summary:**
• **Website Type:** ${this.collectedData.websiteType || 'Not specified'}
• **Business / Industry:** ${this.collectedData.businessIndustry || 'Not specified'}
${this.collectedData.projectGoal ? `• **Goal / Purpose:** ${this.collectedData.projectGoal}` : ''}
${this.collectedData.features.length > 0 ? `• **Features:** ${this.collectedData.features.join(', ')}` : ''}
${this.collectedData.designRequirement ? `• **Design:** ${this.collectedData.designRequirement}` : ''}
${this.collectedData.referenceDesign ? `• **Reference:** ${this.collectedData.referenceDesign}` : ''}
${this.collectedData.budget ? `• **Budget:** ${this.collectedData.budget}` : ''}
${this.collectedData.timeline ? `• **Timeline:** ${this.collectedData.timeline}` : ''}
${this.collectedData.additionalServices.length > 0 ? `• **Additional Services:** ${this.collectedData.additionalServices.join(', ')}` : ''}

Would you like to create your project request now?`,
      stage: 'lead_ready',
      cta: { label: 'Create Project Request', path: '/register' },
      actionButtons: [
        { label: '📝 Create Project Request', prompt: 'Yes, I want to create project request' },
        { label: '📞 Contact Sales', prompt: 'I want to speak with a sales representative' }
      ]
    };

    return response;
  }

  isServiceIntent(text) {
    const serviceKeywords = [
      'website', 'web', 'site', 'make a website', 'build a website', 'create a website',
      'e-commerce', 'ecommerce', 'online store', 'shop', 'portfolio', 'blog',
      'business website', 'company website', 'landing page',
      'register', 'sign up', 'create account', 'submit project',
      'pricing', 'cost', 'quote', 'budget', 'estimate'
    ];
    const lower = text.toLowerCase();
    return serviceKeywords.some(keyword => lower.includes(keyword));
  }
}

// ============================================================
// API FUNCTIONS
// ============================================================
async function fetchRealLLMResponse(provider, apiKey, userPrompt, activeHistory = []) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('No API key configured');
  }

  const systemPrompt = "You are WaveMind Solutions' helpful AI Assistant. Answer the user's general, technical, or personal inquiry professionally, concisely, and accurately in standard markdown format. If the user asks about services, guide them to our website development services.";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (provider === 'openai') {
      const messagesPayload = [{ role: 'system', content: systemPrompt }];
      (activeHistory || []).slice(-4).forEach(m => {
        messagesPayload.push({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text || 'Context message'
        });
      });
      messagesPayload.push({ role: 'user', content: userPrompt });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      clearTimeout(timeoutId);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status} OpenAI API Error`);
      }

      const data = await res.json();
      return data.choices[0]?.message?.content || null;
    } else if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const contentsPayload = [];
      (activeHistory || []).slice(-6).forEach(m => {
        contentsPayload.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text || '' }]
        });
      });

      contentsPayload.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Inquiry: ${userPrompt}` }]
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: contentsPayload,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topK: 40,
            topP: 0.95
          }
        })
      });

      clearTimeout(timeoutId);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status} Gemini API Error`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }

  throw new Error('Unsupported API provider selected.');
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ChatInterface() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeConvId, setActiveConvId] = useState(null);

  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const messagesEndRef = useRef(null);
  const isMounted = useRef(true);
  const salesConversation = useRef(new SalesConversation());

  const handleCreateProjectRequest = useCallback((overrideData = null) => {
    const collected = overrideData || salesConversation.current?.collectedData || {};

    const pendingRequest = {
      websiteType: collected.websiteType || 'Business Website',
      businessType: collected.businessIndustry || collected.businessType || 'General Business',
      projectGoal: collected.projectGoal || '',
      features: (collected.features && collected.features.length > 0)
        ? collected.features
        : ['Contact Form', 'Admin Dashboard', 'WhatsApp Integration', 'SEO'],
      designPreference: collected.designRequirement || collected.designPreference || 'Custom Design',
      budget: collected.budget || '₹15,000',
      timeline: collected.timeline || 'Within 1 month',
      additionalServices: (collected.additionalServices && collected.additionalServices.length > 0)
        ? collected.additionalServices
        : ['SEO'],
      phone: collected.phone || collected.contact || '',
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem('wavemind_pending_project_request', JSON.stringify(pendingRequest));

    if (user) {
      navigate('/dashboard/client/submit');
    } else {
      navigate('/register');
    }
  }, [user, navigate]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (!messagesEndRef.current) return;
    const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 350);
    if (force || isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: force ? 'smooth' : 'instant' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, scrollToBottom]);

  // Mode 1 (Guest) vs Mode 2 (Authenticated) Chat State Management
  useEffect(() => {
    if (user) {
      // MODE 2: AUTHENTICATED USER — Load MongoDB conversation bound to req.user._id
      getOrCreateConversation()
        .then((res) => {
          if (res.data && isMounted.current) {
            setActiveConvId(res.data._id);
            if (Array.isArray(res.data.messages) && res.data.messages.length > 0) {
              const mapped = res.data.messages.map((m, idx) => ({
                id: `msg-${idx}-${Date.now()}`,
                sender: m.role === 'assistant' ? 'ai' : 'user',
                text: m.content,
                fullText: m.content,
                modelUsed: m.role === 'assistant' ? 'WaveMind AI' : undefined,
                timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              }));
              setMessages(mapped);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to load user chat from MongoDB:", err);
        });
    } else {
      // MODE 1: GUEST USER — React memory state ONLY. Resets on reload. 0 MongoDB records created.
      setActiveConvId(null);
      setMessages([]);
      salesConversation.current.reset();
    }
  }, [user]);

  const handleClearChat = () => {
    setMessages([]);
    salesConversation.current.reset();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleSelectThread = (thread) => {
    setMessages(thread.messages || []);
    salesConversation.current.reset();
    setShowHistoryModal(false);
  };

  const handleNewThread = () => {
    setMessages([]);
    salesConversation.current.reset();
    setShowHistoryModal(false);
  };

  const toggleSpeech = (id, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`|_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id, type) => {
    setLikedMap(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleSendMessage = async (msgData) => {
    const userMsgId = 'user-' + Date.now();
    const userText = msgData.text || (msgData.image ? 'Uploaded image for review' : 'Attached file(s) for review');

    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text: userText,
      files: msgData.files,
      image: msgData.image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessagesList = [...messages, newUserMsg];
    setMessages(newMessagesList);
    setIsGenerating(true);

    const promptText = msgData.text || '';
    const aiMsgId = 'ai-' + Date.now();

    // MODE 2: AUTHENTICATED USER — Persist message & AI response to MongoDB
    if (user && activeConvId) {
      try {
        const res = await sendAuthChatMessage(activeConvId, promptText, {
          websiteType: salesConversation.current.collectedData.websiteType || '',
          businessType: salesConversation.current.collectedData.businessType || '',
          budget: salesConversation.current.collectedData.budget || ''
        });

        if (res.assistantMessage && isMounted.current) {
          const aiMsg = {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: res.assistantMessage.content,
            fullText: res.assistantMessage.content,
            modelUsed: 'WaveMind AI (MongoDB Persisted)',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cta: { label: 'Create Project Request', action: () => handleCreateProjectRequest() }
          };
          setMessages(prev => [...prev, aiMsg]);
        }
      } catch (err) {
        console.error("Failed to persist message to MongoDB:", err);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // MODE 1: GUEST USER — React state in-memory ONLY. Zero MongoDB persistence.
    const isServiceRelated = salesConversation.current.isServiceIntent(promptText) ||
      salesConversation.current.stage !== 'initial';

    if (isServiceRelated) {
      const nextQuestion = salesConversation.current.getNextQuestion(promptText);

      if (nextQuestion) {
        const aiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: nextQuestion.text,
          fullText: nextQuestion.text,
          modelUsed: 'WaveMind Sales AI (Guest In-Memory)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: nextQuestion.cta,
          actionButtons: nextQuestion.options ?
            nextQuestion.options.map(opt => ({ label: opt, prompt: opt })) :
            nextQuestion.actionButtons || []
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsGenerating(false);
        return;
      }
    }

    // For non-service queries, use API or predefined responses
    const hasValidKey = SYSTEM_API_KEY && SYSTEM_API_KEY.trim() !== '';
    const isGeminiKey = SYSTEM_API_PROVIDER === 'gemini' && SYSTEM_API_KEY.startsWith('AIzaSy');
    const isOpenAIKey = SYSTEM_API_PROVIDER === 'openai' && SYSTEM_API_KEY.startsWith('sk-');

    if (hasValidKey && (isGeminiKey || isOpenAIKey)) {
      try {
        const realText = await fetchRealLLMResponse(
          SYSTEM_API_PROVIDER,
          SYSTEM_API_KEY,
          promptText,
          messages
        );

        if (realText && isMounted.current) {
          const aiMsg = {
            id: aiMsgId,
            sender: 'ai',
            text: realText,
            fullText: realText,
            modelUsed: `${SYSTEM_API_PROVIDER.toUpperCase()} AI Engine`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cta: { label: 'Explore Our Services', path: '/services' }
          };
          const updated = [...newMessagesList, aiMsg];
          setMessages(updated);
          saveActiveThread(updated);
          setIsGenerating(false);
          return;
        }
      } catch (err) {
        console.warn('External API call failed:', err.message);
      }
    }

    // Fallback response for general queries
    const fallbackMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: `Thank you for your message! I'm here to help you with website development and digital services. 

If you're interested in building a website, I can guide you through the process. Just let me know what type of website you'd like to create!

You can also ask me about:
• Website development
• E-commerce solutions
• Mobile app development
• AI integration
• Pricing and packages

How can I assist you today?`,
      fullText: `Thank you for your message! I'm here to help you with website development and digital services. 

If you're interested in building a website, I can guide you through the process. Just let me know what type of website you'd like to create!

You can also ask me about:
• Website development
• E-commerce solutions
• Mobile app development
• AI integration
• Pricing and packages

How can I assist you today?`,
      modelUsed: 'WaveMind Assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cta: { label: 'Start Your Project', path: '/contact' }
    };

    const updated = [...newMessagesList, fallbackMsg];
    setMessages(updated);
    saveActiveThread(updated);
    setIsGenerating(false);
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
  };

  const formatInlineStyles = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 font-mono text-xs border border-purple-200 dark:border-purple-500/30">$1</code>');
  };

  const renderFormattedText = (content, isStreaming = false) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-200 font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('📋 **Project Summary:**')) {
            return (
              <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 my-2 border border-purple-200 dark:border-purple-700/50">
                <p className="font-bold text-gray-800 dark:text-white mb-2">📋 Project Summary:</p>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {lines.slice(idx + 1).map((summaryLine, sIdx) => {
                    if (summaryLine.trim().startsWith('•')) {
                      return <div key={sIdx}>{summaryLine}</div>;
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          }
          if (line.startsWith('• ')) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1 my-1.5 group">
                <span className="text-purple-500 font-bold mt-1 text-xs">✦</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(line.substring(2)) }} />
              </div>
            );
          }
          if (line.trim() === '') return <div key={idx} className="h-1.5" />;
          return <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineStyles(line) }} />;
        })}

        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    );
  };

  const hasApiKey = SYSTEM_API_KEY && SYSTEM_API_KEY.trim() !== '';

  return (
    <div className="w-full relative font-sans text-gray-900 dark:text-gray-100">
      {/* API Key Status Banner */}
      {!hasApiKey && (
        <div className="max-w-6xl mx-auto px-4 mb-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>
              <strong>API Key Not Configured:</strong> Using predefined responses.
              To enable AI-powered responses, set your API key in the configuration.
            </span>
          </div>
        </div>
      )}

      {/* Top Header Control Bar */}
      <div className="max-w-6xl mx-auto px-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-[#0c0920] border border-gray-200 dark:border-purple-500/30 font-semibold text-gray-800 dark:text-purple-200 shadow-sm hover:border-purple-400 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-500" />
              <span>{selectedModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-60 rounded-2xl bg-white dark:bg-[#0d0924] border border-gray-200 dark:border-purple-500/30 shadow-2xl p-2 z-40 space-y-1">
                {AI_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${selectedModel.id === m.id
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-gray-700 dark:text-purple-200 hover:bg-purple-500/15'
                      }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right History Vault Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#0c0920] border border-gray-200 dark:border-purple-500/30 font-semibold text-gray-700 dark:text-purple-200 hover:border-purple-400 transition-all cursor-pointer"
            title="Open Chat Threads Vault"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>Thread Vault</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
              title="Clear current chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 min-h-[45vh] pb-8">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6 sm:py-10 flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-full blur-2xl opacity-30 animate-pulse pointer-events-none" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-2xl"
              >
                <div className="w-full h-full bg-white dark:bg-[#0a071a] rounded-[22px] flex items-center justify-center border border-gray-200 dark:border-purple-400/30">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-300" />
                </div>
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#06080f]">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              WaveMind Sales Assistant
            </h2>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl font-medium leading-relaxed text-center mb-2">
              Let me help you build your dream website! I'll guide you through the process and understand your requirements.
            </p>

            <p className="text-xs sm:text-sm text-gray-400 dark:text-purple-300/60 font-mono mb-10">
              Professional Website Development • E-commerce • Mobile Apps • AI Solutions
            </p>

            {/* Suggested Cards */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-10"
            >
              {SUGGESTED_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage({ text: card.prompt })}
                    className="group p-6 sm:p-7 rounded-[2.5rem] bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700 hover:border-purple-500/50 shadow-lg hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden cursor-pointer w-full"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} p-3 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-400 transition-colors">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Start Conversation</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Quick Prompts */}
            <div className="w-full pt-6 border-t border-gray-200/60 dark:border-gray-800">
              <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider text-left mb-4">
                Quick Start Prompts
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {QUICK_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage({ text: item.prompt })}
                    className="px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white/70 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-300 transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Chat Thread */
          <div className="space-y-6 sm:space-y-8 pt-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-0.5 shrink-0 shadow-lg">
                    <div className="w-full h-full bg-white dark:bg-[#0b081c] rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[84%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.image && (
                    <div className="mb-2.5 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-w-xs shadow-xl">
                      <img src={msg.image.url} alt="User upload" className="w-full h-auto object-cover max-h-56" />
                    </div>
                  )}

                  <div
                    className={`p-5 sm:p-6 rounded-3xl text-sm sm:text-base ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white rounded-tr-xs shadow-xl'
                      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-xs shadow-lg'
                      }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div>
                        {renderFormattedText(msg.text, isGenerating && msg.text !== msg.fullText)}

                        {/* Action Buttons Row */}
                        {msg.actionButtons && msg.actionButtons.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap gap-2">
                            {msg.actionButtons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                onClick={() => handleSendMessage({ text: btn.prompt })}
                                className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold text-xs hover:bg-purple-500/20 transition-all cursor-pointer"
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {msg.cta && msg.text && (
                          <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                              <Zap className="w-3.5 h-3.5 text-purple-500" />
                              Next Step:
                            </span>
                            <button
                              onClick={() => {
                                if (msg.cta.path === '/register' || msg.cta.label.includes('Project Request') || msg.cta.label.includes('Register')) {
                                  handleCreateProjectRequest();
                                } else {
                                  navigate(msg.cta.path);
                                }
                              }}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:scale-105 transition-all cursor-pointer"
                            >
                              <span>{msg.cta.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {msg.sender === 'ai' && msg.text && (
                    <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400 text-xs bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full px-3.5 py-1 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                      <button
                        onClick={() => toggleSpeech(msg.id, msg.text)}
                        className="p-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="Read aloud"
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                      <button
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`p-1 transition-colors ${likedMap[msg.id] === 'like' ? 'text-emerald-500' : 'hover:text-gray-900 dark:hover:text-white'}`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`p-1 transition-colors ${likedMap[msg.id] === 'dislike' ? 'text-red-500' : 'hover:text-gray-900 dark:hover:text-white'}`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                      <span className="text-[10px] text-gray-400 font-medium">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-0.5 shrink-0 shadow-lg">
                  <div className="w-full h-full bg-white dark:bg-[#0b081c] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1.5 font-mono">WaveMind Sales AI thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Input Bar */}
      <div className="sticky bottom-0 z-30 bg-white/80 dark:bg-[#06080f]/90 backdrop-blur-2xl py-3 sm:py-4 border-t border-gray-200/80 dark:border-purple-500/15 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <ChatInput
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStopGenerating={handleStopGenerating}
        />
      </div>

      {/* Modals */}
      <ThreadHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
      />
    </div>
  );
}