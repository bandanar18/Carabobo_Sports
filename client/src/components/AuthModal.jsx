import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Shield } from 'lucide-react';
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

        {/* Pestañas de Modo */}
        <div className="auth-mode-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMessage(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMessage(''); }}
          >
            Registrarse
          </button>
          <button
            className={`auth-tab admin-badge ${mode === 'admin' ? 'active' : ''}`}
            onClick={() => { setMode('admin'); setErrorMessage(''); }}
          >
            <Shield size={12} /> Portal Admin
          </button>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            {errorMessage}
          </div>
        )}

        {/* 1. FORMULARIO DE INICIO DE SESIÓN */}
        {mode === 'login' && (
          <form onSubmit={handleUserLogin} className="auth-form-body">
            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} customText="Carabobo Sports" />
            </div>

            <div className="auth-field-group">
              <label>CORREO ELECTRÓNICO</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>CONTRASEÑA</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
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
                <span>Recordarme</span>
              </label>
              <a href="#forgot" className="forgot-link" onClick={e => { e.preventDefault(); alert('Para restablecer su contraseña contacte a soporte@carabobosports.com'); }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            </button>

            <div className="auth-switch-prompt">
              <span>¿No tienes una cuenta? </span>
              <button
                type="button"
                className="link-create-account"
                onClick={() => setMode('register')}
              >
                CREAR UNA CUENTA
              </button>
            </div>
          </form>
        )}

        {/* 2. FORMULARIO DE REGISTRO */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form-body">
            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} customText="Carabobo Sports" />
            </div>

            <div className="auth-field-group">
              <label>NOMBRE COMPLETO</label>
              <input
                type="text"
                placeholder="Nombre y Apellido"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>CORREO ELECTRÓNICO</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>NÚMERO DE TELÉFONO</label>
              <input
                type="tel"
                placeholder="+58 412 1234567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="auth-field-group">
              <label>CONTRASEÑA</label>
              <input
                type="password"
                placeholder="Crea una contraseña segura"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>CONFIRMAR CONTRASEÑA</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
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
              <span>Acepto los Términos y Condiciones</span>
            </label>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>

            <div className="auth-switch-prompt">
              <span>¿Ya tienes una cuenta? </span>
              <button
                type="button"
                className="link-create-account"
                onClick={() => setMode('login')}
              >
                INICIAR SESIÓN
              </button>
            </div>
          </form>
        )}

        {/* 3. PORTAL ADMINISTRATIVO */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="auth-form-body admin-portal-body">
            <div className="admin-portal-header">
              <h3>PORTAL ADMINISTRATIVO</h3>
            </div>

            <div className="auth-logo-center">
              <WhistleLogo size={42} showText={true} dark={true} customText="Carabobo Sports" />
            </div>

            <div className="auth-field-group">
              <label>CORREO / ID ADMINISTRADOR</label>
              <input
                type="text"
                placeholder="admin@carabobosports.com"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>CONTRASEÑA</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña de administrador"
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
              {isLoading ? 'ACCEDIENDO...' : 'ACCESO SEGURO'}
            </button>

            <div className="admin-access-warning">
              <Shield size={14} />
              <small>Acceso Restringido a Personal Autorizado de Carabobo Sports</small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
