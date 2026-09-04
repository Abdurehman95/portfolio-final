import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialSkills = [
  { id: 1, name: 'React', category: 'Frontend', proficiency: 90, icon: 'code', color: 'primary', active: true },
  { id: 2, name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'format_paint', color: 'primary', active: true },
  { id: 3, name: 'TypeScript', category: 'Language', proficiency: 85, icon: 'javascript', color: 'secondary', active: true },
  { id: 4, name: 'Node.js', category: 'Backend', proficiency: 80, icon: 'settings', color: 'tertiary', active: true },
  { id: 5, name: 'PostgreSQL', category: 'Database', proficiency: 75, icon: 'database', color: 'primary', active: true },
  { id: 6, name: 'Figma', category: 'Design', proficiency: 88, icon: 'design_services', color: 'secondary', active: true },
];

const categories = ['All', 'Frontend', 'Backend', 'Language', 'Database', 'Design', 'Tools'];

const defaultForm = { name: '', category: 'Frontend', proficiency: 80, icon: 'code', color: 'primary', active: true };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('id', { ascending: true });
    if (data) setSkills(data);
  };

  const filtered = filter === 'All' ? skills : skills.filter(s => s.category === filter);

  const openAdd = () => { setForm(defaultForm); setEditItem(null); setShowModal(true); };
  const openEdit = (skill) => { setForm({ ...skill }); setEditItem(skill.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value });
  };

  const handleSave = async () => {
    const payload = { 
      name: form.name, category: form.category, proficiency: form.proficiency, 
      icon: form.icon, color: form.color, active: form.active 
    };

    if (editItem) {
      await supabase.from('skills').update(payload).eq('id', editItem);
    } else {
      await supabase.from('skills').insert([payload]);
    }
    
    await fetchSkills();
    closeModal();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async (id) => { 
    await supabase.from('skills').delete().eq('id', id);
    await fetchSkills();
    setDeleteConfirm(null); 
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Skill Repository</h2>
          <p className="admin-page__subtitle">Manage and track your technical proficiencies.</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Add Skill
        </button>
      </div>

      {/* Filter tabs */}
      <div className="admin-filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`admin-filter-tab${filter === cat ? ' admin-filter-tab--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
            <span className="admin-filter-tab__count">
              {cat === 'All' ? skills.length : skills.filter(s => s.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="admin-bento-grid">
        {filtered.map(skill => (
          <div key={skill.id} className="admin-skill-card">
            <div className="admin-skill-card__top">
              <div className="admin-skill-card__meta">
                <div className="admin-skill-card__icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: `var(--clr-${skill.color})` }}>{skill.icon}</span>
                </div>
                <div>
                  <h3 className="admin-skill-card__name">{skill.name}</h3>
                  <span className={`admin-tag admin-tag--${skill.color}`}>{skill.category}</span>
                </div>
              </div>
              <div className="admin-skill-card__actions">
                <button className="admin-icon-action" onClick={() => openEdit(skill)} title="Edit">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                </button>
                <button className="admin-icon-action admin-icon-action--danger" onClick={() => setDeleteConfirm(skill.id)} title="Delete">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            </div>
            <div className="admin-skill-bar">
              <div className="admin-skill-bar__header">
                <span style={{ color: 'var(--clr-on-surface-variant)', fontSize: 12 }}>Proficiency</span>
                <span style={{ color: `var(--clr-${skill.color})`, fontWeight: 700, fontSize: 12 }}>{skill.proficiency}%</span>
              </div>
              <div className="admin-skill-bar__track">
                <div className="admin-skill-bar__fill" style={{ width: `${skill.proficiency}%` }} />
              </div>
            </div>
          </div>
        ))}

        <button className="admin-add-card admin-add-card--dashed" onClick={openAdd}>
          <div className="admin-add-card__icon">
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>add_circle</span>
          </div>
          <h4>Track a new skill</h4>
          <p>Keep your portfolio up to date by adding the new technologies you master.</p>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button className="admin-modal__close" onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Skill Name</label>
                  <input name="name" type="text" className="admin-input" value={form.name} onChange={handleFormChange} placeholder="e.g. React" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select name="category" className="admin-input" value={form.category} onChange={handleFormChange}>
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Icon (Material Symbol name)</label>
                  <input name="icon" type="text" className="admin-input" value={form.icon} onChange={handleFormChange} placeholder="e.g. code" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Color</label>
                  <select name="color" className="admin-input" value={form.color} onChange={handleFormChange}>
                    <option value="primary">Primary (Blue)</option>
                    <option value="secondary">Secondary (Purple)</option>
                    <option value="tertiary">Tertiary (Indigo)</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Proficiency: {form.proficiency}%</label>
                <input
                  name="proficiency"
                  type="range"
                  min="0"
                  max="100"
                  className="admin-range"
                  value={form.proficiency}
                  onChange={handleFormChange}
                />
                <div className="admin-skill-bar__track" style={{ marginTop: 8 }}>
                  <div className="admin-skill-bar__fill" style={{ width: `${form.proficiency}%` }} />
                </div>
              </div>
              <label className="admin-checkbox-label">
                <input name="active" type="checkbox" className="admin-checkbox" checked={form.active} onChange={handleFormChange} />
                Display this skill publicly
              </label>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>{editItem ? 'Update Skill' : 'Add Skill'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete Skill?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body">
              <p style={{ color: 'var(--clr-on-surface-variant)' }}>This will permanently remove the skill from your portfolio.</p>
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
          Skills updated!
        </div>
      )}
    </div>
  );
}
