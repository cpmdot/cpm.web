import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getProjects } from '../api/api';
import ProjectCard from './projects/ProjectCard';
import ProjectModal from './projects/ProjectModal';
import LoadingSpinner from './common/LoadingSpinner';
import '../styles/components/projects.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectThunks';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { t, currentLanguage } = useLanguage();

  // State for filters and display
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] =
    useState('residential');
  const [currentIndex, setCurrentIndex] = useState(0); // For carousel current slide index
  const [isFullView, setIsFullView] = useState(false); // Desktop full view mode
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for infinite scroll
  const [noResults, setNoResults] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProjectData, setModalProjectData] = useState(null);

  // Refs for DOM elements
  const projectsInnerRef = useRef(null); // For carousel transform
  const observerRef = useRef(null); // For Intersection Observer
  const resizeTimeoutRef = useRef(null); // Debounce for resize

  // Helper for determining cards per view in carousel mode
  const getCardsPerView = useCallback(() => {
    if (window.innerWidth <= 600) return 1; // Should always be 1 for mobile grid now
    if (window.innerWidth <= 900) return 2;
    return 3;
  }, []);

  // --- API Data Fetching ---
  const setupDisplayData = async () => {
    setIsLoading(true);
    try {
      const data = projects;
      setAllProjects(data);
      setFilteredProjects(data); // Initially all projects are filtered
      // Initial display for infinite scroll/carousel
      setDisplayedProjects(data.slice(0, Math.max(8, getCardsPerView()))); // Display initial batch or enough for one view
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setAllProjects([]);
      setFilteredProjects([]);
      setDisplayedProjects([]);
      setNoResults(true); // Show no results if API fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    setupDisplayData();
  }, [getCardsPerView]);

  // --- Filtering Logic ---
  const filterProjects = useCallback(() => {
    let currentFiltered = allProjects;
    const currentService = selectedServiceFilter;
    const currentType = selectedPropertyType;

    // Filter by service
    if (currentService !== 'all') {
      currentFiltered = currentFiltered.filter((project) =>
        project.services.includes(currentService)
      );
    }
    // Filter by property type
    currentFiltered = currentFiltered.filter(
      (project) => project.type === currentType
    );

    setFilteredProjects(currentFiltered);
    setNoResults(currentFiltered.length === 0);
    setCurrentIndex(0); // Reset carousel position on filter change
    setDisplayedProjects(
      currentFiltered.slice(0, Math.max(8, getCardsPerView()))
    ); // Reset displayed projects for infinite scroll
  }, [
    allProjects,
    selectedServiceFilter,
    selectedPropertyType,
    getCardsPerView,
  ]);

  // Re-filter projects whenever filters change
  useEffect(() => {
    filterProjects();
  }, [selectedServiceFilter, selectedPropertyType, filterProjects]);

  // --- Carousel Logic (for non-full view) ---
  const updateCarousel = useCallback(() => {
    if (!projectsInnerRef.current || !filteredProjects.length) return;

    if (isFullView || window.innerWidth <= 600) {
      // No carousel on mobile or desktop full view
      projectsInnerRef.current.style.transform = 'translateX(0)';
      return;
    }

    const cardsPerView = getCardsPerView();
    const firstCard =
      projectsInnerRef.current.querySelector('.proj-project-card');
    const cardWidth = (firstCard ? firstCard.offsetWidth : 0) + 20; // Card width + gap

    const maxIndex = Math.max(0, filteredProjects.length - cardsPerView);
    const clampedIndex = Math.min(currentIndex, maxIndex);
    setCurrentIndex(clampedIndex);

    const newTransform = `translateX(-${clampedIndex * cardWidth}px)`;
    projectsInnerRef.current.style.transform = newTransform;
  }, [currentIndex, filteredProjects, isFullView, getCardsPerView]);

  // Update carousel position when index or view mode changes
  useEffect(() => {
    updateCarousel();
  }, [currentIndex, isFullView, updateCarousel]);

  // --- Infinite Scroll Logic (for full view) ---
  const loadMoreCards = useCallback(() => {
    if (loadingMore || displayedProjects.length >= filteredProjects.length) {
      setLoadingMore(false); // Ensure loading is off if nothing more to load
      return;
    }

    setLoadingMore(true);
    setTimeout(() => {
      // Simulate API call for more projects
      const nextBatch = filteredProjects.slice(
        displayedProjects.length,
        displayedProjects.length + 4
      ); // Load 4 more
      setDisplayedProjects((prev) => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, displayedProjects, filteredProjects]);

  // Intersection Observer Setup for Infinite Scroll (active in desktop full view and all mobile views)
  useEffect(() => {
    // Observer is active if in desktop full view OR on mobile (any mobile view)
    const isObserverActive = isFullView || window.innerWidth <= 600;

    if (!isObserverActive) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    const targetCards =
      projectsInnerRef.current?.querySelectorAll('.proj-project-card');
    const lastDisplayedCard = targetCards
      ? targetCards[targetCards.length - 1]
      : null;

    if (observerRef.current) observerRef.current.disconnect(); // Disconnect previous observer

    if (
      lastDisplayedCard &&
      displayedProjects.length < filteredProjects.length
    ) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadingMore) {
            // Only load if visible and not already loading
            loadMoreCards();
          }
        },
        {
          root: null, // viewport
          threshold: 0.1,
          rootMargin: '100px', // Load when 100px from bottom of viewport
        }
      );
      observerRef.current.observe(lastDisplayedCard);
    } else {
      // If all cards are displayed or no cards, ensure loading indicator is off
      setLoadingMore(false);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect(); // Cleanup observer
    };
  }, [
    isFullView,
    displayedProjects,
    filteredProjects,
    loadMoreCards,
    loadingMore,
  ]);

  // --- Modal Logic ---
  const openProjectModal = useCallback((project) => {
    setModalProjectData(project);
    setIsModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false);
    setModalProjectData(null);
  }, []);

  // --- Event Handlers ---
  const handleServiceFilterChange = (e) => {
    setSelectedServiceFilter(e.target.value);
  };

  const handlePropertyTypeClick = (type) => {
    setSelectedPropertyType(type);
  };

  const handleExploreClick = () => {
    // On mobile, this button essentially just triggers the scrolling behavior
    // On desktop, it toggles full view
    if (window.innerWidth <= 600) {
      // For mobile, we just ensure infinite scroll is active and focus on projects
      // No explicit 'mobile full view' state toggle now, as the main content is always visible.
      // We might scroll to the projects wrapper here if needed, but for now, rely on its visibility.
    } else {
      setIsFullView((prev) => !prev);
      setCurrentIndex(0); // Reset carousel position
      if (projectsInnerRef.current)
        projectsInnerRef.current.style.transform = 'translateX(0)';
    }
  };

  // --- Resize Listener ---
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        // Handle desktop full view exit if window resized below threshold
        if (window.innerWidth <= 600 && isFullView) {
          setIsFullView(false); // Exit desktop full view
          setCurrentIndex(0);
          if (projectsInnerRef.current)
            projectsInnerRef.current.style.transform = 'translateX(0)';
        }
        // Update carousel for non-full view if cards per view changes (desktop/tablet only)
        if (!isFullView && window.innerWidth > 600) {
          updateCarousel();
        }
        // Re-evaluate observer based on new window width for infinite scroll
        // This is implicitly handled by useEffect dependencies on isFullView and window.innerWidth check.
      }, 300); // Debounce
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFullView, updateCarousel]);

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

  // --- Render ---
  if (isLoading) {
    return (
      <>
        <LoadingSpinner section="Projects" />
      </>
    );
  }

  // Determine current context (main carousel vs full view grid)
  const isCarouselMode = !isFullView && window.innerWidth > 600; // Carousel only on desktop/tablet, not mobile or desktop full view

  // Conditional classes for main container
  const containerClasses = `proj-container ${isFullView ? 'full-view' : ''}`;

  return (
    <section className="projects-section">
      <div className={containerClasses}>
        {/* Sidebar (Desktop Carousel Mode Only) */}
        {isCarouselMode && ( // Only render sidebar if in desktop carousel mode
          <div className="proj-sidebar">
            <select
              className="proj-service-filter"
              value={selectedServiceFilter}
              onChange={handleServiceFilterChange}
            >
              {serviceFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
            </select>

            <div className="proj-header-content">
              <h1>{t('explore-projects')}</h1>
              <p>{t('projects-description')}</p>
            </div>

            <div className="proj-sidebar-actions">
              <button className="proj-explore-btn" onClick={handleExploreClick}>
                {t('explore-all-projects')}{' '}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="proj-stats">
              <div className="proj-stat-item">
                <div className="proj-stat-number">100+</div>
                <div className="proj-stat-label">{t('projects-completed')}</div>
              </div>
              <div className="proj-stat-item">
                <div className="proj-stat-number">15</div>
                <div className="proj-stat-label">{t('years-experience')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Carousel or Full View Grid for Desktop, Main Content for Mobile) */}
        <div className="proj-main-content">
          {/* Header for mobile and desktop full-view - always displayed in main content */}
          <div className="proj-content-header">
            <div className="proj-header-content">
              <h1>{t('explore-projects')}</h1>
              <p className="proj-main-content-description">
                {t('projects-description-short')}
              </p>
            </div>
          </div>

          {/* Filters (Service Dropdown & Property Type Buttons) - Conditionally rendered based on design */}
          {/* This filter wrapper should now be hidden on desktop (when sidebar is present)
              and shown on mobile or when in desktop full-view. */}
          <div className="proj-filter-wrapper">
            <div className="proj-property-types">
              <div className="proj-property-buttons">
                {/* Service filter dropdown (visible in main content for desktop full view and mobile) */}
                <select
                  className="proj-service-filter-dropdown" // This is the dropdown to hide on desktop default view
                  value={selectedServiceFilter}
                  onChange={handleServiceFilterChange}
                >
                  {serviceFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.key)}
                    </option>
                  ))}
                </select>
                {/* Property Type Buttons */}
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

          {/* Stats & Explore Button for Mobile Only (will be hidden on desktop by CSS) */}
          <div className="proj-sidebar-actions mobile-only-proj-actions">
            {' '}
            {/* Added mobile-only class */}
            <button className="proj-explore-btn" onClick={handleExploreClick}>
              {t('explore-all-projects')} <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="proj-stats mobile-only-proj-stats">
            {' '}
            {/* Added mobile-only class */}
            <div className="proj-stat-item">
              <div className="proj-stat-number">100+</div>
              <div className="proj-stat-label">{t('projects-completed')}</div>
            </div>
            <div className="proj-stat-item">
              <div className="proj-stat-number">15</div>
              <div className="proj-stat-label">{t('years-experience')}</div>
            </div>
          </div>

          {/* Projects Display Area (Carousel for Desktop, Grid for Mobile/Full View) */}
          <div className="proj-projects-wrapper">
            {noResults && (
              <div className="proj-no-results" aria-live="polite">
                <p>
                  {t('no-results-part1')}"
                  <span className="proj-service-name">
                    {t(
                      serviceFilterOptions.find(
                        (opt) => opt.value === selectedServiceFilter
                      )?.key || 'all-services'
                    )}
                  </span>
                  " {t('no-results-part2')}"
                  <span className="proj-property-type">
                    {t(
                      propertyTypeOptions.find(
                        (opt) => opt.value === selectedPropertyType
                      )?.key || 'residential'
                    )}
                  </span>
                  " {t('no-results-part3')}
                </p>
              </div>
            )}
            <div className="proj-projects">
              <div className="proj-projects-inner" ref={projectsInnerRef}>
                {/* Render Project Cards based on displayedProjects state */}
                {displayedProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onQuickView={openProjectModal}
                  />
                ))}
              </div>
            </div>
            {/* Carousel Arrows (Desktop Carousel Mode Only) */}
            {isCarouselMode && filteredProjects.length > getCardsPerView() && (
              <>
                <div
                  className={`proj-arrow proj-left-arrow ${
                    currentIndex === 0 ? 'hidden' : ''
                  }`}
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                >
                  <i className="fas fa-chevron-left"></i>
                </div>
                <div
                  className={`proj-arrow proj-right-arrow ${
                    currentIndex >= filteredProjects.length - getCardsPerView()
                      ? 'hidden'
                      : ''
                  }`}
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(
                        filteredProjects.length - getCardsPerView(),
                        prev + 1
                      )
                    )
                  }
                >
                  <i className="fas fa-chevron-right"></i>
                </div>
              </>
            )}
            {/* Loading more projects indicator for desktop full view and mobile */}
            {loadingMore && (isFullView || window.innerWidth <= 600) && (
              <div className="proj-loading active">
                {t('loading-more-projects')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal (Portalled) */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeProjectModal}
        project={modalProjectData}
      />
    </section>
  );
};

export default Projects;
