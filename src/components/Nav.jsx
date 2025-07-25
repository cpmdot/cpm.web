import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import '../styles/components/nav.css';

const Nav = ({ isScrolledDown, isHeaderHovered, onMouseEnter, onMouseLeave }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isMobileMenuOpen, closeMobileMenu } = useUI();
  
  // NEW: State to control the language sub-menu inside the mobile nav
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] = useState(false);

  const baseNavItems = [
    { labelKey: 'about-us', href: '#about-us' },
    { labelKey: 'expertise', href: '#expertise' },
    { labelKey: 'projects', href: '#projects' },
    { labelKey: 'resources', href: '#resources' },
    { labelKey: 'investors', href: '#investors' },
    { labelKey: 'news', href: '#news' },
  ];

  const desktopNavItems = [{ labelKey: 'home', href: '/' }, ...baseNavItems];
  const mobileNavItems = [
    { labelKey: 'login', href: '/login' }, 
    ...baseNavItems, 
    { labelKey: 'contact', href: '#contact' }
  ];

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  const handleLanguageSelect = (lang) => {
    toggleLanguage(lang);
    setIsMobileLangMenuOpen(false); // Close the sub-menu
    closeMobileMenu(); // Close the main menu
  };

  const isNavVisible = !isScrolledDown || isHeaderHovered;
  
  return (
    <>
      <nav 
        className={`nav-bar ${isNavVisible ? 'visible' : ''} ${isScrolledDown ? 'sticky' : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="nav-content">
          <ul className="nav-menu">
            {desktopNavItems.map((item) => (
              <li key={item.labelKey}>
                <a href={item.href} className="nav-item">
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={`mobile-menu-container ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={closeMobileMenu}></div>
        <div className="mobile-menu">
          <nav className="mobile-nav-menu">
           <ul>
            {mobileNavItems.map((item) => (
              <li key={item.labelKey}>
                <a href={item.href} onClick={handleLinkClick}>{t(item.labelKey)}</a>
              </li>
            ))}
          </ul>
          
          {/* UPDATED: Language section with popup behavior */}
          <div className="mobile-menu-language-section">
            {isMobileLangMenuOpen && (
              <div className="language-sub-menu">
                <button
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => handleLanguageSelect('en')}
                >
                  English
                </button>
                <button
                  className={language === 'km' ? 'active' : ''}
                  onClick={() => handleLanguageSelect('km')}
                >
                  ភាសាខ្មែរ
                </button>
              </div>
            )}
            <button
              className="language-main-toggle"
              onClick={() => setIsMobileLangMenuOpen(prev => !prev)}
            >
              <i className="fas fa-globe"></i>
              <span>{t('language')}</span>
            </button>
          </div>
        </nav>
        </div>
      </div>
    </>
  );
};

export default Nav;