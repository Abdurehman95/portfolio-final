import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialProjects = [
  { id: 1, title: 'Tourism management system', subtitle: 'Productivity App', category: 'Web', status: 'Published', featured: true, image: '/tms.png', description: 'A productivity app for managing tourism and developing nation.', github_url: 'https://github.com/Abdurehman95/TOURISM-MANAGEMENT-SYSSTEM-UPDATED', live_url: '#', technologies: 'React, php, TailwindCSS' },
  { id: 2, title: 'Portfolio Website', subtitle: 'Personal Portfolio', category: 'Web', status: 'Published', featured: true, image: '/portfolio.png', description: 'A responsive portfolio website built with modern design principles.', github_url: 'https://github.com/Abdurehman95/react-portfolio-final', live_url: 'https://abdurex.vercel.app/', technologies: 'CSS3, React' },
  { id: 3, title: 'E-commerce Platform', subtitle: 'Online Store', category: 'Web', status: 'Draft', featured: false, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1470&q=80', description: 'A full-featured e-commerce platform built with React, Node.js, and MongoDB.', github_url: '#', live_url: '#', technologies: 'React, Node.js, MongoDB' },
];

const defaultForm = {
  title: '', subtitle: '', description: '', githubUrl: '', liveUrl: '',
  category: 'Web', status: 'Draft', featured: false, technologies: '', image: '',
};

const statusColors = {
  Published: 'primary',
  Draft: 'secondary',
  Archived: 'outline',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: true });
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects(initialProjects);
    }
  };

  const filtered = projects
    .filter(p => filterStatus === 'All' || p.status === filterStatus)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(defaultForm); setEditItem(null); setImagePreview(null); setShowModal(true); };
  const openEdit = (p) => { 
    setForm({ 
      title: p.title || '', subtitle: p.subtitle || '', description: p.description || '', 
      githubUrl: p.github_url || '', liveUrl: p.live_url || '', category: p.category || 'Web', 
      status: p.status || 'Draft', featured: p.featured || false, technologies: p.technologies || ''
    }); 
    setEditItem(p.id); 
    setImagePreview(p.image || null); 
    setShowModal(true); 
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const payload = { 
      title: form.title, subtitle: form.subtitle, description: form.description, 
      github_url: form.githubUrl, live_url: form.liveUrl, category: form.category, 
      status: form.status, featured: form.featured, technologies: form.technologies, 
      image: imagePreview || '' 
    };

    if (editItem) {
      await supabase.from('projects').update(payload).eq('id', editItem);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    
    await fetchProjects();
    closeModal();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async (id) => { 
    await supabase.from('projects').delete().eq('id', id);
    await fetchProjects();
    setDeleteConfirm(null); 
  };

  const toggleFeatured = async (id) => {
    const p = projects.find(x => x.id === id);
    if (p) {
      await supabase.from('projects').update({ featured: !p.featured }).eq('id', id);
      await fetchProjects();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Projects</h2>
          <p className="admin-page__subtitle">Manage the projects displayed on your portfolio.</p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn admin-btn--outline">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>filter_list</span>
            Filter
          </button>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Add Project
          </button>
        </div>
      </div>

      {/* Search + filter row */}
      <div className="admin-table-controls">
        <div className="admin-topbar__search" style={{ maxWidth: 320 }}>
          <span className="material-symbols-outlined admin-topbar__search-icon">search</span>
          <input
            type="text"
            placeholder="Search projects..."
            className="admin-topbar__search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs" style={{ margin: 0 }}>
          {['All', 'Published', 'Draft', 'Archived'].map(s => (
            <button
              key={s}
              className={`admin-filter-tab${filterStatus === s ? ' admin-filter-tab--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-glow" />
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table__empty">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, opacity: 0.3 }}>folder_open</span>
                    <p>No projects found</p>
                  </td>
                </tr>
              ) : filtered.map(project => (
                <tr key={project.id} className="admin-table__row">
                  <td>
                    <div className="admin-table__project-cell">
                      <div className="admin-table__project-thumb">
                        {project.image ? (
                          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--clr-on-surface-variant)', opacity: 0.5 }}>image</span>
                        )}
                      </div>
                      <div>
                        <p className="admin-table__project-title">{project.title}</p>
                        <p className="admin-table__project-sub">{project.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table__secondary">{project.category}</td>
                  <td>
                    <span className={`admin-status-badge admin-status-badge--${statusColors[project.status] || 'outline'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-star-btn${project.featured ? ' admin-star-btn--active' : ''}`}
                      onClick={() => toggleFeatured(project.id)}
                      title={project.featured ? 'Unfeature' : 'Feature'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: project.featured ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-table__row-actions">
                      <button className="admin-icon-action" onClick={() => openEdit(project)} title="Edit">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </button>
                      <button className="admin-icon-action admin-icon-action--danger" onClick={() => setDeleteConfirm(project.id)} title="Delete">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <p>Showing {filtered.length} of {projects.length} entries</p>
          <div className="admin-pagination">
            <button className="admin-page-btn" disabled><span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span></button>
            <button className="admin-page-btn admin-page-btn--active">1</button>
            <button className="admin-page-btn" disabled><span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="admin-modal__close" onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Project Title</label>
                  <input name="title" type="text" className="admin-input" value={form.title} onChange={handleFormChange} placeholder="e.g. Efoy Money" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle / Type</label>
                  <input name="subtitle" type="text" className="admin-input" value={form.subtitle} onChange={handleFormChange} placeholder="e.g. Fintech Application" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea name="description" className="admin-input admin-textarea" rows={3} value={form.description} onChange={handleFormChange} placeholder="Describe the project..." />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select name="category" className="admin-input" value={form.category} onChange={handleFormChange}>
                    {['Web', 'Mobile', 'AI', 'Desktop', 'API', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select name="status" className="admin-input" value={form.status} onChange={handleFormChange}>
                    {['Published', 'Draft', 'Archived'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">GitHub URL</label>
                  <input name="githubUrl" type="url" className="admin-input" value={form.githubUrl} onChange={handleFormChange} placeholder="https://github.com/..." />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Live URL</label>
                  <input name="liveUrl" type="url" className="admin-input" value={form.liveUrl} onChange={handleFormChange} placeholder="https://..." />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Technologies (comma separated)</label>
                <input name="technologies" type="text" className="admin-input" value={form.technologies} onChange={handleFormChange} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Project Image</label>
                <label className="admin-dropzone admin-dropzone--sm" htmlFor="project-image-input">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="admin-dropzone__img" />
                  ) : (
                    <div className="admin-dropzone__inner">
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--clr-primary)' }}>cloud_upload</span>
                      <span style={{ fontSize: 13, color: 'var(--clr-on-surface-variant)' }}>Click to upload project image</span>
                    </div>
                  )}
                  <input id="project-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </label>
              </div>
              <label className="admin-checkbox-label">
                <input name="featured" type="checkbox" className="admin-checkbox" checked={form.featured} onChange={handleFormChange} />
                Feature this project (shown prominently)
              </label>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>{editItem ? 'Update Project' : 'Add Project'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete Project?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body"><p style={{ color: 'var(--clr-on-surface-variant)' }}>This project will be permanently deleted from your portfolio.</p></div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="admin-toast"><span className="material-symbols-outlined">check_circle</span>Projects updated!</div>
      )}
    </div>
  );
}
