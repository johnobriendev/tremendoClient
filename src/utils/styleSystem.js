// src/utils/styleSystem.js
import { colors } from '../theme/colors';

// Main theme styles for different surface types
export const getThemeStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.primary : colors.light.background.primary,
  color: isDark ? colors.dark.text.primary : colors.light.text.primary,
});

export const getNavBarStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.secondary : colors.light.background.secondary,
  color: isDark ? colors.dark.text.primary : colors.light.text.primary,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

export const getModalStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.secondary : colors.light.background.secondary,
  color: isDark ? colors.dark.text.primary : colors.light.text.primary,
});
export const getBoardStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.secondary : colors.light.background.secondary,
  color: isDark ? colors.dark.text.secondary : colors.light.text.secondary,
});

export const getListStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.tertiary : colors.light.background.tertiary,
  color: isDark ? colors.dark.text.primary : colors.light.text.primary,
});

export const getCardStyles = (isDark) => ({
  backgroundColor: isDark ? colors.dark.background.secondary : colors.light.background.secondary,
  color: isDark ? colors.dark.text.primary : colors.light.text.primary,
});

// Button styles with both Tailwind and custom color options
export const getButtonStyles = (type = 'primary', variant = 'solid') => {
  const baseStyles = "px-4 py-2 rounded-lg transition-colors duration-200";
  
  const colorMap = {
    primary: colors.accent.blue,
    success: colors.accent.green,
    danger: colors.accent.red,
    special: colors.accent.purple,
  };

  if (variant === 'solid') {
    return {
      className: `${baseStyles} text-white`,
      style: {
        backgroundColor: colorMap[type],
        '&:hover': {
          opacity: 0.9,
        },
      },
    };
  }

  // For outline variant
  return {
    className: `${baseStyles} bg-transparent`,
    style: {
      color: colorMap[type],
      border: `1px solid ${colorMap[type]}`,
      '&:hover': {
        backgroundColor: `${colorMap[type]}20`, // 20 is hex for 12% opacity
      },
    },
  };
};

// Helper for getting text colors
export const getTextStyles = (isDark, type = 'primary') => {
  const textColors = isDark ? {
    primary: colors.dark.text.primary,
    secondary: colors.dark.text.secondary,
    muted: colors.dark.text.muted,
  } : {
    primary: colors.light.text.primary,
    secondary: colors.light.text.secondary,
    muted: colors.light.text.muted,
  };

  return {
    color: textColors[type],
  };
};

// Example usage of all styles together for a component
export const getComponentStyles = (isDark) => ({
  container: {
    ...getThemeStyles(isDark),
    padding: '1rem',
    borderRadius: '0.5rem',
  },
  header: {
    ...getTextStyles(isDark, 'primary'),
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  content: {
    ...getTextStyles(isDark, 'secondary'),
  },
  footer: {
    ...getTextStyles(isDark, 'muted'),
    marginTop: '1rem',
  },
});

// For background color themes (replacing background images)
export const backgroundThemes = {
  ocean: {
    light: '#E0F2FE',  // sky-100
    dark: '#0C4A6E',   // sky-900
  },
  forest: {
    light: '#DCFCE7',  // green-100
    dark: '#14532D',   // green-900
  },
  sunset: {
    light: '#FFE4E6',  // rose-100
    dark: '#881337',   // rose-900
  },
  lavender: {
    light: '#F3E8FF',  // purple-100
    dark: '#581C87',   // purple-900
  },
  neutral: {
    light: colors.light.background.primary,
    dark: colors.dark.background.primary,
  },
};