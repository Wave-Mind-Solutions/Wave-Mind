import React, { useState, useEffect } from 'react';
import { IndianRupee, Save, RefreshCw, AlertCircle, CheckCircle, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { OFFICIAL_WEBSITE_PRICING, formatINR } from '../../config/pricingConfig';

export default function PricingControl() {
  const [matrix, setMatrix] = useState(OFFICIAL_WEBSITE_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pricing');
      if (res.data && res.data.matrix) {
        setMatrix(res.data.matrix);
      }
    } catch (err) {
      console.warn('Backend pricing API endpoint fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (categoryKey, field, value) => {
    const numericVal = Math.max(0, Number(value) || 0);
    setMatrix(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [field]: numericVal
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving website pricing matrix...');

    try {
      // Validate that min <= recommended <= max
      for (const key of Object.keys(matrix)) {
        const cat = matrix[key];
        if (cat.min > cat.recommended) {
          toast.dismiss(toastId);
          toast.error(`Minimum price cannot be greater than recommended price for ${cat.label}.`);
          setSaving(false);
          return;
        }
        if (cat.recommended > cat.max) {
          toast.dismiss(toastId);
          toast.error(`Recommended price cannot be greater than maximum price for ${cat.label}.`);
          setSaving(false);
          return;
        }
      }

      const res = await api.put('/pricing', { matrix });
      toast.dismiss(toastId);
      toast.success(res.data?.message || 'Pricing matrix updated successfully! 🚀');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to save pricing matrix.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetBaseline = () => {
    setMatrix(OFFICIAL_WEBSITE_PRICING);
    toast.success('Reset to official WaveMind Solutions baseline prices.');
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-sm font-bold text-gray-500">Loading website pricing engine matrix...</p>
      </div>
    );
  }

  const categories = Object.keys(matrix);

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 text-white shadow-2xl relative overflow-hidden border border-purple-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Centralized Source of Truth
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Official Website Price Matrix Control
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
              Modifications made here will automatically synchronize with the AI Chatbot, Submit Project Form, frontend budget inputs, and server-side validation rules in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetBaseline}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs font-black text-white shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Matrix'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Matrix Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((key) => {
            const cat = matrix[key];
            return (
              <div
                key={key}
                className="p-6 rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/80 dark:border-purple-500/20 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.description || `Baseline rates for ${cat.label}`}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/20">
                    Min: {formatINR(cat.min)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Minimum Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      value={cat.min}
                      onChange={(e) => handlePriceChange(key, 'min', e.target.value)}
                    />
                  </div>

                  {/* Recommended Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Recommended (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-sm text-purple-600 dark:text-purple-400 focus:border-purple-500 focus:outline-none"
                      value={cat.recommended}
                      onChange={(e) => handlePriceChange(key, 'recommended', e.target.value)}
                    />
                  </div>

                  {/* Maximum Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Maximum Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                      value={cat.max}
                      onChange={(e) => handlePriceChange(key, 'max', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Hard minimum validation rule active across all endpoints.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Pricing Matrix...' : 'Save Website Pricing Matrix'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
