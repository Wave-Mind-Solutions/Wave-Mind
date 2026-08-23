import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Users, Sparkles, Code, Cpu, Award } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { createBreadcrumbSchema } from '../utils/structuredData';
import { useTheme } from '../context/ThemeContext';

const teamMembers = [
  {
    id: 'harshit',
    name: 'Harshit Tripathi',
    role: 'Web Developer (Team Leader)',
    github: 'https://github.com/harshit-tripathi1001',
    icon: Award,
    gradient: 'from-blue-500 to-indigo-500',
    iconGradient: 'from-blue-600 to-indigo-600',
    description: 'Leading the technical vision and full-stack development, ensuring robust architectures and seamless user experiences.',
  },
  {
    id: 'savit',
    name: 'Savit Singh',
    role: 'Web Developer (Team Member)',
    github: 'https://github.com/savit3810',
    icon: Code,
    gradient: 'from-emerald-500 to-teal-500',
    iconGradient: 'from-emerald-600 to-teal-600',
    description: 'Crafting responsive interfaces and scalable backend solutions with a focus on modern web standards and performance.',
  },
  {
    id: 'pratyush',
    name: 'Pratyush Pandey',
    role: 'AI/ML Engineer (Team Member)',
    github: 'https://github.com/PratyushPandey31',
    icon: Cpu,
    gradient: 'from-purple-500 to-pink-500',
    iconGradient: 'from-purple-600 to-pink-600',
    description: 'Designing and implementing intelligent AI models, integrating deep learning algorithms into production-ready software.',
  }
];

export default function OurTeam() {
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
        title="Our Team — WaveMind Solutions"
        description="Meet the core engineering team behind WaveMind Solutions."
        canonicalPath="/team"
        structuredData={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Our Team', path: '/team' }])]}
      />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />
      </div>

      {/* Animated Orbs - GPU Optimized */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[80px] opacity-30 will-change-transform transform-gpu animate-blob animation-delay-2000" />
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
                The Engineering Core
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
                Meet
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Team
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              We are a group of passionate developers and AI engineers dedicated to building intelligent, scalable, and high-performance digital solutions.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="py-16 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => {
              const IconComponent = member.icon;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${member.iconGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                        <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1 block">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
                      {member.description}
                    </p>

                    {/* Footer / Links */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-auto flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                         <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available</span>
                      </div>
                      
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white text-sm font-bold shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 hover:scale-105"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
