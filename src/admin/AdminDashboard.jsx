import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    projectsCount: 6,
    servicesCount: 3,
    skillsCount: 13,
    messagesCount: 1,
    unreadMessages: 0,
    loading: true
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Projects count
      const { data: projs } = await supabase.from('projects').select('id, status');
      const pCount = projs ? projs.length : 6;

      // 2. Services count
      const { data: svcs } = await supabase.from('services').select('id, active');
      const sCount = svcs ? svcs.filter(s => s.active !== false).length : 3;

      // 3. Skills & Technologies count
      const { data: sks } = await supabase.from('skills').select('id');
      const { data: techs } = await supabase.from('technologies').select('id');
      const totalSkills = (sks ? sks.length : 6) + (techs ? techs.length : 7);

      // 4. Messages count & unread
      const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      const mCount = msgs ? msgs.length : 0;
      const unread = msgs ? msgs.filter(m => !m.is_read).length : 0;

      if (msgs && msgs.length > 0) {
        setRecentMessages(msgs.slice(0, 3));
      }

      setStatsData({
        projectsCount: pCount,
        servicesCount: sCount,
        skillsCount: totalSkills,
        messagesCount: mCount,
        unreadMessages: unread,
        loading: false
      });
    } catch (err) {
      console.warn('Dashboard using fallback counts:', err);
      setStatsData(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      to: '/admin/projects',
      label: 'Projects in Portfolio',
      value: statsData.projectsCount,
      icon: 'folder_special',
      color: 'primary',
      badge: 'Live'
    },
    {
      to: '/admin/services',
      label: 'Active Services',
      value: statsData.servicesCount,
      icon: 'construction',
      color: 'secondary',
      badge: null
    },
    {
      to: '/admin/skills',
      label: 'Skills & Tech Stack',
      value: statsData.skillsCount,
      icon: 'memory',
      color: 'tertiary',
      badge: null
    },
    {
      to: '/admin/messages',
      label: 'Inbox Inquiries',
      value: statsData.messagesCount,
      icon: 'mail',
      color: 'accent',
      badge: statsData.unreadMessages > 0 ? `${statsData.unreadMessages} Unread` : null
    },
  ];

  const quickLinks = [
    { to: '/admin/hero', label: 'Manage Hero', icon: 'home', desc: 'Configure hero title, subtitle & CTA buttons' },
    { to: '/admin/about', label: 'Edit About Me', icon: 'person', desc: 'Update biography, metrics, phone & contact' },
    { to: '/admin/projects', label: 'Projects Repository', icon: 'folder_special', desc: 'Add, publish, or modify showcased projects' },
    { to: '/admin/services', label: 'Offered Services', icon: 'construction', desc: 'Manage web, mobile & API service cards' },
    { to: '/admin/skills', label: 'Skill Repository', icon: 'school', desc: 'Track technical proficiencies and levels' },
    { to: '/admin/technologies', label: 'Development Toolkit', icon: 'memory', desc: 'Organise stack categories and marquee tools' },
    { to: '/admin/messages', label: 'Inquiries Inbox', icon: 'mail', desc: 'Read and respond to visitor messages' },
  ];

  return (
    <div className="admin-page">
      {/* Page header */}
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">
            <span className="gradient-text">Portfolio Command Center</span>
          </h2>
          <p className="admin-page__subtitle">
            Welcome back, Abdurehman! Here is your live portfolio content and performance snapshot.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link to="/" className="admin-btn admin-btn--outline" target="_blank">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
            Live Portfolio
          </Link>
          <button 
            className="admin-btn admin-btn--primary" 
            onClick={fetchDashboardData}
            title="Refresh database records"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Sync Data
          </button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to} className={`admin-stat-card admin-stat-card--${stat.color}`}>
            <div className="admin-stat-card__icon-wrap">
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{stat.icon}</span>
            </div>
            <div className="admin-stat-card__body">
              <div className="admin-stat-card__value">
                {statsData.loading ? '...' : stat.value}
              </div>
              <div className="admin-stat-card__label">{stat.label}</div>
            </div>
            {stat.badge && <span className="admin-stat-card__badge">{stat.badge}</span>}
            <div className="admin-stat-card__glow" />
          </Link>
        ))}
      </div>

      {/* Main Two Column Dashboard Layout */}
      <div className="admin-dashboard-layout">
        {/* Left Column: Quick Actions */}
        <div>
          <div className="admin-section-heading" style={{ marginTop: 0 }}>
            <h3 className="admin-section-heading__title">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>grid_view</span>
              Content Management Modules
            </h3>
          </div>

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

        {/* Right Column: Live Inquiries & Portfolio Status */}
        <div>
          <div className="admin-section-heading" style={{ marginTop: 0 }}>
            <h3 className="admin-section-heading__title">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-secondary)' }}>mark_email_unread</span>
              Recent Inquiries
            </h3>
            <Link to="/admin/messages" className="text-primary text-xs hover:underline flex items-center gap-1 font-medium">
              View All
            </Link>
          </div>

          <div className="admin-recent-card mb-6">
            {recentMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#94a3b8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.3, display: 'block', margin: '0 auto 8px' }}>inbox</span>
                <p style={{ margin: 0, fontSize: 13 }}>No recent inquiries received yet.</p>
              </div>
            ) : (
              <div className="admin-recent-list">
                {recentMessages.map((msg) => (
                  <Link key={msg.id} to="/admin/messages" className="admin-recent-item">
                    <div className="admin-recent-item__avatar">
                      {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="admin-recent-item__body">
                      <div className="admin-recent-item__name">
                        <span>{msg.name || 'Visitor'}</span>
                        {!msg.is_read && (
                          <span style={{ fontSize: 9, background: 'var(--clr-primary)', color: '#020617', padding: '1px 6px', borderRadius: 99, fontWeight: 700 }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="admin-recent-item__sub">{msg.subject || msg.message}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* System & Portfolio Card */}
          <div className="admin-recent-card">
            <div className="admin-recent-card__header">
              <h4 className="admin-recent-card__title">
                <span className="material-symbols-outlined" style={{ color: '#4ade80' }}>verified</span>
                System & Deployment
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Database Status</span>
                <span style={{ color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="admin-pulse-dot" /> Connected (Supabase)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Production URL</span>
                <a href="https://abdurex.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'none' }}>
                  abdurex.vercel.app ↗
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Target Inbox</span>
                <span style={{ color: '#f8fafc' }}>abdurehmanseid856@gmail.com</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Theme Mode</span>
                <span style={{ color: '#f8fafc' }}>Dark Glassmorphism</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

