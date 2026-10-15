import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { leadershipPageSchema, createBreadcrumbSchema } from '../utils/structuredData';

const Leadership = () => {
  const team = [
    {
      name: "Ankita Banik",
      initials: "AB",
      role: "Founding Team Member",
      bio: "Leads operations, HR, compliance and people at WaveMind."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 overflow-hidden"
    >
      <SEOHead
        title="Leadership – Founding Team of WaveMind Solutions"
        description="The founding team of WaveMind Solutions, a technology startup from Kolkata founded in 2023."
        keywords="WaveMind founding team, Ankita Banik, WaveMind Solutions Kolkata"
        canonicalPath="/leadership"
        structuredData={[leadershipPageSchema, createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Leadership', path: '/leadership' }])]}
      />
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/backgrounds/about-bg.png" 
          alt="Leadership Background" 
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-gray-50/80 to-gray-50 dark:from-gray-950/50 dark:via-gray-950/80 dark:to-gray-950" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-20 relative">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight"
          >
            Our <span className="text-gradient">Leadership</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-300 font-medium italic"
          >
            The founding team of WaveMind Solutions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 max-w-md mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-[2rem] p-10 shadow-xl shadow-gray-100 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300 flex flex-col items-center text-center group border border-gray-50 dark:border-gray-700"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500 uppercase">
                {member.initials}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
              <p className="text-primary-600 dark:text-blue-400 font-bold text-[13px] mb-6 uppercase tracking-wider">{member.role}</p>
              <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed max-w-sm">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Leadership;
