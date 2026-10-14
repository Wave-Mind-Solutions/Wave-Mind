import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';

const WAVEBILL_URL = 'https://wavebill.wavemindsolutions.in/';

const wavebillFeatures = [
  'Proforma invoice with UPI QR, tax invoice, purchase order and Bill (no GST)',
  'Clean one-page classic PDF for every document',
  '21 how-to videos in English, Hindi and Bangla, inside the app',
  'Free plan to start: 50 invoices or 15 days, then upgrade',
  'Welcome email when you sign up',
  'Invoice register and payment reminders',
  'AI invoice assistant with SAC code helper and voice entry',
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
              <p className="text-xl md:text-2xl font-extrabold text-blue-600 dark:text-sky-400 mb-3">
                Chhote Business ka Bada Hisab
              </p>
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
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center">Simple plans for every business</h4>
          <p className="mt-2 mb-8 text-center text-gray-600 dark:text-gray-300">Start free. Upgrade when you grow.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-white/60 dark:bg-gray-800/40 p-6 flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Free</div>
              <div className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white">₹0</div>
              <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">Try it with real invoices</p>
              <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" /><span>50 invoices - any mix of proforma & tax</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" /><span>15 days limit</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" /><span>Customers & items</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" /><span>PDF download with your logo</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-white/60 dark:bg-gray-800/40 p-6 flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-sky-400">Starter</div>
              <div className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white">₹499<span className="ml-1 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">/year + 18% GST</span></div>
              <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">For growing businesses</p>
              <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>750 proforma + 750 tax invoices per year</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Payment tracking & customer ledger</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Purchase orders</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Credit & debit notes</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Stock management</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Accountant exports (CSV, ZIP, backup)</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>Signature on PDF invoices</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0 stroke-[3]" /><span>AI payment reminders (daily limit)</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-orange-500/30 bg-white/60 dark:bg-gray-800/40 p-6 flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">Pro</div>
              <div className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white">₹999<span className="ml-1 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">/year + 18% GST</span></div>
              <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">Everything, with AI</p>
              <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-orange-500 mt-0.5 shrink-0 stroke-[3]" /><span>Unlimited invoices</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-orange-500 mt-0.5 shrink-0 stroke-[3]" /><span>Everything in Starter</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-orange-500 mt-0.5 shrink-0 stroke-[3]" /><span>Email invoices to customers from the app</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-orange-500 mt-0.5 shrink-0 stroke-[3]" /><span>All AI features (reminders + AI help)</span></li>
                <li className="flex items-start gap-2.5"><Check className="h-4 w-4 text-orange-500 mt-0.5 shrink-0 stroke-[3]" /><span>Priority support</span></li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">Plans run 1 year from activation. Single user per account.</p>
          <p className="mt-2 text-center text-sm font-semibold text-blue-600 dark:text-sky-400">Chhote Business ka Bada Hisab</p>
        </div>
        </motion.div>
      </div>
    </section>
  );
}
