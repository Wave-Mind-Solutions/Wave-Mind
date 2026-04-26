/**
 * WaveMind Solutions – Premium Chatbot Widget with Dark Mode
 * Floating lead-capture chatbot with modern glassmorphism UI
 * Fully integrated with website's dark/light theme
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// ── Constants ──────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const BOT_STEPS = [
  { id: 0, text: "Hi there! 👋 I'm your WaveMind assistant. Ready to bring your ideas to life? Let's start with what brings you here today." },
  { id: 1, text: "Excellent choice! 🎯 Could you share a bit more about your requirement or project vision? The more details, the better!" },
  { id: 2, text: "Wonderful! 💫 May I know who I'm speaking with?" },
  { id: 3, text: "Perfect! 📫 How should we reach you? (Email or phone number works great)" },
  { id: 4, text: "🎉 Amazing! You're all set! Our team will personally reach out within 24 hours. Can't wait to work with you!" },
];

const QUICK_REPLIES = {
  0: ["💼 New Project", "🚀 Business Growth", "💡 Idea Validation", "🔧 Support"],
  1: ["Mobile App", "Web Platform", "AI Integration", "Consulting"],
};

const TypingIndicator = () => (
  <div className="chatbot-bubble chatbot-bubble--bot" style={{ padding: '16px 20px', width: 74 }}>
    <span className="chatbot-typing-dot" />
    <span className="chatbot-typing-dot" />
    <span className="chatbot-typing-dot" />
  </div>
);

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const MessageBubble = ({ msg }) => {
  const [showTime, setShowTime] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={`chatbot-message-row chatbot-message-row--${msg.from}`}
      onHoverStart={() => setShowTime(true)}
      onHoverEnd={() => setShowTime(false)}
    >
      {msg.from === 'bot' && (
        <motion.div
          className="chatbot-avatar chatbot-avatar--bot"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/logo.png" alt="Bot Logo" className="chatbot-avatar-image" />
        </motion.div>
      )}
      <div className="chatbot-bubble-wrap">
        <motion.div
          className={`chatbot-bubble chatbot-bubble--${msg.from}${msg.isError ? ' chatbot-bubble--error' : ''}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {msg.text}
          {msg.from === 'bot' && !msg.isError && (
            <span className="chatbot-bubble-sparkle">✨</span>
          )}
        </motion.div>
        <AnimatePresence>
          {showTime && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`chatbot-timestamp chatbot-timestamp--${msg.from}`}
            >
              {formatTime(msg.time)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {msg.from === 'user' && (
        <motion.div
          className="chatbot-avatar chatbot-avatar--user"
          whileHover={{ scale: 1.05 }}
        >
          <span className="chatbot-avatar-icon">👤</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Collected data
  const [leadData, setLeadData] = useState({
    requirement: '',
    name: '',
    contact: '',
  });

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const started = useRef(false);

  // ── Detect dark mode from HTML class ──────────────────────────────────
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Observe changes to html class (for dark mode toggle)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // ── Auto-scroll to bottom ──────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Focus input when chat opens ────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnreadCount(0);
    }
  }, [isOpen]);

  // ── Push a bot message after a simulated typing delay ─────────────────
  const pushBotMessage = useCallback((text, delay = 800) => {
    setIsTyping(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text, time: new Date() },
        ]);
        resolve();
      }, delay);
    });
  }, []);

  // ── Kick off chat on first open ────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !started.current) {
      started.current = true;
      pushBotMessage(BOT_STEPS[0].text, 400);
    }
  }, [isOpen, pushBotMessage]);

  // ── Submit lead to backend ─────────────────────────────────────────────
  const submitLead = useCallback(async (data) => {
    setIsSubmitting(true);
    setHasError(false);
    try {
      await axios.post(`${API_BASE}/lead`, {
        name: data.name,
        contact: data.contact,
        requirement: data.requirement,
      });
      setIsDone(true);
    } catch {
      setHasError(true);
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '⚠️ Oops! Something went wrong. Please try again or contact us directly at hello@wavemind.com',
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // ── Handle user message submission ────────────────────────────────────
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || isSubmitting || isDone) return;

    // Push user message with animation
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed, time: new Date() },
    ]);
    setInput('');

    // Collect data based on current step
    const nextStep = step + 1;

    if (step === 0) {
      setStep(nextStep);
      await pushBotMessage(BOT_STEPS[1].text);

    } else if (step === 1) {
      setLeadData((prev) => ({ ...prev, requirement: trimmed }));
      setStep(nextStep);
      await pushBotMessage(BOT_STEPS[2].text);

    } else if (step === 2) {
      setLeadData((prev) => ({ ...prev, name: trimmed }));
      setStep(nextStep);
      await pushBotMessage(BOT_STEPS[3].text);

    } else if (step === 3) {
      const updatedData = { ...leadData, contact: trimmed };
      setLeadData(updatedData);
      setStep(nextStep);

      await pushBotMessage(BOT_STEPS[4].text, 600);
      await submitLead(updatedData);
    }
  }, [input, isTyping, isSubmitting, isDone, step, leadData, pushBotMessage, submitLead]);

  const handleQuickReply = async (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  // ── Enter key handler ──────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Restart chat ───────────────────────────────────────────────────────
  const handleRestart = () => {
    setMessages([]);
    setStep(0);
    setInput('');
    setIsTyping(false);
    setIsDone(false);
    setHasError(false);
    setLeadData({ requirement: '', name: '', contact: '' });
    started.current = false;
    setTimeout(() => {
      started.current = false;
      pushBotMessage(BOT_STEPS[0].text, 400);
      started.current = true;
    }, 100);
  };

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      <motion.button
        id="chatbot-launcher"
        aria-label="Open chatbot"
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`chatbot-launcher ${isDarkMode ? 'chatbot-launcher--dark' : ''}`}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="chatbot-launcher__icon">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="chatbot-launcher__icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unreadCount > 0 && (
              <motion.span
                className="chatbot-unread-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </>
        )}

        {/* Notification pulse when closed */}
        {!isOpen && (
          <motion.span
            className="chatbot-launcher__pulse"
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            key="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`chatbot-window ${isDarkMode ? 'chatbot-window--dark' : ''}`}
          >
            {/* Header with gradient */}
            <div className={`chatbot-header ${isDarkMode ? 'chatbot-header--dark' : ''}`}>
              <div className="chatbot-header__gradient" />
              <div className="chatbot-header__content">
                <motion.div
                  className="chatbot-header__avatar"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <img src="/logo.png" alt="Bot Logo" className="chatbot-header-logo" />
                  <span className="chatbot-header__online" />
                </motion.div>
                <div className="chatbot-header__info">
                  <h3 className={`chatbot-header__name ${isDarkMode ? 'chatbot-header__name--dark' : ''}`}>
                    WaveMind Assistant
                  </h3>
                  <p className={`chatbot-header__status ${isDarkMode ? 'chatbot-header__status--dark' : ''}`}>
                    {isTyping ? (
                      <span className="chatbot-typing-status">Typing</span>
                    ) : (
                      <>
                        <span className="chatbot-status-dot" />
                        Online • Usually replies in minutes
                      </>
                    )}
                  </p>
                </div>
                <div className="chatbot-header__actions">
                  {(isDone || hasError) && (
                    <motion.button
                      onClick={handleRestart}
                      className={`chatbot-header__restart ${isDarkMode ? 'chatbot-header__restart--dark' : ''}`}
                      title="Start new conversation"
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className={`chatbot-header__close ${isDarkMode ? 'chatbot-header__close--dark' : ''}`}
                    aria-label="Close chatbot"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={18} height={18}>
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className={`chatbot-messages-container ${isDarkMode ? 'chatbot-messages-container--dark' : ''}`}>
              <div className="chatbot-messages">
                <AnimatePresence initial={false}>
                  {messages.length === 0 && !isTyping && (
                    <motion.div
                      className={`chatbot-welcome-message ${isDarkMode ? 'chatbot-welcome-message--dark' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="chatbot-welcome-icon">💬</span>
                      <p>Start a conversation with WaveMind AI assistant</p>
                    </motion.div>
                  )}

                  {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="chatbot-message-row chatbot-message-row--bot"
                    >
                      <div className="chatbot-avatar chatbot-avatar--bot">
                        <img src="/logo.png" alt="Bot Logo" className="chatbot-avatar-image" />
                      </div>
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Replies */}
                {!isTyping && !isDone && step < 2 && messages.length > 0 && QUICK_REPLIES[step] && (
                  <motion.div
                    className="chatbot-quick-replies"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {QUICK_REPLIES[step].map((reply, idx) => (
                      <motion.button
                        key={idx}
                        className={`chatbot-quick-reply ${isDarkMode ? 'chatbot-quick-reply--dark' : ''}`}
                        onClick={() => handleQuickReply(reply)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className={`chatbot-input-area ${isDarkMode ? 'chatbot-input-area--dark' : ''}`}>
              {isDone ? (
                <motion.div
                  className="chatbot-done-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="chatbot-done-icon">🎉</div>
                  <p className={`chatbot-done-label ${isDarkMode ? 'chatbot-done-label--dark' : ''}`}>
                    Thanks for chatting! We'll reach out soon.
                  </p>
                  <motion.button
                    className={`chatbot-new-chat-btn ${isDarkMode ? 'chatbot-new-chat-btn--dark' : ''}`}
                    onClick={handleRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start New Chat
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="chatbot-input-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <input
                    id="chatbot-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isTyping ? 'WaveMind is thinking...' : 'Type your message...'}
                    disabled={isTyping || isSubmitting}
                    className={`chatbot-input ${isDarkMode ? 'chatbot-input--dark' : ''}`}
                    maxLength={500}
                    autoComplete="off"
                  />
                  <motion.button
                    id="chatbot-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping || isSubmitting}
                    className="chatbot-send-btn"
                    aria-label="Send message"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <svg className="chatbot-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Branding footer */}
            <div className={`chatbot-footer ${isDarkMode ? 'chatbot-footer--dark' : ''}`}>
              <span>🔒 Your data is secure</span>
              <span className="chatbot-footer-divider">•</span>
              <span>Powered by <strong>WaveMind</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}