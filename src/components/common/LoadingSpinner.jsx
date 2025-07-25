import React from 'react';

// Basic inline styles for the spinner animation
const spinnerStyle = {
  border: '4px solid rgba(0, 0, 0, 0.1)',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  borderLeftColor: '#09f',
  animation: 'spin 1s ease infinite',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
  gap: '16px',
  minHeight: '200px',
};

const LoadingSpinner = ({ section }) => {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {section && <p>Loading {section}...</p>}
    </div>
  );
};

export default LoadingSpinner;