import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import {
  MapPin, Phone, Mail, Send, CheckCircle,
  Sparkles, Globe, Clock,
  Star, Award, Users, Zap, Shield,
  Facebook, Instagram, Linkedin
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { contactPageSchema, createBreadcrumbSchema } from '../utils/structuredData';

const contactInfo = [
  { icon: MapPin, title: "Visit Us", details: "13, Kalupara Lane, Kolkata, India", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: Phone, title: "Call Us", details: "+91 82828 43434", color: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { icon: Mail, title: "Email Us", details: "info@wavemindsolutions.in", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Clock, title: "Working Hours", details: "Mon-Fri: 9AM - 7PM IST", color: "from-orange-500 to-amber-500", bg: "bg-orange-50 dark:bg-orange-500/10" }
];

const services = [
  "Web Development", "Mobile Development", "Cloud Solutions",
  "AI Integration", "UI/UX Design", "Digital Strategy"
];

const trustBadges = [
  { icon: Star, label: "5/5 Rating", count: "500+ Reviews" },
  { icon: Users, label: "Happy Clients", count: "200+ Worldwide" },
  { icon: Award, label: "Industry Awards", count: "12 Recognitions" },
  { icon: Zap, label: "Fast Response", count: "Within 24 Hours" },
  { icon: Shield, label: "Data Protected", count: "GDPR Compliant" }
];

const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/wavemind-solutions/posts/?feedView=all",
    color: "from-blue-700 to-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: Instagram,
    label: "Instagram",
    url: "https://www.instagram.com/wavemindsolutions",
    color: "from-pink-500 to-orange-500",
    bg: "bg-pink-100 dark:bg-pink-900/30"
  },
  {
    icon: Facebook,
    label: "Facebook",
    url: "https://www.facebook.com/wavemindsolutions",
    color: "from-blue-600 to-blue-800",
    bg: "bg-blue-100 dark:bg-blue-900/30"
  }
];

// Memoized Contact Card Component
const ContactCard = memo(({ info, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + index * 0.1 }}
    whileHover={{ y: -5 }}
    className="group relative"
  >
    {/* Glow Effect */}
    <div className={`absolute inset-0 bg-gradient-to-r ${info.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

    <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300">

      {/* Icon */}
      <div className="relative w-11 h-11 mb-3">
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${info.color} blur-md opacity-30 group-hover:opacity-60 transition`} />

        <div className={`relative w-full h-full rounded-xl ${info.bg} flex items-center justify-center`}>
          <info.icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
        {info.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {info.details}
      </p>
    </div>
  </motion.div>
));

// Memoized Trust Badge Component
const TrustBadge = memo(({ badge, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="flex flex-col items-center gap-1.5"
  >
    <badge.icon className="w-5 h-5 text-blue-500" />
    <div className="text-sm font-semibold text-gray-900 dark:text-white">{badge.label}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{badge.count}</div>
  </motion.div>
));

// Social Link Component
const SocialLink = memo(({ social, index }) => (
  <motion.a
    href={social.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.1 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 flex items-center gap-3 min-w-[140px]">
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-r ${social.color} flex items-center justify-center shadow-md`}>
        <social.icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{social.label}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">Follow us</p>
      </div>
    </div>
  </motion.a>
));

const Contact = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Phone: '',
    Company: '',
    Service: 'Web Development',
    Message: ''
  });

  const [state, handleSubmit] = useForm("xjgjqqnv");
  const [focusedField, setFocusedField] = useState(null);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Memoized focus handlers
  const handleFocus = useCallback((field) => () => setFocusedField(field), []);
  const handleBlur = useCallback(() => setFocusedField(null), []);

  // Optimized map iframe - loaded lazily
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.2536836754026!2d88.3653139!3d22.5186481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271295b9d2db7%3A0x8e8334863d0fbe04!2sDhakuria%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1682946571520!5m2!1sen!2sin";

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gray-50 dark:bg-[#0f172a] overflow-x-hidden transition-colors duration-500"
    >
      <SEOHead
        title="Contact Us – Get a Free Project Quote"
        description="Contact WaveMind Solutions for custom software development, mobile apps, AI solutions & cloud services. Get a free project quote. Call +91 82828 43434 or email us."
        keywords="contact WaveMind Solutions, software development quote, hire developers India, IT services Kolkata, project consultation, free quote software development"
        canonicalPath="/contact"
        structuredData={[contactPageSchema, createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)]" />
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />
      <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse animation-delay-2000 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-16 pb-10">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
            >
              <span className="text-gray-900 dark:text-white">
                Get in
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Touch
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Have a project in mind? Let's discuss how we can help you grow and transform your digital presence.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, idx) => (
                  <ContactCard key={idx} info={info} index={idx} />
                ))}
              </div>

              {/* Social Links Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative group"
              >
                <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Follow Us</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, idx) => (
                      <SocialLink key={idx} social={social} index={idx} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Map Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative group"
              >
                <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Our Location</h3>
                  </div>
                  <div className="rounded-xl overflow-hidden h-44 relative bg-gray-100 dark:bg-gray-700">
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Office Location"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
                <AnimatePresence mode="wait">
                  {state.succeeded ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="text-center mb-5">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          Send us a Message
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          We'd love to hear from you
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            onFocus={handleFocus('firstName')}
                            onBlur={handleBlur}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                            placeholder="John"
                          />
                          <ValidationError
                            prefix="First Name"
                            field="firstName"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            onFocus={handleFocus('lastName')}
                            onBlur={handleBlur}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                            placeholder="Doe"
                          />
                          <ValidationError
                            prefix="Last Name"
                            field="lastName"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                            placeholder="john@example.com"
                          />
                          <ValidationError
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                            placeholder="+91 00000 00000"
                          />
                          <ValidationError
                            prefix="Phone"
                            field="phone"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            Company
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                            placeholder="Your Company"
                          />
                          <ValidationError
                            prefix="Company"
                            field="company"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                            Service *
                          </label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer text-sm"
                          >
                            {services.map(service => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                          <ValidationError
                            prefix="Service"
                            field="service"
                            errors={state.errors}
                            className="text-[10px] text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none text-sm"
                          placeholder="Tell us about your project..."
                        />
                        <ValidationError
                          prefix="Message"
                          field="message"
                          errors={state.errors}
                          className="text-[10px] text-red-500 mt-1"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={state.submitting}
                        className="group relative w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {state.submitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>

                      <p className="text-center text-[10px] text-gray-500 dark:text-gray-500 mt-3">
                        We'll never share your information. Promise.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 text-center">
            {trustBadges.map((badge, idx) => (
              <TrustBadge key={idx} badge={badge} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact; 