import React, { useState } from 'react';

const Navigation = ({ isLightMode, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-darker/60 backdrop-blur-xl z-50 border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold gradient-text scale-in">Abdurex</a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            <a
              href="#home"
              onClick={handleNavClick}
              className="nav-link"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={handleNavClick}
              className="nav-link"
            >
              About
            </a>
            <a
              href="#services"
              onClick={handleNavClick}
              className="nav-link"
            >
              Services
            </a>
            <a
              href="#experience"
              onClick={handleNavClick}
              className="nav-link"
            >
              Experience
            </a>
            <a
              href="#technology"
              onClick={handleNavClick}
              className="nav-link"
            >
              Technology
            </a>
            <a
              href="#projects"
              onClick={handleNavClick}
              className="nav-link"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={handleNavClick}
              className="nav-link"
            >
              Contact
            </a>
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div
              className="theme-toggle"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              <div className="theme-toggle-slider">
                <i className={`fas ${isLightMode ? 'fa-sun' : 'fa-moon'} text-gray-700`}></i>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-200 hover:text-primary focus:outline-none transition"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden mt-4 pb-2 space-y-2`}>
          <a
            href="#home"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            About
          </a>
          <a
            href="#services"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Services
          </a>
          <a
            href="#experience"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Experience
          </a>
          <a
            href="#technology"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Technology
          </a>
          <a
            href="#projects"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={handleNavClick}
            className="block py-2 nav-link"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
