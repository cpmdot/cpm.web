import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/slideshow.css';
import { fetchSlideshow } from '../features/slides/slideThunks';
import LoadingSpinner from './common/LoadingSpinner';

const Slideshow = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  const showSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    dispatch(fetchSlideshow());
  }, [dispatch]);

  useEffect(() => {
    if (slides && slides.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [slides]);

  const handleDotClick = (index) => {
    clearInterval(slideIntervalRef.current);
    showSlide(index);
  };

  if (!slides || slides.length === 0) {
    return (
      <>
        <LoadingSpinner section="Slideshow" />
      </>
    );
  }

  return (
    <section className="slideshow">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="image-container">
              <img src={slide.imageUrl} alt="" />
            </div>

            <div className="container">
              <div className="content">
                <h1>{t(`slideshow-heading-${index + 1}`)}</h1>
                <div className="content-body">
                  <ul>
                    <li>{t(`slideshow-content-${index + 1}`)}</li>
                  </ul>
                  <div className="buttons">
                    {slide.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        // UPDATED: Simpler class names for better styling control
                        className={`slide-button ${
                          btnIndex === 0 ? 'primary' : 'secondary'
                        }`}
                      >
                        {t(
                          `slideshow-button-${button.text
                            .toLowerCase()
                            .replace(/\s+/g, '-')}-${index + 1}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Slideshow;
