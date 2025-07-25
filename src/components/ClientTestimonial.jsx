import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VideoPlayer from './common/VideoPlayer'; // Import the new VideoPlayer component
import '../styles/components/client-testimonial.css'; // Corrected CSS path
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials } from '../features/testimonials/testimonialThunks';
import LoadingSpinner from './common/LoadingSpinner';

const ClientTestimonial = () => {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector(
    (state) => state.testimonials
  );

  const { t } = useLanguage();
  const [currentGroup, setCurrentGroup] = useState(0);

  const itemsPerView = useMemo(() => {
    // This logic can be simplified with useMemo
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 1;
    }
    return 2;
  }, []); // We can add a resize listener if dynamic changes are needed

  // Dispatch fetch data

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const totalGroups = Math.ceil((testimonials?.length || 0) / itemsPerView);

  // This style object will be updated by state, instead of manually changing the DOM
  const sliderStyle = {
    transform: `translateX(-${currentGroup * (100 / itemsPerView)}%)`,
    transition: 'transform 0.5s ease-in-out',
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <>
        <LoadingSpinner section="Testimonials" />;
      </>
    );
  }

  return (
    <section className="client-testimonial">
      <div className="testimonial-content">
        <div className="title-container">
          <h2>{t('testimonials-title')}</h2>
        </div>

        <div className="testimonial-video">
          <VideoPlayer
            src="https://cpmdot.b-cdn.net/cpm_marketing.mp4"
            poster="https://cpmdot.b-cdn.net/images/testimonial/videocover.svg"
          />
        </div>

        <div className="testimonial-slider">
          <div className="testimonial-slides" style={sliderStyle}>
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="testimonial-item"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <div className="testimonial-author">
                  <div className="testimonial-image">
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(item.clientName)}
                    >
                      <img src={item.imageUrl} alt={t(item.clienName)} />
                      <div className="linkedin-icon">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                          alt="LinkedIn Icon"
                        />
                      </div>
                    </a>
                  </div>
                  <div className="author-info">
                    <div className="author-name">{t(item.clientName)}</div>
                    <div className="author-title">{t(item.title)}</div>
                    <div className="author-company-row">
                      <div className="author-logo">
                        <img src={item.companyLogoUrl} alt={`${t(item.clientCompany)} Logo`} />
                      </div>
                      <div className="author-company">{t(item.clientCompany)}</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-quote">
                  <p className="quote-title">{t(item.quote.title)}</p>
                  <p className="quote-description">
                    {t(item.quote.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="dot-navigation">
            {Array.from({ length: totalGroups }).map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentGroup ? 'active' : ''}`}
                onClick={() => setCurrentGroup(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonial;
