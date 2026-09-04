import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialTechs = {
  Frontend: [
    { id: 1, name: 'React', proficiency: 90 },
    { id: 2, name: 'Tailwind CSS', proficiency: 95 },
    { id: 3, name: 'TypeScript', proficiency: 85 },
  ],
  Backend: [
    { id: 4, name: 'Node.js', proficiency: 80 },
    { id: 5, name: 'Python', proficiency: 75 },
  ],
  Database: [
    { id: 6, name: 'PostgreSQL', proficiency: 75 },
    { id: 7, name: 'Supabase', proficiency: 85 },
  ],
};

const categoryIcons = { Frontend: 'web', Backend: 'settings', Database: 'database' };

export default function AdminTechnologies() {
  const [categories, setCategories] = useState({});
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showAddTech, setShowAddTech] = useState(null);
  const [newTech, setNewTech] = useState({ name: '', proficiency: 80 });
  const [editingTech, setEditingTech] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', proficiency: 80 });
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null);
  const [deleteConfirmTech, setDeleteConfirmTech] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    const { data } = await supabase.from('technologies').select('*').order('id', { ascending: true });
    if (data) {
      const grouped = data.reduce((acc, tech) => {
        if (!acc[tech.category]) acc[tech.category] = [];
        acc[tech.category].push(tech);
        return acc;
      }, {});
      setCategories(grouped);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories({ ...categories, [newCatName.trim()]: [] });
    setNewCatName('');
    setShowAddCat(false);
  };

  const handleDeleteCategory = async (cat) => {
    await supabase.from('technologies').delete().eq('category', cat);
    await fetchTechs();
    setDeleteConfirmCat(null);
  };

  const handleAddTech = async (cat) => {
    if (!newTech.name.trim()) return;
    await supabase.from('technologies').insert([{ name: newTech.name, proficiency: newTech.proficiency, category: cat }]);
    await fetchTechs();
    setNewTech({ name: '', proficiency: 80 });
    setShowAddTech(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteTech = async (cat, id) => {
    await supabase.from('technologies').delete().eq('id', id);
    await fetchTechs();
    setDeleteConfirmTech(null);
  };

  const startEditTech = (cat, tech) => {
    setEditingTech({ catKey: cat, id: tech.id });
    setEditForm({ name: tech.name, proficiency: tech.proficiency });
  };

  const saveEditTech = async () => {
    const { id } = editingTech;
    await supabase.from('technologies').update({ name: editForm.name, proficiency: editForm.proficiency }).eq('id', id);
    await fetchTechs();
    setEditingTech(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Technologies & Skills</h2>
          <p className="admin-page__subtitle">Manage tech stacks, organise categories, and adjust proficiencies.</p>
        </div>
        <div className="admin-page__actions">
          <button className="admin-btn admin-btn--outline" onClick={() => setShowAddCat(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
            New Category
          </button>
        </div>
      </div>

      {/* New Category input */}
      {showAddCat && (
        <div className="admin-card" style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Category name..."
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            autoFocus
            style={{ flex: 1 }}
          />
          <button className="admin-btn admin-btn--primary" onClick={handleAddCategory}>Create</button>
          <button className="admin-btn admin-btn--outline" onClick={() => { setShowAddCat(false); setNewCatName(''); }}>Cancel</button>
        </div>
      )}

      {/* Category columns */}
      <div className="admin-tech-columns">
        {Object.entries(categories).map(([cat, techs]) => (
          <div key={cat} className="admin-tech-column">
            {/* Column header */}
            <div className="admin-tech-column__header">
              <div className="admin-tech-column__header-left">
                <div className="admin-tech-column__icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {categoryIcons[cat] || 'category'}
                  </span>
                </div>
                <h3 className="admin-tech-column__title">{cat}</h3>
                <span className="admin-tech-column__count">{techs.length}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="admin-editor-btn" onClick={() => setDeleteConfirmCat(cat)} title="Delete category">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            </div>

            {/* Tech items */}
            <div className="admin-tech-column__list">
              {techs.map(tech => (
                <div key={tech.id} className="admin-tech-item">
                  {editingTech?.catKey === cat && editingTech?.id === tech.id ? (
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ marginBottom: 6, fontSize: 12 }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="range" min="0" max="100"
                          className="admin-range"
                          value={editForm.proficiency}
                          onChange={e => setEditForm({ ...editForm, proficiency: Number(e.target.value) })}
                          style={{ flex: 1 }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--clr-primary)', minWidth: 32 }}>{editForm.proficiency}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button className="admin-btn admin-btn--primary" style={{ fontSize: 11, padding: '4px 12px' }} onClick={saveEditTech}>Save</button>
                        <button className="admin-btn admin-btn--outline" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => setEditingTech(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined admin-tech-item__drag" style={{ fontSize: 18 }}>drag_indicator</span>
                      <div className="admin-tech-item__body">
                        <div className="admin-tech-item__name">{tech.name}</div>
                        <div className="admin-tech-item__bar-row">
                          <div className="admin-tech-item__bar">
                            <div className="admin-tech-item__bar-fill" style={{ width: `${tech.proficiency}%` }} />
                          </div>
                          <span className="admin-tech-item__pct">{tech.proficiency}%</span>
                        </div>
                      </div>
                      <div className="admin-tech-item__actions">
                        <button className="admin-editor-btn" onClick={() => startEditTech(cat, tech)} title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        </button>
                        <button className="admin-editor-btn" onClick={() => setDeleteConfirmTech({ cat, id: tech.id })} title="Delete">
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--clr-error)' }}>delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add tech to category */}
            {showAddTech === cat ? (
              <div className="admin-tech-column__add-form">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Technology name..."
                  value={newTech.name}
                  onChange={e => setNewTech({ ...newTech, name: e.target.value })}
                  autoFocus
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <label className="admin-label" style={{ minWidth: 80 }}>Level: {newTech.proficiency}%</label>
                  <input
                    type="range" min="0" max="100"
                    className="admin-range"
                    value={newTech.proficiency}
                    onChange={e => setNewTech({ ...newTech, proficiency: Number(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="admin-btn admin-btn--primary" style={{ fontSize: 12, flex: 1 }} onClick={() => handleAddTech(cat)}>Add</button>
                  <button className="admin-btn admin-btn--outline" style={{ fontSize: 12 }} onClick={() => { setShowAddTech(null); setNewTech({ name: '', proficiency: 80 }); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="admin-tech-column__add-btn" onClick={() => setShowAddTech(cat)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Add {cat} Skill
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete category confirm */}
      {deleteConfirmCat && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmCat(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete "{deleteConfirmCat}" category?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirmCat(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body">
              <p style={{ color: 'var(--clr-on-surface-variant)' }}>All technologies in this category will be deleted permanently.</p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setDeleteConfirmCat(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteCategory(deleteConfirmCat)}>Delete Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete tech confirm */}
      {deleteConfirmTech && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmTech(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete Technology?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirmTech(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body"><p style={{ color: 'var(--clr-on-surface-variant)' }}>This will permanently remove this technology.</p></div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setDeleteConfirmTech(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteTech(deleteConfirmTech.cat, deleteConfirmTech.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="admin-toast"><span className="material-symbols-outlined">check_circle</span>Technologies updated!</div>
      )}
    </div>
  );
}
