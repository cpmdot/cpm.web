import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';

const ProjectModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();
  const modalRef = useRef(null);

  // Effect to manage modal visibility and accessibility attributes
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.classList.add('active');
        modalElement.setAttribute('aria-hidden', 'false');
        modalElement.removeAttribute('inert');
        // Focus the close button for accessibility
        const closeButton = modalElement.querySelector('.proj-close-modal');
        if (closeButton) {
          closeButton.focus();
        }
      } else {
        modalElement.classList.remove('active');
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.setAttribute('inert', '');
      }
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close modal on outside click
  const handleClickOutside = (event) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  if (!isOpen || !project) return null;

  const services = project.services || [];

  return createPortal(
    <div className="proj-project-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="proj-modal-title">
      <div className="proj-modal-content">
        <button className="proj-close-modal" onClick={onClose} aria-label={t('close-modal-label')}>
          <i className="fas fa-times"></i>
        </button>
        <div className="proj-modal-header">
          <h2 className="proj-modal-title" id="proj-modal-title">{t('project-details')}</h2>
        </div>
        <div className="proj-modal-body">
          <div className="modal-section">
            <h3>{t('project-overview')}</h3>
            <p><strong>{t('title')}:</strong> {t(project.titleKey)}</p>
            <p><strong>{t('location')}:</strong> {t(project.locationKey)}</p>
            <p><strong>{t('type')}:</strong> {t(project.projectTypeKey)}</p>
            <p><strong>{t('size')}:</strong> {project.size}</p>
            <p><strong>{t('status')}:</strong> {t(project.badgeKey)}</p>
          </div>
          <div className="modal-section">
            <h3>{t('services-provided')}</h3>
            <div className="proj-modal-services">
              {services.length ? (
                services.map(serviceCode => (
                  <span key={serviceCode} className="proj-service-tag">{t(`tag-${serviceCode}`)}</span>
                ))
              ) : (
                <p>{t('no-services')}</p>
              )}
            </div>
          </div>
          <div className="modal-section">
            <h3>{t('description')}</h3>
            <p>{t('project-full-description')}</p> {/* Use a dedicated key for full description */}
          </div>
        </div>
      </div>
    </div>,
    document.body // Render modal outside #root
  );
};

export default ProjectModal;