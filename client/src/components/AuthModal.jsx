import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Shield, User, Mail, Phone } from 'lucide-react';
import WhistleLogo from './WhistleLogo';
import { api } from '../services/api';

export default function AuthModal({ initialMode = 'login', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('juan.perez@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Admin state
  const [adminId, setAdminId] = useState('admin@carabobosports.com');
  const [adminPassword, setAdminPassword] = useState('admin2026');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Ejecuta la llamada al backend y entrega el usuario autenticado a App
  const submitAuth = async (request) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await request();
      if (!res.success) {
        setErrorMessage(res.message || 'No se pudo completar la operación.');
        return;
      }
      await onLoginSuccess(res.user);
      onClose();
    } catch {
      setErrorMessage('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = (e) => {
    e.preventDefault();
    submitAuth(() => api.login({ email, password }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Debe aceptar los términos y condiciones.');
      return;
    }
    submitAuth(() => api.register({ name: fullName, email: regEmail, phone, password: regPassword }));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    submitAuth(() => api.adminLogin({ email: adminId, password: adminPassword }));
  };

  return (
    <div className="modal-backdrop">
      <div className={`auth-modal-card ${mode === 'admin' ? 'admin-theme' : ''}`}>
        <button className="auth-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Mode Switcher Tabs */}
        <div className="auth-mode-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMessage(''); }}
          >
            User Login
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMessage(''); }}
          >
            User Registration
          </button>
          <button
            className={`auth-tab admin-badge ${mode === 'admin' ? 'active' : ''}`}
            onClick={() => { setMode('admin'); setErrorMessage(''); }}
          >
            <Shield size={12} /> Admin Login
          </button>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            {errorMessage}
          </div>
        )}

        {/* 1. USER LOGIN FORM (Screenshot 185730) */}
        {mode === 'login' && (
          <form onSubmit={handleUserLogin} className="auth-form-body">
            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} />
            </div>

            <div className="auth-field-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <a href="#forgot" className="forgot-link" onClick={e => { e.preventDefault(); alert('Para restablecer su contraseña contacte a soporte@carabobosports.com'); }}>
                FORGOT PASSWORD?
              </a>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'INICIANDO...' : 'LOG IN'}
            </button>

            <div className="auth-switch-prompt">
              <span>NEW HERE? </span>
              <button
                type="button"
                className="link-create-account"
                onClick={() => setMode('register')}
              >
                CREATE AN ACCOUNT
              </button>
            </div>
          </form>
        )}

        {/* 2. USER REGISTRATION FORM (Screenshot 185730) */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form-body">
            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} />
            </div>

            <div className="auth-field-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Email Address"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>PHONE NUMBER</label>
              <input
                type="tel"
                placeholder="Phone Number (+58 412...)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="auth-field-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <label className="checkbox-label terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                required
              />
              <span>I agree to Terms & Conditions</span>
            </label>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'CREANDO CUENTA...' : 'CREATE ACCOUNT'}
            </button>

            <div className="auth-switch-prompt">
              <span>ALREADY HAVE AN ACCOUNT? </span>
              <button
                type="button"
                className="link-create-account"
                onClick={() => setMode('login')}
              >
                LOG IN
              </button>
            </div>
          </form>
        )}

        {/* 3. ADMIN LOGIN (Screenshot 185730) */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="auth-form-body admin-portal-body">
            <div className="admin-portal-header">
              <h3>ADMIN PORTAL</h3>
            </div>

            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} />
            </div>

            <div className="auth-field-group">
              <label>EMAIL / ADMIN ID</label>
              <input
                type="text"
                placeholder="Email or Admin ID"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Lock size={16} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth-submit admin" disabled={isLoading}>
              {isLoading ? 'ACCEDIENDO...' : 'SECURE LOG IN'}
            </button>

            <div className="admin-access-warning">
              <Shield size={14} />
              <small>Access Restricted to Authorized Personnel</small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
