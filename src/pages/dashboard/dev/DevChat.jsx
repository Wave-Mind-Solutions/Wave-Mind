/**
 * DevChat — same chat logic as ClientChat, mounted in Developer layout
 */
import { useState, useEffect, useRef } from 'react';
// Removed
import { MessageSquare, Send, Search } from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { getConversations, getMessages, sendMessage } from '../../../services/chatService';
import { useAuth } from '../../../context/AuthContext';
import socket from '../../../services/SocketService';
import toast from 'react-hot-toast';

const DevChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getConversations()
      .then(res => setConversations(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    socket.emit('join_conversation', { conversationId: activeConv.conversationId });
    getMessages(activeConv.conversationId)
      .then(res => setMessages(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingMsgs(false));
    return () => socket.emit('leave_conversation', { conversationId: activeConv.conversationId });
  }, [activeConv]);

  useEffect(() => {
    const handler = ({ message }) => {
      if (activeConv && message.conversationId === activeConv.conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      } else {
        toast('New Transmission! 🛰️');
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
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch { toast.error('Transmission Failed.'); }
    finally { setSending(false); }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout role="developer" title="Neural Link">
      <div className="premium-glass rounded-[3rem] border border-white/10 shadow-2xl h-[calc(100vh-250px)] flex overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600/5 opacity-30 blur-[100px] -z-10" />
        
        {/* Sidebar */}
        <div className="w-80 md:w-96 border-r border-white/5 flex flex-col backdrop-blur-3xl bg-white/[0.02]">
          <div className="p-8 border-b border-white/5">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="text" placeholder="Scan protocols..." className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/30 transition-all font-black uppercase tracking-widest relative z-10" />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loadingConvs ? Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />) :
             conversations.length === 0 ? (
               <div className="text-center py-12 px-6">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <MessageSquare className="text-gray-700" size={24} />
                 </div>
                 <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Silence in the void</div>
               </div>
             ) :
             conversations.map((conv, i) => (
              <button 
                key={i} 
                
                
                onClick={() => setActiveConv(conv)}
                className={`w-full p-5 rounded-[2rem] flex items-center gap-4 cursor-pointer transition-all text-left border relative overflow-hidden group ${activeConv?.conversationId === conv.conversationId ? 'bg-blue-600/10 border-blue-500/30 shadow-2xl shadow-blue-600/10' : 'bg-transparent border-transparent hover:bg-white/[0.03]'}`}>
                {activeConv?.conversationId === conv.conversationId && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />}
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-2xl border border-white/10">
                    {initials(conv.participant?.fullName)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1e293b] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-white text-sm tracking-tight truncate group-hover:text-blue-400 transition-colors">{conv.participant?.fullName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest truncate">{conv.participant?.role}</span>
                  </div>
                </div>
                
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 animate-pulse border border-blue-400/30">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className="flex-grow flex flex-col bg-white/[0.01]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg border border-white/10 shadow-2xl">
                  {initials(activeConv.participant?.fullName)}
                </div>
                <div>
                  <h4 className="font-black text-white text-lg tracking-tight">{activeConv.participant?.fullName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{activeConv.participant?.role} Node</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-5 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tactical Link Established</div>
              </div>
            </div>

            <div className="flex-grow p-10 space-y-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-blue-900/5">
              {loadingMsgs ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
                  <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Decrypting Stream...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                    <MessageSquare size={40} className="text-gray-700" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">Initiate Transmission</h3>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Zero data points in current buffer</div>
                </div>
              ) :
               messages.map((msg, i) => {
                const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;
                return (
                  <div 
                    
                    
                    key={i} 
                    className={`flex gap-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 text-xs font-black shadow-lg">
                        {initials(activeConv.participant?.fullName)}
                      </div>
                    )}
                    <div className={`max-w-md px-6 py-4 rounded-[2rem] border shadow-2xl relative ${isMine ? 'bg-blue-600 border-blue-400/30 text-white rounded-tr-none' : 'bg-white/5 text-gray-300 border-white/10 rounded-tl-none'}`}>
                      <div className="text-sm font-medium leading-relaxed tracking-wide">{msg.content}</div>
                      <span className={`text-[9px] font-black mt-2 block uppercase tracking-widest ${isMine ? 'text-blue-200 text-right' : 'text-gray-600'}`}>{formatTime(msg.createdAt)}</span>
                    </div>
                    {isMine && (
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-lg">
                        {initials(user?.fullName)}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-8 border-t border-white/5 backdrop-blur-2xl">
              <div className="flex items-center gap-4 bg-white/[0.03] rounded-3xl p-3 pl-8 border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/[0.05] transition-all shadow-2xl">
                <input type="text" placeholder="Encode message payload..." className="flex-grow bg-transparent outline-none text-white text-sm font-medium py-3"
                  value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <button 
                  
                  
                  onClick={handleSend} disabled={sending || !input.trim()}
                  className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-blue-400/30">
                  <Send size={22} className={sending ? 'animate-pulse' : ''} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-transparent to-blue-900/5">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-600/20 blur-[60px] animate-pulse" />
              <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                <MessageSquare size={64} className="text-blue-500/40" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Neural Link Idle</h3>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] max-w-xs leading-relaxed">Select an active node to establish a high-bandwidth tactical link</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DevChat;
