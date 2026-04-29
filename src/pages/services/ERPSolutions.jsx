import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, CheckCircle2, ArrowRight, Layers, BarChart2, Zap, Settings, Shield, Database } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const erpSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "ERP Solutions for MSMEs in India",
  "provider": { "@type": "LocalBusiness", "name": "WaveMind Solutions", "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" } },
  "description": "Cloud ERP solutions for Indian MSMEs and manufacturers. Inventory, accounting, HR, and production management in one unified platform.",
  "areaServed": { "@type": "Country", "name": "India" }
};

const features = [
  { icon: Database, title: "Inventory Management", desc: "Real-time stock tracking across multiple warehouses" },
  { icon: BarChart2, title: "Financial Accounting", desc: "GST-compliant ledgers, invoicing, and P&L reports" },
  { icon: Settings, title: "Production Planning", desc: "Bill of materials, work orders, and capacity planning" },
  { icon: Layers, title: "Supply Chain", desc: "Vendor management, purchase orders, and delivery tracking" },
  { icon: Shield, title: "HR & Payroll", desc: "Attendance, leave management, and salary processing" },
  { icon: Zap, title: "Dashboard & Analytics", desc: "Real-time KPI dashboards for management decisions" },
];

const ERPSolutions = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden"
  >
    <SEOHead
      title="ERP Solutions for MSMEs in India | Cloud ERP Software Kolkata"
      description="WaveMind Solutions delivers cloud ERP systems for Indian MSMEs and manufacturers. Inventory, accounting, HR, production management. GST-ready. Get a free ERP consultation."
      keywords="ERP solutions India, ERP for MSME India, cloud ERP India, ERP software for manufacturing India, GST-ready ERP India, ERP Kolkata, affordable ERP small business India"
      canonicalPath="/erp-solutions"
      structuredData={[erpSchema, createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'ERP Solutions', path: '/erp-solutions' }
      ])]}
    />

    <section className="relative pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
          <Box className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">ERP Solutions</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cloud ERP Solutions<br /></span>
          <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">for Indian MSMEs</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Run your entire business from one platform. Inventory, accounting, HR, production, and supply chain —
          all GST-ready and built for the realities of Indian manufacturing and trading MSMEs.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full text-white font-semibold hover:shadow-xl transition-all duration-300">Get Free ERP Demo</Link>
          <Link to="/services" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold hover:border-orange-500 transition-all duration-300">All Services</Link>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">ERP Modules for Indian Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Why WaveMind ERP for Indian MSMEs?</h2>
        <div className="space-y-4">
          {[
            "100% GST-compliant — e-invoicing, GSTR reports built-in",
            "Works in Hindi and English — bilingual interface",
            "Cloud-hosted — accessible from anywhere on mobile or desktop",
            "No expensive hardware — browser-based, any device",
            "Custom modules — pay only for what your business needs",
            "Training included — we train your entire team at launch",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600">
          <h2 className="text-3xl font-bold text-white mb-4">Modernise Your Business Operations</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">Get a free ERP consultation. We'll analyse your operations and propose the right modules for your business.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
            Get Free ERP Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </motion.div>
);

export default ERPSolutions;
