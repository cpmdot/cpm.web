import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './common/ImageWithFallback';
import '../styles/components/vision-mission.css';

const VisionMission = () => { // Removed setIsContactOpen prop as "Read More" doesn't open contact modal
  const { t } = useLanguage();

  const missionItems = [
    { titleKey: 'deliver-comprehensive-services', textKey: 'deliver-comprehensive-services-text' },
    { titleKey: 'ensure-exceptional-quality', textKey: 'ensure-exceptional-quality-text' },
    { titleKey: 'foster-strong-partnerships', textKey: 'foster-strong-partnerships-text' },
    { titleKey: 'leverage-expertise', textKey: 'leverage-expertise-text' },
    { titleKey: 'drive-value-and-success', textKey: 'drive-value-and-success-text' },
    { titleKey: 'promote-sustainability-and-cost-savings', textKey: 'promote-sustainability-and-cost-savings-text' },
  ];

  // Placeholder for "Read More" action (e.g., navigate to /about, open a new modal, etc.)
  const handleReadMoreClick = () => {
    alert("Read More clicked! (Implement navigation or a dedicated modal here)");
    // Example: If you use React Router:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/about'); // Or whatever page you want to go to
  };

  return (
    <div className="vision-mission-container">
      <main>
        <div className="main-content">
          <div className="vision-container">
            <h2>{t('vision')}</h2>
            <div className="underline vision-underline" aria-hidden="true"></div>
          </div>
          <p className="vision-text">{t('vision-text')}</p>
          <button
            className="action-btn"
            onClick={handleReadMoreClick} // Changed back to handleReadMoreClick
            aria-label={t('read-more')} // Changed aria-label back
          >
            {t('read-more')} {/* Changed button text back */}
          </button>
        </div>
        <div className="mission-icon-container">
          <ImageWithFallback
            src="https://cpmdot.b-cdn.net/icons/Mission.svg"
            fallbackSrc="https://via.placeholder.com/400x400?text=Image+Not+Found"
            alt={t('mission-icon-alt')}
            className="mission-icon"
            loading="lazy"
          />
        </div>
      </main>

      <section className="mission">
        <div className="mission-content">
          <div className="mission-title-container">
            <h2>{t('mission')}</h2>
            <div className="underline mission-underline" aria-hidden="true"></div>
          </div>
          <div className="mission-grid">
            {missionItems.map((item, index) => (
              <div className="mission-card" key={index}>
                <h3>
                  <span className="mission-number">{index + 1}.</span>
                  <span>{t(item.titleKey)}</span>
                </h3>
                <p>{t(item.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;