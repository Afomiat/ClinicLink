import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiCheck, FiX, FiSettings, FiFilter, 
  FiCalendar, FiFileText, FiMessageCircle, FiInfo, FiAlertCircle,
  FiMail, FiSmartphone, FiMessageSquare
} from 'react-icons/fi';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = {
    appointment: { icon: 'calendar_month', color: 'text-primary', bg: 'bg-primary/10' },
    medical: { icon: 'biotech', color: 'text-secondary', bg: 'bg-secondary/10' },
    message: { icon: 'chat', color: 'text-blue-500', bg: 'bg-blue-50' },
    system: { icon: 'settings', color: 'text-slate-500', bg: 'bg-slate-100' },
    urgent: { icon: 'emergency', color: 'text-error', bg: 'bg-error/10' }
  };

  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Upcoming Appointment",
        message: "Your checkup with Dr. Sarah Johnson is tomorrow at 10:00 AM",
        timestamp: "10 min ago",
        category: "appointment",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        title: "Test Results Available",
        message: "Your blood test results from June 15 are now available for review",
        timestamp: "1 hour ago",
        category: "medical",
        read: false,
        priority: "medium"
      },
      {
        id: 3,
        title: "New Message",
        message: "Dr. Robert Chen sent you a message about your heart health",
        timestamp: "3 hours ago",
        category: "message",
        read: true,
        priority: "medium"
      },
      {
        id: 4,
        title: "System Maintenance",
        message: "The patient portal will be down for maintenance tonight from 1-3 AM",
        timestamp: "1 day ago",
        category: "system",
        read: true,
        priority: "low"
      },
      {
        id: 5,
        title: "Prescription Ready",
        message: "Your prescription refill is ready for pickup at the pharmacy",
        timestamp: "2 days ago",
        category: "medical",
        read: false,
        priority: "high"
      },
      {
        id: 6,
        title: "Urgent: Insurance Update",
        message: "Please update your insurance information before your next visit",
        timestamp: "3 days ago",
        category: "urgent",
        read: false,
        priority: "high"
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setIsLoading(false);
    }, 800);
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-lg py-lg font-inter bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface font-manrope flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Stay updated with your clinical alerts and activity.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              unreadCount > 0 ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Mark All as Read
          </button>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-3 bg-white border border-slate-100 rounded-full shadow-sm hover:bg-slate-50 transition-all text-slate-500"
          >
            <FiSettings />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl border border-slate-100 mb-lg shadow-[0px_20px_50px_rgba(15,23,42,0.08)] overflow-hidden"
          >
            <div className="p-4 px-6">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">
                    Channels
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { id: 'email', label: 'Email', icon: <FiMail /> },
                      { id: 'push', label: 'Push', icon: <FiSmartphone /> },
                      { id: 'sms', label: 'SMS', icon: <FiMessageSquare /> }
                    ].map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2 px-4 bg-slate-50/80 rounded-xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all group">
                        <div className="h-7 w-7 bg-white shadow-sm rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'sms'} />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Last synced</p>
                    <p className="text-[9px] text-slate-500 font-black tracking-tight">Just Now</p>
                  </div>
                  <button 
                    onClick={() => setIsSettingsOpen(false)} 
                    className="h-9 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-gutter items-start">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-md sticky top-24">
          <div className="bg-white rounded-xl p-sm border border-slate-100 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <div className="p-xs border-b border-slate-50 mb-sm flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Filter Feed</h3>
              <button 
                onClick={() => setActiveFilter('all')}
                className="text-[11px] font-bold text-secondary hover:underline uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-sm p-xs">
              <div className="space-y-2">
                {['all', 'appointment', 'medical', 'message', 'system', 'urgent'].map(cat => (
                  <label 
                    key={cat} 
                    className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer capitalize font-medium py-1 px-1 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <input 
                      type="radio"
                      checked={activeFilter === cat}
                      onChange={() => setActiveFilter(cat)}
                      className="rounded-full border-slate-300 text-secondary focus:ring-secondary h-4 w-4"
                    />
                    <span className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] ${activeFilter === cat ? 'text-primary' : (categories[cat]?.color || 'text-slate-400')}`}>
                        {cat === 'all' ? 'all_inbox' : categories[cat].icon}
                      </span>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-secondary-container/20 rounded-xl p-sm border border-secondary/10">
            <h4 className="font-bold text-sm text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              Smart Cleanup
            </h4>
            <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed italic">
              "We recommend clearing notifications older than 30 days to keep your clinical dashboard organized."
            </p>
          </div>
        </div>

        {/* Notifications Main Feed */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
            Chronological Activity
            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{filteredNotifications.length}</span>
          </h3>

          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-bold uppercase tracking-widest">Loading Alerts...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className={`relative bg-white rounded-xl p-4 flex items-start gap-4 border transition-all hover:shadow-md group ${
                        !notif.read ? 'border-primary/20 bg-primary/[0.02]' : 'border-slate-100'
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categories[notif.category].bg}`}>
                        <span className={`material-symbols-outlined text-2xl font-light ${categories[notif.category].color}`}>
                          {categories[notif.category].icon}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-[15px] font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${!notif.read ? 'text-slate-700 font-medium' : 'text-slate-400 font-medium'}`}>
                          {notif.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        {!notif.read && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Mark as Read"
                          >
                            <FiCheck size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-xl p-20 text-center"
                  >
                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">notifications_off</span>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Inbox Zero Achieved</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-8">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Notifications are automatically archived after 60 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;