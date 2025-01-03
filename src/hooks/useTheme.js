import { useState, useEffect } from 'react';
import { colors } from '../theme/colors';

export const useTheme = () => {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Return everything components need
  return {
    theme,
    setTheme,
    isDark: theme === 'dark',
    colors: colors[theme],    // Current theme colors
    accent: colors.accent     // Accent colors (same in both themes)
  };
};