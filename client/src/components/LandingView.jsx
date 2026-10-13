import React from 'react';
import { ArrowRight, Trophy, Globe, Award, ShieldCheck, Ticket, Users, Calendar, Activity } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function LandingView({ onNavigateToEvents, onOpenAuth, onSelectEventForDetails, featuredEvents }) {
  return (
    <div className="landing-page-wrapper">
      {/* Sección Hero */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            PORTAL OFICIAL DE TORNEOS DEPORTIVOS DE CARABOBO
          </div>
          
          <h1 className="hero-title">
            COMPITE. SIGUE. ALCANZA.
          </h1>
          <p className="hero-subtitle">
            Tu centro unificado para todos los torneos y eventos deportivos de Carabobo.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-hero" onClick={() => onOpenAuth('register')}>
              REGÍSTRATE AHORA
            </button>
            <button className="btn-secondary-hero" onClick={onNavigateToEvents}>
              VER PRÓXIMOS EVENTOS
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Decoración gráfica */}
        <div className="hero-decor-stripes"></div>
      </section>

      {/* Torneos Destacados y Últimos Resultados */}
      <section className="featured-results-section container">
        <div className="featured-left">
          <div className="section-header-compact">
            <h2>Torneos Destacados</h2>
            <button className="link-action" onClick={onNavigateToEvents}>Ver Todos</button>
          </div>

          <div className="featured-cards-grid">
            <div className="tournament-card">
              <div className="card-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80"
                  alt="Torneo Baloncesto Carabobo"
                />
                <span className="badge-tag">Baloncesto</span>
              </div>
              <div className="tournament-card-body">
                <h3>Torneo Máster Forum Valencia</h3>
                <p>Las mejores franquicias de baloncesto compitiendo por la copa estatal en Carabobo.</p>
                <button
                  className="btn-card-action"
                  onClick={() => onSelectEventForDetails(1)}
                >
                  VER DETALLES Y ENTRADAS
                </button>
              </div>
            </div>

            <div className="tournament-card">
              <div className="card-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                  alt="Copa Regional Fútbol"
                />
                <span className="badge-tag">Fútbol</span>
              </div>
              <div className="tournament-card-body">
                <h3>Copa Carabobo Misael Delgado</h3>
                <p>Encuentro regional de fútbol sala y campo con transmisión de resultados en vivo.</p>
                <button
                  className="btn-card-action"
                  onClick={() => onSelectEventForDetails(3)}
                >
                  VER DETALLES Y ENTRADAS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Últimos Resultados */}
        <div className="latest-results-panel">
          <div className="section-header-compact">
            <h2>Últimos Resultados</h2>
            <button className="link-action" onClick={onNavigateToEvents}>Ver Más &gt;</button>
          </div>

          <div className="results-list">
            <div className="result-item">
              <div className="result-teams">
                <div className="team-row">
                  <span className="team-badge-icon">🏀</span>
                  <span className="t-name">Uora A</span>
                  <span className="t-score highlight">84</span>
                </div>
                <div className="team-row">
                  <span className="team-badge-icon">🏀</span>
                  <span className="t-name">Uora B</span>
                  <span className="t-score">82</span>
                </div>
              </div>
              <span className="result-status live">En Vivo</span>
            </div>

            <div className="result-item">
              <div className="result-teams">
                <div className="team-row">
                  <span className="team-badge-icon">⚽</span>
                  <span className="t-name">Carabobo FC</span>
                  <span className="t-score highlight">2</span>
                </div>
                <div className="team-row">
                  <span className="team-badge-icon">⚽</span>
                  <span className="t-name">Deportivo Táchira</span>
                  <span className="t-score">1</span>
                </div>
              </div>
              <span className="result-status live">78 min</span>
            </div>

            <div className="result-item">
              <div className="result-teams">
                <div className="team-row">
                  <span className="team-badge-icon">🏊</span>
                  <span className="t-name">Tiburones Valencia</span>
                  <span className="t-score highlight">145</span>
                </div>
                <div className="team-row">
                  <span className="team-badge-icon">🏊</span>
                  <span className="t-name">Delfines Cabriales</span>
                  <span className="t-score">132</span>
                </div>
              </div>
              <span className="result-status final">Finalizado</span>
            </div>
          </div>

          <div className="banner-ad-box">
            <Ticket size={24} color="#F36F21" />
            <div>
              <p><strong>¿Deseas asistir a los eventos?</strong></p>
              <small>Reserva tus entradas con QR y paga por transferencia bancaria o pago móvil.</small>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="how-header">
            <h2>Cómo Funciona</h2>
            <p>Tu centro unificado para todos los torneos y disciplinas deportivas de Carabobo.</p>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <div className="how-icon-circle">
                <Globe size={32} color="#F36F21" />
              </div>
              <h3>Conéctate con el Deporte</h3>
              <p>
                Descubre el calendario unificado de torneos, campeonatos y copas deportivas en todo el estado Carabobo.
              </p>
            </div>

            <div className="how-card">
              <div className="how-icon-circle">
                <WhistleLogo size={36} showText={false} />
              </div>
              <h3>Sigue el Marcador en Vivo</h3>
              <p>
                Consulta jugada a jugada las estadísticas de tus equipos favoritos, goles, puntos y faltas en tiempo real.
              </p>
            </div>

            <div className="how-card">
              <div className="how-icon-circle">
                <Trophy size={32} color="#F36F21" />
              </div>
              <h3>Pase Digital Instantáneo</h3>
              <p>
                Reserva tus entradas, adjunta tu comprobante de pago y recibe tu pase digital con código QR para ingreso seguro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
