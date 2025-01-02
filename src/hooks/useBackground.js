// src/hooks/useBackground.js
import { useState, useEffect } from 'react';

export const useBackground = () => {
  const [backgroundColor, setBackgroundColor] = useState(() => 
    localStorage.getItem('backgroundColor') || null
  );

  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
  }, [backgroundColor]);

  return [backgroundColor, setBackgroundColor];
};

// import { useState, useEffect } from 'react';

// export const useBackground = () => {
//   const [backgroundImage, setBackgroundImage] = useState(() => {
//     const savedBackground = localStorage.getItem('backgroundImage');
//     return savedBackground === 'null' ? null : (savedBackground || "url('/bsas5.webp')");
//   });

//   useEffect(() => {
//     localStorage.setItem('backgroundImage', backgroundImage);
//   }, [backgroundImage]);

//   return [backgroundImage, setBackgroundImage];
// };