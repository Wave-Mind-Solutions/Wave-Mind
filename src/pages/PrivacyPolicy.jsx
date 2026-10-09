import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Calendar, Mail, Globe, ArrowRight,
  ExternalLink, FileText, Database, Eye,
  Lock, Clock, UserCheck, AlertCircle, RefreshCw,
  MessageSquare, ChevronRight, CheckCircle2
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { privacyPolicyPageSchema, createBreadcrumbSchema } from '../utils/structuredData';

/**
 * EFFECTIVE DATE CONFIGURATION
 * 
 * Keep this date placeholder easy to update in a single location.
 * Website owners/administrators can replace this value once the
 * policy publication date is formally decided.
 */
export const PRIVACY_POLICY_EFFECTIVE_DATE = '9 October 2026';

// Table of contents items for quick navigation
const POLICY_SECTIONS = [
  { id: 'about-this-policy', num: '01', title: 'About this policy', icon: InfoIconSummary },
  { id: 'information-we-collect', num: '02', title: 'Information we collect', icon: Database },
  { id: 'why-we-use-information', num: '03', title: 'Why we use your information', icon: Eye },
  { id: 'who-may-receive-information', num: '04', title: 'Who may receive your information', icon: UserCheck },
  { id: 'cookies-and-tracking', num: '05', title: 'Cookies and similar technologies', icon: FileText },
  { id: 'data-retention', num: '06', title: 'How long we keep information', icon: Clock },
  { id: 'security', num: '07', title: 'Security', icon: Lock },
  { id: 'your-choices-and-rights', num: '08', title: 'Your choices, requests and complaints', icon: Shield },
  { id: 'children', num: '09', title: 'Children', icon: AlertCircle },
  { id: 'contact-us', num: '10', title: 'Contact us', icon: Mail },
  { id: 'changes-to-policy', num: '11', title: 'Changes to this policy', icon: RefreshCw },
];

function InfoIconSummary(props) {
  return <FileText {...props} />;
}

const PrivacyPolicy = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden transition-colors duration-700"
    >
      <SEOHead
        title="Privacy Policy"
        description="Learn how WaveMind Solutions collects, uses, protects and manages your personal information across our website and digital services."
        keywords="WaveMind Solutions privacy policy, data protection, DPDP Act 2023, user privacy, cookies policy, personal data rights"
        canonicalPath="/privacy-policy"
        structuredData={[
          privacyPolicyPageSchema,
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy-policy' }
          ])
        ]}
      />

      {/* Background Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f14_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f14_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
      </div>

      {/* Ambient Gradient Orbs */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-pink-500/5 dark:bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative pt-8 sm:pt-12 pb-20 sm:pb-24 z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} className="text-gray-400" />
              </li>
              <li className="text-blue-600 dark:text-blue-400" aria-current="page">
                Privacy Policy
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <header className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6"
            >
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Legal & Transparency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
            >
              <span className="text-gray-900 dark:text-white">Privacy </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6"
            >
              Learn how WaveMind Solutions collects, uses, protects and manages your personal information.
            </motion.p>

            {/* Effective Date Prominent Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-medium shadow-sm"
            >
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Effective date:{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {PRIVACY_POLICY_EFFECTIVE_DATE}
                </span>
              </span>
            </motion.div>
          </header>

          {/* Quick Table of Contents / Index Pill Grid */}
          <div className="mb-14 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-[#0a0c14]/70 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
              <FileText className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Table of Contents (11 Sections)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {POLICY_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  type="button"
                  className="flex items-center gap-2.5 p-2.5 text-left rounded-xl bg-gray-50/80 dark:bg-white/5 hover:bg-blue-50/80 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                >
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {sec.num}
                  </span>
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                    {sec.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 11 Policy Content Sections */}
          <article className="space-y-8">

            {/* 1. About this policy */}
            <section
              id="about-this-policy"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  1. About this policy
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  WaveMind Solutions is a website, app and digital-solutions agency based in India. This policy explains how we handle personal information collected through <strong className="text-gray-900 dark:text-white">wavemindsolutions.in</strong>, our Facebook and Instagram lead forms, and enquiries received through WhatsApp, email or other direct contact. It does not cover how our clients handle information on their own websites or apps.
                </p>
              </div>
            </section>

            {/* 2. Information we collect */}
            <section
              id="information-we-collect"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  2. Information we collect
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  When you contact us or submit an enquiry, we may collect your name, phone number, email address, business name, role in the business and the details you choose to share about your project. This can include the service you need, your budget range, preferred timeline and messages or files you send us.
                </p>
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-500/5 border border-blue-200/60 dark:border-blue-500/10">
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-blue-600 dark:text-blue-400">Social Lead Forms & Meta Platforms:</strong> Facebook or Instagram may pre-fill contact information in a lead form. Please check it before submitting. If a form uses phone verification, Meta may process the verification information under its own policies. Never share a verification code with us in a message.
                  </p>
                </div>
                <p>
                  Our website and its hosting services may also collect technical information such as your IP address, browser, device, pages visited and access times through server logs or cookies, depending on the website's configuration. Please do not send passwords, payment-card details, identity documents or other sensitive information in an enquiry.
                </p>
              </div>
            </section>

            {/* 3. Why we use your information */}
            <section
              id="why-we-use-information"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  3. Why we use your information
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  We use enquiry information to understand your needs, assess whether our services are suitable, answer questions, prepare quotes, arrange discussions and follow up about your enquiry. If you become a client, we also use the information needed to manage your project, provide support, issue invoices and keep required records.
                </p>
                <p>
                  We may use technical information to run and secure the website, troubleshoot problems and understand how it is used. We use personal information only for specified purposes and on a lawful basis under applicable law, including consent where required or permitted uses of information you voluntarily provide for a particular purpose.
                </p>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white">No unsolicited marketing:</strong> Submitting an enquiry is not consent to unrelated promotional messages. Where consent is required for marketing, we will ask separately. You can ask us to stop promotional contact at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Who may receive your information */}
            <section
              id="who-may-receive-information"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  4. Who may receive your information
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  Information may be handled by our authorised team members and service providers as needed for the purposes above. These may include website hosting providers, email and business-communication services, and Meta services used for Facebook, Instagram and WhatsApp enquiries. Providers may process information on our behalf or under their own terms, depending on the service.
                </p>
                <p>
                  Facebook, Instagram and WhatsApp also process information under their own privacy policies. Their collection and platform activity are not controlled by this policy. Some providers may process or store information outside India. Any transfers must follow applicable legal requirements and restrictions.
                </p>
                <p>
                  We may disclose information where required by law or where legally permitted to protect rights, investigate fraud or address security incidents.
                </p>
              </div>
            </section>

            {/* 5. Cookies and similar technologies */}
            <section
              id="cookies-and-tracking"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  05
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  5. Cookies and similar technologies
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  Cookies are small files saved by a website on your device. Depending on how our website is configured, it may use cookies for essential functions and, if enabled, analytics or advertising tools. Non-essential tracking will be subject to consent where required. You can manage or block cookies through your browser, although some website functions may not work correctly.
                </p>
              </div>
            </section>

            {/* 6. How long we keep information */}
            <section
              id="data-retention"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  06
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  6. How long we keep information
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  We keep personal information only for as long as needed for the purpose for which it was collected, unless a longer period is required or permitted by law. Enquiry records are reviewed and deleted or anonymised when no longer needed. Client, invoice and other required records may be retained to meet contractual, accounting, tax or legal obligations. When you withdraw consent or request deletion, we will stop the relevant processing and delete information unless a lawful reason requires us to retain it. Backup copies may remain until their normal deletion cycle and are not used for new marketing.
                </p>
              </div>
            </section>

            {/* 7. Security */}
            <section
              id="security"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs">
                  07
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  7. Security
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  We take reasonable technical and organisational steps to protect personal information against unauthorised access, loss and misuse. No website or communication service is completely secure. Where a personal-data breach requires notification under applicable law, we will notify affected people and the relevant authority as required.
                </p>
              </div>
            </section>

            {/* 8. Your choices, requests and complaints */}
            <section
              id="your-choices-and-rights"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs">
                  08
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  8. Your choices, requests and complaints
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  You can contact us to ask about the personal information we hold about you, request access or a summary, correct inaccurate information, request deletion, withdraw consent or stop marketing messages. We may need proportionate information to verify that a request is yours. Withdrawing consent does not affect processing already carried out lawfully, but may prevent us from providing a service that needs that information.
                </p>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent border border-blue-500/15">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Digital Personal Data Protection Act, 2023 (India)
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Where applicable and in force, India's Digital Personal Data Protection Act, 2023 provides rights including access to information about processing, correction and erasure, grievance redressal, and nomination of another person to exercise rights in the event of death or incapacity. We handle requests in accordance with applicable law. If your complaint is not addressed, you may use the relevant legal complaint process, including the Data Protection Board of India where that process is available and applicable.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Children */}
            <section
              id="children"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs">
                  09
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  9. Children
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  Our business enquiry services are intended for adults. Children under 18 should not submit personal information through these forms. If you believe a child has provided information, contact us so we can review it and take appropriate action under applicable law.
                </p>
              </div>
            </section>

            {/* 10. Contact us */}
            <section
              id="contact-us"
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-[#0a0c14]/90 dark:via-[#0a0c14]/90 dark:to-blue-950/20 backdrop-blur-sm border border-blue-500/30 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500 text-white font-bold text-xs shadow-md">
                  10
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  10. Contact us
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11 relative z-10">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  For privacy questions, deletion requests, consent withdrawal or complaints:
                </p>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-gray-200/80 dark:border-white/10">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                    WaveMind Solutions - Privacy Contact
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reach our privacy officer and legal contact desk through any of the verified channels below:
                  </p>
                </div>

                {/* Contact Cards Grid with clickable, accessible links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">

                  {/* Email */}
                  <a
                    href="mailto:info@wavemindsolutions.in"
                    className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:border-blue-500 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    aria-label="Send email to info@wavemindsolutions.in"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                      Email
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 break-all transition-colors">
                      info@wavemindsolutions.in
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/918282843434"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:border-emerald-500 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    aria-label="Chat with WaveMind Solutions on WhatsApp at +91 82828 43434"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <MessageSquare size={18} />
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                      WhatsApp
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      +91 82828 43434
                    </span>
                  </a>

                  {/* Website */}
                  <a
                    href="https://wavemindsolutions.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:border-purple-500 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    aria-label="Visit WaveMind Solutions website"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <Globe size={18} />
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                      Website
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 break-all transition-colors">
                      https://wavemindsolutions.in
                    </span>
                  </a>

                </div>
              </div>
            </section>

            {/* 11. Changes to this policy */}
            <section
              id="changes-to-policy"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0c14]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  11
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  11. Changes to this policy
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-0 sm:pl-11">
                <p>
                  We may update this policy when our practices or legal requirements change. The revised policy will show its effective date. Where required, we will provide an additional notice or seek fresh consent for a new purpose.
                </p>
              </div>
            </section>

          </article>

          {/* Quick Return to Top or Contact */}
          <div className="mt-14 pt-8 border-t border-gray-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <p>
              Questions about this policy?{' '}
              <a
                href="mailto:info@wavemindsolutions.in"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Write to our privacy team
              </a>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              type="button"
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Back to Top ↑
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default memo(PrivacyPolicy);
