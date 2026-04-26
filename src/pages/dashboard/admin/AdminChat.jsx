/**
 * AdminChat — reuses the same real-time chat logic as ClientChat
 * but mounted in the Admin dashboard layout
 */
import { useState, useEffect, useRef } from 'react';
// Removed
import {
  MessageSquare, Send, Search, Plus, X, User as UserIcon,
  Shield, Zap, Clock, CheckCheck, Phone, Video, Info,
  ChevronLeft
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getConversations, getMessages, sendMessage } from '../../../services/chatService';
import { getDevelopers, getClients } from '../../../services/adminService';
import { useAuth } from '../../../context/AuthContext';
import socket from '../../../services/SocketService';
import toast from 'react-hot-toast';

const AdminChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    Promise.all([getConversations(), getDevelopers(), getClients()])
      .then(([convRes, devRes, clientRes]) => {
        setConversations(convRes.data || []);
        setAllUsers([...(devRes.data || []), ...(clientRes.data || [])]);
      })
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

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
    return () => {
      if (activeConv?.conversationId) {
        socket.emit('leave_conversation', { conversationId: activeConv.conversationId });
      }
    };
  }, [activeConv]);

  useEffect(() => {
    const handler = ({ message, conversationId }) => {
      const activeId = activeConv?.conversationId;
      const msgConvId = message.conversationId || conversationId;
      if (activeConv && msgConvId === activeId) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      } else {
        toast.success(`Message from ${message.senderId?.fullName || 'User'}`, {
          icon: '💬',
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }
        });
        getConversations().then(res => setConversations(res.data || []));
      }
    };
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, [activeConv]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return;
    setSending(true);
    try {
      const res = await sendMessage(activeConv.participant?._id, input.trim());
      if (!activeConv.conversationId) {
        setActiveConv(prev => ({ ...prev, conversationId: res.data.conversationId }));
        getConversations().then(res => setConversations(res.data || []));
      }
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch { toast.error('Failed to transmit.'); }
    finally { setSending(false); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const filteredConvs = conversations.filter(c =>
    c.participant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" title="Direct Communication Hub">
      <div className="h-[calc(100vh-220px)] max-w-[1500px] mx-auto premium-glass rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex relative">

        {/* Sidebar */}
        <div


          className="w-full md:w-80 lg:w-96 bg-gray-50/50 dark:bg-white/5 border-r border-gray-100 dark:border-white/10 flex flex-col z-20 backdrop-blur-3xl"
        >
          <div className="p-8 border-b border-gray-100 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] -mr-16 -mt-16" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter">
                  <MessageSquare className="text-blue-600 w-6 h-6" />
                  Dispatch
                </h2>
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-2 ml-9">Secure Command Node</p>
              </div>
              <button
                onClick={() => setShowNewModal(true)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 flex items-center justify-center shadow-xl hover:scale-110 transition-all active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="relative z-10 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Scan frequencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white placeholder:text-gray-400 outline-none border border-gray-200 dark:border-white/5 focus:border-blue-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">

            {loadingConvs ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-6 rounded-3xl bg-gray-100/50 dark:bg-white/5 animate-pulse border border-gray-100 dark:border-white/5 h-24" />
              ))
            ) : filteredConvs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-[2rem] border border-gray-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">No Operational Streams</p>
              </div>
            ) : (
              filteredConvs.map((conv, i) => (
                <button
                  key={conv.conversationId || i}



                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-6 rounded-[2.5rem] transition-all text-left group relative overflow-hidden ${activeConv?.conversationId === conv.conversationId
                      ? 'bg-blue-600/10 border border-blue-500/20 shadow-2xl'
                      : 'bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl font-black shadow-2xl group-hover:scale-105 transition-transform ${conv.participant?.role === 'developer' ? 'from-orange-500 to-red-600' : 'from-blue-600 to-indigo-700'
                        }`}>
                        {initials(conv.participant?.fullName)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0f172a]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-black text-gray-900 dark:text-white text-base truncate tracking-tight">
                          {conv.participant?.fullName}
                        </h4>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : 'SYNC'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wide text-[10px]">{conv.lastMessage || 'Channel Ready'}</p>
                      <div className="mt-2">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border ${conv.participant?.role === 'developer' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                          {conv.participant?.role}
                        </span>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-2xl border-2 border-white dark:border-[#0f172a]">
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
        <div className="flex-grow flex flex-col bg-white/30 dark:bg-black/10 backdrop-blur-sm">
          {activeConv ? (
            <div
              key={activeConv.conversationId || 'new'}
              className="flex flex-col h-full"
            >
              {/* Chat Header */}
              <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]" />
                <div className="flex items-center gap-6 relative z-10">
                  <button onClick={() => setActiveConv(null)} className="md:hidden p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500"><ChevronLeft /></button>
                  <div className="relative group">
                    <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br flex items-center justify-center text-white text-2xl font-black shadow-2xl group-hover:rotate-6 transition-transform ${activeConv.participant?.role === 'developer' ? 'from-orange-500 to-red-600' : 'from-blue-600 to-indigo-700'
                      }`}>
                      {initials(activeConv.participant?.fullName)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0f172a]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{activeConv.participant?.fullName}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="px-3 py-1 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Operational Link</span>
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{activeConv.participant?.role} Specialist</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  {[Phone, Video, Info].map((Icon, i) => (
                    <button key={i}
                      className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all shadow-lg">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar bg-gray-50/20 dark:bg-black/5">
                {loadingMsgs ? (
                  <div className="h-full flex flex-col items-center justify-center gap-5">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-blue-600/30" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Feed...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-gray-200 dark:border-white/10">
                      <MessageSquare size={40} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-400 dark:text-gray-600 tracking-tighter">Command Direct Establish</h4>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">Ready for deployment orders...</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;
                    return (
                      <div
                        key={msg._id || idx}


                        className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-4 group`}
                      >
                        {!isMine && (
                          <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-2xl shrink-0 mt-2">
                            {initials(activeConv.participant?.fullName)}
                          </div>
                        )}
                        <div className={`relative max-w-[80%] ${isMine ? 'order-1' : 'order-2'}`}>
                          <div className={`p-6 rounded-[2.5rem] shadow-2xl relative ${isMine
                              ? 'bg-gradient-to-br from-gray-900 to-black dark:from-blue-600 dark:to-indigo-700 text-white rounded-tr-none border border-white/10'
                              : 'bg-white dark:bg-white/5 text-gray-900 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-white/10 backdrop-blur-md'
                            }`}>
                            <p className="text-sm font-bold leading-relaxed tracking-wide">{msg.content}</p>
                            <div className={`flex items-center gap-3 mt-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${isMine ? 'text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                {formatTime(msg.createdAt)}
                              </span>
                              {isMine && (
                                <CheckCheck size={12} className="text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        {isMine && (
                          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white flex items-center justify-center text-[8px] font-black shadow-xl shrink-0 mt-2 border border-gray-300 dark:border-white/10">
                            ADMIN
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Control Area */}
              <div className="p-8 border-t border-gray-100 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-3xl">
                <div className="flex items-center gap-5 bg-gray-100 dark:bg-white/5 p-3 pl-8 rounded-[3rem] border border-gray-200 dark:border-white/10 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-2"><Plus size={20} /></button>
                  <input
                    type="text"
                    placeholder="Dispatch directive transmission..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-grow bg-transparent outline-none text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 py-3"
                  />
                  <button


                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl disabled:opacity-50 group"
                  >
                    {sending ? <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.03] to-blue-600/[0.03] animate-pulse" />
              <div


                className="relative z-10 max-w-lg"
              >
                <div className="w-32 h-32 bg-white dark:bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl border border-gray-100 dark:border-white/10 group">
                  <Shield size={50} className="text-blue-600 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">Central Command Relay</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed opacity-80">
                  Select a satellite node (Client or Developer) to establish a secure synchronization channel for operational briefing.
                </p>

                <button
                  onClick={() => setShowNewModal(true)}
                  className="mt-12 px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl transition-all shadow-xl active:scale-95"
                >
                  Establish New Stream
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* New Stream Modal */}

      {showNewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div onClick={() => setShowNewModal(false)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
          <div
            className="premium-glass w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative z-10 border border-gray-100 dark:border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase tracking-[0.05em]">Operational Directory</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">Select Unit for Synchronization</p>
                </div>
                <button onClick={() => setShowNewModal(false)} className="w-14 h-14 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl text-gray-400 flex items-center justify-center transition-all"><X size={28} /></button>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                {allUsers.map(u => (
                  <button
                    key={u._id}

                    onClick={() => { setActiveConv({ participant: u }); setShowNewModal(false); }}
                    className="w-full p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-500/30 transition-all flex items-center gap-6 text-left group shadow-sm"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-2xl group-hover:scale-110 transition-transform ${u.role === 'developer' ? 'bg-gradient-to-br from-orange-400 to-red-600' : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                      }`}>
                      {initials(u.fullName)}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tighter group-hover:text-blue-600 transition-colors">{u.fullName}</h4>
                      <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${u.role === 'developer' ? 'text-orange-500' : 'text-blue-500'}`}>
                        {u.developerType || u.role} UNIT Node
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminChat;
