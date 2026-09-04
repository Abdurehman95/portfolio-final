import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Projects', value: '12', icon: 'folder_special', color: 'primary' },
  { label: 'Services', value: '6', icon: 'construction', color: 'secondary' },
  { label: 'Technologies', value: '24', icon: 'memory', color: 'tertiary' },
  { label: 'Messages', value: '3', icon: 'mail', color: 'primary', badge: true },
];

const quickLinks = [
  { to: '/admin/hero', label: 'Manage Hero', icon: 'home', desc: 'Edit hero title, subtitle & CTA' },
  { to: '/admin/about', label: 'Edit About', icon: 'person', desc: 'Update bio, metrics & image' },
  { to: '/admin/projects', label: 'Manage Projects', icon: 'folder_special', desc: 'Add, edit, or remove projects' },
  { to: '/admin/messages', label: 'View Messages', icon: 'mail', desc: 'Read & reply to contact messages' },
  { to: '/admin/services', label: 'Manage Services', icon: 'construction', desc: 'Update offered services' },
  { to: '/admin/technologies', label: 'Technologies', icon: 'memory', desc: 'Organise tech stack categories' },
  { to: '/admin/skills', label: 'Skill Repository', icon: 'school', desc: 'Track proficiency levels' },
];

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      {/* Page header */}
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Dashboard</h2>
          <p className="admin-page__subtitle">Welcome back, Abdurehman! Here's an overview of your portfolio.</p>
        </div>
        <div className="admin-page__actions">
          <Link to="/" className="admin-btn admin-btn--outline">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
            View Live Site
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`admin-stat-card admin-stat-card--${stat.color}`}>
            <div className="admin-stat-card__icon-wrap">
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div className="admin-stat-card__body">
              <div className="admin-stat-card__value">{stat.value}</div>
              <div className="admin-stat-card__label">{stat.label}</div>
            </div>
            {stat.badge && <span className="admin-stat-card__badge">New</span>}
            <div className="admin-stat-card__glow" />
          </div>
        ))}
      </div>

      {/* Section heading */}
      <div className="admin-section-heading">
        <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>grid_view</span>
        <h3>Quick Actions</h3>
      </div>

      {/* Quick links bento grid */}
      <div className="admin-quick-grid">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className="admin-quick-card">
            <div className="admin-quick-card__icon">
              <span className="material-symbols-outlined">{link.icon}</span>
            </div>
            <div className="admin-quick-card__body">
              <h4 className="admin-quick-card__title">{link.label}</h4>
              <p className="admin-quick-card__desc">{link.desc}</p>
            </div>
            <span className="material-symbols-outlined admin-quick-card__arrow">arrow_forward</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
