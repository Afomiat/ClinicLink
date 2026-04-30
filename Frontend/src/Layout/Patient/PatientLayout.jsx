import React, { useState, useEffect } from 'react';
import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import NotificationCenter from '../../Pages/Dashboards/Patients/NotificationCenter';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

import {
  FaCalendarCheck,
  FaComments,
  FaFileMedical,
  FaThLarge,
  FaBell,
  FaSearch,
  FaUserMd,
  FaVials,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaPills
} from 'react-icons/fa';
import { RiHospitalLine } from 'react-icons/ri';
import { GiMoneyStack } from 'react-icons/gi';
import styles from './PatientLayout.module.css';

const PatientLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const location = useLocation();
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
    const navigate = useNavigate();
const handleProfileClick = () => {
    navigate('/patient/profile');
  };

useEffect(() => {
  // Simulate fetching patient data
  setPatientName('John Smith');
  
  // Simulate fetching notifications count
  const fetchNotificationsCount = async () => {
    try {
      // In a real app, you would fetch this from your API
      const count = 3; // Mock count
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  fetchNotificationsCount();
}, []);

  useEffect(() => {
    console.log('Current mode:', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const navItems = [
    { 
      path: '/patient', 
      label: 'Dashboard', 
      icon: <FaThLarge />,
      exact: true
    },
    { 
      path: '/patient/doctors', 
      label: 'Doctors', 
      icon: <FaUserMd />,
      activePaths: ['/patient/doctors'] 
    },
    { 
      path: '/patient/appointments', 
      label: 'Appointments', 
      icon: <FaCalendarCheck />,
      activePaths: ['/patient/appointments'] 
    },
    { 
      path: '/patient/messages', 
      label: 'Messages', 
      icon: <FaComments />, 
      badge: 3,
      activePaths: ['/patient/messages'] 
    },
    { 
      path: '/patient/medical-records', 
      label: 'Medical Records', 
      icon: <FaFileMedical />,
      activePaths: ['/patient/medical-records'] 
    },
    { 
      path: '/patient/test-results', 
      label: 'Test Results', 
      icon: <FaVials />,
      activePaths: ['/patient/test-results'] 
    },
    { 
      path: '/patient/prescriptions', 
      label: 'Prescriptions', 
      icon: <FaPills />,
      activePaths: ['/patient/prescriptions'] 
    },
    { 
      path: '/patient/Payment', 
      label: 'Payment', 
      icon: <GiMoneyStack />,
      activePaths: ['/patient/payment'] 
    },
      { 
    path: '/patient/notifications', 
    label: 'Notifications', 
    icon: <FaBell />, 
    badge: notificationCount, // Use the notificationCount state
    activePaths: ['/patient/notifications'] 
  },
  ];

  const isNonDashboardLinkActive = (path, activePaths) => {
    return activePaths 
      ? activePaths.some(activePath => location.pathname.startsWith(activePath))
      : location.pathname.startsWith(path);
  };

  const isLinkActive = (path, activePaths, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return activePaths 
      ? activePaths.some(activePath => {
          const pattern = activePath.replace(/:[^\s/]+/g, '([^\\s/]+)');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(location.pathname);
        })
      : location.pathname.startsWith(path);
  };
  const handleNotificationClick = () => {
  // Clear the notification count when viewing notifications
  setNotificationCount(0);
  navigate('/patient/notifications');
};

// Update both the nav link and top bar bell to use this handler

  return (
    <div className={`${styles.container} ${darkMode ? 'dark-mode' : ''}`}>
      {/* Patient Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed} ${darkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.sidebarHeader} ${darkMode ? styles.darkMode : ''}`}>
          {isSidebarOpen && (
          <div className={styles.logo}>
            <img src={logo} alt="HealthPlus Logo" className={styles.logoImage} />
          </div>
          )}
          <button 
            className={styles.toggleButton}  
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
  
        <nav className={styles.navContainer}>
          <ul className={styles.navList}>
            {navItems.map(({ path, label, icon, activePaths, exact, badge }, i) => (
              <li key={`${path}-${i}`} className={styles.navItem}>
                {exact ? (
                  <NavLink
                    to={path}
                    end
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.activeLink : ''} ${darkMode ? styles.darkMode : ''}`
                    }
                  >
                    <span className={styles.icon}>{icon}</span>
                    {isSidebarOpen && <span className={styles.label}>{label}</span>}
                  </NavLink>
                ) : (
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `${styles.navLink} ${
                        isActive || isNonDashboardLinkActive(path, activePaths)
                          ? styles.activeLink
                          : ''
                      } ${darkMode ? styles.darkMode : ''}`
                    }
                  >
                    <span className={styles.icon}>{icon}</span>
                    {isSidebarOpen && (
                      <>
                        <span className={styles.label}>{label}</span>
                        {badge && <span className={styles.navBadge}>{badge}</span>}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
  
        {isSidebarOpen && (
          <div className={`${styles.sidebarFooter} ${darkMode ? styles.darkMode : ''}`}>
            <Link to="/patient/settings" className={`${styles.settingsLink} ${darkMode ? styles.darkMode : ''}`}>
              <FaCog className={styles.settingsIcon} />
              <span>Settings</span>
            </Link>
            <button className={`${styles.logoutButton} ${darkMode ? styles.darkMode : ''}`}>
              <FaSignOutAlt className={styles.logoutIcon} />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
  
      {/* Main Content Area */}
      <div className={`${styles.main} ${darkMode ? styles.darkMode : ''}`}>
        {/* Top Navigation Bar */}
        <header className={`${styles.topBar} ${darkMode ? styles.darkMode : ''}`}>
          <div className={styles.searchContainer}>
            <h1>Patient Dashboard</h1>
          </div>
  
          <div className={styles.userControls}>
            {/* <button 
              onClick={toggleDarkMode}
              className={`${styles.themeToggle} ${darkMode ? styles.darkMode : ''}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
             */}
            <div 
              className={styles.notificationBadge} 
              onClick={() => navigate('/patient/notifications')}
              style={{ cursor: 'pointer' }}
            >
              <FaBell className={styles.notificationIcon} />
              {notificationCount > 0 && (
                <span className={styles.notificationCount}>{notificationCount}</span>
              )}
            </div>
  <div className={styles.userProfile} onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
    <div className={styles.avatar}>
      <span>JS</span>
    </div>
    {isSidebarOpen && (
      <div className={styles.userInfo}>
        <span className={styles.userName}>{patientName}</span>
        <span className={styles.userRole}>Patient</span>
      </div>
    )}
  </div>
          </div>
        </header>
  
        {/* Content Area */}
        <main className={`${styles.content} ${darkMode ? styles.darkMode : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;