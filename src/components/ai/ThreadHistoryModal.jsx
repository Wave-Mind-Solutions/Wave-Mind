import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Download, Trash2, Plus, MessageSquare, ArrowRight, X, Clock, Calendar } from 'lucide-react';

export default function ThreadHistoryModal({ isOpen, onClose, onSelectThread, onNewThread }) {
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadThreads();
    }
  }, [isOpen]);

  const loadThreads = () => {
    try {
      const stored = localStorage.getItem('wavemind_chat_threads');
      if (stored) {
        setThreads(JSON.parse(stored));
      } else {
        setThreads([]);
      }
    } catch (e) {
      console.error(e);
      setThreads([]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(threads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wavemind_chat_vault_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all past chat threads? This cannot be undone.')) {
      localStorage.removeItem('wavemind_chat_threads');
      setThreads([]);
    }
  };

  const filteredThreads = threads.filter(t => {
    const titleMatch = t.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const msgMatch = t.messages?.some(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase()));
    return titleMatch || msgMatch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#0e0b25] border border-purple-500/30 p-6 sm:p-8 shadow-2xl text-white font-sans flex flex-col overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-0.5 flex items-center justify-center shadow-lg shrink-0">
              <div className="w-full h-full bg-[#0a071a] rounded-[14px] flex items-center justify-center">
                <History className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">Conversation Vault</div>
              <h3 className="text-xl font-bold text-white">Past Chat Threads & History API</h3>
            </div>
          </div>

          {/* Action & Search Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads by keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/25 text-white text-xs outline-none focus:border-purple-400 transition-all"
              />
            </div>

            <button
              onClick={() => { onNewThread(); onClose(); }}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Thread</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={threads.length === 0}
              title="Export all threads to JSON file"
              className="py-2.5 px-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {threads.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all thread history"
                className="py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Threads List Container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {filteredThreads.length === 0 ? (
              <div className="py-12 text-center text-purple-300/50 text-sm">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No saved threads found in your conversation vault.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => {
                    onSelectThread(thread);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-900/30 transition-all cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                        {thread.title || 'Agentic AI Strategy Session'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        {thread.messages?.length || 0} msgs
                      </span>
                    </div>

                    <p className="text-xs text-purple-200/60 truncate">
                      {thread.messages?.[thread.messages.length - 1]?.text || 'No messages'}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-purple-300/50 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(thread.updatedAt || Date.now()).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(thread.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-600 text-purple-300 group-hover:text-white transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
