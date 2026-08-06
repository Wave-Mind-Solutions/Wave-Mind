import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import ChatInterface from '../components/ai/ChatInterface';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AgentAI() {
  return (
    <div className="min-h-screen relative bg-white dark:bg-[#06080f] text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-purple-500/30">
      <SEOHead 
        title="WaveMind AI Assistant | Intelligent Agentic Business AI"
        description="Experience WaveMind AI — your intelligent business assistant powered by Gemini AI. Get instant answers for web development, workflow automation, and mobile solutions."
      />

      {/* Futuristic Background Lights & Grid Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle SVG Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08] dark:opacity-[0.15]" />
        
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 dark:bg-blue-600/30 rounded-full blur-[140px] animate-blob" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-pink-600/10 dark:bg-pink-600/15 rounded-full blur-[160px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-4 pb-20 max-w-6xl">

        {/* Main Interactive AI Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChatInterface />
        </motion.div>

        {/* Enterprise Call-to-Action Card */}
        <section className="mt-16 sm:mt-20">
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/30 backdrop-blur-2xl border border-blue-500/30 dark:border-white/10 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                Need a Custom AI Solution for Your Enterprise?
              </h3>
              <p className="text-blue-100/80 text-sm md:text-base leading-relaxed">
                Our engineering team designs bespoke agentic workflows, fine-tuned LLMs, and custom software tailored specifically for your business.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 font-extrabold text-sm shadow-xl hover:bg-gray-100 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Book AI Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
