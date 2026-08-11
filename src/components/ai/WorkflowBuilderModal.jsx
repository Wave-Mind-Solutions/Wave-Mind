import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Workflow, Plus, Trash2, Play, Check, X, ArrowRight, Zap, Bot, Database, Mail } from 'lucide-react';

export default function WorkflowBuilderModal({ isOpen, onClose }) {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', name: 'Client Form Submission Trigger', desc: 'Fires when a new project requirement is received', icon: Zap, color: 'from-amber-500 to-orange-600' },
    { id: 2, type: 'ai', name: 'Agentic AI Requirement Intake', desc: 'Parses features, tech stack, and computes ₹ INR pricing estimate', icon: Bot, color: 'from-purple-600 to-indigo-600' },
    { id: 3, type: 'db', name: 'PostgreSQL & PGVector RAG Sync', desc: 'Stores proposal vectors and updates client project timeline', icon: Database, color: 'from-blue-600 to-cyan-600' },
    { id: 4, type: 'action', name: 'Automated Email & WhatsApp Dispatch', desc: 'Sends instant project blueprint proposal SLA to client', icon: Mail, color: 'from-emerald-500 to-teal-600' }
  ]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);

  const handleRunWorkflow = () => {
    setIsExecuting(true);
    setExecutionLog([]);

    nodes.forEach((node, idx) => {
      setTimeout(() => {
        setExecutionLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executed Step ${idx + 1}: ${node.name} ✓`]);
        if (idx === nodes.length - 1) {
          setIsExecuting(false);
        }
      }, (idx + 1) * 800);
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl h-[82vh] rounded-3xl bg-[#0b081e] border border-purple-500/30 p-6 sm:p-8 shadow-2xl text-white font-sans flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">WaveMind Visual Workflow Architect</h3>
                <p className="text-xs text-purple-300/60">Design & test autonomous AI agent pipeline workflows</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunWorkflow}
                disabled={isExecuting}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isExecuting ? 'Running Pipeline...' : 'Test Workflow Run'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {nodes.map((node, index) => {
                const IconComponent = node.icon;
                return (
                  <React.Fragment key={node.id}>
                    <div className="relative p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center text-white mb-3 shadow-md">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">Step 0{index + 1}</div>
                      <h4 className="font-bold text-sm text-white mb-1">{node.name}</h4>
                      <p className="text-xs text-purple-200/60 leading-relaxed mb-3">{node.desc}</p>
                      
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono pt-2 border-t border-purple-500/20">
                        <span>Status: Ready</span>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {index < nodes.length - 1 && (
                      <div className="hidden md:flex items-center justify-center text-purple-400/50">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Execution Console Output */}
            {executionLog.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-purple-500/30 font-mono text-xs text-emerald-400 space-y-1.5">
                <div className="text-purple-300 font-bold mb-2">Execution Telemetry Log:</div>
                {executionLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
