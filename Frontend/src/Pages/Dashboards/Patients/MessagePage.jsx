import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiSend, FiPaperclip, FiSmile, FiMoreVertical, 
  FiVideo, FiPhone, FiInfo, FiCheck, FiClock, FiChevronLeft
} from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';

const MessagePage = () => {
  const [conversations, setConversations] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
        status: 'online',
        unread: 2,
        lastMessage: "That's great to hear. Any other symptoms?"
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        status: 'busy',
        unread: 0,
        lastMessage: "Your test results came back normal."
      },
      {
        id: 3,
        name: 'Dr. Emily Wong',
        specialty: 'Pediatrics',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        status: 'offline',
        unread: 0,
        lastMessage: "See you at the next checkup."
      }
    ];

    const mockConversations = {
      1: [
        { id: 1, sender: 'doctor', text: 'Hello John, how are you feeling after starting the new medication?', timestamp: '10:30 AM', status: 'read' },
        { id: 2, sender: 'patient', text: 'Much better, thank you! The dizziness has completely gone away.', timestamp: '10:32 AM', status: 'read' },
        { id: 3, sender: 'doctor', text: "That's great to hear. Any other symptoms we should discuss at your next appointment?", timestamp: '10:35 AM', status: 'delivered' }
      ],
      2: [
        { id: 1, sender: 'doctor', text: 'Your test results came back normal.', timestamp: 'Yesterday', status: 'read' },
        { id: 2, sender: 'patient', text: "That's a relief! Should I continue with the same treatment?", timestamp: 'Yesterday', status: 'read' }
      ]
    };

    setTimeout(() => {
      setDoctors(mockDoctors);
      setConversations(mockConversations);
      setIsLoading(false);
      
      if (location.state?.doctorId) {
        const doc = mockDoctors.find(d => d.id === location.state.doctorId);
        if (doc) setActiveChat(doc);
      }
    }, 800);
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'patient',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setNewMessage('');
  };

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-lg py-lg font-inter bg-background h-[calc(100vh-100px)] overflow-hidden">
      <div className="grid grid-cols-12 gap-gutter h-full">
        
        {/* Sidebar: Conversations */}
        <div className={`col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 flex flex-col overflow-hidden shadow-sm ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-50">
            <h2 className="font-h1 text-h2 text-on-surface font-manrope mb-6">Messages</h2>
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search specialists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              </div>
            ) : filteredDoctors.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveChat(doc)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  activeChat?.id === doc.id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-sm">
                    <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    doc.status === 'online' ? 'bg-success' : doc.status === 'busy' ? 'bg-warning' : 'bg-slate-300'
                  }`} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${activeChat?.id === doc.id ? 'text-primary' : 'text-slate-900'}`}>
                      {doc.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">10:42 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{doc.lastMessage}</p>
                </div>
                {doc.unread > 0 && (
                  <div className="h-5 w-5 bg-primary text-white text-[9px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    {doc.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-100 flex flex-col overflow-hidden shadow-sm ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <FiChevronLeft size={24} />
                  </button>
                  <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm">
                    <img src={activeChat.image} alt={activeChat.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-none mb-1">{activeChat.name}</h3>
                    <p className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {activeChat.specialty} • Active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
                    <FiPhone size={18} />
                  </button>
                  <button className="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
                    <FiVideo size={18} />
                  </button>
                  <button className="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
                    <FiInfo size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
                <AnimatePresence mode="popLayout">
                  {(conversations[activeChat.id] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] space-y-1.5 ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-6 py-4 text-[14px] leading-relaxed shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] transition-all ${
                          msg.sender === 'patient' 
                            ? 'bg-primary text-white rounded-[26px] rounded-tr-[4px] font-medium' 
                            : 'bg-white text-slate-700 border border-slate-100 rounded-[26px] rounded-tl-[4px] font-medium'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-2 px-2 ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">{msg.timestamp}</span>
                          {msg.sender === 'patient' && (
                            <span className="text-primary/60">
                              {msg.status === 'read' ? <IoCheckmarkDone size={14} /> : <FiCheck size={12} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </div>

              {/* Input Bar */}
              <div className="p-6 pt-2">
                <div className="bg-slate-50/50 rounded-[28px] p-2 flex items-center gap-2 border border-slate-100/50 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
                  <button className="h-10 w-10 text-slate-400 hover:text-primary transition-colors flex items-center justify-center hover:bg-white rounded-full">
                    <FiPaperclip size={20} />
                  </button>
                  <button className="h-10 w-10 text-slate-400 hover:text-primary transition-colors flex items-center justify-center hover:bg-white rounded-full">
                    <FiSmile size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[14px] font-medium text-slate-700 px-3 placeholder:text-slate-300"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                      newMessage.trim() 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="h-24 w-24 bg-primary/5 rounded-[40px] flex items-center justify-center text-primary/30 relative">
                <FiSend size={40} className="rotate-12" />
                <div className="absolute inset-0 border-2 border-dashed border-primary/10 rounded-[40px] animate-spin-slow" />
              </div>
              <div className="max-w-xs">
                <h3 className="font-h3 text-h3 text-slate-900 mb-2">Private Care Messaging</h3>
                <p className="text-body-sm text-slate-400 leading-relaxed">Select a specialist from your care team to start a secure, private conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;