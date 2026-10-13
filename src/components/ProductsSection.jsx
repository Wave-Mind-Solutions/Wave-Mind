import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';

const WAVEBILL_URL = 'https://wavebill.wavemindsolutions.in/';

const wavebillFeatures = [
  'GST proforma and tax invoices with PDF download',
  'Invoice register and payment reminders',
  'AI invoice assistant with SAC code helper and voice entry',
  'UPI QR on proforma, share by email or WhatsApp',
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Products built by WaveMind
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Software we build and run ourselves, live and ready to use.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-xl p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-center shadow-sm">
                  <img src="/1-wavebill-mark.png" alt="WaveBill logo" className="w-8 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">WaveBill</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                    Live - free to sign up
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                A GST invoice generator for Indian businesses. Create proforma and tax invoices,
                download PDFs, track payments and send reminders from one place.
              </p>
              <a
                href={WAVEBILL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
              >
                Open WaveBill
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <ul className="flex-1 space-y-3">
              {wavebillFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
