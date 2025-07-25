// client/src/context/UIContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UIContext = createContext();

// Create a custom hook to easily use the context
export const useUI = () => useContext(UIContext);

// Create the Provider component
export const UIProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Centralized function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  // --- REASON FOR CHANGE ---
  // This effect handles the 'body' overflow scroll-lock in one central place.
  // Previously, this logic was scattered and could cause bugs.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to ensure style is reset if the component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const value = {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};