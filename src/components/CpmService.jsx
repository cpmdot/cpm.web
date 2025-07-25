import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/cpm-service.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../features/services/serviceThunks';
import LoadingSpinner from './common/LoadingSpinner';

const CpmService = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.services);

  const { t } = useLanguage();
  const initialItems = 8; // Show 2 rows of 4 items initially
  const [visibleItems, setVisibleItems] = useState(initialItems);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Handle case where services is not yet available
  if (!services || services.length === 0) {
    // return <div className="empty-state">No services available</div>;
    return (
      <>
        <LoadingSpinner section="Services" />
      </>
    );
  }

  const showMore = () => {
    setVisibleItems(services.length); // Show all items
  };

  const showLess = () => {
    setVisibleItems(initialItems); // Revert to initial count
  };

  const capitalizeTitle = (title) => {
    if (!title) return '';
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // This is more efficient because we only render the items that are visible.
  const visibleServices = services.slice(0, visibleItems);

  const showMoreButtonIsVisible = visibleItems < services.length;
  const showLessButtonIsVisible = visibleItems > initialItems;

  return (
    <section className="cpm-service" aria-label="CPM Services">
      <div className="cpm-service-content">
        <div className="text-container">
          <h3>{t('cpm-service-specializations')}</h3>
          <h2>{t('cpm-service-title')}</h2>
          <p>{t('cpm-service-description')}</p>
        </div>

        <div className="service-grid" id="service-grid">
          {/* We now map over the shorter, 'visibleServices' array */}
          {visibleServices.map((service, index) => (
            <div
              key={index}
              className="service-item"
              data-category={service.category}
            >
              <div
                className="service-image-placeholder"
                style={{ backgroundImage: `url(${service.imageUrl})` }}
              />
              <div className="service-details">
                <div className="service-provider">
                  <img
                    src={service.categoryIconUrl}
                    alt={`${service.category} Icon`}
                    className="provider-logo"
                  />
                  <span>{service.category}</span>
                </div>
                <h4>{capitalizeTitle(t(service.title))}</h4>
                <p>{t(`${service.title}-summary`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="service-actions">
          {showMoreButtonIsVisible && (
            <button
              className="show-more-btn"
              onClick={showMore}
              aria-controls="service-grid"
            >
              {t('show-more')}
            </button>
          )}
          {showLessButtonIsVisible && (
            <button
              className="show-less-btn"
              onClick={showLess}
              aria-controls="service-grid"
            >
              {t('show-less')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CpmService;
