import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, CheckCircle2, ArrowRight, Code, Globe, Zap, Shield, Layers, Smartphone } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { createBreadcrumbSchema } from '../../utils/structuredData';

const webDevSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Web Development Services in Kolkata, India",
  "provider": {
    "@type": "LocalBusiness",
    "name": "WaveMind Solutions",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    }
  },
  "description": "Custom web development for Indian startups and MSMEs. React, Next.js, Node.js applications built for performance and SEO.",
  "areaServed": { "@type": "Country", "name": "India" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Web Application Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Commerce Website Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "React & Next.js Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Redesign & Revamp" } }
    ]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does web development cost in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Web development costs in India typically range from ₹15,000–₹2,00,000+ depending on complexity. A basic business website starts at ₹15,000, while a full-featured web application can range from ₹80,000 to ₹5,00,000."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A simple business website takes 1–2 weeks. A custom web application typically takes 4–8 weeks. Enterprise-level platforms may take 3–6 months."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide website maintenance after launch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, WaveMind Solutions provides ongoing maintenance, updates, security patches, and performance monitoring packages after launch."
      }
    }
  ]
};

const features = [
  { icon: Code, title: "React & Next.js", desc: "Modern, fast frontends with SSR/SSG for SEO" },
  { icon: Globe, title: "SEO-First Build", desc: "Every site built with Core Web Vitals in mind" },
  { icon: Zap, title: "Fast Load Times", desc: "<2s load time on mobile and desktop" },
  { icon: Shield, title: "Secure & Scalable", desc: "HTTPS, rate limiting, and cloud-ready architecture" },
  { icon: Smartphone, title: "Mobile-Responsive", desc: "Pixel-perfect on all screen sizes" },
  { icon: Layers, title: "API Integration", desc: "Connect CRMs, payments, and third-party tools" },
];

const faqs = [
  { q: "How much does web development cost in India?", a: "A basic business website starts at ₹15,000. Custom web applications range from ₹80,000 to ₹5,00,000+ depending on features and complexity." },
  { q: "How long does it take to build a website?", a: "Simple websites take 1–2 weeks. Custom web apps take 4–8 weeks. Enterprise platforms may take 3–6 months." },
  { q: "Do you provide maintenance after launch?", a: "Yes — we offer monthly maintenance packages including security updates, performance monitoring, and feature additions." },
];

const WebDevelopment = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden"
  >
    <SEOHead
      title="Web Development Company in Kolkata India | Custom Websites for MSMEs"
      description="WaveMind Solutions builds custom websites and web applications for Indian startups and MSMEs. React, Next.js, Node.js development in Kolkata. Get a free quote today."
      keywords="web development company Kolkata, custom website development India, React developer India, Next.js development, affordable web development MSME, web application development Kolkata"
      canonicalPath="/web-development"
      structuredData={[webDevSchema, faqSchema, createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Web Development', path: '/web-development' }
      ])]}
    />

    {/* Hero */}
    <section className="relative pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
        >
          <Monitor className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Web Development</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent"
        >
          Web Development Company<br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            in Kolkata, India
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          We build custom websites and web applications for Indian startups and MSMEs — fast, SEO-optimised,
          and built to convert visitors into customers. From simple business websites to complex SaaS platforms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:shadow-xl transition-all duration-300"
          >
            Get Free Quote
          </Link>
          <Link
            to="/services"
            className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-semibold hover:border-blue-500 transition-all duration-300"
          >
            All Services
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            What's Included in Our Web Development
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Every project delivered with performance, security, and SEO built-in from day one.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us for Web Dev */}
    <section className="py-16 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Why Indian MSMEs Choose WaveMind for Web Development
        </h2>
        <div className="space-y-4">
          {[
            "Affordable pricing — transparent quotes, no hidden costs",
            "Fast delivery — most projects completed in 2–6 weeks",
            "SEO-ready — built with Core Web Vitals and structured data",
            "Mobile-first design — 60%+ of Indian users browse on mobile",
            "Local support — Kolkata-based team, responsive in your timezone",
            "Post-launch maintenance — we don't disappear after delivery",
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Website?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Get a free consultation and project estimate within 24 hours. No obligation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300"
          >
            Get Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-blue-200 text-sm mt-6">
            📍 Kolkata, India &nbsp;|&nbsp; 🌐 Serving clients Pan-India &nbsp;|&nbsp; ⚡ 24-hr response
          </p>
        </div>
      </div>
    </section>
  </motion.div>
);

export default WebDevelopment;
