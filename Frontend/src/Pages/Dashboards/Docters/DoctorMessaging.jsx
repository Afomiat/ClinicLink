import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPaperclip, 
  FaMicrophone, 
  FaEllipsisV,
  FaSearch,
  FaCheckDouble,
  FaRegClock,
  FaArrowLeft,
  FaUserMd,
  FaUserInjured,
  FaFlask,
  FaUserShield,
  FaCheck
} from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import styles from './DoctorMessaging.module.css';

const DoctorMessaging = () => {
  const [conversations, setConversations] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data initialization
  useEffect(() => {
    const mockContacts = [
      // Patients
      {
        id: 'p-1',
        name: 'John Smith',
        type: 'patient',
        avatar: 'JS',
        lastSeen: 'online',
        unread: 2,
        isOnline: true
      },
      {
        id: 'p-2',
        name: 'Maria Garcia',
        type: 'patient',
        avatar: 'MG',
        lastSeen: '1h ago',
        unread: 0
      },
      // Lab Technicians
      {
        id: 'l-1',
        name: 'Lab Tech - Hematology',
        type: 'lab',
        avatar: 'LH',
        lastSeen: 'online',
        unread: 1,
        isOnline: true
      },
      // Administrators
      {
        id: 'a-1',
        name: 'Admin - Scheduling',
        type: 'admin',
        avatar: 'AS',
        lastSeen: 'online',
        unread: 3,
        isOnline: true
      }
    ];

    // Mock conversations
    const mockConversations = {
      'p-1': [
        {
          id: 'p1-1',
          sender: 'patient',
          text: 'Dr., I\'ve been experiencing some dizziness after taking the new medication',
          time: '10:30 AM',
          status: 'read'
        },
        {
          id: 'p1-2',
          sender: 'doctor',
          text: 'How often does this occur? Is it right after taking the pill or throughout the day?',
          time: '10:35 AM',
          status: 'read'
        }
      ],
      'l-1': [
        {
          id: 'l1-1',
          sender: 'lab',
          text: 'Dr., the blood work for John Smith shows elevated WBC count',
          time: '9:15 AM',
          status: 'read'
        }
      ],
      'a-1': [
        {
          id: 'a1-1',
          sender: 'admin',
          text: 'Reminder: You have 3 physicals scheduled for tomorrow morning',
          time: 'Yesterday',
          status: 'read'
        }
      ]
    };

    setTimeout(() => {
      setContacts(mockContacts);
      setConversations(mockConversations);
      setIsLoading(false);
    }, 800);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !activeChat) return;

    const contactId = activeChat.id;
    const currentConversation = conversations[contactId] || [];
    
    const newMsg = {
      id: currentConversation.length + 1,
      sender: 'doctor',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedConversations = {
      ...conversations,
      [contactId]: [...currentConversation, newMsg]
    };

    setConversations(updatedConversations);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact => 
    (activeTab === 'all' || contact.type === activeTab) &&
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = activeChat ? conversations[activeChat.id] || [] : [];

  const getContactIcon = (type) => {
    switch(type) {
      case 'patient': return <FaUserInjured />;
      case 'lab': return <FaFlask />;
      case 'admin': return <FaUserShield />;
      default: return <FaUserMd />;
    }
  };

  return (
    <div className={styles.messagingContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${!activeChat ? styles.sidebarFull : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2><FaUserMd />  Messages</h2>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'patient' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('patient')}
            >
              Patients
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'lab' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('lab')}
            >
              Lab
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'admin' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className={styles.contactList}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No {activeTab === 'all' ? 'contacts' : activeTab + 's'} found</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`${styles.contactItem} ${activeChat?.id === contact.id ? styles.active : ''}`}
                onClick={() => setActiveChat(contact)}
              >
                <div className={`${styles.avatar} ${styles[contact.type]}`}>
                  {getContactIcon(contact.type)}
                </div>
                <div className={styles.contactInfo}>
                  <h3>{contact.name}</h3>
                  <p className={styles.lastSeen}>
                    {contact.lastSeen === 'online' ? 
                      <span className={styles.onlineDot}></span> : ''}
                    {contact.lastSeen}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className={styles.unreadBadge}>{contact.unread}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Using same styling as patient version */}
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
              <div className={`${styles.avatar} ${styles[activeChat.type]}`}>
                {getContactIcon(activeChat.type)}
              </div>
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
                    className={`${styles.message} ${
                      message.sender === 'doctor' ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.text}</p>
                      <div className={styles.messageMeta}>
                        <span>{message.time}</span>
                            {message.sender === 'doctor' && (
                            <span className={styles.statusIcon}>
                                {message.status === 'read' ? (
                                <FaCheckDouble className={styles.readIcon} />
                                ) : message.status === 'sent' ? (
                                <FaCheck className={styles.sentIcon} />
                                ) : (
                                <FaRegClock className={styles.clockIcon} />
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
            <p>Choose from your patients, lab technicians, or administrators to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorMessaging;