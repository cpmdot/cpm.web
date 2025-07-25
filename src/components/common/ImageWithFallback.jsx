import React, { useState } from 'react';

const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    // If an error occurs loading the primary image, switch to the fallback.
    setCurrentSrc(fallbackSrc);
  };

  return (
    <img 
      src={currentSrc} 
      onError={handleError} 
      alt={alt} 
      {...props} 
    />
  );
};

export default ImageWithFallback;