import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const root = document.documentElement;
  
    const lightModeVars = {
      '--bg-primary': '#ffffff',
      '--sidebar-bg': '#4a6fa5',
      '--sidebar-text': '#ffffff',
      '--sidebar-text-active': '#f0f0f0',
      '--white': '#ffffff',
      '--accent': '#4a6fa5',
      '--text-color': '#333333',
      '--bullet-color': '#4a6fa5',
      '--icon-color':'#e7af5c',
      '--calanderday':'000',
      '--active-text': '#000',
      '--active-nav-bag': '#EEEEEE',

      '--card-bg': '#ffffff',

    };
  
    const darkModeVars = {
      '--bg-primary': '#1E1E1E',            // Dark charcoal background
      '--sidebar-bg': '#2A2A2A',            // Slightly lighter gray for sidebar
      '--sidebar-text': '#CFCFCF',          // Light gray text
      '--sidebar-text-active': '#FFFFFF',   // White text for active state
      '--white': '#2A2A2A',
      '--accent': '#FF4C29',                // Orange-red accent (from text in image)
      '--active-bg': '#333333',             // Hover/active background
      '--active-text': '#FFFFFF',
      '--text-color': '#E0E0E0',            // Main text color
      '--bullet-color': '#FF4C29',
      '--icon-color':'#FF4C29',
      '--active-nav-bag': '#F79B72',
      '--calanderday':'FF4C29',
'--card-bg': '#3A3A3A',
           // Bullet/indicator color
    };
  
    const variables = darkMode ? darkModeVars : lightModeVars;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  
    root.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  return (
    <DarkModeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode: () => {} 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);