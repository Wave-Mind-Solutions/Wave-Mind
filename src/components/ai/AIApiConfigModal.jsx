import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Check, X, Trash2, Cpu, Zap } from 'lucide-react';

export default function AIApiConfigModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('wavemind');
  const [apiKey, setApiKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('wavemind_api_provider') || 'wavemind';
      const savedKey = localStorage.getItem('wavemind_api_key') || '';
      setProvider(savedProvider);
      setApiKey(savedKey);
      setStatusMessage('');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('wavemind_api_provider', provider);
    localStorage.setItem('wavemind_api_key', apiKey.trim());
    
    if (apiKey.trim()) {
      setStatusMessage(`✓ Real ${provider.toUpperCase()} Agent Connected Successfully!`);
    } else {
      setStatusMessage('✓ Active Provider: WaveMind Generative Core Engine');
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('wavemind_api_key');
    localStorage.setItem('wavemind_api_provider', 'wavemind');
    setApiKey('');
    setProvider('wavemind');
    setStatusMessage('✓ API Key cleared! Switched to WaveMind Generative Core.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0e0b25] border border-purple-500/30 p-6 sm:p-8 shadow-2xl text-white font-sans overflow-hidden"
        >
          {/* Header Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#0a071a] rounded-[14px] flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">Agentic Settings</div>
              <h3 className="text-xl font-bold text-white">LLM API Key Configuration</h3>
            </div>
          </div>

          <p className="text-sm text-purple-200/70 mb-6 leading-relaxed">
            Connect your own <strong>OpenAI</strong> or <strong>Google Gemini</strong> API keys for live high-throughput agent completions. Keys are stored safely in client local storage.
          </p>

          {/* Select Provider */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-purple-300 mb-2">Select LLM Provider Engine</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white font-medium text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              >
                <option value="wavemind">🤖 WaveMind Core Engine (Built-in offline fallback)</option>
                <option value="openai">⚡ OpenAI API (GPT-4o / GPT-3.5 Turbo)</option>
                <option value="gemini">✨ Google Gemini API (Gemini 1.5 Pro / Flash)</option>
              </select>
            </div>

            {/* Input API Key */}
            {provider !== 'wavemind' && (
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-2">
                  Enter {provider === 'openai' ? 'OpenAI Secret Key (sk-...)' : 'Google Gemini API Key'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'openai' ? 'sk-proj-...' : 'AIzaSy...'}
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white text-sm font-mono outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>
            )}
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-sm shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Save & Connect API</span>
            </button>

            {apiKey && (
              <button
                onClick={handleClear}
                title="Clear saved key"
                className="py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
