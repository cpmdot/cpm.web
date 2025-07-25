import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/footer.css'; // Corrected the CSS import path

// Import your local logo image
import cpmLogo from '../assets/images/cpm_logo.png'; 

const Footer = () => {
  const { t, toggleLanguage } = useLanguage();
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false); // Controls collapsible "About Us"
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false); // Controls collapsible "Quick Links"

  const languagePopupWrapperRef = useRef(null); // Ref for the language popup area

  // This effect handles closing the language popup when a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the language popup wrapper AND the language button itself
      if (
        languagePopupWrapperRef.current &&
        !languagePopupWrapperRef.current.contains(event.target) &&
        !event.target.closest('.footer-language-toggle') // Also check if the click target is the button itself
      ) {
        setIsLanguagePopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelection = (lang) => {
    toggleLanguage(lang);
    setIsLanguagePopupOpen(false);
  };

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-content">
          {/* Footer Logo (Desktop Only - now an image) */}
          <div className="footer-logo">
            {/* Desktop Logo Image - now uses your local cpm_logo.png */}
            <img
              src={cpmLogo} // Changed to use imported local image
              alt="CPMdot Logo"
              className="logo-desktop" // Class for desktop visibility
            />
            <div className="footer-logo-text">
              <span className="vertical-line" aria-hidden="true"></span>
              <p className="domain">{t('footer-domain')}</p>
            </div>
          </div>

          {/* About Us Links (Collapsible on mobile, regular links on desktop) */}
          <div className="footer-links">
            {/* Header for collapsible section on mobile, just a heading on desktop */}
            <div className={`header-wrapper ${isAboutUsOpen ? 'active' : ''}`} onClick={() => setIsAboutUsOpen(prev => !prev)}>
              <h4>{t('about-us-heading')}</h4>
            </div>
            {/* The header-divider is for desktop layout, hidden on mobile by CSS */}
            <div className="header-divider"></div>
            <ul className={isAboutUsOpen ? 'active' : ''}>
              <li><a href="/about">{t('who-is-cpm')}</a></li>
              <li><a href="/leadership">{t('leadership-and-bod')}</a></li>
              <li><a href="/impact">{t('our-impact')}</a></li>
            </ul>
          </div>

          {/* Quick Links (Collapsible on mobile, regular links on desktop) */}
          <div className="footer-links">
            <div className={`header-wrapper ${isQuickLinksOpen ? 'active' : ''}`} onClick={() => setIsQuickLinksOpen(prev => !prev)}>
              <h4>{t('quick-links-heading')}</h4>
            </div>
            <div className="header-divider"></div>
            <ul className={isQuickLinksOpen ? 'active' : ''}>
              <li><a href="/schedule">{t('schedule')}</a></li>
              <li><a href="/news">{t('news')}</a></li>
              <li><a href="/resources">{t('resources')}</a></li>
              <li><a href="/partners">{t('partners')}</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <div className="follow-us-container">
              <span className="follow-us">{t('follow-us')}</span>
              <span className="cpmdot-handle">@CPMdot</span>
            </div>
            <div className="social-icons">
              <a href="https://www.facebook.com/CPMdot" target="_blank" rel="noopener noreferrer" className="social-link"><img src="https://cpmdot.b-cdn.net/icons/social/fb.svg" alt={t('facebook-icon-alt')} className="social-icon" /></a>
              <a href="https://www.linkedin.com/company/cpmdot/" target="_blank" rel="noopener noreferrer" className="social-link"><img src="https://cpmdot.b-cdn.net/icons/social/in.svg" alt={t('linkedin-icon-alt')} className="social-icon" /></a>
              <a href="https://t.me/cpmdot" target="_blank" rel="noopener noreferrer" className="social-link"><img src="https://cpmdot.b-cdn.net/icons/social/tel.svg" alt={t('telegram-icon-alt')} className="social-icon" /></a>
              <a href="https://twitter.com/cpmdot" target="_blank" rel="noopener noreferrer" className="social-link"><img src="https://cpmdot.b-cdn.net/icons/social/x.svg" alt={t('x-icon-alt')} className="social-icon" /></a>
              <a href="https://www.youtube.com/@cpmdot" target="_blank" rel="noopener noreferrer" className="social-link"><img src="https://cpmdot.b-cdn.net/icons/social/yt.svg" alt={t('youtube-icon-alt')} className="social-icon" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          {/* Mobile Copyright: "CPM. © 2024" - now uses image */}
          <p className="copyright-mobile">
            <img src={cpmLogo} alt="CPMdot Logo" className="logo-mobile-bottom-copyright" /> {t('copyright-year')}
          </p>
          {/* Desktop Copyright: "Copyright © 2024" */}
          <p className="copyright-desktop">
            {t('copyright-full-word')} {t('copyright-year')}
          </p>

          {/* footer-bottom-links-container will hold the links and language toggle */}
          <div className="footer-bottom-links-container">
            <div className="footer-bottom-links">
              <a href="/terms">{t('terms-of-use')}</a>
              <a href="/privacy">{t('privacy')}</a>
              <a href="/about">{t('about-us-link')}</a>
            </div>
            {/* Language Toggle */}
            <div className="footer-language-toggle-wrapper" ref={languagePopupWrapperRef}>
              <button
                className="footer-language-toggle"
                onClick={() => setIsLanguagePopupOpen(prev => !prev)}
                aria-expanded={isLanguagePopupOpen}
              >
                <span>{t('language-label')}</span>
                <img src="https://cpmdot.b-cdn.net/icons/top_header/lan.svg" alt={t('language-toggle-alt')} />
              </button>
              {isLanguagePopupOpen && (
                <div className="footer-language-popup">
                  <button onClick={() => handleLanguageSelection('en')}>{t('lang-en')}</button>
                  <button onClick={() => handleLanguageSelection('km')}>{t('lang-kh')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;