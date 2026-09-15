import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialState = {
  heading: 'About Me',
  description: `I'm a passionate Full Stack Developer with over 3 years of experience creating modern web applications.
I specialize in JavaScript ecosystems including React, Node.js, and modern CSS frameworks.

Name: Abdurehman Seid
Email: abdurehmanseid@gmail.com
Phone: +251967192079
Experience: 3+ Years
Location: Ethiopia, Woldia`,
  yearsExperience: 3,
  projectsCompleted: 15,
  clients: 10,
  altText: 'Portrait of Abdurehman',
  showImage: true,
  about_image: '/image.png',
};

export default function AdminAbout() {
  const [form, setForm] = useState(initialState);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialState.about_image);
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    const { data } = await supabase.from('about_content').select('*').single();
    if (data) {
      setForm({
        heading: data.heading || '',
        description: data.description || '',
        yearsExperience: data.years_experience || 0,
        projectsCompleted: data.projects_completed || 0,
        clients: data.clients || 0,
        altText: data.alt_text || '',
        showImage: data.show_image ?? true,
      });
      if (data.about_image) setImagePreview(data.about_image);
    } else {
      setForm(initialState);
      setImagePreview(initialState.about_image);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setSaved(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('about_content').upsert({
      id: 1,
      heading: form.heading,
      description: form.description,
      years_experience: Number(form.yearsExperience),
      projects_completed: Number(form.projectsCompleted),
      clients: Number(form.clients),
      alt_text: form.altText,
      show_image: form.showImage,
      about_image: imagePreview
    });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const wordCount = form.description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = form.description.length;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <div className="admin-breadcrumb">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_document</span>
            <span>Content Management / About Me</span>
          </div>
          <h2 className="admin-page__title">Edit 'About Me' Section</h2>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn admin-btn--outline" onClick={() => { setForm(initialState); setImagePreview(initialState.about_image); }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
            Discard Changes
          </button>
          <button className="admin-btn admin-btn--primary" onClick={handleSave}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
            {saved ? 'Published!' : 'Publish Section'}
          </button>
        </div>
      </div>

      <div className="admin-split-layout">
        {/* Left: Form */}
        <div className="admin-split-layout__left">
          {/* Metrics */}
          <div className="admin-card">
            <div className="admin-card__header">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>analytics</span>
              <h3 className="admin-card__title">Key Metrics</h3>
            </div>
            <div className="admin-form-row admin-form-row--3">
              <div className="admin-form-group">
                <label className="admin-label">Years of Experience</label>
                <input
                  name="yearsExperience"
                  type="number"
                  className="admin-input"
                  value={form.yearsExperience}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Projects Completed</label>
                <input
                  name="projectsCompleted"
                  type="number"
                  className="admin-input"
                  value={form.projectsCompleted}
                  onChange={handleChange}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Happy Clients</label>
                <input
                  name="clients"
                  type="number"
                  className="admin-input"
                  value={form.clients}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Biography rich text */}
          <div className="admin-card admin-card--editor">
            <div className="admin-card__header admin-card__header--bordered">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>description</span>
              <h3 className="admin-card__title">Biography Content</h3>
            </div>
            {/* Toolbar */}
            <div className="admin-editor-toolbar">
              <div className="admin-editor-toolbar__group">
                <select className="admin-input" style={{ padding: '4px 8px', fontSize: 12 }}>
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
              </div>
              <div className="admin-editor-toolbar__group">
                <button className="admin-editor-btn admin-editor-btn--active" type="button" title="Bold">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_bold</span>
                </button>
                <button className="admin-editor-btn" type="button" title="Italic">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_italic</span>
                </button>
                <button className="admin-editor-btn" type="button" title="Underline">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_underlined</span>
                </button>
              </div>
              <div className="admin-editor-toolbar__group">
                <button className="admin-editor-btn" type="button" title="Bullet list">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_list_bulleted</span>
                </button>
                <button className="admin-editor-btn" type="button" title="Numbered list">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_list_numbered</span>
                </button>
              </div>
              <div className="admin-editor-toolbar__group">
                <button className="admin-editor-btn" type="button" title="Link">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>link</span>
                </button>
                <button className="admin-editor-btn" type="button" title="Code">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>code</span>
                </button>
              </div>
            </div>
            <div style={{ padding: '0 1px' }}>
              <textarea
                name="description"
                className="admin-input admin-textarea admin-textarea--editor"
                value={form.description}
                onChange={handleChange}
                rows={12}
              />
            </div>
            <div className="admin-editor-footer">
              <span>Words: {wordCount} | Characters: {charCount}</span>
              <span className="admin-editor-footer__status">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>cloud_done</span>
                Autosaved just now
              </span>
            </div>
          </div>

          {/* Profile image */}
          <div className="admin-card">
            <div className="admin-card__header">
              <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)' }}>image</span>
              <h3 className="admin-card__title">Section Media</h3>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <label className="admin-img-upload" htmlFor="about-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="About" className="admin-img-upload__preview" />
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ color: 'var(--clr-primary)', fontSize: 28 }}>upload</span>
                    <span style={{ fontSize: 11, color: 'var(--clr-primary)', fontWeight: 600 }}>Change Image</span>
                  </>
                )}
                <input id="about-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>
              <div style={{ flex: 1 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Alt Text</label>
                  <input
                    name="altText"
                    type="text"
                    className="admin-input"
                    value={form.altText}
                    onChange={handleChange}
                  />
                </div>
                <label className="admin-checkbox-label">
                  <input
                    name="showImage"
                    type="checkbox"
                    checked={form.showImage}
                    onChange={handleChange}
                    className="admin-checkbox"
                  />
                  Display image alongside text
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="admin-split-layout__right">
          <div className="admin-preview-header">
            <h3 className="admin-preview-header__title">
              <span className="material-symbols-outlined">visibility</span>
              Live Preview
            </h3>
            <div className="admin-preview-tabs">
              <button
                className={`admin-preview-tab${previewMode === 'desktop' ? ' admin-preview-tab--active' : ''}`}
                onClick={() => setPreviewMode('desktop')}
              >Desktop</button>
              <button
                className={`admin-preview-tab${previewMode === 'mobile' ? ' admin-preview-tab--active' : ''}`}
                onClick={() => setPreviewMode('mobile')}
              >Mobile</button>
            </div>
          </div>
          <div className="admin-preview-canvas">
            <div className="admin-preview-canvas__bg" />
            <div className="admin-about-preview">
              <h2 className="admin-about-preview__heading">{form.heading}</h2>
              <div className="admin-about-preview__grid">
                {form.showImage && (
                  <div className="admin-about-preview__img-wrap">
                    <div className="admin-about-preview__img-glow" />
                    {imagePreview ? (
                      <img src={imagePreview} alt={form.altText} className="admin-about-preview__img" />
                    ) : (
                      <div className="admin-about-preview__img-placeholder">
                        <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--clr-primary)', opacity: 0.4 }}>person</span>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 14, whiteSpace: 'pre-wrap', marginBottom: 24 }}>
                    {form.description}
                  </p>
                  <div className="admin-metrics-preview">
                    <div>
                      <div className="admin-metrics-preview__val admin-metrics-preview__val--primary">{form.yearsExperience}+</div>
                      <div className="admin-metrics-preview__label">Years Exp.</div>
                    </div>
                    <div>
                      <div className="admin-metrics-preview__val admin-metrics-preview__val--secondary">{form.projectsCompleted}</div>
                      <div className="admin-metrics-preview__label">Projects</div>
                    </div>
                    <div>
                      <div className="admin-metrics-preview__val admin-metrics-preview__val--tertiary">{form.clients}</div>
                      <div className="admin-metrics-preview__label">Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="admin-toast">
          <span className="material-symbols-outlined">check_circle</span>
          Section published successfully!
        </div>
      )}
    </div>
  );
}
