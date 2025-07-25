import React, { useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ProjectCard = ({ project, onQuickView }) => {
  const { t } = useLanguage();

  const handleQuickViewClick = useCallback(() => {
    onQuickView(project);
  }, [project, onQuickView]);

  // Determine header background style
  const headerStyle = project.headerBg
    ? { backgroundImage: `url(${project.headerBg})` }
    : project.gradient
    ? { background: project.gradient }
    : {};

  return (
    <>
      <div
        className="proj-project-card"
        data-type={project.type}
        data-services={project.services.join(',')}
      >
        <div
          className={`proj-project-header ${project.headerClass || ''}`}
          style={headerStyle}
        >
          <div className="proj-project-badge">
            {t(project.badge || 'completed-default')}
          </div>
          <div className="proj-project-overlay">
            <button
              className="proj-quick-view-btn"
              onClick={handleQuickViewClick}
            >
              {t('quick-view')} <i className="fas fa-expand"></i>
            </button>
          </div>
        </div>
        <div className="proj-project-content">
          <h2>{t(project.title)}</h2>
          <p className="proj-project-location">
            <i className="fas fa-map-marker-alt"></i>{' '}
            <span data-lang-key={project.location}>{t(project.location)}</span>
          </p>
          <p className="proj-project-type" data-lang-key={project.type}>
            {t(project.type)}
          </p>
          <div className="proj-project-services">
            {project.services.map((serviceCode) => (
              <span key={serviceCode} className="proj-service-tag">
                {t(`tag-${serviceCode}`)}
              </span>
            ))}
          </div>
          <div className="proj-project-footer">
            <button
              className="proj-project-details-btn"
              onClick={handleQuickViewClick}
            >
              {t('view-details')} <i className="fas fa-arrow-right"></i>
            </button>
            <div className="proj-project-size">{project.size}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
