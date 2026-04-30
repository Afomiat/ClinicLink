import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaPaperclip, 
  FaMicrophone, 
  FaEllipsisV,
  FaSearch,
  FaCheckDouble,
  FaCheck,
  FaRegClock,
  FaArrowLeft
} from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import styles from './Messaging.module.css';
import { useLocation } from 'react-router-dom';
const PatientMessaging = () => {
  const [conversations, setConversations] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readStatus, setReadStatus] = useState({});
    const location = useLocation();
  const [initialDoctorId, setInitialDoctorId] = useState(null);
  useEffect(() => {
    if (location.state?.doctorId) {
      setInitialDoctorId(location.state.doctorId);
      // Clear the state after using it
      window.history.replaceState({}, '');
    }
  }, [location.state]);
  // Mock data for doctors with their conversations
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        avatar: 'SJ',
        lastSeen: 'online',
        unread: 2,
        isOnline: true
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        avatar: 'MC',
        lastSeen: '2h ago',
        unread: 0,
        isOnline: false
      },
      {
        id: 3,
        name: 'Dr. Emily Wilson',
        specialty: 'Pediatrics',
        avatar: 'EW',
        lastSeen: '1d ago',
        unread: 5,
        isOnline: false
      }
    ];

    // Mock conversations for each doctor
    const mockConversations = {
      1: [
        {
          id: '1-1',
          sender: 'doctor',
          text: 'Hello John, how are you feeling after starting the new medication?',
          timestamp: Date.now() - 3600000,
          status: 'read'
        },
        {
          id: '1-2',
          sender: 'patient',
          text: 'Much better, thank you! The dizziness has completely gone away.',
          timestamp: Date.now() - 1800000,
          status: 'read'
        },
        {
          id: '1-3',
          sender: 'doctor',
          text: 'That\'s great to hear. Any other symptoms we should discuss at your next appointment?',
          timestamp: Date.now() - 900000,
          status: 'delivered'
        }
      ],
      2: [
        {
          id: '2-1',
          sender: 'doctor',
          text: 'Your test results came back normal.',
          timestamp: Date.now() - 86400000,
          status: 'read'
        },
        {
          id: '2-2',
          sender: 'patient',
          text: 'That\'s a relief! Should I continue with the same treatment?',
          timestamp: Date.now() - 86300000,
          status: 'read'
        }
      ],
      3: []
    };

    setTimeout(() => {
      setDoctors(mockDoctors);
      setConversations(mockConversations);
      setIsLoading(false);
    }, 800);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChat]);

  // Track message visibility for read receipts
  useEffect(() => {
    if (!activeChat) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            if (messageId && !readStatus[messageId]) {
              setReadStatus(prev => ({ ...prev, [messageId]: true }));
              
              // Mark doctor's messages as read when visible
              setConversations(prev => {
                const updated = { ...prev };
                const conversation = updated[activeChat.id];
                if (conversation) {
                  updated[activeChat.id] = conversation.map(msg => {
                    if (msg.id === messageId && msg.sender === 'doctor' && msg.status !== 'read') {
                      return { ...msg, status: 'read' };
                    }
                    return msg;
                  });
                }
                return updated;
              });
            }
          }
        });
      },
      { threshold: 0.5, root: document.querySelector(`.${styles.messagesContainer}`) }
    );
    
    const messageElements = document.querySelectorAll(`.${styles.message}`);
    messageElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [activeChat, conversations, readStatus]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !activeChat) return;

    const doctorId = activeChat.id;
    const currentConversation = conversations[doctorId] || [];
    const tempId = `temp-${Date.now()}`;
    
    const newMsg = {
      id: tempId,
      sender: 'patient',
      text: newMessage,
      timestamp: Date.now(),
      status: 'sending'
    };

    // Optimistic update
    setConversations(prev => ({
      ...prev,
      [doctorId]: [...currentConversation, newMsg]
    }));
    setNewMessage('');

    // Simulate network flow
    setTimeout(() => {
      // Mark as sent
      setConversations(prev => ({
        ...prev,
        [doctorId]: prev[doctorId].map(msg => 
          msg.id === tempId ? { ...msg, id: `msg-${Date.now()}`, status: 'sent' } : msg
        )
      }));

      // Simulate delivery
      setTimeout(() => {
        setConversations(prev => ({
          ...prev,
          [doctorId]: prev[doctorId].map(msg => 
            msg.id.startsWith('temp-') && msg.id === tempId ? { ...msg, status: 'delivered' } : msg
          )
        }));

        // If doctor is online, simulate reading after delay
        if (activeChat.isOnline) {
          setTimeout(() => {
            setConversations(prev => ({
              ...prev,
              [doctorId]: prev[doctorId].map(msg => 
                msg.id.startsWith('temp-') && msg.id === tempId ? { ...msg, status: 'read' } : msg
              )
            }));
          }, 2000 + Math.random() * 3000);
        }
      }, 500);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = activeChat ? conversations[activeChat.id] || [] : [];

  return (
    <div className={styles.messagingContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${!activeChat ? styles.sidebarFull : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Messages</h2>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.doctorList}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No doctors found</p>
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className={`${styles.doctorItem} ${activeChat?.id === doctor.id ? styles.active : ''}`}
                onClick={() => setActiveChat(doctor)}
              >
                <div className={styles.avatar}>{doctor.avatar}</div>
                <div className={styles.doctorInfo}>
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                  <span className={styles.lastSeen}>
                    {doctor.lastSeen === 'online' ? 
                      <span className={styles.onlineDot}></span> : ''}
                    {doctor.lastSeen}
                  </span>
                </div>
                {doctor.unread > 0 && (
                  <div className={styles.unreadBadge}>{doctor.unread}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setActiveChat(null)}
            >
              <FaArrowLeft />
            </button>
            <div className={styles.chatPartner}>
              <div className={styles.avatar}>{activeChat.avatar}</div>
              <div>
                <h3>{activeChat.name}</h3>
                <p>
                  {activeChat.lastSeen === 'online' ? 
                    <span className={styles.onlineStatus}>Online</span> : 
                    `Last seen ${activeChat.lastSeen}`}
                </p>
              </div>
            </div>
            <button className={styles.menuButton}>
              <FaEllipsisV />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {currentMessages.length > 0 ? (
              <>
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    data-message-id={message.id}
                    className={`${styles.message} ${
                      message.sender === 'patient' ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.text}</p>
                      <div className={styles.messageMeta}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'patient' && (
                          <span className={styles.statusIcon}>
                            {message.status === 'read' ? (
                              <FaCheckDouble className={styles.readIcon} />
                            ) : message.status === 'delivered' ? (
                              <FaCheckDouble />
                            ) : message.status === 'sent' ? (
                              <FaCheck />
                            ) : (
                              <FaRegClock />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className={styles.emptyChat}>
                <div className={styles.telegramAnimation}>
                  <div className={styles.telegramPaper}>
                    <div className={styles.telegramLines}>
                      <div className={styles.telegramLine1}></div>
                      <div className={styles.telegramLine2}></div>
                      <div className={styles.telegramLine3}></div>
                    </div>
                  </div>
                </div>
                <h3>Start chatting with {activeChat.name}</h3>
                <p>Send a message to begin your conversation</p>
              </div>
            )}
          </div>

          <div className={styles.messageInput}>
            <button className={styles.attachmentButton}>
              <FaPaperclip />
            </button>
            <button className={styles.emojiButton}>
              <BsEmojiSmile />
            </button>
            <div className={styles.inputContainer}>
              <textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
              />
            </div>
            {newMessage ? (
              <button className={styles.sendButton} onClick={handleSendMessage}>
                <IoSend />
              </button>
            ) : (
              <button className={styles.voiceButton}>
                <FaMicrophone />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noChatSelected}>
          <div className={styles.noChatContent}>
            <h3>Select a conversation</h3>
            <p>Choose a doctor from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMessaging;