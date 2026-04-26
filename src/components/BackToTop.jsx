import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      id="back-to-top"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-2xl z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <i className="fas fa-arrow-up text-xl"></i>
    </button>
  );
};

export default BackToTop;
