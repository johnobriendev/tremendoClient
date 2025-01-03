// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { colors } from '../theme/colors.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Use useMemo to compute the color values
  const themeColors = useMemo(() => {
    // This will recompute only when theme changes
    return {
      colors: {
        ...colors[theme],
        accent: colors.accent
      },
      accent: colors.accent,
      theme,
    };
  }, [theme]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    //  update the document's class for global CSS changes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Create a memoized value object that includes both the state and the setter
  const contextValue = useMemo(() => ({
    ...themeColors,
    setTheme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
  }), [themeColors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};