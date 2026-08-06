import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Bot, Smartphone, BarChart3, Briefcase, Headphones, ArrowUpRight } from 'lucide-react';

const PROMPT_CARDS = [
  {
    id: 'website',
    icon: Rocket,
    title: 'Build me a Website',
    description: 'Custom high-performance web applications with React, Next.js & modern UI.',
    gradient: 'from-blue-600 to-cyan-500',
    prompt: 'Can you help me design and build a modern, high-performance website for my business with WaveMind Solutions?'
  },
  {
    id: 'automation',
    icon: Bot,
    title: 'AI Automation',
    description: 'Automate complex business workflows, CRM integrations, and data pipelines.',
    gradient: 'from-purple-600 to-pink-500',
    prompt: 'What AI automation solutions does WaveMind offer to streamline business operations?'
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Native iOS & Android mobile solutions with sleek UI/UX and robust backends.',
    gradient: 'from-indigo-600 to-purple-500',
    prompt: 'Tell me about WaveMind\'s mobile app development capabilities for iOS and Android.'
  },
  {
    id: 'marketing',
    icon: BarChart3,
    title: 'Digital Marketing',
    description: 'Data-driven SEO strategies, growth hacking, and high-converting campaigns.',
    gradient: 'from-emerald-600 to-teal-500',
    prompt: 'How can WaveMind help boost our online presence through SEO and digital marketing?'
  },
  {
    id: 'pricing',
    icon: Briefcase,
    title: 'Pricing & Plans',
    description: 'Transparent pricing packages tailored for startups, SMBs, and enterprise teams.',
    gradient: 'from-amber-500 to-orange-600',
    prompt: 'What are WaveMind\'s pricing tiers and engagement models for new projects?'
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Contact Support',
    description: 'Get instant tech support or connect directly with our specialist engineering team.',
    gradient: 'from-rose-500 to-red-600',
    prompt: 'How can I contact the WaveMind engineering team or request a technical consultation?'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function PromptCards({ onSelectPrompt }) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {PROMPT_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <motion.button
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(card.prompt)}
            className="group relative text-left p-5 rounded-2xl bg-white/40 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/60 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Background Hover Glow */}
            <div className={`absolute -right-12 -top-12 w-28 h-28 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none`} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon className="w-full h-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue-500 dark:group-hover:text-purple-400 group-hover:bg-blue-500/10 transition-all">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/40 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-gray-400 group-hover:text-blue-500 dark:group-hover:text-purple-300">
              <span>Quick Prompt</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Ask AI &rarr;
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
