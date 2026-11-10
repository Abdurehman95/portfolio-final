import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';
import { supabase } from '../supabaseClient';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      setError('Please enter your email.');
      return;
    }
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) {
        // If Supabase auth user does not exist or credentials incorrect
        setError(authError.message || 'Invalid email or password.');
        setLoading(false);
      } else {
        localStorage.setItem('adminAuth', 'true');
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check connection.');
      setLoading(false);
    }
  };

  return (
    <div className="command-center-login">
      {/* Background grid overlay */}
      <div className="command-center-grid" />

      <div className="command-center-card">
        {/* Brand header */}
        <div className="command-brand">
          <div className="command-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="#38bdf8" strokeWidth="2"/>
              <path d="M12 11V15" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="command-brand-info">
            <h1 className="command-brand-title">
              Abdurex <span className="command-brand-title-accent">Port</span>
            </h1>
            <p className="command-brand-subtitle">COMMAND CENTER</p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="command-heading">Admin Sign In</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="command-form" noValidate>
          {error && (
            <div className="command-error-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error_outline</span>
              <span>{error}</span>
            </div>
          )}

          <div className="command-field">
            <label className="command-label" htmlFor="admin-email">Email</label>
            <div className="command-input-wrap">
              <span className="command-input-at">@</span>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                className="command-input"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="command-field">
            <label className="command-label" htmlFor="admin-password">Password</label>
            <div className="command-input-wrap">
              <span className="material-symbols-outlined command-input-icon">lock</span>
              <input
                id="admin-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className="command-input command-input--pwd"
                placeholder="•••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="command-eye-btn"
                onClick={() => setShowPwd(!showPwd)}
                tabIndex={-1}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined">
                  {showPwd ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="command-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="command-spinner" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Live Portfolio link */}
        <div className="command-footer">
          <Link to="/" className="command-back-link">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            <span>Back to Live Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
