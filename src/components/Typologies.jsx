import React from 'react';
import { useLanguage } from '../context/LanguageContext';
// ✅ Corrected the CSS import path
import '../styles/components/typologies.css';

const Typologies = () => {
  const { t } = useLanguage();

  const typologyItems = [
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/residential.svg', text: 'residential', number: '01' },
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/commercial.svg', text: 'commercial', number: '02' },
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/corp_office.svg', text: 'corporate-office', number: '03' },
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/gov_office.svg', text: 'government-office', number: '04' },
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/institutions.svg', text: 'institutions', number: '05' },
    { icon: 'https://cpmdot.b-cdn.net/icons/typologies_sector/industrial.svg', text: 'industrial', number: '06' },
  ];

  return (
    <section className="typologies">
      <div className="typologies-content">
        <div className="typologies-header">
          <div className="typology-blue-bar"></div>
          <h2 className="typologies-title">{t('typologies-title')}</h2>
        </div>
        <p>{t('typologies-heading')}</p>
        <div className="typologies-grid">
          {typologyItems.map((item) => (
            <div key={item.number} className="typology-item">
              <div className="icon-container">
                <span className="typology-number">{item.number}</span>
                <img src={item.icon} alt={t(`${item.text}-icon-alt`)} className="typology-icon" loading="lazy" />
              </div>
              <p>{t(item.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Typologies;