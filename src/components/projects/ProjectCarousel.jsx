// client/src/components/ProjectCarousel.jsx
import React, { useState, useRef } from 'react';
import ProjectCard from './ProjectCard';

const ProjectCarousel = ({ projects, onOpenModal, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef(0);

  const getCardsPerView = () => window.innerWidth <= 900 ? 2 : 3;
  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, projects.length - cardsPerView);

  const cardWidth = 100 / projects.length;
  const containerWidth = 100 / cardsPerView;
  const gap = 20;

  const getTransform = () => {
    const baseTranslate = -currentIndex * (containerWidth / cardsPerView * projects.length);
    return `translateX(calc(${baseTranslate}% + ${swipeOffset}px - ${currentIndex * gap}px))`;
  };

  const goNext = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const goPrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    setSwipeOffset(currentX - touchStartX.current);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    if (swipeOffset < -50 && currentIndex < maxIndex) {
      goNext();
    } else if (swipeOffset > 50 && currentIndex > 0) {
      goPrev();
    }
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  return (
    <div className="proj-projects-wrapper">
      <div className="proj-projects">
        <div
          className="proj-projects-inner"
          style={{ transform: getTransform(), transition: isSwiping ? 'none' : 'transform 0.5s ease-out' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {projects.map((project) => (
            <div key={project.title} style={{ width: `calc(${containerWidth}% - ${gap}px)`, flex: `0 0 calc(${containerWidth}% - ${gap}px)`}}>
              <ProjectCard project={project} onOpenModal={onOpenModal} t={t} />
            </div>
          ))}
        </div>
      </div>
      <button className={`proj-arrow proj-left-arrow ${currentIndex === 0 ? 'hidden' : ''}`} onClick={goPrev}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className={`proj-arrow proj-right-arrow ${currentIndex >= maxIndex ? 'hidden' : ''}`} onClick={goNext}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default ProjectCarousel;