import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, CheckCircle2, ArrowRight, Users, BarChart2, Zap, RefreshCw, Settings } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const crmSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom CRM Development for MSMEs in India",
  "provider": { "@type": "LocalBusiness", "name": "WaveMind Solutions", "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" } },
  "description": "Affordable custom CRM development for Indian startups and MSMEs. Manage leads, automate follow-ups, and grow sales with a CRM built for your business.",
  "areaServed": { "@type": "Country", "name": "India" }
};

const features = [
  { icon: Users, title: "Lead Management", desc: "Capture, track, and nurture leads from all channels" },
  { icon: RefreshCw, title: "Sales Pipeline", desc: "Visual pipeline with automated stage progression" },
  { icon: Zap, title: "WhatsApp Automation", desc: "Auto follow-ups via WhatsApp, email, and SMS" },
  { icon: BarChart2, title: "Sales Analytics", desc: "Real-time dashboards and conversion reports" },
  { icon: Settings, title: "Custom Workflows", desc: "Build workflows specific to your sales process" },
  { icon: Database, title: "Data Migration", desc: "Migrate from Excel or any legacy system" },
];

const CRMDevelopment = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden"
  >
    <SEOHead
      title="Custom CRM Development for MSMEs in India | CRM Software Kolkata"
      description="WaveMind Solutions builds affordable custom CRM software for Indian startups and MSMEs. Manage leads, automate follow-ups, and grow sales. Get a free CRM demo today."
      keywords="CRM development India, custom CRM software MSME, CRM for small business India, CRM software Kolkata, affordable CRM India, sales automation India, lead management software India"
      canonicalPath="/crm-development"
      structuredData={[crmSchema, createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'CRM Development', path: '/crm-development' }
      ])]}
    />

    <section className="relative pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
          <Database className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">CRM Development</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Custom CRM Software<br /></span>
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">for Indian MSMEs</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Stop losing leads in Excel sheets. Get a custom CRM built for your sales process — with WhatsApp automation,
          lead tracking, and real-time analytics. Designed specifically for Indian startups and MSMEs.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full text-white font-semibold hover:shadow-xl transition-all duration-300">Get Free CRM Demo</Link>
          <Link to="/services" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold hover:border-indigo-500 transition-all duration-300">All Services</Link>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">CRM Features Built for Indian Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Why Build a Custom CRM Instead of Buying One?</h2>
        <div className="space-y-4">
          {[
            "Fits your exact sales process — not a generic template",
            "No per-user licensing fees — own it outright",
            "Integrates with WhatsApp, your website, and Indian payment gateways",
            "Works in Hindi and regional languages",
            "Offline-capable for field sales teams",
            "Scales as you grow — add modules without migrating platforms",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Stop Losing Leads?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Get a free CRM consultation. We'll map your sales process and show you a custom solution.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
            Get Free CRM Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </motion.div>
);

export default CRMDevelopment;
