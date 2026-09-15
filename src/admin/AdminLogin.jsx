import React, { useState } from 'react';

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
    if (!form.email) { setError('Please enter your email.'); return; }
    if (!form.password) { setError('Please enter your password.'); return; }
    setLoading(true);
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message || 'Invalid credentials.');
      setLoading(false);
    } else {
      localStorage.setItem('adminAuth', 'true');
      window.location.reload();
    }
  };

  return (
    <div className="admin-login">
      {/* Background glows */}
      <div className="admin-login__glow admin-login__glow--1" />
      <div className="admin-login__glow admin-login__glow--2" />

      <div className="admin-login__card">
        {/* Brand */}
        <div className="admin-login__brand">
          <div className="admin-login__logo">
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="admin-login__title">Abdurex Port</h1>
            <p className="admin-login__subtitle">Admin Dashboard</p>
          </div>
        </div>

        <h2 className="admin-login__heading">Welcome back</h2>
        <p className="admin-login__desc">Sign in to manage your portfolio content.</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          {error && (
            <div className="admin-error-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="login-email">Email Address</label>
            <div className="admin-input-icon-wrap">
              <span className="material-symbols-outlined admin-input-icon">alternate_email</span>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="admin-input admin-input--icon"
                placeholder="admin@abdurex.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="login-password">Password</label>
            <div className="admin-input-icon-wrap">
              <span className="material-symbols-outlined admin-input-icon">lock</span>
              <input
                id="login-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className="admin-input admin-input--icon admin-input--icon-right"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="admin-input-icon-right"
                onClick={() => setShowPwd(!showPwd)}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {showPwd ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="admin-login__hint">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
          Use the credentials you configured in Supabase Authentication.
        </div>
      </div>
    </div>
  );
}
