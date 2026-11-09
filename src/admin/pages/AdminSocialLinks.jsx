import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  platformPresets,
  getStoredSocialLinks,
  saveStoredSocialLinks,
  sanitizeUrl
} from '../../utils/socialLinks';

const emptyForm = {
  platform: '',
  url: '',
  icon: 'fab fa-instagram',
  color: '#e1306c',
  active: true,
  display_order: 1
};

export default function AdminSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [savedToast, setSavedToast] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        // Table does not exist or permission denied
        setDbConnected(false);
        setDbError(error.message);
        const local = getStoredSocialLinks();
        setLinks(local);
      } else if (data && data.length > 0) {
        setDbConnected(true);
        setDbError(null);
        setLinks(data);
        saveStoredSocialLinks(data);
      } else {
        // Connected but empty table, seed with defaults
        setDbConnected(true);
        setDbError(null);
        setLinks(getStoredSocialLinks());
      }
    } catch (err) {
      setDbConnected(false);
      setDbError(err.message || 'Database error');
      setLinks(getStoredSocialLinks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const showToast = (msg) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(''), 3500);
  };

  const handleOpenAdd = () => {
    const nextOrder = links.length > 0 ? Math.max(...links.map(l => l.display_order || 0)) + 1 : 1;
    setForm({ ...emptyForm, display_order: nextOrder });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setForm({
      platform: item.platform || '',
      url: item.url || '',
      icon: item.icon || 'fab fa-instagram',
      color: item.color || '#0ea5e9',
      active: item.active !== false,
      display_order: item.display_order ?? 1
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleApplyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      platform: preset.platform,
      icon: preset.icon,
      color: preset.color,
      url: prev.url ? prev.url : preset.defaultUrl
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.platform.trim()) {
      alert('Please enter a platform name.');
      return;
    }
    if (!form.url.trim()) {
      alert('Please enter a valid link URL.');
      return;
    }

    const payload = {
      platform: form.platform.trim(),
      url: form.url.trim(),
      icon: form.icon.trim(),
      color: form.color || '#0ea5e9',
      active: form.active,
      display_order: Number(form.display_order) || 0
    };

    let updatedList = [...links];

    // Try saving to Supabase first
    if (dbConnected) {
      try {
        if (editingId) {
          const { error } = await supabase
            .from('social_links')
            .update(payload)
            .eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('social_links')
            .insert([payload]);
          if (error) throw error;
        }
        await fetchLinks();
        setShowModal(false);
        showToast(editingId ? 'Link updated successfully in Supabase!' : 'New link created in Supabase!');
        return;
      } catch (err) {
        console.warn('Database save failed, persisting locally:', err);
      }
    }

    // Local state fallback / synchronization
    if (editingId) {
      updatedList = updatedList.map(item => item.id === editingId ? { ...item, ...payload } : item);
    } else {
      const newId = Date.now();
      updatedList.push({ id: newId, ...payload });
    }

    updatedList.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setLinks(updatedList);
    saveStoredSocialLinks(updatedList);
    setShowModal(false);
    showToast(editingId ? 'Link updated!' : 'New link added!');
  };

  const handleToggleActive = async (item) => {
    const updatedStatus = !item.active;
    const updatedList = links.map(l => l.id === item.id ? { ...l, active: updatedStatus } : l);
    setLinks(updatedList);
    saveStoredSocialLinks(updatedList);

    if (dbConnected) {
      try {
        await supabase
          .from('social_links')
          .update({ active: updatedStatus })
          .eq('id', item.id);
      } catch (err) {
        console.warn('Failed to update status in DB:', err);
      }
    }
    showToast(`${item.platform} is now ${updatedStatus ? 'active' : 'hidden'}`);
  };

  const handleDelete = async (id) => {
    const updatedList = links.filter(l => l.id !== id);
    setLinks(updatedList);
    saveStoredSocialLinks(updatedList);

    if (dbConnected) {
      try {
        await supabase.from('social_links').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete in DB:', err);
      }
    }
    setDeleteConfirm(null);
    showToast('Social link removed successfully');
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const listCopy = [...links];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    // Recalculate display_order
    const reordered = listCopy.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setLinks(reordered);
    saveStoredSocialLinks(reordered);

    if (dbConnected) {
      try {
        for (const item of reordered) {
          await supabase
            .from('social_links')
            .update({ display_order: item.display_order })
            .eq('id', item.id);
        }
      } catch (err) {
        console.warn('Failed to update order in DB:', err);
      }
    }
    showToast('Link order updated');
  };

  const handleCopySql = () => {
    const sql = `-- Supabase SQL: Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#0ea5e9',
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active social links" 
ON public.social_links FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access to social links" 
ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon manage social links" 
ON public.social_links FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.social_links (platform, url, icon, color, active, display_order)
VALUES
    ('GitHub', 'https://github.com/Abdurehman95', 'fab fa-github', '#ffffff', true, 1),
    ('LinkedIn', 'https://www.linkedin.com/feed/', 'fab fa-linkedin-in', '#0ea5e9', true, 2),
    ('Twitter / X', 'https://x.com/home', 'fab fa-x-twitter', '#38bdf8', true, 3),
    ('Telegram', 'https://t.me/abdu_8995', 'fab fa-telegram', '#229ed9', true, 4),
    ('Instagram', 'https://instagram.com/', 'fab fa-instagram', '#e1306c', true, 5)
ON CONFLICT DO NOTHING;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const filteredLinks = links.filter(l =>
    l.platform.toLowerCase().includes(search.toLowerCase()) ||
    l.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {savedToast && (
        <div className="admin-success-toast">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{savedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-page__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 className="admin-page__title">Social Media Links</h2>
            {dbConnected ? (
              <span className="admin-status-badge admin-status-badge--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>cloud_done</span>
                Database Synced
              </span>
            ) : (
              <span className="admin-status-badge admin-status-badge--secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>cloud_off</span>
                Local Storage Mode
              </span>
            )}
          </div>
          <p className="admin-page__subtitle">
            Manage links for Instagram, LinkedIn, GitHub, Twitter, and other platforms across your entire portfolio.
          </p>
        </div>
        <div className="admin-page__actions">
          <button onClick={handleCopySql} className="admin-btn admin-btn--outline" title="Copy SQL migration for Supabase SQL Editor">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {copiedSql ? 'check' : 'content_copy'}
            </span>
            {copiedSql ? 'SQL Copied!' : 'Copy Supabase SQL'}
          </button>
          <button onClick={handleOpenAdd} className="admin-btn admin-btn--primary">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_link</span>
            Add New Link
          </button>
        </div>
      </div>

      {/* Database Setup Banner (if table not created yet) */}
      {!dbConnected && (
        <div style={{
          background: 'rgba(210, 187, 255, 0.08)',
          border: '1px solid rgba(210, 187, 255, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-secondary)', fontSize: '28px' }}>
              info
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--clr-on-surface)' }}>
                Database table <code style={{ color: 'var(--clr-primary)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>social_links</code> not detected in Supabase
                {dbError && <span style={{ fontSize: '11px', color: 'var(--clr-outline)', marginLeft: '8px' }}>({dbError})</span>}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--clr-on-surface-variant)' }}>
                All link edits are currently saved safely in your browser. To sync across all devices via Supabase, copy the 1-click SQL script and run it in your Supabase SQL Editor.
              </p>
            </div>
          </div>
          <button onClick={handleCopySql} className="admin-btn admin-btn--outline admin-btn--sm">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>code</span>
            {copiedSql ? 'Copied to Clipboard!' : 'Copy Table SQL Schema'}
          </button>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '20px 24px', background: 'var(--clr-surface-container)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>visibility</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Live Portfolio Preview</h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--clr-on-surface-variant)' }}>
            Showing {links.filter(l => l.active).length} active of {links.length} total
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--clr-surface-container-lowest)', borderRadius: '10px' }}>
          {links.filter(l => l.active).length === 0 ? (
            <p style={{ color: 'var(--clr-on-surface-variant)', fontSize: '13px', margin: 0 }}>
              No active links. Toggle a link below to display it on your portfolio.
            </p>
          ) : (
            links.filter(l => l.active).map(link => (
              <a
                key={link.id}
                href={sanitizeUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                title={`${link.platform}: ${link.url}`}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#1e293b',
                  color: link.color || '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <i className={link.icon}></i>
              </a>
            ))
          )}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="admin-table-controls">
        <div className="admin-topbar__search" style={{ maxWidth: 320 }}>
          <span className="material-symbols-outlined admin-topbar__search-icon">search</span>
          <input
            type="text"
            placeholder="Search links..."
            className="admin-topbar__search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--clr-on-surface-variant)' }}>
          {filteredLinks.length} platform{filteredLinks.length === 1 ? '' : 's'} configured
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-glow" />
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Platform & Icon</th>
                <th>Target URL</th>
                <th>Color</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px' }}>
                    <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 8px' }} />
                    <p style={{ color: 'var(--clr-on-surface-variant)', fontSize: '13px' }}>Loading links...</p>
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.3 }}>share</span>
                    <p>No social media links found</p>
                    <button onClick={handleOpenAdd} className="admin-btn admin-btn--primary admin-btn--sm" style={{ marginTop: '12px' }}>
                      Add your first link
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link, idx) => (
                  <tr key={link.id} className="admin-table__row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === 0 ? 'var(--clr-outline-variant)' : 'var(--clr-on-surface)',
                            cursor: idx === 0 ? 'default' : 'pointer',
                            padding: '2px',
                            display: 'flex'
                          }}
                          title="Move up"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_upward</span>
                        </button>
                        <span style={{ fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                          {link.display_order ?? idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === filteredLinks.length - 1}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: idx === filteredLinks.length - 1 ? 'var(--clr-outline-variant)' : 'var(--clr-on-surface)',
                            cursor: idx === filteredLinks.length - 1 ? 'default' : 'pointer',
                            padding: '2px',
                            display: 'flex'
                          }}
                          title="Move down"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_downward</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: link.color || '#fff',
                            fontSize: '18px',
                            flexShrink: 0
                          }}
                        >
                          <i className={link.icon}></i>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--clr-on-surface)' }}>{link.platform}</p>
                          <code style={{ fontSize: '11px', color: 'var(--clr-on-surface-variant)' }}>{link.icon}</code>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--clr-primary)',
                            fontSize: '13px'
                          }}
                        >
                          {link.url}
                        </span>
                        <a
                          href={sanitizeUrl(link.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open link in new tab"
                          style={{ color: 'var(--clr-on-surface-variant)', display: 'flex', alignItems: 'center' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                        </a>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: link.color || '#0ea5e9',
                            display: 'inline-block',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--clr-on-surface-variant)' }}>
                          {link.color || '#0ea5e9'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(link)}
                        className={`admin-status-badge admin-status-badge--${link.active ? 'primary' : 'outline'}`}
                        style={{ cursor: 'pointer', border: 'none', background: link.active ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.05)' }}
                      >
                        {link.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--outline admin-btn--sm"
                          onClick={() => handleOpenEdit(link)}
                          title="Edit link"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setDeleteConfirm(link)}
                          title="Delete link"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {editingId ? 'Edit Social Link' : 'Add New Social Link'}
              </h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setShowModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal__body">
                {/* Preset Picker */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="admin-label" style={{ marginBottom: '8px' }}>Quick Platform Presets</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {platformPresets.map(preset => (
                      <button
                        key={preset.platform}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="admin-btn admin-btn--outline admin-btn--sm"
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: form.platform.toLowerCase() === preset.platform.toLowerCase() ? 'rgba(14, 165, 233, 0.2)' : 'transparent'
                        }}
                      >
                        <i className={preset.icon} style={{ color: preset.color }}></i>
                        {preset.platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Platform Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Instagram, LinkedIn, GitHub"
                      value={form.platform}
                      onChange={e => setForm({ ...form, platform: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">FontAwesome Icon Class *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. fab fa-instagram, fab fa-linkedin-in"
                      value={form.icon}
                      onChange={e => setForm({ ...form, icon: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Profile / Page URL *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://instagram.com/yourhandle"
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    required
                  />
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--clr-on-surface-variant)' }}>
                    Enter full URL with https:// or standard handle URL.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Brand Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="color"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'transparent'
                        }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        placeholder="#e1306c"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={form.display_order}
                      onChange={e => setForm({ ...form, display_order: Number(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm({ ...form, active: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--clr-on-surface)' }}>
                      Visible on portfolio (active)
                    </span>
                  </label>
                </div>

                {/* Live Modal Icon Preview */}
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--clr-surface-container-lowest)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '12px'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--clr-on-surface-variant)' }}>Icon Preview:</span>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#1e293b',
                      color: form.color || '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}
                  >
                    <i className={form.icon || 'fas fa-link'}></i>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{form.platform || 'Platform Name'}</span>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--clr-on-surface-variant)' }}>
                      {form.url || 'No URL specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                  {editingId ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Delete Social Link</h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setDeleteConfirm(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="admin-modal__body">
              <p style={{ margin: 0, color: 'var(--clr-on-surface)' }}>
                Are you sure you want to remove <strong>{deleteConfirm.platform}</strong>?
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--clr-on-surface-variant)' }}>
                This link will no longer appear on your portfolio home, contact, and footer sections.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
