import { useState, useEffect } from 'react';

export const useBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedBackground = localStorage.getItem('backgroundImage');
    return savedBackground === 'null' ? null : (savedBackground || "url('/bsas5.webp')");
  });

  useEffect(() => {
    localStorage.setItem('backgroundImage', backgroundImage);
  }, [backgroundImage]);

  return [backgroundImage, setBackgroundImage];
};