import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialServices = [
  { id: 1, icon: 'code', title: 'Web Development', description: 'Custom, responsive websites built with modern frameworks. Focus on performance, accessibility, and scalable architecture.', tags: ['React', 'Tailwind'], color: 'primary', active: true },
  { id: 2, icon: 'design_services', title: 'UI/UX Design', description: 'Intuitive and engaging user interfaces. Wireframing, prototyping, and high-fidelity visual design tailored to user needs.', tags: ['Figma', 'Prototyping'], color: 'secondary', active: true },
  { id: 3, icon: 'api', title: 'API Integration', description: 'Seamless connection of third-party services and custom backend development. Secure and efficient data flow across systems.', tags: ['REST', 'GraphQL'], color: 'tertiary', active: true },
];

const defaultForm = { icon: 'code', title: '', description: '', tags: '', color: 'primary', active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('id', { ascending: true });
    if (data) setServices(data);
  };

  const openAdd = () => { setForm(defaultForm); setEditItem(null); setShowModal(true); };
  const openEdit = (svc) => {
    setForm({ ...svc, tags: (svc.tags || []).join(', ') });
    setEditItem(svc.id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSaveService = async () => {
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { 
      icon: form.icon, title: form.title, description: form.description, 
      tags: tagsArray, color: form.color, active: form.active 
    };

    if (editItem) {
      await supabase.from('services').update(payload).eq('id', editItem);
    } else {
      await supabase.from('services').insert([payload]);
    }
    
    await fetchServices();
    closeModal();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async (id) => {
    await supabase.from('services').delete().eq('id', id);
    await fetchServices();
    setDeleteConfirm(null);
  };

  const toggleActive = async (id) => {
    const svc = services.find(s => s.id === id);
    if (svc) {
      await supabase.from('services').update({ active: !svc.active }).eq('id', id);
      await fetchServices();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Manage Services</h2>
          <p className="admin-page__subtitle">Add, edit, or remove services offered.</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Add Service
        </button>
      </div>

      <div className="admin-bento-grid">
        {services.map((svc) => (
          <div key={svc.id} className={`admin-service-card${!svc.active ? ' admin-service-card--inactive' : ''}`}>
            {/* Hover actions */}
            <div className="admin-service-card__actions">
              <button className="admin-icon-action" onClick={() => toggleActive(svc.id)} title={svc.active ? 'Hide' : 'Show'}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{svc.active ? 'visibility' : 'visibility_off'}</span>
              </button>
              <button className="admin-icon-action" onClick={() => openEdit(svc)} title="Edit">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
              </button>
              <button className="admin-icon-action admin-icon-action--danger" onClick={() => setDeleteConfirm(svc.id)} title="Delete">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
              </button>
            </div>

            <div className={`admin-service-card__icon admin-service-card__icon--${svc.color}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{svc.icon}</span>
            </div>
            <h3 className="admin-service-card__title">{svc.title}</h3>
            <p className="admin-service-card__desc">{svc.description}</p>
            <div className="admin-tag-row">
              {svc.tags.map(tag => (
                <span key={tag} className={`admin-tag admin-tag--${svc.color}`}>{tag}</span>
              ))}
            </div>
            {!svc.active && <div className="admin-service-card__hidden-badge">Hidden</div>}
          </div>
        ))}

        {/* Add new placeholder */}
        <button className="admin-add-card" onClick={openAdd}>
          <span className="material-symbols-outlined" style={{ fontSize: 36 }}>add_circle</span>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem ? 'Edit Service' : 'Add New Service'}</h3>
              <button className="admin-modal__close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Icon (Material Symbol)</label>
                  <input name="icon" type="text" className="admin-input" value={form.icon} onChange={handleFormChange} placeholder="e.g. code" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Color Accent</label>
                  <select name="color" className="admin-input" value={form.color} onChange={handleFormChange}>
                    <option value="primary">Primary (Blue)</option>
                    <option value="secondary">Secondary (Purple)</option>
                    <option value="tertiary">Tertiary (Indigo)</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Service Title</label>
                <input name="title" type="text" className="admin-input" value={form.title} onChange={handleFormChange} placeholder="e.g. Web Development" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea name="description" className="admin-input admin-textarea" rows={3} value={form.description} onChange={handleFormChange} placeholder="Describe this service..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Tags (comma separated)</label>
                <input name="tags" type="text" className="admin-input" value={form.tags} onChange={handleFormChange} placeholder="React, Tailwind, Node.js" />
              </div>
              <label className="admin-checkbox-label">
                <input name="active" type="checkbox" className="admin-checkbox" checked={form.active} onChange={handleFormChange} />
                Display this service publicly
              </label>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSaveService}>
                {editItem ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete Service?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="admin-modal__body">
              <p style={{ color: 'var(--clr-on-surface-variant)' }}>This action cannot be undone. The service will be permanently removed.</p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="admin-toast">
          <span className="material-symbols-outlined">check_circle</span>
          Services updated!
        </div>
      )}
    </div>
  );
}
