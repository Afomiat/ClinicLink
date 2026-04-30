import React, { useState, useEffect } from 'react';
import { 
  FaBell,
  FaBellSlash,
  FaRegBell,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFileMedicalAlt,
  FaCommentMedical,
  FaUserMd,
  FaCog,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdEmergency, MdMedicalServices } from 'react-icons/md';

// import { MdEmergency } from 'react-icons/md';
import styles from './DoctorNotificationCenter.module.css';

const DoctorNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Doctor-specific notification categories
  const categories = {
    appointment: { 
      icon: <FaCalendarAlt className={styles.categoryIcon} />, 
      color: '#4CAF50',
      name: 'Appointments'
    },
    lab_results: { 
      icon: <MdMedicalServices className={styles.categoryIcon} />, 
      color: '#2196F3',
      name: 'Lab Results'
    },
    messages: { 
      icon: <FaCommentMedical className={styles.categoryIcon} />, 
      color: '#FF9800',
      name: 'Messages'
    },
    emergency: { 
      icon: <MdEmergency className={styles.categoryIcon} />, 
      color: '#F44336',
      name: 'Emergencies'
    },
    patient_updates: { 
      icon: <FaUserMd className={styles.categoryIcon} />, 
      color: '#9C27B0',
      name: 'Patient Updates'
    },
    system: { 
      icon: <FaCog className={styles.categoryIcon} />, 
      color: '#607D8B',
      name: 'System'
    }
  };

  // Generate doctor-specific mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "New Patient Appointment",
        message: "Patient: Sarah Johnson\nReason: Annual physical\nTime: Tomorrow at 9:30 AM",
        details: "Patient has history of hypertension. Last visit 6 months ago. Requested flu shot.",
        timestamp: "5 min ago",
        category: "appointment",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        title: "Critical Lab Results",
        message: "Patient: Michael Chen\nTest: Complete Blood Count",
        details: "WBC: 14.2 (High)\nHGB: 10.1 (Low)\nPLT: 85 (Low)\nPlease review urgently.",
        timestamp: "25 min ago",
        category: "lab_results",
        read: false,
        priority: "urgent"
      },
      {
        id: 3,
        title: "Patient Message",
        message: "From: Robert Davis\nSubject: Medication side effects",
        details: "Dr., I've been experiencing dizziness since starting the new blood pressure medication. Should I stop taking it?",
        timestamp: "1 hour ago",
        category: "messages",
        read: true,
        priority: "medium"
      },
      {
        id: 4,
        title: "Emergency Alert",
        message: "Patient: Emma Wilson - Allergic Reaction",
        details: "Patient presenting with difficulty breathing and facial swelling after bee sting. Epinephrine administered. En route to ER.",
        timestamp: "2 hours ago",
        category: "emergency",
        read: false,
        priority: "critical"
      },
      {
        id: 5,
        title: "Patient Chart Update",
        message: "New records available for James Peterson",
        details: "Recent visit notes from Dr. Lee uploaded. New imaging results available.",
        timestamp: "1 day ago",
        category: "patient_updates",
        read: true,
        priority: "low"
      },
      {
        id: 6,
        title: "System Maintenance",
        message: "EHR system update scheduled",
        details: "The electronic health records system will be unavailable from 2:00 AM to 4:00 AM for scheduled maintenance.",
        timestamp: "2 days ago",
        category: "system",
        read: true,
        priority: "low"
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

  const toggleExpand = (id) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeFilter);

  // Sort by priority (critical first, then unread, then read)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.priority === 'critical') return -1;
    if (b.priority === 'critical') return 1;
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className={styles.notificationCenter}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>
            <IoMdNotificationsOutline className={styles.headerIcon} />
            Physician Alerts
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </h2>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.soundToggle} onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </div>
          <button 
            className={styles.settingsButton}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Notification settings"
          >
            <FaCog />
          </button>
          <button 
            className={`${styles.markAllButton} ${unreadCount === 0 ? styles.disabled : ''}`}
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
          <h3>Alert Preferences</h3>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Critical alerts (override all settings)
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              New lab results
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Appointment changes
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Patient messages
            </label>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              Mobile push notifications
            </label>
          </div>
        </motion.div>
      )}

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <FaFilter className={styles.filterIcon} /> All Alerts
        </button>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`${styles.filterButton} ${activeFilter === key ? styles.active : ''}`}
            onClick={() => setActiveFilter(key)}
            style={{ color: category.color }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      <div className={styles.notificationsList}>
        <AnimatePresence>
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map(notification => (
              <motion.div
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''} ${
                  notification.priority === 'critical' ? styles.critical : ''
                }`}
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
                    <div className={styles.headerRight}>
                      <span className={styles.timestamp}>{notification.timestamp}</span>
                      {notification.priority === 'critical' && (
                        <span className={styles.priorityBadge}>CRITICAL</span>
                      )}
                    </div>
                  </div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  
                  <AnimatePresence>
                    {expandedNotification === notification.id && (
                      <motion.div
                        className={styles.notificationDetails}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {notification.details.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    className={styles.expandButton}
                    onClick={() => toggleExpand(notification.id)}
                  >
                    {expandedNotification === notification.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
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
                    title="Dismiss"
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
              <h3>No alerts to display</h3>
              <p>When you have new notifications, they'll appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      

    </div>
  );
};

export default DoctorNotificationCenter;