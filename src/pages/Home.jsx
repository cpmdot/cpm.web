// client/src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context and Components
import Header from '../components/Header';
import Nav from '../components/Nav';
import Slideshow from '../components/Slideshow';
import Partners from '../components/Partners';
import VisionMission from '../components/VisionMission';
import Typologies from '../components/Typologies';
import CpmService from '../components/CpmService';
import Projects from '../components/Projects';
import ClientTestimonial from '../components/ClientTestimonial';
import JoinCommunity from '../components/JoinCommunity';
import Footer from '../components/Footer';
import Contact from '../components/Contact';

const Home = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />

      <Header
        isScrolledDown={isScrolledDown}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        setIsContactOpen={setIsContactOpen}
      />
      <Nav
        isScrolledDown={isScrolledDown}
        isHeaderHovered={isHeaderHovered}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      />

      <main>
        <Slideshow />
        <Partners />
        <VisionMission />
        <Typologies />
        <CpmService />
        <Projects />
        <ClientTestimonial />
        <JoinCommunity />
      </main>

      <Footer />

      {isContactOpen && (
        <Contact
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          onSuccess={(message) => toast.success(message)}
          onError={(message) => toast.error(message)}
        />
      )}
    </>
  );
};

export default Home;
