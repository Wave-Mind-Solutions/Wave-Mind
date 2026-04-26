import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Monitor, Smartphone, Database, Cloud, Cpu, Palette, CheckCircle2,
  Sparkles, Globe, Zap, Shield, Award, ArrowRight, Code,
  TrendingUp, Users, Rocket, Star, Sun, Moon
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { servicesPageSchema, createBreadcrumbSchema } from '../utils/structuredData';

import { useTheme } from '../context/ThemeContext';

const servicesList = [
  {
    icon: Monitor,
    title: "Web Development",
    desc: "Creating stunning, responsive, and high-performance web applications tailored to your needs.",
    capabilities: ["Custom Web Apps", "E-Commerce", "UI/UX Design", "PWAs"],
    gradient: "from-blue-500 to-cyan-500",
    iconGradient: "from-blue-600 to-cyan-600",
    color: "blue",
    features: ["Next.js/React", "Node.js/Python", "GraphQL/REST", "SSR/SSG"]
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    desc: "Native and cross-platform mobile experiences that engage users on any device.",
    capabilities: ["iOS & Android", "React Native / Flutter", "Enterprise Mobility", "App Optimization"],
    gradient: "from-purple-500 to-pink-500",
    iconGradient: "from-purple-600 to-pink-600",
    color: "purple",
    features: ["Push Notifications", "Offline Sync", "Biometric Auth", "App Store Deployment"]
  },
  {
    icon: Database,
    title: "Enterprise Solutions",
    desc: "Streamlining operations with customized software that scales with your growth.",
    capabilities: ["Custom ERP", "CRM Systems", "Process Automation", "Legacy Modernization"],
    gradient: "from-indigo-500 to-blue-500",
    iconGradient: "from-indigo-600 to-blue-600",
    color: "indigo",
    features: ["Microservices", "API Integration", "Data Migration", "24/7 Support"]
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Optimizing infrastructure for maximum scalability, security, and efficiency.",
    capabilities: ["Cloud Hosting", "CI/CD Pipelines", "Serverless", "Infrastructure as Code"],
    gradient: "from-cyan-500 to-teal-500",
    iconGradient: "from-cyan-600 to-teal-600",
    color: "cyan",
    features: ["AWS/Azure/GCP", "Kubernetes", "Terraform", "Monitoring & Logging"]
  },
  {
    icon: Cpu,
    title: "AI & Data Science",
    desc: "Leveraging data and machine learning to uncover insights and automate decisions.",
    capabilities: ["ML Models", "Predictive Analytics", "NLP", "Computer Vision"],
    gradient: "from-pink-500 to-rose-500",
    iconGradient: "from-pink-600 to-rose-600",
    color: "pink",
    features: ["TensorFlow/PyTorch", "LLM Integration", "Data Visualization", "Real-time Analytics"]
  },
  {
    icon: Palette,
    title: "Digital Strategy",
    desc: "Elevating your brand presence through data-driven strategy and visual design.",
    capabilities: ["Brand Identity", "SEO Strategy", "Social Media", "Campaigns"],
    gradient: "from-orange-500 to-amber-500",
    iconGradient: "from-orange-600 to-amber-600",
    color: "orange",
    features: ["Market Research", "Conversion Optimization", "Analytics Setup", "Growth Hacking"]
  }
];

const processSteps = [
  { step: "01", title: "Discovery", desc: "We dive deep into your goals and challenges.", icon: Users },
  { step: "02", title: "Strategy", desc: "Crafting a tailored roadmap for success.", icon: TrendingUp },
  { step: "03", title: "Development", desc: "Building with cutting-edge technology.", icon: Code },
  { step: "04", title: "Launch & Grow", desc: "Deploying and optimizing for scale.", icon: Rocket }
];

const technologies = [
  "React", "Next.js", "Node.js", "Python", "TypeScript", "Tailwind",
  "AWS", "Docker", "Kubernetes", "TensorFlow", "GraphQL", "PostgreSQL"
];

const servicesStats = [
  { value: "200+", label: "Projects Completed", icon: Code },
  { value: "98%", label: "Client Satisfaction", icon: Star },
  { value: "50+", label: "Expert Developers", icon: Users },
  { value: "24/7", label: "Support Available", icon: Rocket }
];

const Services = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden transition-colors duration-700"
    >
      <SEOHead
        title="Our Services – Web, Mobile, AI & Cloud"
        description="Explore WaveMind Solutions' services: custom web apps, mobile development, AI/ML integration, cloud infrastructure, UI/UX design, and enterprise security solutions."
        keywords="web development services, mobile app development India, AI ML solutions, cloud DevOps, UI UX design services, custom software development, React Node.js development, SaaS development agency"
        canonicalPath="/services"
        structuredData={[servicesPageSchema, createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])]}
      />
      {/* Theme Toggle Button */}
      {/* <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-24 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 group"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-700" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-700" />
        )}
      </button> */}

      {/* Animated Background Elements */}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                What We Offer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Services
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive technology solutions designed to accelerate growth and transform your digital presence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-4 justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Solutions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Global Scale</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="py-12 border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {servicesStats.map((stat, idx) => (
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

      {/* Services Grid */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(idx)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition duration-700`} />

                <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.iconGradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, i) => (
                      <span key={i} className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${service.gradient}/10 text-gray-700 dark:text-gray-300 border border-${service.color}-200 dark:border-${service.color}-800`}>
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Capabilities List */}
                  <ul className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    {service.capabilities.map((cap, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm"
                      >
                        <CheckCircle2 className={`w-5 h-5 text-${service.color}-500 shrink-0`} />
                        {cap}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <div className="mt-6 pt-4">
                    <Link
                      to="/contact"
                      className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Rocket className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Process</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How We Bring Ideas to Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              A proven methodology that ensures success at every stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Tech Stack</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Cutting-Edge Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
              We use the latest tools and frameworks to build modern solutions
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-5 py-2.5 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
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

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how our services can help you achieve your goals and drive digital innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
                >
                  View Case Studies
                </Link>
              </div>
              <p className="text-sm text-blue-200 mt-6">Free consultation • No obligation • Quick response</p>
            </div>
          </motion.div>
        </div>
      </div>


    </motion.div>
  );
};


export default Services;