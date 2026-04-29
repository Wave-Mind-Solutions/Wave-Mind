import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2, ArrowRight, MessageSquare, Mail, RefreshCw, Settings, BarChart2, Smartphone } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const automationSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Business Automation Services for MSMEs in India",
  "provider": { "@type": "LocalBusiness", "name": "WaveMind Solutions", "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" } },
  "description": "WhatsApp automation, email marketing automation, and business process automation for Indian startups and MSMEs.",
  "areaServed": { "@type": "Country", "name": "India" }
};

const features = [
  { icon: MessageSquare, title: "WhatsApp Automation", desc: "Auto-reply, broadcast messages, and lead follow-up via WhatsApp Business API" },
  { icon: Mail, title: "Email Marketing Automation", desc: "Drip campaigns, onboarding sequences, and abandoned cart recovery" },
  { icon: RefreshCw, title: "Lead Follow-up Automation", desc: "Auto-follow-up within minutes of inquiry — never lose a hot lead" },
  { icon: Settings, title: "Workflow Automation", desc: "Connect your CRM, website, and tools with zero manual work" },
  { icon: Smartphone, title: "SMS Campaigns", desc: "Transactional and promotional SMS with DLT compliance" },
  { icon: BarChart2, title: "Automation Analytics", desc: "Track open rates, conversions, and ROI from every automation" },
];

const Automation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden"
  >
    <SEOHead
      title="Business Automation Services India | WhatsApp Automation for MSMEs"
      description="WaveMind Solutions automates your business operations with WhatsApp automation, email campaigns, and workflow automation. Save time, follow up faster, and close more deals."
      keywords="business automation India, WhatsApp automation India, email marketing automation India, lead automation MSME, workflow automation India, sales automation Kolkata"
      canonicalPath="/automation"
      structuredData={[automationSchema, createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Automation', path: '/automation' }
      ])]}
    />

    <section className="relative pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
          <Zap className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Business Automation</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Automate Your Business<br /></span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Work Smarter, Not Harder</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          WhatsApp automation, email campaigns, lead follow-ups, and workflow automation — all connected and
          running 24/7. Let your business generate and convert leads while you focus on what matters.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-xl transition-all duration-300">Get Free Automation Audit</Link>
          <Link to="/services" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold hover:border-purple-500 transition-all duration-300">All Services</Link>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Automation Services We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Why Automation for Indian MSMEs?</h2>
        <div className="space-y-4">
          {[
            "Follow up with every lead within 5 minutes — automatically",
            "Save 3–5 hours per day on manual tasks like follow-ups and reports",
            "WhatsApp API reaches 90%+ of Indian smartphone users",
            "Reduce cost of sales while increasing conversion rates",
            "No technical knowledge needed — we build, configure, and train",
            "DLT-registered SMS and WhatsApp for TRAI compliance",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">Get a free automation audit. We'll identify where you're losing time and money — and fix it.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
            Get Free Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </motion.div>
);

export default Automation;
