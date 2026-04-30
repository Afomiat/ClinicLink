import React, { useState, useEffect } from 'react';
import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
// import DoctorNotificationCenter from '../DoctorNotificationCenter';

import {
  FaUserInjured,
  FaCalendarCheck,
  FaComments,
  FaFileMedical,
  FaThLarge,
  FaBell,
  FaSearch,
  FaUser,
  FaVials,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaSun,
  FaMoon,
  FaSignOutAlt
} from 'react-icons/fa';
import { RiMedicineBottleLine } from 'react-icons/ri';
import { GiStethoscope } from 'react-icons/gi';
import styles from './DoctorLayout.module.css';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const location = useLocation();
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

useEffect(() => {
  // Simulate fetching doctor data
  setDoctorName('Dr. Sarah Johnson');
  
  // Simulate fetching notifications
  const mockNotifications = [
    // Your notification data here
  ];
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  setNotificationCount(unreadCount);
}, []);
  useEffect(() => {
    console.log('Current mode:', darkMode ? 'dark' : 'light');
    console.log('Computed container background:', 
      getComputedStyle(document.querySelector(`.${styles.container}`)).backgroundColor);
  }, [darkMode]);

  const navItems = [
    { 
      path: '/doctor', 
      label: 'Dashboard', 
      icon: <FaThLarge />,
      exact: true  // Only highlight on exact match
    },
    { 
      path: '/doctor/patients', 
      label: 'Patients', 
      icon: <FaUserInjured />,
      activePaths: ['/doctor/patients', '/doctor/patients/:patientId'] 
    },
    { 
      path: '/doctor/appointments', 
      label: 'Appointments', 
      icon: <FaCalendarCheck />,
      activePaths: ['/doctor/appointments'] 
    },
    { 
      path: '/doctor/messages', 
      label: 'Messages', 
      icon: <FaComments />, 
      badge: 5,
      activePaths: ['/doctor/messages'] 
    },
    { 
      path: '/doctor/reports', 
      label: 'Reports', 
      icon: <FaFileMedical />,
      activePaths: ['/doctor/reports'] 
    },
    { 
    path: '/doctor/notifications', 
    label: 'Notifications', 
    icon: <FaBell />,
    badge: notificationCount, // Use the actual notification count
    activePaths: ['/doctor/notifications'] 
  },
    { 
      path: '/doctor/lab', 
      label: 'Lab Results', 
      icon: <FaVials />,
      activePaths: ['/doctor/lab'] 
    },
    { 
      path: '/doctor/prescriptions', 
      label: 'Prescriptions', 
      icon: <RiMedicineBottleLine />,
      activePaths: ['/doctor/prescriptions'] 
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
          // Convert path pattern to regex (handle :params)
          const pattern = activePath.replace(/:[^\s/]+/g, '([^\\s/]+)');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(location.pathname);
        })
      : location.pathname.startsWith(path);
  };

  return (
<div className={`${styles.container} ${darkMode ? 'dark-mode' : ''}`}>
{/* Premium Sidebar */}
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
                <NavLink
                  to={path}
                  end={exact}
                  className={({ isActive }) =>
                    `${styles.navLink} ${
                      isActive || (!exact && isNonDashboardLinkActive(path, activePaths))
                        ? styles.activeLink
                        : ''
                    } ${darkMode ? styles.darkMode : ''}`
                  }
                >
                  <span className={styles.icon}>{icon}</span>
                  {isSidebarOpen && (
                    <>
                      <span className={styles.label}>{label}</span>
                      {badge > 0 && <span className={styles.navBadge}>{badge}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
  
        {isSidebarOpen && (
          <div className={`${styles.sidebarFooter} ${darkMode ? styles.darkMode : ''}`}>
            <Link to="/settings" className={`${styles.settingsLink} ${darkMode ? styles.darkMode : ''}`}>
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
        {/* Premium Top Navigation Bar */}
        <header className={`${styles.topBar} ${darkMode ? styles.darkMode : ''}`}>
          <div className={styles.searchContainer}>

                       <h1>Doctor Dashboard</h1>

          </div>
  
          <div className={styles.userControls}>
            <Link to="/doctor/notifications" className={styles.notificationBadge}>
              <FaBell className={styles.notificationIcon} />
              {notificationCount > 0 && (
                <span className={styles.notificationCount}>{notificationCount}</span>
              )}
            </Link>
            
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                <span>SJ</span>
              </div>
              {isSidebarOpen && (
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{doctorName}</span>
                  <span className={styles.userRole}>Cardiologist</span>
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

export default Layout;