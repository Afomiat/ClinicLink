import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
  
    const lightModeVars = {
      '--bg-primary': '#f8f9ff',
      '--sidebar-bg': '#ffffff',
      '--sidebar-text': '#64748b',
      '--sidebar-text-active': '#0f172a',
      '--white': '#ffffff',
      '--accent': '#119c89',
      '--text-color': '#0f172a',
      '--bullet-color': '#119c89',
      '--icon-color':'#119c89',
      '--calanderday':'#000000',
      '--active-text': '#000000',
      '--active-nav-bag': '#f1f5f9',
      '--card-bg': '#ffffff',
    };
  
    const variables = lightModeVars;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  
    root.classList.remove('dark');
    root.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }, []);
  
  return (
    <DarkModeContext.Provider value={{ 
      darkMode: false, 
      toggleDarkMode: () => {} 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);