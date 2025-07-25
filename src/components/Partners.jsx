import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/partners.css'; // ✅ Corrected the CSS import path

const Partners = () => {
  const { t } = useLanguage(); // Use t from LanguageContext

  const partnerLogos = [
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P1.svg', alt: 'Partner 1' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P20.svg', alt: 'Partner 2' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P3.svg', alt: 'Partner 3' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P4.svg', alt: 'Partner 4' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P5.svg', alt: 'Partner 5' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P6.svg', alt: 'Partner 6' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P7.svg', alt: 'Partner 7' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P8.svg', alt: 'Partner 8' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P9.svg', alt: 'Partner 9' },
    { src: 'https://cpmdot.b-cdn.net/icons/partner_icons/P10.svg', alt: 'Partner 10' },
  ];

  // For a seamless animation, we duplicate the logos in the array.
  // This is cleaner than having two separate divs in the HTML.
  const duplicatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="partners">
      <div className="container">
        <h2>{t('partners-heading')}</h2>
        <div className="partner-logos">
          <div className="logo-wrapper">
            {duplicatedLogos.map((logo, index) => (
              <img key={index} src={logo.src} alt={logo.alt} loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;