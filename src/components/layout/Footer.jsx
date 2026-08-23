import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, Mail, Sparkles, Globe, Shield, Zap, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" aria-label="Site footer" className="bg-white dark:bg-[#0a0c14] border-t border-gray-100 dark:border-white/5 pt-16 pb-8 relative overflow-hidden transition-colors duration-700">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-3 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                  <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">WaveMind</span>
                <span className="block text-[10px] font-bold text-blue-500 tracking-[0.2em]">SOLUTIONS</span>
              </div>
            </Link>

            <p className="text-gray-500 dark:text-gray-400 text-sm italic max-w-sm">
              "Innovating digital frontiers with organic precision and aesthetic excellence. We bridge the gap between vision and reality."
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Linkedin, link: "https://www.linkedin.com/company/wavemind-solutions/posts/?feedView=all" },
                { icon: Instagram, link: "https://www.instagram.com/wavemindsolutions" },
                { icon: Facebook, link: "https://www.facebook.com/wavemindsolutions?rdid=oXzeaoVzthKwCqFQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BmFYbaUbs%2F#" }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 transition-all border dark:border-white/10 shadow-sm group"
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest border-l-2 border-blue-500 pl-2">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'AI Assistant', path: '/agent-ai' },
                { name: 'Our Projects', path: '/projects' },
                { name: 'Our Team', path: '/team' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full group-hover:w-3 group-hover:bg-blue-500 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://wave-mind-careers.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full group-hover:w-3 group-hover:bg-blue-500 transition-all" />
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest border-l-2 border-purple-500 pl-2">
              Capabilities
            </h4>
            <ul className="space-y-3">
              {['Web Development', 'Mobile Apps', 'Cloud & DevOps', 'AI Solutions'].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-bold flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full group-hover:w-3 group-hover:bg-purple-500 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers Section */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              Careers
            </h4>
            <div className="space-y-4">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
                Join our mission to craft the future.
              </p>
              <a
                href="https://wave-mind-careers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white text-[10px] font-bold rounded-xl transition-all group border border-indigo-500/20 uppercase tracking-widest"
              >
                Join Us
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>

          {/* Trust Section */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest border-l-2 border-pink-500 pl-2">
              Infrastructure
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Shield, label: 'Secure' },
                { icon: Zap, label: 'Fast' },
                { icon: Globe, label: 'Global' },
                { icon: Heart, label: 'Stable' }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border dark:border-white/10 hover:border-pink-500/30 transition-all">
                  <f.icon size={12} className="text-pink-500" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-blue-500/10 flex items-center gap-3">
              <Sparkles size={16} className="text-blue-500 animate-pulse" />
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Empowering the next generation of digital leaders.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-4">
            <span>© {currentYear} WaveMind</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <span className="italic">Organic Digital Craftsmanship</span>
          </div>

          <Link
            to="/contact"
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border dark:border-white/10 hover:border-blue-500/30 transition-all group"
          >
            <Mail size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
              info@wavemindsolutions.in
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;