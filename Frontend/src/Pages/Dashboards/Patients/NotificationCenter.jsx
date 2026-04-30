import React, { useState, useEffect } from 'react';
import { 
  FaBell,
  FaBellSlash,
  FaRegBell,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaCalendarAlt,
  FaFileMedical,
  FaCommentDots,
  FaCog,
  FaFilter
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import styles from './NotificationCenter.module.css';

const NotificationCenter = () => {
//   const { darkMode } = useDarkMode();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notification categories
  const categories = {
    appointment: { icon: <FaCalendarAlt />, color: '#4CAF50' },
    medical: { icon: <FaFileMedical />, color: '#2196F3' },
    message: { icon: <FaCommentDots />, color: '#FF9800' },
    system: { icon: <FaCog />, color: '#9C27B0' },
    urgent: { icon: <FaExclamationCircle />, color: '#F44336' }
  };

  // Generate mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Upcoming Appointment",
        message: "Your checkup with Dr. Smith is tomorrow at 10:00 AM",
        timestamp: "10 min ago",
        category: "appointment",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        title: "Test Results Available",
        message: "Your blood test results from June 15 are now available",
        timestamp: "1 hour ago",
        category: "medical",
        read: false,
        priority: "medium"
      },
      {
        id: 3,
        title: "New Message",
        message: "Dr. Johnson sent you a message about your treatment plan",
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
        title: "Urgent: Insurance Update Needed",
        message: "Please update your insurance information before your next visit",
        timestamp: "3 days ago",
        category: "urgent",
        read: false,
        priority: "high"
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, read: true })
    );
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeFilter);

  return (
    <div className={styles.notificationCenter}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>
            <FaBell className={styles.headerIcon} />
            Notifications
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </h2>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.settingsButton}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <FaCog />
          </button>
          <button 
            className={styles.markAllButton}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <motion.div 
          className={styles.settingsPanel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Notification Settings</h3>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Email notifications
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Push notifications
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Sound alerts
            </label>
          </div>
        </motion.div>
      )}

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <FaFilter /> All
        </button>
        {Object.keys(categories).map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${activeFilter === category ? styles.active : ''}`}
            onClick={() => setActiveFilter(category)}
            style={{ color: categories[category].color }}
          >
            {categories[category].icon} {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.notificationsList}>
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div 
                  className={styles.notificationIcon}
                  style={{ color: categories[notification.category].color }}
                >
                  {categories[notification.category].icon}
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h3>{notification.title}</h3>
                    <span className={styles.timestamp}>{notification.timestamp}</span>
                  </div>
                  <p>{notification.message}</p>
                </div>
                <div className={styles.notificationActions}>
                  {!notification.read && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className={styles.actionButton}
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <FaTimes />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaRegBell className={styles.emptyIcon} />
              <h3>No notifications found</h3>
              <p>When you have new notifications, they'll appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationCenter;