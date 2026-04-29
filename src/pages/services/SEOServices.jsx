import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, CheckCircle2, ArrowRight, Globe, BarChart2, FileText, MapPin } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const seoServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "SEO Services for Startups and MSMEs in India",
  "provider": { "@type": "LocalBusiness", "name": "WaveMind Solutions", "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" } },
  "description": "Result-driven SEO services for Indian startups and MSMEs.",
  "areaServed": { "@type": "Country", "name": "India" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How long does SEO take to show results in India?", "acceptedAnswer": { "@type": "Answer", "text": "SEO typically takes 3–6 months to show meaningful results. Local SEO for Kolkata keywords can show traction in 4–8 weeks." } },
    { "@type": "Question", "name": "How much do SEO services cost in India?", "acceptedAnswer": { "@type": "Answer", "text": "Plans range from ₹10,000–₹50,000/month depending on competition and scope." } }
  ]
};

const services = [
  { icon: Search, title: "Keyword Research", desc: "Low-competition, high-intent keywords for your industry" },
  { icon: FileText, title: "On-Page SEO", desc: "Optimised titles, meta tags, H1–H3, and schema markup" },
  { icon: MapPin, title: "Local SEO", desc: "Google Business Profile and local citations" },
  { icon: Globe, title: "Technical SEO", desc: "Core Web Vitals, sitemap, and page speed" },
  { icon: FileText, title: "Content Strategy", desc: "Blogs, landing pages, topical authority building" },
  { icon: BarChart2, title: "Analytics & Reporting", desc: "Monthly Google Search Console and GA4 reports" },
];

const SEOServices = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden"
  >
    <SEOHead
      title="SEO Services for Startups & MSMEs in India | Kolkata SEO Agency"
      description="WaveMind Solutions provides result-driven SEO for Indian startups and MSMEs. Local SEO Kolkata, keyword research, technical SEO, and content marketing. Get a free SEO audit today."
      keywords="SEO services India, SEO agency Kolkata, local SEO Kolkata, SEO for startups India, SEO for MSMEs, technical SEO India, affordable SEO services India"
      canonicalPath="/seo-services"
      structuredData={[seoServiceSchema, faqSchema, createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'SEO Services', path: '/seo-services' }
      ])]}
    />

    <section className="relative pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">SEO Services</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SEO Services for<br /></span>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Indian Startups & MSMEs</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Build organic search presence that generates leads 24/7 — with transparent reporting and no fluff.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-white font-semibold hover:shadow-xl transition-all duration-300">Get Free SEO Audit</Link>
          <Link to="/services" className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold hover:border-emerald-500 transition-all duration-300">All Services</Link>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">What's Included in Our SEO Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-4"><s.icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Why MSMEs Trust WaveMind for SEO</h2>
        <div className="space-y-4">
          {["No black-hat tactics — only white-hat, Google-approved SEO","Hyper-local focus — Kolkata + Pan-India city targeting","MSME-specific strategy — low-competition keyword targeting","Content creation included — blogs, landing pages, schema","Monthly reporting — traffic, rankings, and leads tracked","Affordable pricing — plans starting ₹10,000/month"].map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SEO FAQ for Indian Businesses</h2>
        <div className="space-y-4">
          {[
            { q: "How long does SEO take to show results in India?", a: "SEO typically takes 3–6 months. Local SEO for Kolkata keywords can show traction in 4–8 weeks with proper setup." },
            { q: "How much do SEO services cost in India?", a: "Plans range from ₹10,000–₹50,000/month. We offer custom pricing based on your industry and goals." },
            { q: "Can SEO work for a brand new business?", a: "Absolutely. New businesses benefit most from long-tail keywords and local SEO to build authority quickly." },
          ].map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Rank on Google?</h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Get a free SEO audit. We'll identify quick wins and a 6-month growth plan — no obligation.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
            Get Free SEO Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </motion.div>
);

export default SEOServices;
