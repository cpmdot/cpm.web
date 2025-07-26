import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import ContactForm from './forms/ContactForm'; // Import the ContactForm component
import AppointmentForm from './forms/AppointmentForm'; // Import the AppointmentForm component
import '../styles/components/contact.css'; // Import the CSS for the contact popup
import CreateAppointmentForm from './forms/CreateAppointmentForm'; 

const Contact = ({ isOpen, onClose, onSuccess, onError }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'appointment'
  const popupRef = useRef(null);
  const openerButtonRef = useRef(null); // To store which button opened the popup for focus management

  // Effect to manage modal visibility and accessibility attributes
  useEffect(() => {
    const popupElement = popupRef.current;
    if (popupElement) {
      if (isOpen) {
        popupElement.classList.add('active');
        popupElement.setAttribute('aria-hidden', 'false');
        popupElement.removeAttribute('inert'); // Re-enable interaction
        // Store the currently focused element before opening for later focus restoration
        openerButtonRef.current = document.activeElement;
        // Focus the first tabbable element inside the modal
        const firstTabbableElement = popupElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstTabbableElement) {
          firstTabbableElement.focus();
        }
      } else {
        popupElement.classList.remove('active');
        popupElement.setAttribute('aria-hidden', 'true');
        popupElement.setAttribute('inert', ''); // Make content inert when hidden
        // Restore focus to the element that opened the modal
        if (openerButtonRef.current) {
          openerButtonRef.current.focus();
        }
      }
    }
  }, [isOpen]);

  // Handle clicks outside the modal content to close it
  const handleClickOutside = useCallback((event) => {
    if (popupRef.current && event.target === popupRef.current) {
      onClose(); // Close the modal
    }
  }, [onClose]);

  // Effect to add/remove outside click listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle keyboard events (e.g., Escape key to close)
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null; // Don't render anything if not open

  // Use React Portal to render the modal outside the component's DOM hierarchy
  return createPortal(
    <div className="cform-contact-popup" ref={popupRef} role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
      <div className="cform-contact-popup-content">
        <button
          className="cform-close-popup"
          aria-label={t('close-popup')}
          onClick={onClose}
        >
          ×
        </button>
        <div className="cform-contact-container">
          {/* Sidebar with contact details and branding */}
          <div className="cform-contact-info-sidebar">
            <div className="cform-sidebar-content">
              {/* Contact details section */}
              <div className="cform-contact-details">
                <h2 id="contact-form-title">{t('get-in-touch')}</h2>
                {/* Phone contact method */}
                <div className="cform-contact-method">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h3>{t('phone-label')}</h3>
                    <p>+855 (89) 775-277</p>
                  </div>
                </div>
                {/* Email contact method */}
                <div className="cform-contact-method">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h3>{t('email-label')}</h3>
                    <p>info@cpmdot.com</p>
                  </div>
                </div>
                {/* Address contact method */}
                <div className="cform-contact-method">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h3>{t('address-label')}</h3>
                    <p>{t('address-content-line1')}<br/>{t('address-content-line2')}<br/>{t('address-content-line3')}</p>
                  </div>
                </div>
                {/* Business hours section */}
                <div className="cform-business-hours">
                  <h3>{t('business-hours-label')}</h3>
                  <p>{t('business-hours-content-line1')}<br/>{t('business-hours-content-line2')}</p>
                </div>
              </div>
              {/* Company logo display */}
              <div className="cform-logo-container">
                <img src="https://cpmdot.b-cdn.net/icons/cpm_logo.png" alt="CPMDOT Logo" className="cform-logo" />
              </div>
              {/* Social media links */}
              <div className="cform-social-links">
                <a href="https://www.facebook.com/CPMdot" className="cform-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <img src="https://cpmdot.b-cdn.net/icons/social/fb.svg" alt="Facebook" className="cform-social-icon" />
                </a>
                <a href="https://www.linkedin.com/company/cpmdot/?viewAsMember=true" className="cform-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <img src="https://cpmdot.b-cdn.net/icons/social/in.svg" alt="LinkedIn" className="cform-social-icon" />
                </a>
                <a href="https://t.me/cpmdot" className="cform-social-link" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <img src="https://cpmdot.b-cdn.net/icons/social/tel.svg" alt="Telegram" className="cform-social-icon" />
                </a>
                <a href="https://x.com/CPMdot" className="cform-social-link" target="_blank" rel="noopener noreferrer" aria-label="X">
                  <img src="https://cpmdot.b-cdn.net/icons/social/x.svg" alt="X" className="cform-social-icon" />
                </a>
                <a href="https://www.youtube.com/@cpmdot" className="cform-social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <img src="https://cpmdot.b-cdn.net/icons/social/yt.svg" alt="YouTube" className="cform-social-icon" />
                </a>
              </div>
            </div>
          </div>
          {/* Form section with tabs for contact and appointment */}
          <div className="cform-contact-form">
            {/* Tab navigation */}
            <div className="cform-form-tabs" role="tablist">
              <button
                className={`cform-tab-button ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
                aria-selected={activeTab === 'contact'}
                role="tab"
                id="contact-tab"
              >
                <i className="fas fa-envelope"></i> {t('contact-tab')}
              </button>
              <button
                className={`cform-tab-button ${activeTab === 'appointment' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointment')}
                aria-selected={activeTab === 'appointment'}
                role="tab"
                id="appointment-tab"
              >
                <i className="fas fa-calendar-alt"></i> {t('appointment-tab')}
              </button>
            </div>
            {/* Tab contents - Now passing isActive prop */}
            <ContactForm onSuccess={onSuccess} onError={onError} isActive={activeTab === 'contact'} />
            <CreateAppointmentForm onSuccess={onSuccess} onError={onError} isActive={activeTab === 'appointment'} />
          </div>
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
};

export default Contact;