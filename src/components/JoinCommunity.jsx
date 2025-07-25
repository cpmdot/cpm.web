import React from 'react';
import { useLanguage } from '../context/LanguageContext';
// ✅ Corrected the CSS import path
import '../styles/components/join-community.css';

const JoinCommunity = () => {
  const { t } = useLanguage();

  // This handler can be expanded later to open a registration modal or navigate to a new page.
  const handleJoinClick = () => {
    console.log('"Become a Member" button was clicked.');
  };

  return (
    <section className="join-community">
      <div className="join-community-content">
        <h2>{t('join-our-community')}</h2>
        <button
          className="action-btn join-btn"
          onClick={handleJoinClick}
          aria-label={t('become-a-member')}
        >
          {t('become-a-member')}
        </button>
      </div>
    </section>
  );
};

export default JoinCommunity;