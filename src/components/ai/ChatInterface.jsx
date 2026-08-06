import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, Volume2, VolumeX, RotateCcw,
  Trash2, ArrowRight, ThumbsUp, ThumbsDown, Code, Workflow,
  Smartphone, Briefcase, Bot, User, ArrowDown, Send,
  Mic, Paperclip, X, Zap, MessageSquare, Share2, Bookmark,
  ChevronDown, ChevronUp, Maximize2, Minimize2, Settings,
  Sliders, Cpu, Layers, Globe, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import ChatInput from './ChatInput';
import { Link } from 'react-router-dom';

const AI_MODELS = [
  { id: 'gpt-5.5', name: 'GPT-5.5 Turbo', provider: 'OpenAI', badge: 'Fastest' },
  { id: 'gemini-1.5', name: 'Gemini 1.5 Pro', provider: 'Google AI', badge: 'Smart' },
  { id: 'wavemind-llm', name: 'WaveMind Enterprise', provider: 'Custom LLM', badge: 'Trained' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: 'Creative' }
];

const QUICK_PROMPTS = [
  { label: '✨ Build an AI chatbot', prompt: 'Can you help me build a custom AI chatbot for my business?' },
  { label: '⚡ Automate my workflow', prompt: 'What AI automation workflows can WaveMind integrate for my team?' },
  { label: '🚀 Design a SaaS website', prompt: 'I want to design a modern SaaS web application with React and Next.js.' },
  { label: '📈 Improve my business', prompt: 'How can WaveMind AI solutions help scale our business growth and sales?' },
  { label: '💻 Create a React application', prompt: 'Can you outline the architecture for a high-performance React application?' },
  { label: '🤖 Build AI agents', prompt: 'How do autonomous AI agents work, and how can WaveMind deploy them for us?' }
];

const SUGGESTED_CARDS = [
  {
    icon: Code,
    title: 'Build a Web Application',
    desc: 'Design & code a high-performance React website with modern UI/UX',
    prompt: 'Can you help me design and build a modern web application for my business with WaveMind Solutions?',
    gradient: 'from-purple-600 via-indigo-600 to-blue-500'
  },
  {
    icon: Workflow,
    title: 'Automate Workflows',
    desc: 'Integrate AI LLM agents & CRM data pipelines to save time',
    prompt: 'What AI automation solutions does WaveMind offer to streamline business operations?',
    gradient: 'from-pink-600 via-purple-600 to-indigo-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile App Strategy',
    desc: 'Architect a cross-platform iOS & Android mobile app experience',
    prompt: 'Tell me about WaveMind\'s mobile app development capabilities for iOS and Android.',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-500'
  },
  {
    icon: Briefcase,
    title: 'Pricing & Cost Estimate',
    desc: 'Calculate project pricing tiers, delivery timeline & engagement model',
    prompt: 'What are WaveMind\'s pricing packages and engagement models for new projects?',
    gradient: 'from-amber-500 via-orange-600 to-rose-500'
  }
];

const generateAiResponse = (userPrompt) => {
  const lower = userPrompt.toLowerCase();

  if (lower.includes('website') || lower.includes('web') || lower.includes('react') || lower.includes('saas')) {
    return {
      text: `### 🚀 WaveMind Custom Web Application Services

At **WaveMind Solutions**, we craft enterprise-grade, lightning-fast web applications tailored to your business goals.

#### What We Deliver:
* **Frontend Excellence:** Built with React 18, Next.js 14, Tailwind CSS, and Framer Motion for rich interactive UIs.
* **Backend Robustness:** Scalable APIs powered by Node.js, Python, PostgreSQL, and Redis.
* **Edge Performance:** Optimized page loads with 99.9% Google Lighthouse performance scores.
* **SEO & Analytics:** Native SSR, Schema.org structured data, and automated tracking.

\`\`\`jsx
// Example WaveMind Core Integration
import { WaveApp } from '@wavemind/core';

export default function App() {
  return <WaveApp theme="dark" aiEngine="gemini-pro" />;
}
\`\`\`

#### Next Steps:
Submit your project requirements directly to our engineering team or request an architecture review.`,
      cta: { label: 'Submit Web Requirement', path: '/contact' }
    };
  }

  if (lower.includes('automation') || lower.includes('ai') || lower.includes('workflow') || lower.includes('agent') || lower.includes('crm')) {
    return {
      text: `### 🤖 WaveMind AI & Workflow Automation

Transform manual operations into self-driving intelligent workflows with our agentic AI integration services.

#### Key Capabilities:
1. **Custom LLM Agents:** Fine-tuned OpenAI / Gemini models customized on your internal company docs.
2. **Automated CRM & ERP Sync:** Seamless integration with HubSpot, Salesforce, Zoho, and custom ERPs.
3. **Smart Lead Qualification:** AI chatbots and voice agents that capture and book high-intent leads 24/7.
4. **Data Extraction:** Parse unstructured PDFs, invoices, and contracts automatically.`,
      cta: { label: 'Explore Automation Services', path: '/services' }
    };
  }

  if (lower.includes('mobile') || lower.includes('app') || lower.includes('ios') || lower.includes('android')) {
    return {
      text: `### 📱 Cross-Platform Mobile Application Development

We build intuitive, fluid mobile experiences that users love on both iOS and Android.

#### Highlights:
* **Frameworks:** React Native & Flutter for 60fps native performance.
* **Offline-First Storage:** Local sqlite/realm caching for uninterrupted offline usage.
* **Real-time Push Notifications:** Firebase & OneSignal integration for high user retention.
* **Biometric Auth & Security:** FaceID, TouchID, and encrypted storage.`,
      cta: { label: 'Request Mobile Consultation', path: '/contact' }
    };
  }

  if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('plan')) {
    return {
      text: `### 💼 WaveMind Transparent Engagement & Pricing

We offer flexible engagement tiers designed for startups, growing companies, and enterprise organizations:

* **Startup MVP:** 2 – 3 Weeks delivery • Core UI/UX, Auth, Database, Responsive Design.
* **Growth Business:** 4 – 6 Weeks delivery • Custom Workflows, AI Agent, Analytics, API Integrations.
* **Enterprise Suite:** Custom Sprints • Multi-tenant SaaS, Dedicated Specialist Team, 24/7 SLA.

#### Need a custom estimate?
Tell me a bit more about your feature scope or schedule a discovery session with our tech lead!`,
      cta: { label: 'Get Custom Quote', path: '/contact' }
    };
  }

  return {
    text: `### 💡 WaveMind AI Analysis: "${userPrompt}"

Thank you for asking! As **WaveMind Solutions' AI Assistant**, I am configured to help you design, deploy, and scale modern web applications, AI automation agents, and custom enterprise software.

#### Our Recommended Blueprint:
1. **Discovery & Architecture:** We analyze product requirements and technical architecture.
2. **Rapid Prototyping:** We deliver interactive wireframes and functional proof-of-concepts.
3. **Production Deployment:** CI/CD pipeline deployment with enterprise security and analytics.

Is there a specific feature, tech stack, or deadline you would like us to target for your project?`,
    cta: { label: 'Submit Project Brief', path: '/contact' }
  };
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [likedMap, setLikedMap] = useState({});
  
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [persona, setPersona] = useState('Enterprise Consultant');
  const [temperature, setTemperature] = useState(0.7);

  const messagesEndRef = useRef(null);

  // Smart auto-scroll: only scroll if forced (new message) or if user is near bottom
  const scrollToBottom = useCallback((force = false) => {
    if (!messagesEndRef.current) return;
    const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 350);
    if (force || isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: force ? 'smooth' : 'instant' });
    }
  }, []);

  // Scroll smoothly when a new message is added
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, scrollToBottom]);

  const handleClearChat = () => {
    setMessages([]);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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

  const handleSendMessage = (msgData) => {
    const userMsgId = 'user-' + Date.now();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text: msgData.text || (msgData.image ? 'Uploaded an image for review' : 'Attached files for review'),
      files: msgData.files,
      image: msgData.image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsGenerating(true);

    const promptText = msgData.text || 'general project query';
    const aiResult = generateAiResponse(promptText);

    setTimeout(() => {
      const aiMsgId = 'ai-' + Date.now();
      const fullText = aiResult.text;

      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: '',
          fullText: fullText,
          modelUsed: selectedModel.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: aiResult.cta
        }
      ]);

      let currentIndex = 0;
      const chunkSize = 10;
      const interval = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= fullText.length) {
          clearInterval(interval);
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
          setIsGenerating(false);
        } else {
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText.slice(0, currentIndex) } : m));
        }
      }, 30);
    }, 300);
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
  };

  const formatInlineStyles = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 font-mono text-xs border border-purple-500/30">$1</code>');
  };

  const renderFormattedText = (content, isStreaming = false) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-3 text-sm md:text-base leading-relaxed text-purple-100/90 font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-pink-200 mt-4 mb-2">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-sm md:text-base font-bold text-white mt-3 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full" />
                {line.replace('#### ', '')}
              </h4>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1 my-1.5 group">
                <span className="text-purple-400 font-bold mt-1 text-xs">✦</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(line.substring(2)) }} />
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 my-1.5 group">
                <span className="text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full text-xs border border-purple-500/30">
                  {line.match(/^\d+\./)[0]}
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(line.replace(/^\d+\.\s/, '')) }} />
              </div>
            );
          }
          if (line.startsWith('```')) {
            return (
              <div key={idx} className="my-4 font-mono text-xs rounded-2xl bg-[#070512] text-purple-100 p-4 border border-purple-500/25 overflow-x-auto shadow-2xl relative group">
                <div className="text-purple-300/70 text-[11px] mb-2 font-sans flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-purple-400" />
                    WaveMind Code Integration
                  </span>
                  <button
                    onClick={() => handleCopy('code-' + idx, line.replace(/```[a-z]*/g, ''))}
                    className="hover:text-white transition-colors px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 border border-purple-500/30"
                  >
                    {copiedId === 'code-' + idx ? (
                      <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3"/> Copied!</span>
                    ) : (
                      'Copy code'
                    )}
                  </button>
                </div>
                <pre className="text-purple-200/90 leading-relaxed font-mono">{line.replace(/```[a-z]*/g, '')}</pre>
              </div>
            );
          }
          if (line.trim() === '') return <div key={idx} className="h-1.5" />;

          return <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineStyles(line) }} />;
        })}

        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full relative font-sans text-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[45vh] pb-8">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6 sm:py-10 flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-5">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-2xl shadow-purple-500/40"
              >
                <div className="w-full h-full bg-[#0a071a] rounded-[22px] flex items-center justify-center border border-purple-400/30">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300" />
                </div>
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#06080f]">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight mb-3">
              Welcome to WaveMind AI
            </h2>

            <p className="text-base sm:text-lg text-purple-200/80 max-w-2xl font-normal leading-relaxed text-center mb-2">
              Your intelligent AI partner for web development, AI automation, mobile apps, cloud solutions, and business growth.
            </p>

            <p className="text-xs sm:text-sm text-purple-400/70 font-mono mb-8">
              Ask anything below to get started.
            </p>

            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-8"
            >
              {SUGGESTED_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={idx}
                    variants={cardItemVariants}
                    whileHover={{ y: -6, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage({ text: card.prompt })}
                    className="group p-6 sm:p-7 rounded-2xl bg-[#0c0822]/60 hover:bg-[#0f0a2c]/90 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/60 shadow-lg hover:shadow-[0_12px_30px_rgba(168,85,247,0.25)] transition-all duration-300 text-left relative overflow-hidden cursor-pointer w-full"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-sm text-purple-300/70 line-clamp-2 leading-relaxed pl-0.5">
                          {card.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Prompt AI</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            <div className="w-full pt-4 border-t border-purple-500/15">
              <p className="text-[11px] font-mono text-purple-400/60 uppercase tracking-wider text-left mb-3">
                Quick Actions
              </p>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {QUICK_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage({ text: item.prompt })}
                    className="px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-purple-950/40 border border-purple-500/20 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-0.5 shrink-0 shadow-lg shadow-purple-500/30">
                    <div className="w-full h-full bg-[#0b081c] rounded-[10px] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[84%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                  {msg.image && (
                    <div className="mb-2.5 rounded-2xl overflow-hidden border border-purple-500/30 max-w-xs shadow-xl">
                      <img src={msg.image.url} alt="User upload" className="w-full h-auto object-cover max-h-56" />
                    </div>
                  )}

                  <div
                    className={`p-4.5 sm:p-6 rounded-2xl text-sm sm:text-base ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-tr-xs shadow-lg shadow-purple-950/60 border border-purple-400/20'
                        : 'bg-[#0c091f]/85 backdrop-blur-xl border border-purple-500/20 text-purple-100 rounded-tl-xs shadow-xl'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div>
                        {renderFormattedText(msg.text, isGenerating && msg.text !== msg.fullText)}

                        {msg.cta && msg.text && (
                          <div className="mt-5 pt-3.5 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs text-purple-300/70 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-purple-400" />
                              Recommended Action:
                            </span>
                            <Link
                              to={msg.cta.path}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all border border-purple-300/30"
                            >
                              <span>{msg.cta.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {msg.sender === 'ai' && msg.text && (
                    <div className="flex items-center gap-2 mt-2 text-purple-300/60 text-xs bg-purple-950/30 backdrop-blur-md rounded-full px-3 py-1 border border-purple-500/20">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 hover:text-white transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <div className="w-px h-3 bg-purple-500/20" />
                      <button
                        onClick={() => toggleSpeech(msg.id, msg.text)}
                        className="p-1 hover:text-white transition-colors"
                        title="Read aloud"
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="w-px h-3 bg-purple-500/20" />
                      <button
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`p-1 transition-colors ${likedMap[msg.id] === 'like' ? 'text-emerald-400' : 'hover:text-white'}`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`p-1 transition-colors ${likedMap[msg.id] === 'dislike' ? 'text-red-400' : 'hover:text-white'}`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-3 bg-purple-500/20" />
                      <span className="text-[10px] text-purple-400/50">{msg.timestamp}</span>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-0.5 shrink-0 shadow-lg shadow-purple-500/20">
                  <div className="w-full h-full bg-[#0b081c] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#0c091f]/80 backdrop-blur-md border border-purple-500/20 text-xs text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1.5 font-mono">WaveMind AI thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-30 bg-[#06080f]/90 backdrop-blur-2xl py-3 sm:py-4 border-t border-purple-500/15 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <ChatInput
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStopGenerating={handleStopGenerating}
        />
      </div>

      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0e0a24] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-white"
            >
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold">WaveMind AI Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-500/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-purple-300 uppercase tracking-wider">AI Assistant Persona</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Enterprise Consultant', 'Software Architect', 'Creative Designer'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPersona(p)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                        persona === p
                          ? 'bg-purple-600/30 border-purple-400 text-white'
                          : 'bg-purple-950/30 border-purple-500/20 text-purple-300/70 hover:bg-purple-900/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-purple-300">
                  <span className="uppercase tracking-wider">Creativity (Temperature)</span>
                  <span>{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-sm text-white shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Save Preferences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}