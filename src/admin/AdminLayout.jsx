import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/hero', label: 'Hero', icon: 'home' },
  { to: '/admin/about', label: 'About', icon: 'person' },
  { to: '/admin/services', label: 'Services', icon: 'construction' },
  { to: '/admin/skills', label: 'Skills', icon: 'school' },
  { to: '/admin/technologies', label: 'Technologies', icon: 'memory' },
  { to: '/admin/projects', label: 'Projects', icon: 'folder_special' },
  { to: '/admin/messages', label: 'Messages', icon: 'mail' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar${mobileOpen ? ' admin-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar__brand">
          <div className="admin-login__logo" style={{ width: 40, height: 40 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--clr-primary)' }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="admin-sidebar__title gradient-text">Abdurex Port</h1>
            <p className="admin-sidebar__subtitle">Command Center</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' admin-nav-link--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__live-btn"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
            View Live Site
          </button>
          <div className="admin-sidebar__footer-links">
            <button 
              className="admin-nav-link admin-nav-link--danger" 
              style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminEmail');
                window.location.href = '/admin';
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="admin-main">
        {/* Top nav */}
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="admin-status-pill">
              <span className="admin-pulse-dot" />
              <span>Supabase Connected</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <button
              className="admin-btn admin-btn--outline"
              style={{ padding: '6px 14px', fontSize: 12 }}
              onClick={() => navigate('/')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
              Live Site
            </button>
            <div className="admin-topbar__avatar" style={{ background: 'linear-gradient(135deg, #0ea5e9, #7e22ce)', border: 'none' }} title="Admin: Abdurehman">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
