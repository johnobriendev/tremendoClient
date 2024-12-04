import React from 'react';

const BackgroundWrapper = ({ children, backgroundImage, theme, getThemeStyles }) => {
  return (
    <div className="relative flex-grow">
      {/* Background layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          ...(backgroundImage ? {
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
          } : getThemeStyles(theme === 'dark')),
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-10 min-h-full">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;