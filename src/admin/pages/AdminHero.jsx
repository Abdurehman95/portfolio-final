import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';const initialState = {
  title: 'Hi, I\'m Abdurehman Seid',
  subtitle: 'I build exceptional digital experiences that are fast, accessible, and visually appealing. Let\'s create something amazing together.',
  ctaText: 'Hire Me',
  ctaUrl: '#contact',
  secondaryCtaText: 'Download CV',
  secondaryCtaUrl: '#',
  heroImage: '/image.png',
};

export default function AdminHero() {
  const [form, setForm] = useState(initialState);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialState.heroImage);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching hero data:', error.message);
      } else if (data) {
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          ctaText: data.cta_text || '',
          ctaUrl: data.cta_url || '',
          secondaryCtaText: data.secondary_cta_text || '',
          secondaryCtaUrl: data.secondary_cta_url || '',
          heroImage: data.hero_image || initialState.heroImage,
        });
        if (data.hero_image) setImagePreview(data.hero_image);
      } else {
        // Fallback to initial state if no data in DB
        setForm(initialState);
        setImagePreview(initialState.heroImage);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
      // NOTE: In a full implementation, you would upload `file` to Supabase Storage here
      // and update form.heroImage with the public URL.
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('hero_content')
        .upsert({
          id: 1, // Assuming a single row for hero content
          title: form.title,
          subtitle: form.subtitle,
          cta_text: form.ctaText,
          cta_url: form.ctaUrl,
          secondary_cta_text: form.secondaryCtaText,
          secondary_cta_url: form.secondaryCtaUrl,
          hero_image: imagePreview // This assumes imagePreview contains a base64 string or URL
        });
        
      if (error) {
        console.error('Error saving data:', error);
        alert(`Failed to save data: ${error.message || JSON.stringify(error)}`);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDiscard = () => {
    setForm(initialState);
    setImagePreview(initialState.heroImage);
    setSaved(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <div className="admin-breadcrumb">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_document</span>
            <span>Content Management / Hero</span>
          </div>
          <h2 className="admin-page__title">Manage Hero Section</h2>
          <p className="admin-page__subtitle">Configure the primary landing area of your portfolio.</p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn admin-btn--outline" onClick={handleDiscard}>Discard Changes</button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-split-grid">
        {/* Left column */}
        <div className="admin-split-grid__left">
          {/* Text content card */}
          <div className="admin-card">
            <div className="admin-card__header">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>edit_document</span>
              <h3 className="admin-card__title">Text Content</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="hero-title">Hero Title</label>
              <input
                id="hero-title"
                name="title"
                type="text"
                className="admin-input"
                value={form.title}
                onChange={handleChange}
              />
              <p className="admin-hint">This text will be rendered with the primary brand gradient.</p>
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="hero-subtitle">Subtitle / Intro</label>
              <textarea
                id="hero-subtitle"
                name="subtitle"
                rows={4}
                className="admin-input admin-textarea"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="hero-cta-text">Primary CTA Text</label>
                <input
                  id="hero-cta-text"
                  name="ctaText"
                  type="text"
                  className="admin-input"
                  value={form.ctaText}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="hero-cta-url">CTA URL</label>
                <input
                  id="hero-cta-url"
                  name="ctaUrl"
                  type="text"
                  className="admin-input admin-input--accent"
                  value={form.ctaUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="hero-sec-cta-text">Secondary CTA Text</label>
                <input
                  id="hero-sec-cta-text"
                  name="secondaryCtaText"
                  type="text"
                  className="admin-input"
                  value={form.secondaryCtaText}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="hero-sec-cta-url">Secondary CTA URL</label>
                <input
                  id="hero-sec-cta-url"
                  name="secondaryCtaUrl"
                  type="text"
                  className="admin-input"
                  value={form.secondaryCtaUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="admin-split-grid__right">
          {/* Media upload card */}
          <div className="admin-card">
            <div className="admin-card__header">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-secondary)' }}>image</span>
              <h3 className="admin-card__title">Hero Media</h3>
            </div>
            <label className="admin-dropzone" htmlFor="hero-image-upload">
              {imagePreview ? (
                <img src={imagePreview} alt="Hero preview" className="admin-dropzone__img" />
              ) : (
                <div className="admin-dropzone__inner">
                  <div className="admin-dropzone__icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>cloud_upload</span>
                  </div>
                  <h4 className="admin-dropzone__title">Upload Hero Asset</h4>
                  <p className="admin-dropzone__hint">Drag and drop or click to browse</p>
                  <span className="admin-dropzone__badge">Recommended: 1920×1080 (WebP, PNG)</span>
                </div>
              )}
              <input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                style={{ marginTop: 8, width: '100%' }}
                onClick={() => setImagePreview(null)}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Live preview card */}
          <div className="admin-card admin-card--glow">
            <div className="admin-card__header">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-tertiary)' }}>visibility</span>
              <h3 className="admin-card__title">Live Preview</h3>
            </div>
            <div className="admin-preview-box">
              <h4 className="admin-preview-box__title">{form.title || 'Hero Title'}</h4>
              <p className="admin-preview-box__body">{form.subtitle || 'Hero subtitle will appear here.'}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn--primary" type="button" style={{ fontSize: 12 }}>
                  {form.ctaText}
                </button>
                {form.secondaryCtaText && (
                  <button className="admin-btn admin-btn--outline" type="button" style={{ fontSize: 12 }}>
                    {form.secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {saved && (
        <div className="admin-toast">
          <span className="material-symbols-outlined">check_circle</span>
          Changes saved successfully!
        </div>
      )}
    </div>
  );
}
