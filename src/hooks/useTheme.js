// src/hooks/useTheme.js
import { useState, useEffect } from 'react';
import { colors } from '../theme/colors';  // Import from theme/colors.js instead of styleSystem
import { backgroundThemes } from '../utils/styleSystem';  // Only import backgroundThemes from styleSystem


export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'neutral');
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeColor', themeColor);
  }, [theme, themeColor]);

  return {
    theme,
    setTheme,
    themeColor,
    setThemeColor,
    isDark: theme === 'dark',
    colors: {
      background: {
        ...colors[theme].background,
        ...backgroundThemes[themeColor][theme]
      },
      text: colors[theme].text,
      accent: colors.accent
    }
  };
};
// import { useState, useEffect } from 'react';

// export const useTheme = () => {
//   const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
//   useEffect(() => {
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   return [theme, setTheme];
// };