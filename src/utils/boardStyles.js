export const getThemeStyles = (isDark) => ({
  backgroundColor: isDark ? '#1F2937' : '#dae8f1' , //'#181d28' '#b1cee2'
  color: isDark ? '#CBD5E0' : '#1A202C', //#fff #000
});

export const getModalStyles = (isDark) => ({
  backgroundColor: isDark ? '#4a5568' : '#dadde2',
  color: isDark ? '#CBD5E0' : '#1A202C', //#fff #000
});

export const getNavBarStyles = (isDark) => ({
  backgroundColor: isDark ? '#1a202c' : '#E2E8F0', //#e4eef5
  color: isDark ? '#CBD5E0' : '#1A202C',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});