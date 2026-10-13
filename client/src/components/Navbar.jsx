import React, { useState } from 'react';
import { Search, Bell, User, Shield, ChevronDown, RefreshCw, LogOut } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function Navbar({
  currentView,
  setCurrentView,
  activeUser,
  users,
  onSwitchUser,
  onOpenAuth,
  onResetDemo
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const isAdmin = activeUser?.role === 'ADMIN';

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
          <WhistleLogo size={32} customText="Carabobo Sports" />
          <span className="brand-subtag">Oficial</span>
        </div>

        <nav className="navbar-links">
          <button
            className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            Inicio
          </button>
          <button
            className={`nav-link ${currentView === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentView('events')}
          >
            Eventos y En Vivo
          </button>
          <button
            className={`nav-link ${currentView === 'my-bookings' ? 'active' : ''}`}
            onClick={() => setCurrentView('my-bookings')}
          >
            Mis Reservas
          </button>
          
          <button
            className={`nav-link admin-pill ${currentView.startsWith('admin') ? 'active' : ''}`}
            onClick={() => setCurrentView('admin-dashboard')}
          >
            <Shield size={14} style={{ marginRight: '5px' }} />
            Portal Admin
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        {/* Búsqueda */}
        <div className="nav-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar torneos, equipos..."
            onClick={() => { if (currentView !== 'events') setCurrentView('events'); }}
          />
        </div>

        {/* Notificaciones */}
        <button
          className="icon-btn"
          title="Notificaciones"
          onClick={() => setShowNotificationToast(!showNotificationToast)}
        >
          <Bell size={18} />
          <span className="badge-count">2</span>
        </button>

        {showNotificationToast && (
          <div className="notification-dropdown">
            <h4>Notificaciones Recientes</h4>
            <div className="notif-item">
              <span className="notif-dot green"></span>
              <div>
                <p><strong>Pase Digital Emitido</strong></p>
                <small>Tu reserva para Uora A vs Uora B ha sido aprobada.</small>
              </div>
            </div>
            <div className="notif-item">
              <span className="notif-dot orange"></span>
              <div>
                <p><strong>Partido en Vivo</strong></p>
                <small>Carabobo FC vs Táchira en 2do tiempo.</small>
              </div>
            </div>
          </div>
        )}

        {/* Conmutador de Demo y Perfil */}
        <div className="user-profile-menu">
          <button
            className="user-badge-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <img
              src={activeUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={activeUser?.name}
              className="user-avatar"
            />
            <div className="user-info-text">
              <span className="user-name">{activeUser?.name || 'Invitado'}</span>
              <span className="user-role-badge">{isAdmin ? 'ADMINISTRADOR' : 'AFICIONADO'}</span>
            </div>
            <ChevronDown size={14} />
          </button>

          {showUserDropdown && (
            <div className="user-dropdown-card">
              <div className="dropdown-header">
                <small>CONMUTADOR RÁPIDO DE ROLES (DEMO)</small>
              </div>
              <div className="user-list-options">
                {users.map(u => (
                  <button
                    key={u.id}
                    className={`dropdown-user-option ${u.id === activeUser?.id ? 'active' : ''}`}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setShowUserDropdown(false);
                      if (u.role === 'ADMIN') {
                        setCurrentView('admin-dashboard');
                      }
                    }}
                  >
                    <img src={u.avatar} alt={u.name} />
                    <div style={{ textAlign: 'left' }}>
                      <p className="u-name">{u.name}</p>
                      <small className="u-sub">{u.username} • {u.role === 'ADMIN' ? 'Administrador' : 'Aficionado'}</small>
                    </div>
                  </button>
                ))}
              </div>

              <div className="dropdown-divider"></div>
              
              <button
                className="dropdown-action-btn"
                onClick={() => {
                  onResetDemo();
                  setShowUserDropdown(false);
                }}
              >
                <RefreshCw size={14} /> Restablecer Datos de Demo
              </button>

              <button
                className="dropdown-action-btn danger"
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenAuth('login');
                }}
              >
                <LogOut size={14} /> Cambiar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
