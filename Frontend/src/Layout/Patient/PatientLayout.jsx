import React, { useState, useEffect } from 'react';
import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import NotificationCenter from '../../Pages/Dashboards/Patients/NotificationCenter';

import {
  FaCalendarCheck,
  FaComments,
  FaFileMedical,
  FaThLarge,
  FaBell,
  FaUserMd,
  FaVials,
  FaCog,
  FaSignOutAlt,
  FaPills,
  FaSearch,
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { GiMoneyStack } from 'react-icons/gi';

const PatientLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleProfileClick = () => {
    navigate('/patient/profile');
  };

  useEffect(() => {
    setPatientName('Sarah Johnson');
    const fetchNotificationsCount = async () => {
      try {
        const count = 3;
        setNotificationCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotificationsCount();
  }, []);

  const navItems = [
    {
      path: '/patient',
      label: 'Dashboard',
      icon: 'dashboard',
      exact: true,
    },
    {
      path: '/patient/doctors',
      label: 'Doctors',
      icon: 'stethoscope',
      activePaths: ['/patient/doctors'],
    },
    {
      path: '/patient/appointments',
      label: 'Appointments',
      icon: 'calendar_today',
      activePaths: ['/patient/appointments'],
    },
    {
      path: '/patient/messages',
      label: 'Messages',
      icon: 'chat_bubble',
      badge: 3,
      activePaths: ['/patient/messages'],
    },
    {
      path: '/patient/medical-records',
      label: 'Medical Records',
      icon: 'folder_shared',
      activePaths: ['/patient/medical-records'],
    },
    {
      path: '/patient/test-results',
      label: 'Test Results',
      icon: 'biotech',
      activePaths: ['/patient/test-results'],
    },
    {
      path: '/patient/prescriptions',
      label: 'Prescriptions',
      icon: 'medication',
      activePaths: ['/patient/prescriptions'],
    },
    {
      path: '/patient/Payment',
      label: 'Payment',
      icon: 'payments',
      activePaths: ['/patient/payment'],
    },
    {
      path: '/patient/notifications',
      label: 'Notifications',
      icon: 'notifications',
      badge: notificationCount,
      activePaths: ['/patient/notifications'],
    },
  ];

  const isNonDashboardLinkActive = (path, activePaths) => {
    return activePaths
      ? activePaths.some((activePath) => location.pathname.startsWith(activePath))
      : location.pathname.startsWith(path);
  };

  const isLinkActive = (path, activePaths, exact = false) => {
    if (exact) return location.pathname === path;
    return activePaths
      ? activePaths.some((activePath) => {
          const pattern = activePath.replace(/:[^\s/]+/g, '([^\\s/]+)');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(location.pathname);
        })
      : location.pathname.startsWith(path);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    navigate('/patient/notifications');
  };

  // Determine active nav item label for topbar title
  const activeNav = navItems.find((item) =>
    item.exact ? location.pathname === item.path : isNonDashboardLinkActive(item.path, item.activePaths)
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-inter transition-colors duration-500">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 border-r border-slate-100 bg-white flex flex-col h-full py-8 z-50 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? 'w-[280px]' : 'w-[88px]'
        } shadow-[20px_0_40px_rgba(0,0,0,0.02)]`}
      >
        {/* Logo Section */}
        <div className="px-6 mb-12 flex items-center gap-4 overflow-hidden group cursor-pointer" onClick={() => navigate('/patient')}>
          <div className="w-12 h-12 bg-secondary-container/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500 shadow-sm border border-secondary/10">
            <img src={logo} alt="ClinicLink Logo" className="w-8 h-8 object-contain" />
          </div>
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="min-w-0"
              >
                <h1 className="text-xl font-black text-slate-900 leading-tight truncate font-manrope flex items-center gap-2">
                  ClinicLink
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="material-symbols-outlined text-secondary text-base"
                  >
                    verified
                  </motion.span>
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-secondary font-black opacity-60">
                  Premium Portal
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 custom-scrollbar">
          {navItems.map(({ path, label, icon, activePaths, exact, badge }, i) => {
            const active = exact
              ? location.pathname === path
              : isNonDashboardLinkActive(path, activePaths);

            return (
              <NavLink
                key={`${path}-${i}`}
                to={path}
                end={exact}
                className={() =>
                  `flex items-center gap-3 px-4 py-3.5 transition-all duration-300 rounded-2xl relative group ${
                    active
                      ? 'text-secondary'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {active && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-secondary-container/10 rounded-2xl border border-secondary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <span
                  className={`material-symbols-outlined text-[22px] flex-shrink-0 relative z-10 transition-colors duration-300 ${
                    active ? 'text-secondary' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {icon}
                </span>
                
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex items-center justify-between relative z-10"
                    >
                      <span className={`text-sm font-bold tracking-tight ${active ? 'text-slate-900' : ''}`}>{label}</span>
                      {badge > 0 && (
                        <span className="bg-secondary text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-secondary/20">
                          {badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed mode */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl z-[100]">
                    {label}
                  </div>
                )}
                
                {!isSidebarOpen && badge > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full shadow-lg shadow-secondary/40 ring-2 ring-white z-20" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Settings + Logout */}
        <div className="px-4 mt-auto pt-6 border-t border-slate-50 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all duration-300 group">
            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-slate-600">settings</span>
            {isSidebarOpen && <span className="text-sm font-bold tracking-tight">Settings</span>}
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-error hover:bg-error/5 rounded-2xl transition-all duration-300 group">
            <span className="material-symbols-outlined text-[22px] text-error/60 group-hover:text-error">logout</span>
            {isSidebarOpen && <span className="text-sm font-bold tracking-tight">Log Out</span>}
          </button>

          <button 
            onClick={toggleSidebar}
            className="w-full mt-6 flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-300 group overflow-hidden"
          >
            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-slate-600 transition-transform duration-500">
              {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
            </span>
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Layout Wrapper ── */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-500 ease-in-out ${
          isSidebarOpen ? 'ml-[280px]' : 'ml-[88px]'
        }`}
      >
        {/* ── Top Navigation Bar ── */}
        <header
          className={`fixed top-0 right-0 h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 z-40 transition-all duration-500 ${
            isSidebarOpen ? 'left-[280px]' : 'left-[88px]'
          }`}
        >
          {/* Search Bar - Luxurious Style */}
          <div className="relative w-96 max-w-full group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-secondary">
              search
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
              placeholder="Search records, doctors, or results..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button
              className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:text-secondary hover:bg-secondary-container/10 transition-all shadow-sm"
              onClick={handleNotificationClick}

            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-secondary/20">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <button
              className="flex items-center gap-4 pl-4 border-l border-slate-100 cursor-pointer group"
              onClick={handleProfileClick}
            >
              <div className="text-right hidden lg:block">
                <p className="text-sm font-black text-slate-900 group-hover:text-secondary transition-colors">
                  {patientName || 'Sarah Johnson'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Member</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary font-black text-sm border border-secondary/10 shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3 duration-300">
                {patientName
                  ? patientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  : 'SJ'}
              </div>
            </button>
          </div>
        </header>

      {/* ── Main Content ── */}
      <main
        className={`transition-all duration-300 pt-24 px-8 pb-8 min-h-screen`}
      >
        <Outlet />
      </main>
      </div>
    </div>
  );
};

export default PatientLayout;