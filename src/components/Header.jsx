import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import '../styles/components/header.css';

const Header = ({ isScrolledDown, onMouseEnter, onMouseLeave, setIsContactOpen }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isMobileMenuOpen, toggleMobileMenu } = useUI();
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const languageToggleRef = useRef(null);
  const history = useHistory(); // Initialize useHistory hook

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageToggleRef.current && !languageToggleRef.current.contains(event.target)) {
        setIsLanguagePopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (lang) => {
    toggleLanguage(lang);
    setIsLanguagePopupOpen(false);
  };

  const handleLoginClick = () => {
    history.push('/login'); // Navigate to the /login route
  };

  return (
    <header 
      className={`top-header ${isScrolledDown ? 'hidden' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="header-content">
        <div className="logo-container">
          <a href="/" aria-label="Go to homepage">
            {/* Updated alt text from "CPM. Company Logo" to "cpmsite Company Logo" */}
            <img src="https://cpmdot.b-cdn.net/icons/cpm_logo.png" alt="cpmsite Company Logo" />
          </a>
        </div>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className="user-actions">
          <div className="language-toggle-wrapper desktop-only" ref={languageToggleRef}>
            <button
              className="action-btn plain-btn"
              onClick={() => setIsLanguagePopupOpen(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={isLanguagePopupOpen}
            >
              <img src="https://cpmdot.b-cdn.net/icons/top_header/lan.svg" alt="Language" className="language-icon" />
              {/* This span now has a class so we can hide it on desktop */}
              <span className="language-text">{language.toUpperCase()}</span>
            </button>
            {isLanguagePopupOpen && (
              <div className="language-popup">
                <button onClick={() => handleLanguageSelect('en')}>English</button>
                <button onClick={() => handleLanguageSelect('km')}>Khmer</button>
              </div>
            )}
          </div>
          
          {/* Login button - now linked to /login route */}
          <button className="action-btn plain-btn desktop-only" onClick={handleLoginClick}>{t('login')}</button>
          
          <button className="action-btn contact-btn" onClick={() => setIsContactOpen(true)}>
            {t('contact')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;