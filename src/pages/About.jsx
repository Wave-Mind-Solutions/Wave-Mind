import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Target, Eye, Lightbulb, Heart, Shield, Users, Zap, TrendingUp,
  Sparkles, Globe, Award, Coffee, Code, Rocket, Star,
  ChevronRight, Briefcase, Calendar, MapPin, Quote, Sun, Moon
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { aboutPageSchema, createBreadcrumbSchema } from '../utils/structuredData';

import { useTheme } from '../context/ThemeContext';

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "Pushing boundaries for state-of-the-art solutions.", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Shield, title: "Integrity", desc: "Upholding highest standards in all our actions.", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: TrendingUp, title: "Excellence", desc: "Delivering quality and surpassing expectations.", color: "from-blue-500 to-indigo-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: Users, title: "Collaboration", desc: "Working together to achieve common goals.", color: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { icon: Zap, title: "Agility", desc: "Adapting swiftly to changing environments.", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  { icon: Heart, title: "Empathy", desc: "Understanding and valuing clients and team.", color: "from-rose-500 to-red-500", bg: "bg-rose-50 dark:bg-rose-500/10" }
];

const stats = [
  { value: 150, label: "Projects Delivered", icon: Code, suffix: "+" },
  { value: 50, label: "Team Members", icon: Users, suffix: "+" },
  { value: 98, label: "Client Satisfaction", icon: Star, suffix: "%" },
  { value: 12, label: "Global Awards", icon: Award, suffix: "" }
];

const journeyMilestones = [
  { year: "2023", title: "Foundation", description: "WaveMind was born with a vision to transform digital experiences.", icon: Sparkles },
  { year: "2024", title: "Global Expansion", description: "Expanded operations to serve clients worldwide.", icon: Globe },
  { year: "2025", title: "Innovation Hub", description: "Launched AI innovation lab and research center.", icon: Zap },
];

const missionVision = [
  {
    icon: Target,
    title: "Our Mission",
    gradient: "from-blue-500 to-indigo-500",
    description: "To innovate continuously and deliver excellence in every project we undertake. We strive to be the trusted technology partner that drives digital transformation for businesses worldwide.",
    color: "blue"
  },
  {
    icon: Eye,
    title: "Our Vision",
    gradient: "from-purple-500 to-pink-500",
    description: "To be globally recognized as a premier IT solutions provider, fostering a culture where creativity meets technology to shape a better, connected future.",
    color: "purple"
  }
];

const About = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden transition-colors duration-700"
    >
      <SEOHead
        title="About Us – Our Mission, Vision & Values"
        description="Learn about WaveMind Solutions — a premium software agency founded in 2023. Discover our mission, core values, and the expert team behind 150+ successful projects."
        keywords="about WaveMind Solutions, software company India, IT agency Kolkata, our team, company values, tech startup India, software development agency"
        canonicalPath="/about"
        structuredData={[aboutPageSchema, createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      {/* Theme Toggle Button */}
      {/* <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-24 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 group"
      >
        {theme === 'dark' ? (
          <div className="relative">
            <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-700" />
          </div>
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

      {/* Hero Section with Parallax */}
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
                Our Story
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                WaveMind
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              A technology company empowering businesses through creative digital solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-4 justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Est. 2023</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Globe className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Global Presence</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                <Briefcase className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">150+ Projects</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {missionVision.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-10 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                    Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
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
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Journey</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              The WaveMind Story
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden lg:block" />

            {journeyMilestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative lg:flex items-center gap-8 mb-12 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className="lg:w-1/2 p-6">
                  <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <milestone.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                  </div>
                </div>
                <div className="hidden lg:block w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900 z-10" />
                <div className="lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Heart className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Core Values</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Principles That Guide Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The values that shape our culture and drive our success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl ${val.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <val.icon className={`w-7 h-7 bg-gradient-to-r ${val.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{val.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
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
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join us in shaping the future of technology. Let's create something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Get in Touch
                </button>
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


    </motion.div>
  );
};


export default About;