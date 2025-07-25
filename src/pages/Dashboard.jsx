import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectThunks';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/projects/ProjectCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { t, currentLanguage } = useLanguage();
  const { projects, loading, error } = useSelector((state) => state.projects);

  // Desktop full view mode
  const [isFullView, setIsFullView] = useState(false); 
  const [selectedPropertyType, setSelectedPropertyType] =
    useState('residential');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;

  const containerClasses = `proj-container ${isFullView ? 'full-view' : ''}`;

  // Helper arrays for translation lookup (moved outside component if not state-dependent)
  const serviceFilterOptions = [
    { value: 'all', key: 'all-services' },
    { value: 'cpm', key: 'cpm-service' },
    { value: 'hse', key: 'hse-service' },
    { value: 'doc', key: 'doc-service' },
    { value: 'design', key: 'design-service' },
    { value: 'contract', key: 'contract-service' },
    { value: 'risk', key: 'risk-service' },
    { value: 'infra', key: 'infra-service' },
  ];

  const propertyTypeOptions = [
    { value: 'residential', key: 'residential' },
    { value: 'commercial', key: 'commercial' },
    { value: 'corporate', key: 'corporate' },
    { value: 'government', key: 'government' },
    { value: 'institutions', key: 'institutions' },
    { value: 'industrial', key: 'industrial' },
  ];

  const handleExploreClick = () => {
    // // On mobile, this button essentially just triggers the scrolling behavior
    // // On desktop, it toggles full view
    // if (window.innerWidth <= 600) {
    //   // For mobile, we just ensure infinite scroll is active and focus on projects
    //   // No explicit 'mobile full view' state toggle now, as the main content is always visible.
    //   // We might scroll to the projects wrapper here if needed, but for now, rely on its visibility.
    // } else {
    //   setIsFullView((prev) => !prev);
    //   setCurrentIndex(0); // Reset carousel position
    //   if (projectsInnerRef.current)
    //     projectsInnerRef.current.style.transform = 'translateX(0)';
    // }
  };

  return (
    <>
      <section className="projects-section">
        <div className="proj-container full-view">
          {/* sidebar - not yet */}

          {/* Main content area */}
          <div className="proj-main-content">
            <div className="proj-content-header">
              <div className="proj-header-content">
                <h1>{t('explore-projects')}</h1>
                <p className="proj-main-content-description">
                  {t('projects-description-short')}
                </p>
              </div>
            </div>

            <div className="">
              <div className="">
                <div className="">
                  {propertyTypeOptions.map((type) => (
                    <button
                      key={type.value}
                      className={`proj-property-btn ${
                        selectedPropertyType === type.value ? 'active' : ''
                      }`}
                      onClick={() => handlePropertyTypeClick(type.value)}
                      data-type={type.value}
                    >
                      {t(type.key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="proj-sidebar-actions mobile-only-proj-actions">
              {' '}
              {/* Added mobile-only class */}
              <button className="proj-explore-btn" onClick={handleExploreClick}>
                {t('explore-all-projects')}{' '}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="proj-projects">
              <div className="proj-projects-inner">
                {/* Render Project Cards based on displayedProjects state */}
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    project={project}
                    onQuickView={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
