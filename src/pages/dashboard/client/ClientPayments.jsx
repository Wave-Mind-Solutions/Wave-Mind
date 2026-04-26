import { useState, useEffect } from 'react';
// Removed
import { IndianRupee, CreditCard, FileText, CheckCircle, Clock, Activity, Download, ArrowRight, Shield, Zap, TrendingUp, DollarSign } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getPayments } from '../../../services/clientService';

const ClientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then(res => setPayments(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalBudget = payments.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalVouchers = payments.reduce((sum, p) => sum + (p.voucherCount || 0), 0);

  return (
    <DashboardLayout role="client" title="Ledger & Settlements">
      <div className="max-w-[1400px] mx-auto space-y-10 selection:bg-blue-500/30">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div 
              
              
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Shield size={12} />
              Verified Financial Protocol
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              Financial <span className="text-emerald-600 dark:text-emerald-500">Inventory</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest max-w-xl opacity-80">
              Audit your project allocations, settlement tokens, and organizational ledger in real-time.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Allocation', value: `₹${totalBudget.toLocaleString()}`, icon: DollarSign, color: 'from-blue-600 to-indigo-600', text: 'Operational Capital' },
            { label: 'Active Workstreams', value: String(payments.length), icon: Activity, color: 'from-emerald-500 to-teal-500', text: 'Live Engagements' },
            { label: 'Settlement Tokens', value: String(totalVouchers), icon: Zap, color: 'from-orange-500 to-amber-500', text: 'Verified Vouchers' },
          ].map((card, i) => (
            <div
              key={i}
              
              
              
              
              className="premium-glass rounded-[3rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.color} opacity-5 rounded-full blur-[50px] -mr-20 -mt-20 group-hover:opacity-20 transition-all duration-700`} />
              
              <div className="flex items-center gap-6 mb-10">
                <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">{card.label}</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-600 mt-1 uppercase tracking-widest">{card.text}</p>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                {loading ? <div className="w-32 h-12 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl" /> : card.value}
              </h3>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time Sync</span>
                <TrendingUp size={14} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Payment List */}
        <div 
          
          
          
          className="premium-glass rounded-[4rem] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-60 -mt-60" />
          
          <div className="p-12 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tighter">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                Operational Ledger
              </h3>
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mt-3 ml-16">Verified Transactional Manifest</p>
            </div>
            <button className="px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center gap-3 group shadow-xl active:scale-95">
              <Download size={16} className="group-hover:-translate-y-1 transition-transform" /> Export Statement
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/5 relative z-10">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-12 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                    <div className="space-y-3">
                      <div className="w-48 h-6 bg-gray-100 dark:bg-white/5 rounded-lg" />
                      <div className="w-32 h-4 bg-gray-100 dark:bg-white/5 rounded-lg" />
                    </div>
                  </div>
                  <div className="w-32 h-12 bg-gray-100 dark:bg-white/5 rounded-xl" />
                </div>
              ))
            ) : payments.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 dark:bg-white/2 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-white/10 m-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-200 dark:border-white/10 shadow-xl">
                  <CreditCard size={48} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">No Active Transactions</h4>
                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed max-w-xs mx-auto">
                  Historical settlement data and active ledger entries will be manifested here upon synchronization.
                </p>
              </div>
            ) : (
              payments.map((p, i) => (
                <div 
                  key={p._id || i} 
                  
                  className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative w-20 h-20 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <FileText size={32} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 dark:text-white tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">{p.title}</h4>
                      <div className="flex flex-wrap items-center gap-6 mt-3">
                        <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] shadow-sm">
                          {p.voucherCount} Secure Token{p.voucherCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Activity size={12} /> HASH: {p._id?.slice(-12).toUpperCase() || 'WM-NULL-NODE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 dark:border-white/5 pt-10 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-2">Entity Value</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₹{(p.budget || 0).toLocaleString()}</p>
                    </div>
                    <div className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl ${
                      p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/20'
                    }`}>
                      {p.status === 'Completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      {p.status}
                    </div>
                    <div className="hidden xl:block text-gray-300 dark:text-gray-700 group-hover:text-blue-600 dark:group-hover:text-white transition-colors group-hover:translate-x-3 transition-transform">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 premium-glass p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 flex items-center gap-6 group hover:border-blue-500/20 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Shield size={28} />
            </div>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[11px] mb-1">Matrix Encryption</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Financial data is end-to-end encrypted with AES-256 protocols.</p>
            </div>
          </div>
          <div className="flex-1 premium-glass p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <IndianRupee size={28} />
            </div>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[11px] mb-1">Automated Settlement</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Smart contracts handle voucher distribution upon milestone verification.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientPayments;
