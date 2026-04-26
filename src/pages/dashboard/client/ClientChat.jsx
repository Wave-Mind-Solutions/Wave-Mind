import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Search, User, Phone, Video,
  MoreHorizontal, Smile, Paperclip, Mic, Star,
  Clock, CheckCheck, Shield, Sparkles, Zap,
  Users, Award, Bell, Volume2, Moon, Sun, ChevronLeft,
  Settings, Info, Activity
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getConversations, getMessages, sendMessage } from '../../../services/chatService';
import { getAdmins } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import socket from '../../../services/SocketService';
import toast from 'react-hot-toast';

const ClientChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load conversations & admins
  useEffect(() => {
    Promise.all([getConversations(), getAdmins()])
      .then(([convRes, adminRes]) => {
        setConversations(convRes.data || []);
        setAdmins(adminRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  // Load messages when active conv changes
  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    if (activeConv.conversationId) {
      socket.emit('join_conversation', { conversationId: activeConv.conversationId });
      getMessages(activeConv.conversationId)
        .then(res => setMessages(res.data || []))
        .catch(console.error)
        .finally(() => setLoadingMsgs(false));
    } else {
      setMessages([]);
      setLoadingMsgs(false);
    }

    if (activeConv.conversationId) {
      socket.emit('mark_read', { conversationId: activeConv.conversationId });
    }

    return () => {
      if (activeConv?.conversationId) {
        socket.emit('leave_conversation', { conversationId: activeConv.conversationId });
      }
    };
  }, [activeConv]);

  // Real-time new messages
  useEffect(() => {
    const handler = ({ message, conversationId }) => {
      const activeId = activeConv?.conversationId;
      const msgConvId = message.conversationId || conversationId;
      if (activeConv && msgConvId === activeId) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
        socket.emit('mark_read', { conversationId: activeId });
      } else {
        toast.success(`New message from ${message.senderId?.fullName || 'Support'}`, {
          icon: '💬',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
          }
        });
        getConversations().then(res => setConversations(res.data || []));
      }
    };

    const typingHandler = ({ conversationId, userId, isTyping }) => {
      if (activeConv?.conversationId === conversationId && userId !== user?._id) {
        setIsTyping(isTyping);
      }
    };

    socket.on('new_message', handler);
    socket.on('typing', typingHandler);

    return () => {
      socket.off('new_message', handler);
      socket.off('typing', typingHandler);
    };
  }, [activeConv, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!typing && activeConv?.conversationId) {
      setTyping(true);
      socket.emit('typing', { conversationId: activeConv.conversationId, isTyping: true });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (typing && activeConv?.conversationId) {
        setTyping(false);
        socket.emit('typing', { conversationId: activeConv.conversationId, isTyping: false });
      }
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return;
    const receiver = activeConv.participant?._id;
    if (!receiver) return;

    setSending(true);
    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      content: input.trim(),
      senderId: user?._id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    setInput('');

    if (typing && activeConv?.conversationId) {
      socket.emit('typing', { conversationId: activeConv.conversationId, isTyping: false });
      setTyping(false);
    }

    try {
      const res = await sendMessage(receiver, input.trim());
      setMessages(prev => prev.map(m => m._id === tempId ? { ...res.data, status: 'sent' } : m));
      if (!activeConv.conversationId) {
        setActiveConv(prev => ({ ...prev, conversationId: res.data.conversationId }));
        getConversations().then(res => setConversations(res.data || []));
      }
    } catch {
      toast.error('Transmission failed.');
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const myInitials = initials(user?.fullName);

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d) => {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const adminConvs = conversations.filter(c => c.participant?.role === 'admin');
  const filteredConvs = adminConvs.filter(conv =>
    conv.participant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const messageVariants = { hidden: { opacity: 0, y: 10, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } };

  return (
    <DashboardLayout role="client" title="Communication Hub">
      <div className="h-[calc(100vh-200px)] max-w-[1400px] mx-auto bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex relative">

        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-gray-50 dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="text-blue-600 w-5 h-5" />
                  Messages
                </h2>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1">Secure Communication</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
                <Shield size={16} className="text-blue-600" />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none border border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {loadingConvs ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse h-20" />
              ))
            ) : filteredConvs.length === 0 && admins.length > 0 ? (
              <div className="space-y-3 p-2">
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 text-center">Available Support Agents</p>
                {admins.map((adm, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveConv({ participant: adm })}
                    className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all text-left shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {initials(adm.fullName)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{adm.fullName}</h4>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Available
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              filteredConvs.map((conv, i) => (
                <button
                  key={conv.conversationId || i}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-4 rounded-xl transition-all text-left ${activeConv?.conversationId === conv.conversationId
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500/30 shadow-md'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                        {initials(conv.participant?.fullName)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {conv.participant?.fullName}
                        </h4>
                        <span className="text-[9px] font-medium text-gray-400">
                          {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage || 'Start a conversation...'}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col bg-white dark:bg-[#1e293b]">
          <AnimatePresence mode="wait">
            {activeConv ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-[#0f172a]/50">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setActiveConv(null)} className="md:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-md">
                        {initials(activeConv.participant?.fullName)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeConv.participant?.fullName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-500 text-[9px] font-semibold">Online</span>
                        <span className="text-[9px] font-medium text-gray-400">Support Specialist</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                      <button key={i} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-black/10">
                  {loadingMsgs ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                        <MessageSquare size={28} className="text-gray-400 dark:text-gray-600" />
                      </div>
                      <h4 className="text-base font-bold text-gray-500 dark:text-gray-400">No messages yet</h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[9px] font-semibold rounded-full">
                            {date}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {msgs.map((msg, idx) => {
                            const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;
                            return (
                              <motion.div
                                key={msg._id || idx}
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}
                              >
                                {!isMine && (
                                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {initials(activeConv.participant?.fullName)}
                                  </div>
                                )}
                                <div className={`relative max-w-[70%] ${isMine ? 'order-1' : 'order-2'}`}>
                                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMine
                                      ? 'bg-blue-600 text-white rounded-tr-sm'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-tl-sm'
                                    }`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                    <div className={`flex items-center gap-1.5 mt-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                      <span className={`text-[9px] font-medium ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {formatTime(msg.createdAt)}
                                      </span>
                                      {isMine && (
                                        msg.status === 'sending' ? <Clock size={9} className="animate-pulse" /> : <CheckCheck size={10} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isMine && (
                                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {myInitials}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div className="flex justify-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">?</div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 transition-all">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={handleTyping}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-grow bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 py-2.5"
                    />
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Smile size={18} />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending || !input.trim()}
                      className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-all"
                    >
                      {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1.5">
                      <Shield size={10} className="text-emerald-500" />
                      Encrypted
                    </span>
                    <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1.5">
                      <Activity size={10} className="text-blue-500" />
                      Real-time
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-md">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={36} className="text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a support agent from the sidebar to start messaging
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[
                      { icon: Shield, label: "Secure", color: "text-emerald-500" },
                      { icon: Clock, label: "Fast", color: "text-blue-500" },
                      { icon: Zap, label: "Priority", color: "text-yellow-500" }
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                        <item.icon className={`mx-auto mb-1.5 ${item.color}`} size={18} />
                        <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientChat;