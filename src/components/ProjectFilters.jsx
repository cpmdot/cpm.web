// client/src/components/ProjectFilters.jsx
import React from 'react';

const ProjectFilters = ({ selectedType, selectedService, onTypeChange, onServiceChange, t }) => {
  const propertyTypes = ['residential', 'commercial', 'corporate', 'government', 'institutions', 'industrial'];
  const services = ['all', 'cpm', 'hse', 'doc', 'design', 'contract', 'risk', 'infra'];

  return (
    <div className="project-filters">
      <h1>{t('explore-projects')}</h1>
      <p>{t('projects-description')}</p>
      <div className="filter-controls">
        {propertyTypes.map(type => (
          <button
            key={type}
            className={selectedType === type ? 'active' : ''}
            onClick={() => onTypeChange(type)}
          >
            {t(type)}
          </button>
        ))}
        <select className="service-select" value={selectedService} onChange={e => onServiceChange(e.target.value)}>
          {services.map(service => (
            <option key={service} value={service}>{t(`${service}-service`)}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters;