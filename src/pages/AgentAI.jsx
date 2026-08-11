import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import ChatInterface from '../components/ai/ChatInterface';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createBreadcrumbSchema } from '../utils/structuredData';

export default function AgentAI() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden transition-colors duration-700 pt-24"
    >
      <SEOHead 
        title="WaveMind AI Assistant | Intelligent Agentic Business AI"
        description="Experience WaveMind AI — your intelligent business assistant powered by Gemini & LLM engines. Get instant assistance for web development, workflow automation, and custom software."
        canonicalPath="/agent-ai"
        structuredData={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'AI Assistant', path: '/agent-ai' }])]}
      />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />
      </div>

      {/* Animated Orbs - GPU Optimized */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob animation-delay-4000" />

      {/* Main Interactive AI Chat Container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChatInterface />
        </motion.div>

        {/* Enterprise Call-to-Action Card Banner */}
        <section className="mt-20">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-14 text-center md:text-left text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Need a Custom AI Solution for Your Enterprise?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium">
                Our engineering team designs bespoke agentic workflows, fine-tuned LLMs, RAG knowledge bases, and custom software tailored specifically for your business.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-sm shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book AI Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-sm hover:bg-white/30 transition-all flex items-center justify-center cursor-pointer"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
