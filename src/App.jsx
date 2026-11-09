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
import AdminSocialLinks from './admin/pages/AdminSocialLinks';
import { supabase } from './supabaseClient';

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
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        const localAuth = localStorage.getItem('adminAuth') === 'true';
        if (session || localAuth) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setIsAuthenticated(localStorage.getItem('adminAuth') === 'true');
      } finally {
        if (isMounted) setSessionChecked(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session) {
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
      } else {
        const localAuth = localStorage.getItem('adminAuth') === 'true';
        setIsAuthenticated(localAuth);
      }
      setSessionChecked(true);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  if (!sessionChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1326', color: '#89ceff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner" style={{ width: 36, height: 36, margin: '0 auto 16px', border: '3px solid rgba(14,165,233,0.2)', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Verifying session...</p>
        </div>
      </div>
    );
  }

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
          <Route path="social" element={<AdminSocialLinks />} />
          <Route path="settings" element={<AdminSocialLinks />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
