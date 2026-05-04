import React, { useState, useEffect } from 'react';
import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#faf8ff] font-inter">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 border-r border-slate-200 bg-slate-50 flex flex-col h-full py-6 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-[280px]' : 'w-[72px]'
        }`}
      >
        {/* Logo */}
        <div className="px-5 mb-8 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src={logo} alt="ClinicLink Logo" className="w-7 h-7 object-contain" />
          </div>
          {isSidebarOpen && (
            <div className="min-w-0">
              <h1 className="text-lg font-black text-blue-700 leading-tight truncate font-manrope">
                ClinicLink
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Health Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon, activePaths, exact, badge }, i) => {
            const active = exact
              ? location.pathname === path
              : isNonDashboardLinkActive(path, activePaths);

            return (
              <NavLink
                key={`${path}-${i}`}
                to={path}
                end={exact}
                onClick={label === 'Notifications' ? handleNotificationClick : undefined}
                className={() =>
                  `flex items-center gap-3 px-5 py-3 transition-all duration-200 ease-in-out font-medium text-sm relative ${
                    active
                      ? 'text-blue-700 bg-blue-50/60 border-r-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-100 border-r-4 border-transparent'
                  }`
                }
              >
                <span
                  className={`material-symbols-outlined text-xl flex-shrink-0 ${
                    active ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {icon}
                </span>
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {badge > 0 && (
                      <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {/* Collapsed badge dot */}
                {!isSidebarOpen && badge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Book Appointment CTA */}
        {isSidebarOpen && (
          <div className="px-5 my-4">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Book Appointment
            </button>
          </div>
        )}

        {/* Footer: Settings + Logout */}
        <div className="pt-4 border-t border-slate-200 space-y-0.5">
          <Link
            to="/patient/settings"
            className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-100 transition-all font-medium text-sm"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 flex-shrink-0">
              settings
            </span>
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          <button className="w-full flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm">
            <span className="material-symbols-outlined text-xl text-slate-400 flex-shrink-0">
              logout
            </span>
            {isSidebarOpen && <span>Log Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-3 px-5 py-3 text-slate-500 hover:bg-slate-100 transition-all font-medium text-sm mt-1"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <span className="material-symbols-outlined text-xl text-slate-400 flex-shrink-0">
              {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
            </span>
            {isSidebarOpen && <span className="text-xs text-slate-400">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Top Navigation Bar ── */}
      <header
        className={`fixed top-0 right-0 h-16 border-b border-slate-200/60 bg-white/85 backdrop-blur-md flex items-center justify-between px-8 z-40 shadow-sm transition-all duration-300 ${
          isSidebarOpen ? 'left-[280px]' : 'left-[72px]'
        }`}
      >
        {/* Search */}
        <div className="relative w-96 max-w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Search records, doctors, or results..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          {/* Notifications */}
          <button
            className="relative text-slate-500 hover:text-blue-600 transition-colors"
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Settings shortcut */}
          <button className="text-slate-500 hover:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </button>

          {/* User profile */}
          <button
            className="flex items-center gap-3 pl-5 border-l border-slate-200 cursor-pointer group"
            onClick={handleProfileClick}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                {patientName}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Patient</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {patientName
                ? patientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : 'P'}
            </div>
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          isSidebarOpen ? 'ml-[280px]' : 'ml-[72px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;