// client/src/components/ProjectGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ projects, onOpenModal, isMobileView, onBack, t }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const observerRef = useRef();
  const loadingRef = useRef();

  useEffect(() => {
    // Reset visible count when projects change
    setVisibleCount(8);
  }, [projects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < projects.length) {
          if (loadingRef.current) loadingRef.current.classList.add('active');
          setTimeout(() => {
            setVisibleCount(prev => prev + 4);
            if (loadingRef.current) loadingRef.current.classList.remove('active');
          }, 500);
        }
      }, { rootMargin: "200px" }
    );

    const currentLoader = loadingRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [visibleCount, projects.length]);

  const visibleProjects = projects.slice(0, visibleCount);

  if (isMobileView) {
    return (
        <div className="proj-mobile-content">
          <div className="proj-mobile-projects">
              {visibleProjects.map((project) => (
                  <ProjectCard key={project.title} project={project} onOpenModal={onOpenModal} t={t} />
              ))}
          </div>
          <div className="proj-loading" ref={loadingRef}>{t('loading-more-projects')}</div>
        </div>
    );
  }

  return (
    <div className="proj-projects-wrapper">
        <div className="proj-projects-inner">
            {visibleProjects.map((project) => (
                <div key={project.title} className="proj-project-card">
                  <ProjectCard project={project} onOpenModal={onOpenModal} t={t} />
                </div>
            ))}
        </div>
        <div className="proj-loading" ref={loadingRef}>{t('loading-more-projects')}</div>
    </div>
  );
};

export default ProjectGrid;