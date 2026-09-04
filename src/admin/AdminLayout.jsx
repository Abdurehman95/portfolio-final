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
          <div className="admin-sidebar__logo">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="admin-sidebar__title">Abdurex Port</h1>
            <p className="admin-sidebar__subtitle">Admin Dashboard</p>
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
            View Live Site
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          </button>
          <div className="admin-sidebar__footer-links">
            <NavLink to="/admin/settings" className="admin-nav-link">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </NavLink>
            <button 
              className="admin-nav-link admin-nav-link--danger" 
              style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => {
                localStorage.removeItem('adminAuth');
                window.location.href = '/admin';
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
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

          <div className="admin-topbar__search">
            <span className="material-symbols-outlined admin-topbar__search-icon">search</span>
            <input
              type="text"
              placeholder="Search..."
              className="admin-topbar__search-input"
            />
          </div>

          <div className="admin-topbar__actions">
            <button className="admin-icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
              <span className="admin-icon-btn__badge" />
            </button>
            <button className="admin-icon-btn" aria-label="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="admin-topbar__avatar">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#89ceff' }}>A</span>
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
