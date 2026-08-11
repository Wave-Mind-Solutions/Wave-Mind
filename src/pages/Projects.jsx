import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowUpRight,
  Sparkles,
  Zap,
  Cpu,
  ShoppingBag,
  TrendingUp,
  FileText,
  MapPin,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowUpDown,
  PieChart,
  X,
  Star,
  Shield,
  Globe,
  Code
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { createBreadcrumbSchema } from '../utils/structuredData';
import { useTheme } from '../context/ThemeContext';

const filters = ["All", "AI", "E-Commerce", "FinTech", "Civic Tech"];

const projectsStats = [
  { value: "6+", label: "Production Repos", icon: Code },
  { value: "98.2%", label: "AI Model Accuracy", icon: Star },
  { value: "< 1.5s", label: "Query Latency", icon: Zap },
  { value: "100%", label: "Benchmarked Code", icon: Shield }
];

const projects = [
  {
    id: "pathfinder",
    title: "AI Career Pathfinder",
    category: "AI",
    icon: Cpu,
    gradient: "from-violet-500 to-indigo-500",
    iconGradient: "from-violet-600 to-indigo-600",
    description:
      "AI-powered career guidance platform with role-based dashboards for students and parents, plus an integrated AI chatbot for personalized career recommendations.",
    tech: ["FastAPI", "MongoDB", "React", "AI", "TailwindCSS"],
    link: "https://github.com/savit3810/PathFinder-AI---Lifelong-AI-Career-Companion",
    complexity: 88,
    features: [
      "Multi-role interactive dashboard for parents & students",
      "Deep NLP matching with national employment datasets",
      "Real-time AI advising chat module with LLM streaming",
      "Automated resume analysis and action-item generators",
    ],
    impact: "98.2% career recommendation accuracy rating",
    chartTitle: "Monthly User Engagement Growth",
    chartType: "area",
    chartsData: [
      { label: "Jan", val1: 150, val2: 80 },
      { label: "Feb", val1: 320, val2: 85 },
      { label: "Mar", val1: 650, val2: 91 },
      { label: "Apr", val1: 1200, val2: 95 },
      { label: "May", val1: 2400, val2: 98 },
    ],
    chartLegend: ["Active Users", "Accuracy (%)"],
    architecture:
      "Microservices backend on FastAPI communicating with OpenAI GPT API and storing data in MongoDB Atlas; frontend built in React with responsive Tailwind components.",
  },
  {
    id: "surgical-works",
    title: "Jay Bharat Surgical Works",
    category: "E-Commerce",
    icon: ShoppingBag,
    gradient: "from-emerald-500 to-teal-500",
    iconGradient: "from-emerald-600 to-teal-600",
    description:
      "Full-stack sales platform with a MongoDB backend and a Flutter-based customer + admin dashboard, actively running in production for a real medical supply business.",
    tech: ["JavaScript", "MongoDB", "Flutter", "REST API", "Node.js"],
    link: "https://github.com/savit3810/jay-bharat-surgical-works",
    complexity: 92,
    features: [
      "Complete inventory catalog management with admin portal",
      "Flutter app deployment for fast client-side ordering",
      "Secure offline-first local synchronization of cart data",
      "Comprehensive daily sales and tax reporting dashboard",
    ],
    impact: "+40% increase in monthly order volume since launch",
    chartTitle: "Sales & Order Progression (Monthly)",
    chartType: "area",
    chartsData: [
      { label: "Month 1", val1: 5000, val2: 120 },
      { label: "Month 2", val1: 7500, val2: 180 },
      { label: "Month 3", val1: 12000, val2: 250 },
      { label: "Month 4", val1: 18500, val2: 380 },
      { label: "Month 5", val1: 24000, val2: 510 },
    ],
    chartLegend: ["Revenue ($)", "Orders"],
    architecture:
      "Node.js Express API serving as a secure gateway, MongoDB database storage, with cross-platform clients interacting via REST APIs.",
  },
  {
    id: "credit-risk",
    title: "Rural Credit Risk Predictor",
    category: "FinTech",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    iconGradient: "from-amber-600 to-orange-600",
    description:
      "Machine learning model that assesses credit risk for rural families, with data-visualization dashboards built for lenders to make faster decisions.",
    tech: ["Python", "Machine Learning", "Streamlit", "Pandas", "Scikit-Learn"],
    link: "https://github.com/savit3810/rural-credit-risk-predictor",
    complexity: 85,
    features: [
      "Interactive Streamlit visualization dashboard",
      "Custom Random Forest and XGBoost model pipeline",
      "Automated local feature importance rendering",
      "Exploratory Data Analysis metrics for credit underwriters",
    ],
    impact: "Reduced default forecasting error rate by 14.5%",
    chartTitle: "Algorithm Accuracy & Recall Matrix (%)",
    chartType: "area",
    chartsData: [
      { label: "Baseline", val1: 78, val2: 72 },
      { label: "RandomForest", val1: 82, val2: 79 },
      { label: "XGBoost", val1: 89, val2: 86 },
      { label: "Our Pipeline", val1: 93, val2: 91 },
    ],
    chartLegend: ["Accuracy (%)", "Recall (%)"],
    architecture:
      "Python Streamlit client rendering interactive graphs using Plotly, utilizing an offline Scikit-Learn prediction pipeline.",
  },
  {
    id: "docmind",
    title: "DocMind AI",
    category: "AI",
    icon: FileText,
    gradient: "from-blue-500 to-cyan-500",
    iconGradient: "from-blue-600 to-cyan-600",
    description:
      "AI-powered tool for parsing, summarizing, and querying documents using large language models — turning static files into a searchable knowledge base.",
    tech: ["Python", "AI", "LLM", "LangChain", "Vector DB"],
    link: "https://github.com/savit3810/docmindai",
    complexity: 80,
    features: [
      "Chunking & vector embedding pipeline for heavy PDFs",
      "Retrieval-Augmented Generation (RAG) conversational engine",
      "Multi-file semantic search and reference citation tracking",
      "Automated summary generation for dense technical text",
    ],
    impact: "Queries take <1.5s on 10,000+ page archives",
    chartTitle: "Query Response Time Comparison (Seconds)",
    chartType: "bar",
    chartsData: [
      { label: "Standard DB", val1: 8.5 },
      { label: "Elasticsearch", val1: 4.2 },
      { label: "DocMind AI", val1: 1.2 },
    ],
    chartLegend: ["Response Time (sec)"],
    architecture:
      "LangChain processing engine backend with ChromaDB vector search and OpenAI API; frontend builds in React/Vite.",
  },
  {
    id: "floodpulse",
    title: "FloodPulse Mumbai",
    category: "Civic Tech",
    icon: MapPin,
    gradient: "from-sky-500 to-blue-500",
    iconGradient: "from-sky-600 to-blue-600",
    description:
      "A real-time disaster command center concept for flood monitoring and response coordination in Mumbai, built to help city teams act faster during emergencies.",
    tech: ["React", "Real-time Data", "Dashboard UI", "Leaflet Maps", "WebSockets"],
    link: "https://pratyush-two.vercel.app",
    complexity: 90,
    features: [
      "Interactive Leaflet spatial data overlay layers",
      "WebSocket real-time rain gauge alert streams",
      "Dispatch routing calculations for disaster relief squads",
      "Emergency broadcast triggers with instant notification lag",
    ],
    impact: "Under 5s notification lag to citizen alert lists",
    chartTitle: "System Emergency Message Delivery Latency (Sec)",
    chartType: "bar",
    chartsData: [
      { label: "SMS", val1: 12 },
      { label: "Email", val1: 8 },
      { label: "Push", val1: 3 },
      { label: "FloodPulse", val1: 1.5 },
    ],
    chartLegend: ["Latency (sec)"],
    architecture:
      "Node.js WebSocket gateway broadcasting real-time geographic sensor measurements to React Leaflet map clients.",
  },
  {
    id: "personal-finance",
    title: "Personal Finance Manager",
    category: "FinTech",
    icon: PieChart,
    gradient: "from-pink-500 to-rose-500",
    iconGradient: "from-pink-600 to-rose-600",
    description:
      "Full-stack application for income and expense tracking, budgeting, and secure transaction storage, designed for everyday personal finance management.",
    tech: ["Python", "Streamlit", "SQLite", "Matplotlib"],
    link: "https://github.com/savit3810/PERSONAL_FINANCE_MANAGEMENT_SYSTEM",
    complexity: 75,
    features: [
      "Local transaction registry and ledger with SQLite",
      "Custom recursive budget threshold warnings",
      "Dynamic visual expenditure charts per category",
      "Automatic scheduled transaction reminders",
    ],
    impact: "Helps users save an average of 18% monthly",
    chartTitle: "Monthly User Savings Ratio Increase (%)",
    chartType: "area",
    chartsData: [
      { label: "Month 1", val1: 5 },
      { label: "Month 2", val1: 8 },
      { label: "Month 3", val1: 12 },
      { label: "Month 4", val1: 18 },
    ],
    chartLegend: ["Savings Rate (%)"],
    architecture:
      "Local Python application using Streamlit for UI and direct SQLite queries to store transactional data.",
  },
];

// Interactive Mouse Spotlight Card Component matching Services.jsx
const ProjectSpotlightCard = ({ children, className = "" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[2.5rem] border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          opacity,
        }}
      />
      {children}
    </div>
  );
};

// Custom Animated Chart Component
function ProjectMetricsChart({ data, type, legend }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => Math.max(d.val1 || 0, d.val2 || 0)), 1);

  if (type === 'bar') {
    return (
      <div className="w-full space-y-3 pt-2">
        {data.map((item, idx) => {
          const pct = Math.round((item.val1 / maxVal) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>{item.label}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{item.val1}s</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const width = 300;
  const height = 120;
  const padding = 20;

  const pointsVal1 = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.val1 / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPathVal1 = `M ${padding},${height - padding} L ${pointsVal1} L ${width - padding},${height - padding} Z`;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-end gap-4 text-[10px] font-bold text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          {legend[0] || "Primary Metric"}
        </span>
        {legend[1] && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            {legend[1]}
          </span>
        )}
      </div>
      <div className="relative w-full h-32 bg-gray-50/80 dark:bg-gray-800/40 rounded-2xl p-2 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeOpacity="0.1" />

          <path d={areaPathVal1} fill="url(#areaGrad)" />
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsVal1} />

          {data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - (d.val1 / maxVal) * (height - padding * 2);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                <text x={x} y={height - 4} fontSize="8" textAnchor="middle" fill="currentColor" className="text-gray-400 font-medium">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function Projects() {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeFilter === "All") return matchSearch;
        const normalizedFilter = activeFilter.toLowerCase();
        const matchFilter = p.category.toLowerCase().includes(normalizedFilter);

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sortBy === "alpha") return a.title.localeCompare(b.title);
        if (sortBy === "complexity-desc") return b.complexity - a.complexity;
        if (sortBy === "complexity-asc") return a.complexity - b.complexity;
        return 0;
      });
  }, [searchQuery, activeFilter, sortBy]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setActiveFilter("All");
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden transition-colors duration-700"
    >
      <SEOHead
        title="Our Projects — Real Systems & Architectures"
        description="Explore real products, platforms, and AI systems built by WaveMind Solutions engineers — from AI career engines to medical e-commerce platforms."
        canonicalPath="/projects"
        structuredData={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }])]}
      />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />
      </div>

      {/* Animated Orbs - GPU Optimized */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob animation-delay-4000" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Sparkles Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Engineering Showcase
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Projects Showcase
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Explore the architectures, production codebases, and performance benchmarks of platforms built by WaveMind engineers — spanning LLM engines, FinTech predictive modeling, and medical supply platforms.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-4 justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Production Codebases</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Live Benchmarks</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Row Banner */}
      <div className="py-12 border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {projectsStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid and Controls Section */}
      <div className="py-16 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Search, Filter, Sort Glass Panel */}
          <div className="mb-12 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 space-y-6 shadow-xl shadow-gray-900/5 dark:shadow-none">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by title, stack (e.g. FastAPI, Flutter, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 py-3.5 pl-12 pr-10 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    type="button"
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 shrink-0">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none transition-all focus:border-blue-500 cursor-pointer"
                >
                  <option value="default">Sort: Default Order</option>
                  <option value="alpha">Sort: Alphabetical (A-Z)</option>
                  <option value="complexity-desc">Sort: Complexity (High-Low)</option>
                  <option value="complexity-asc">Sort: Complexity (Low-High)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                          : "bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Project Count */}
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Showing {filteredProjects.length} of {projects.length} system showcases
              </div>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const IconComponent = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <ProjectSpotlightCard className="p-8 h-full group flex flex-col justify-between">
                    
                    {/* Header Banner */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${project.iconGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                          Complexity: {project.complexity}%
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
                        {project.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagClick(item);
                            }}
                            className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 transition-all"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer group/btn"
                      >
                        Deep Dive Details
                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Repo
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>

                  </ProjectSpotlightCard>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="mt-16 text-center rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-700 py-16 px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Projects Match Your Filter</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                We couldn't find system showcases matching "{searchQuery}". Try clearing search or choosing another filter category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                type="button"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Bottom Call To Action Banner */}
          <div className="mt-24 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 text-center text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Have a Unique Custom Requirement?
            </h2>
            <p className="max-w-2xl mx-auto text-blue-100 text-base mb-8 relative z-10 font-medium">
              Our engineering team builds custom web applications, cross-platform mobile apps, RAG pipelines, and automated microservices tailored directly to your workflow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <a
                href="mailto:hello@wavemindsolutions.in"
                className="px-8 py-4 rounded-full bg-white text-gray-900 text-sm font-bold shadow-lg hover:bg-blue-50 hover:scale-105 transition-all cursor-pointer"
              >
                Consult an Engineer
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Deep Dive Project Modal Dialog (Framer Motion) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8 md:p-12 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-8 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3.5 py-1 rounded-full bg-gray-100/50 dark:bg-gray-800/50">
                    Complexity Score: {selectedProject.complexity}/100
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  {selectedProject.title}
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-500">
                  Technical Architecture & Case-Study
                </p>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Overview</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">System Architecture</h4>
                    <div className="p-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedProject.architecture}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    
                    {/* Impact Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border border-blue-500/20">
                      <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Measured Impact</h4>
                      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {selectedProject.impact}
                      </p>
                    </div>

                    {/* Stack */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tech.map((t) => (
                          <span key={t} className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visual Chart */}
                    <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                        {selectedProject.chartTitle}
                      </h4>
                      <ProjectMetricsChart
                        data={selectedProject.chartsData}
                        type={selectedProject.chartType}
                        legend={selectedProject.chartLegend}
                      />
                    </div>
                  </div>

                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 text-sm font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    View Source Repository
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
