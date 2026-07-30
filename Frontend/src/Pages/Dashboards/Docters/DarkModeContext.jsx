import { createContext, useContext } from 'react';

const DarkModeContext = createContext();

/**
 * DarkModeProvider
 *
 * CSS variables (--bg-primary, --sidebar-bg, etc.) are pre-defined in
 * index.html's inline <style> block so there is NO post-hydration layout shift.
 * Dark-mode toggling is disabled; the provider exists only to supply the context.
 */
export const DarkModeProvider = ({ children }) => {
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