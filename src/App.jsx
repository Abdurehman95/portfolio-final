import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Experience from './components/Experience';
import Technology from './components/Technology';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="App">
      <Navigation isLightMode={isLightMode} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Technology />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
