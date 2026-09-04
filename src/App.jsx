import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminHero from './admin/pages/AdminHero';
import AdminAbout from './admin/pages/AdminAbout';
import AdminServices from './admin/pages/AdminServices';
import AdminSkills from './admin/pages/AdminSkills';
import AdminTechnologies from './admin/pages/AdminTechnologies';
import AdminProjects from './admin/pages/AdminProjects';
import AdminMessages from './admin/pages/AdminMessages';

// Public portfolio layout wrapper
function PublicLayout({ isLightMode, toggleTheme }) {
  return (
    <>
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
    </>
  );
}

// Protected Route wrapper for Admin Dashboard
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  return children;
}

function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
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
    <Router>
      <Routes>
        {/* Public portfolio */}
        <Route
          path="/"
          element={<PublicLayout isLightMode={isLightMode} toggleTheme={toggleTheme} />}
        />

        {/* Admin dashboard (with sidebar layout) */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="technologies" element={<AdminTechnologies />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
