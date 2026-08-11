import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative pt-4 pb-2 text-center overflow-hidden z-10 max-w-6xl mx-auto px-4 sm:px-6">

      {/* Floating Animated Ambient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-[130px] rounded-full pointer-events-none animate-pulse" />

      {/* Top Animated AI Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 shadow-lg mb-3 group cursor-default hover:border-purple-500/40 transition-all"
      >
        <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
        </div>
        <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 uppercase">
          Agentic AI Engine
        </span>
      </motion.div>

      {/* Main Title with Gradient Glow */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-2 leading-tight"
      >
        <span className="relative inline-block">
          <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          <span className="relative bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WaveMind AI
          </span>
        </span>
      </motion.h1>
    </div>
  );
}

