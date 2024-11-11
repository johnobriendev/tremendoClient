export const getThemeStyles = (isDark) => ({
  backgroundColor: isDark ? '#181d28' : '#dae8f1',
  color: isDark ? '#fff' : '#000',
});

export const getModalStyles = (isDark) => ({
  backgroundColor: isDark ? '#4a5568' : '#dadde2',
  color: isDark ? '#fff' : '#000',
});

export const getBoardStyles = (isDark) => ({
  backgroundColor: isDark ? '#2f374d' : '#bfd7e7',
  color: isDark ? '#e2e8f0' : '#2d3748',
});

export const getButtonStyles = (isDark, colorScheme) => {
  const baseStyles = "mt-2 px-3 py-1 rounded transition duration-200 ease-in-out";
  const colorStyles = {
    blue: isDark ? "text-blue-300 hover:bg-blue-800" : "text-blue-600 hover:bg-blue-100",
    green: isDark ? "text-green-300 hover:bg-green-800" : "text-green-600 hover:bg-green-100",
    red: isDark ? "text-red-300 hover:bg-red-800" : "text-red-600 hover:bg-red-100",
  };
  return `${baseStyles} ${colorStyles[colorScheme]}`;
};

export const getNavBarStyles = (isDark) => ({
  backgroundColor: isDark ? '#1a202c' : '#e4eef5',
  color: isDark ? '#fff' : '#000',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});