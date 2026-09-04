import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const initialMessages = [
  {
    id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Website Development',
    message: `Hello Abdurehman,\n\nI saw your portfolio and would like to discuss a potential collaboration on a new enterprise dashboard project we are launching next quarter. We are specifically looking for someone with your expertise in designing high-fidelity, high-performance interfaces.\n\nOur current tech stack involves heavily customized Tailwind CSS and advanced charting libraries, and we need a design system that feels like a true "command center" — minimal, glassy, and utilizing high-contrast neon accents on deep dark backgrounds.\n\nKey Requirements:\n• Design a 12-column grid system layout.\n• Establish a comprehensive design token system.\n• Create modular, reusable UI components.\n\nPlease let me know if you have availability next week for a 30-minute introductory call.\n\nBest regards,\nJohn Doe\nProduct Manager | Nexus Tech`,
    isRead: false, time: '2h ago', initials: 'JD', color: 'primary',
  },
  {
    id: 2, name: 'Sara Ahmed', email: 'sara@example.com', subject: 'Collaboration',
    message: `Hi Abdurehman,\n\nAre you available for a quick sync next week regarding the new project? We'd love to discuss the scope and potential collaboration.\n\nBest,\nSara`,
    isRead: true, time: 'Yesterday', initials: 'SA', color: 'secondary',
  },
  {
    id: 3, name: 'Mike Kline', email: 'mike@example.com', subject: 'Server Migration Status',
    message: `Hi,\n\nThe migration completed successfully with 0 downtime. All services are running as expected. Let me know if you need the full report.\n\nThanks,\nMike`,
    isRead: true, time: 'Oct 12', initials: 'MK', color: 'tertiary',
  },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  const filtered = messages
    .filter(m => {
      if (filter === 'unread') return !m.is_read;
      if (filter === 'read') return m.is_read;
      return true;
    })
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
    );

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      await fetchMessages();
    }
  };

  const handleMarkRead = async (id) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    await fetchMessages();
    if (selected?.id === id) setSelected({ ...selected, is_read: true });
  };

  const handleMarkUnread = async (id) => {
    await supabase.from('messages').update({ is_read: false }).eq('id', id);
    await fetchMessages();
    if (selected?.id === id) setSelected({ ...selected, is_read: false });
  };

  const handleDelete = async (id) => {
    await supabase.from('messages').delete().eq('id', id);
    const remaining = messages.filter(m => m.id !== id);
    setMessages(remaining);
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(remaining[0] || null);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selected) return;
    window.open(`mailto:${selected.email}?subject=Re: ${selected.subject}&body=${encodeURIComponent(replyText)}`);
    setReplyText('');
  };

  return (
    <div className="admin-page admin-page--inbox">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">
            Messages Inbox
            {unreadCount > 0 && (
              <span className="admin-unread-badge">{unreadCount}</span>
            )}
          </h2>
          <p className="admin-page__subtitle">Read and respond to contact form messages.</p>
        </div>
      </div>

      <div className="admin-inbox-layout">
        {/* Left pane: message list */}
        <div className="admin-inbox-list">
          <div className="admin-inbox-list__header">
            <h3 className="admin-inbox-list__title">Inbox</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="admin-editor-btn" title="Filter">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>filter_list</span>
              </button>
              <button className="admin-editor-btn" title="More options">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="admin-inbox-filters">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                className={`admin-filter-tab${filter === f ? ' admin-filter-tab--active' : ''}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: 11 }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding: '0 12px 8px' }}>
            <div className="admin-topbar__search">
              <span className="material-symbols-outlined admin-topbar__search-icon" style={{ fontSize: 16 }}>search</span>
              <input
                type="text"
                placeholder="Search messages..."
                className="admin-topbar__search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-inbox-list__items">
            {filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--clr-on-surface-variant)', fontSize: 13 }}>
                No messages found
              </div>
            ) : filtered.map(msg => (
              <div
                key={msg.id}
                className={`admin-msg-item${selected?.id === msg.id ? ' admin-msg-item--active' : ''}${!msg.is_read ? ' admin-msg-item--unread' : ''}`}
                onClick={() => handleSelect(msg)}
              >
                {!msg.is_read && <div className="admin-msg-item__dot" />}
                <div className="admin-msg-item__avatar" style={{ color: `var(--clr-${msg.color})` }}>
                  {msg.initials}
                </div>
                <div className="admin-msg-item__body">
                  <div className="admin-msg-item__top">
                    <span className={`admin-msg-item__name${!msg.is_read ? ' admin-msg-item__name--bold' : ''}`}>{msg.name}</span>
                    <span className={`admin-msg-item__time${!msg.is_read ? ' admin-msg-item__time--unread' : ''}`}>{msg.time}</span>
                  </div>
                  <div className="admin-msg-item__subject">{msg.subject}</div>
                  <div className="admin-msg-item__preview">{msg.message.substring(0, 80)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right pane: message detail */}
        <div className="admin-inbox-detail">
          {selected ? (
            <>
              <div className="admin-glow-orb" />
              {/* Detail header */}
              <div className="admin-inbox-detail__header">
                <div className="admin-inbox-detail__header-top">
                  <h2 className="admin-inbox-detail__subject">{selected.subject}</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="admin-icon-action"
                      title={selected.is_read ? 'Mark unread' : 'Mark read'}
                      onClick={() => selected.is_read ? handleMarkUnread(selected.id) : handleMarkRead(selected.id)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        {selected.is_read ? 'mark_email_unread' : 'mark_email_read'}
                      </span>
                    </button>
                    <button className="admin-icon-action admin-icon-action--danger" title="Delete" onClick={() => setDeleteConfirm(selected.id)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                    </button>
                  </div>
                </div>
                <div className="admin-inbox-detail__sender">
                  <div className="admin-inbox-detail__avatar" style={{ color: `var(--clr-${selected.color})` }}>
                    {selected.initials}
                  </div>
                  <div>
                    <div className="admin-inbox-detail__sender-name">
                      {selected.name}
                      <span className="admin-inbox-detail__sender-email">&lt;{selected.email}&gt;</span>
                    </div>
                    <div className="admin-inbox-detail__sender-to">To: Abdurehman • {selected.time}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      className="admin-btn admin-btn--outline"
                      style={{ fontSize: 12 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>reply</span>
                      Reply
                    </a>
                  </div>
                </div>
              </div>

              {/* Message body */}
              <div className="admin-inbox-detail__body">
                {selected.message.split('\n').map((line, i) => (
                  line.startsWith('•') ? (
                    <li key={i} style={{ color: 'var(--clr-on-surface-variant)', marginLeft: 16, marginBottom: 4 }}>{line.slice(1).trim()}</li>
                  ) : line.trim() === '' ? (
                    <div key={i} style={{ height: 12 }} />
                  ) : (
                    <p key={i}>{line}</p>
                  )
                ))}
              </div>

              {/* Quick reply */}
              <div className="admin-inbox-detail__reply">
                <div className="admin-inbox-detail__reply-avatar">A</div>
                <div className="admin-inbox-detail__reply-input-wrap">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Type a quick reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                    style={{ paddingRight: 40 }}
                  />
                  <button className="admin-inbox-detail__send" onClick={handleReply} title="Send">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="admin-inbox-detail__empty">
              <span className="material-symbols-outlined" style={{ fontSize: 56, opacity: 0.2 }}>mail</span>
              <p>Select a message to read it</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: 'var(--clr-error)' }}>Delete Message?</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="admin-modal__body"><p style={{ color: 'var(--clr-on-surface-variant)' }}>This message will be permanently deleted.</p></div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
