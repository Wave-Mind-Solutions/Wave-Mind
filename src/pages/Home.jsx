import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  ArrowRight, Code, Smartphone, Cloud, Cpu, Layout, Monitor,
  CheckCircle, ChevronDown, Star, Play, Users, Zap, Shield,
  Search, Activity, Box, Moon, Sun, Sparkles, Award, Globe,
  Layers, Rocket, Heart, Coffee, GitBranch, Database, Zap as ZapIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { homePageSchema, faqSchema, websiteSchema } from '../utils/structuredData';

import { useTheme } from '../context/ThemeContext';

const faqsList = [
  { q: "How fast can you deliver a project?", a: "Most initial MVP builds take between 2-4 weeks, depending on complexity. We work in rapid sprints to get your product to market faster." },
  { q: "Do you provide ongoing support?", a: "Yes, we offer comprehensive maintenance and scaling support packages after the initial launch." },
  { q: "What technologies do you use?", a: "We specialize in modern stacks: React, Next.js, Node.js, Python, and cloud infrastructure on AWS/GCP." },
  { q: "Can I upgrade my plan later?", a: "Absolutely. Our solutions are built to scale. You can start small and expand your feature set as your user base grows." },
];

const homeServices = [
  { icon: Code, title: "Web Application", gradient: "from-blue-500 to-cyan-500", desc: "Forging reactive experiences for the modern web." },
  { icon: Smartphone, title: "Mobile & Tablet", gradient: "from-purple-500 to-pink-500", desc: "Intuitive touch experiences across iOS and Android." },
  { icon: Cloud, title: "Cloud Infrastructure", gradient: "from-emerald-500 to-teal-500", desc: "Elastic, globally distributed cloud architectures." },
  { icon: Cpu, title: "AI Integration", gradient: "from-orange-500 to-red-500", desc: "Embed large language models seamlessly into workflows." },
  { icon: Layout, title: "UI/UX Design", gradient: "from-indigo-500 to-purple-500", desc: "Interfaces so beautiful and clean, users will love them." },
  { icon: Shield, title: "Security & Compliance", gradient: "from-slate-500 to-gray-500", desc: "Bank-grade security standards and data protection." },
];

const homeFeatures = [
  { icon: Rocket, title: "Lightning Fast", desc: "Optimized performance with edge computing" },
  { icon: Shield, title: "Bank Security", desc: "Enterprise-grade encryption & compliance" },
  { icon: Globe, title: "Global Scale", desc: "Multi-region deployment ready" },
  { icon: Zap, title: "Smart Analytics", desc: "AI-powered insights and reporting" },
];

const homeStats = [
  { end: 2023, suffix: "", label: "Founded", icon: Award },
  { end: 150, suffix: "+", label: "Projects Delivered", icon: Rocket },
  { end: 99.9, suffix: "%", decimals: 1, label: "Uptime", icon: ZapIcon },
  { end: 24, suffix: "/7", label: "Support", icon: Heart }
];

const whyChooseUs = [
  { icon: GitBranch, text: "Real-time requirement tracking" },
  { icon: Database, text: "Automated deployment pipelines" },
  { icon: Layers, text: "Component-driven architecture" }
];

const processSteps = [
  { no: 1, title: "Submit Request", desc: "Share your business requirements and vision.", icon: Coffee },
  { no: 2, title: "Expert Analysis", desc: "We review and blueprint the perfect architecture.", icon: Search },
  { no: 3, title: "Team Assignment", desc: "Top-tier developers assigned to your project.", icon: Users },
  { no: 4, title: "Delivery & Scale", desc: "Watch your product come to life and soar.", icon: Rocket }
];

const CountUpItem = ({ end, suffix = "", prefix = "", duration = 2, decimals = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toFixed(decimals) + suffix;
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, {
        duration: duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, end, duration, count]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  );
};

const testimonials = [
  {
    text: "WaveMind Solutions transformed our idea into a scalable SaaS platform with exceptional speed and precision. Their team truly understands modern product development.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Arjun Mehta",
    role: "Founder, NexaTech",
    rating: 5,
  },
  {
    text: "From UI/UX to backend architecture, WaveMind delivered a complete solution that exceeded our expectations. Highly professional and reliable team.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Sharma",
    role: "Product Manager, InnovateX",
    rating: 5,
  },
  {
    text: "Their AI-driven approach helped us unlock insights we never thought possible. WaveMind is not just a service provider, they are a true tech partner.",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    name: "Rahul Verma",
    role: "CTO, DataBridge",
    rating: 5,
  },
  {
    text: "The team at WaveMind built our cloud infrastructure from scratch and ensured seamless scalability. We've seen a major improvement in performance.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Ananya Iyer",
    role: "Head of Engineering, CloudSphere",
    rating: 5,
  },
  {
    text: "Working with WaveMind felt like having an in-house development team. Their communication and execution were top-notch.",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
    name: "Karan Malhotra",
    role: "CEO, ScaleUp Labs",
    rating: 5,
  },
  {
    text: "They delivered a high-quality mobile application with flawless user experience. Our customer engagement increased significantly.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    name: "Neha Kapoor",
    role: "Co-Founder, AppVibe",
    rating: 5,
  },
  {
    text: "WaveMind's expertise in full-stack development helped us launch faster than expected. Their attention to detail is impressive.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    name: "Amit Kulkarni",
    role: "Tech Lead, DevCore",
    rating: 5,
  },
  {
    text: "Their design team created a modern, intuitive interface that perfectly represents our brand. The results were beyond our expectations.",
    image: "https://randomuser.me/api/portraits/women/30.jpg",
    name: "Sneha Reddy",
    role: "Brand Manager, Elevate Digital",
    rating: 5,
  },
  {
    text: "WaveMind helped us digitize our operations with a custom software solution. The impact on efficiency has been tremendous.",
    image: "https://randomuser.me/api/portraits/men/60.jpg",
    name: "Imran Khan",
    role: "Operations Head, SmartWorks",
    rating: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const SpotlightCard = ({ children, className = "" }) => {
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
      className={`relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-gray-800/30 backdrop-blur-md transition-all duration-500 hover:border-blue-500/50 ${className}`}
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

const TestimonialsColumn = ({ testimonials, duration = 30, className = "" }) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <motion.div
        animate={{ y: ["0%", "-100%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-6 will-change-transform transform-gpu"
      >
        {[...testimonials, ...testimonials].map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100/50 dark:border-white/5 hover:border-blue-500/30 transition-all duration-500 will-change-transform"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">"{testimonial.text}"</p>
            <div className="flex items-center gap-3">
              <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" decoding="async" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-700 overflow-x-hidden">
      <SEOHead
        title="Software Development & IT Services"
        description="WaveMind Solutions builds SaaS platforms, mobile apps, AI integrations & enterprise tools. 150+ projects delivered with 99.9% uptime. Get started free today."
        keywords="software development India, web development company Kolkata, mobile app development, SaaS platform development, AI solutions India, React development, Node.js agency, cloud infrastructure, IT services"
        canonicalPath="/"
        structuredData={[homePageSchema, faqSchema, websiteSchema]}
      />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />
      </div>

      {/* Theme Toggle Button
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-24 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 group"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button> */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Animated Orbs for Extra Depth */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[80px] will-change-transform transform-gpu animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400/10 dark:bg-yellow-600/10 rounded-full blur-[80px] will-change-transform transform-gpu animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-[80px] will-change-transform transform-gpu animate-blob animation-delay-4000" />

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                WaveMind 2.0 is here
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
            >
              Build software that
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                redefines your industry
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              We blend artistic vision with technical precision to build SaaS platforms,
              mobile apps, and enterprise tools that scale effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold text-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
              >
                Explore services
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {homeStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    <CountUpItem end={stat.end} suffix={stat.suffix} decimals={stat.decimals} />
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-600" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Box className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Services</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Everything you need to build faster
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              End-to-end ecosystem for product development. Design, engineering, and deployment under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeServices.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className="p-8 h-full group will-change-transform transform-gpu">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${service.gradient} p-3 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <service.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.desc}</p>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                <ZapIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Unify your entire product lifecycle
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Stop juggling multiple disconnected tools. WaveMind offers a holistic environment
                where requirements, designs, and code seamlessly converge.
              </p>
              <div className="space-y-4">
                {whyChooseUs.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {homeFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 will-change-transform"
                  >
                    <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Simple Process</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Four simple steps from idea to deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg relative">
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center font-bold text-blue-600">
                    {step.no}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Star className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Testimonials</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Loved by founders worldwide
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See what our customers have to say about working with us.
            </p>
          </div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[700px] overflow-hidden -mx-6 px-6">
            <TestimonialsColumn testimonials={firstColumn} duration={35} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={40} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Box className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">FAQ</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqsList.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown className={`text-gray-400 dark:text-gray-600 transition-transform duration-300 w-5 h-5 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-8 pb-6"
                    >
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 text-center"
          >
            {/* CTA Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to scale your vision?
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                Join visionary companies that use WaveMind to build, collaborate,
                and ship high-end digital products faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="group px-8 py-4 bg-white rounded-full text-gray-900 font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                >
                  Talk to Sales
                </Link>
              </div>
              <p className="text-sm text-blue-200 mt-8">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </section >

      <style jsx>{`
        .animate-blob {
          animation: blob 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div >
  );
};

export default Home;