import React, { useState } from 'react';
import { Play, Calendar, Clock, MapPin, Ticket, BarChart3, Search, ChevronRight } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function UserDashboardView({
  events,
  selectedSport,
  setSelectedSport,
  onOpenBookModal,
  onSelectEventDetails
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const sportsList = [
    { id: 'all', name: 'Todos', icon: '🏆' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'soccer', name: 'Football', icon: '⚽' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'running', name: 'Running', icon: '🏃' },
    { id: 'swimming', name: 'Swimming', icon: '🏊' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' }
  ];

  // Filter events
  const filteredEvents = events.filter(evt => {
    const matchesSport = selectedSport === 'all' || evt.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchesSearch = !searchTerm || 
      evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const liveEvents = filteredEvents.filter(e => e.isLive || e.status === 'En Curso');
  const upcomingEvents = filteredEvents.filter(e => !e.isLive && !['Finalizado', 'Cancelado'].includes(e.status));

  return (
    <div className="event-dashboard-container container">
      {/* Sidebar / Top Sports Filter Tabs */}
      <div className="dashboard-layout">
        <aside className="sports-sidebar">
          <div className="sidebar-title">
            <span>DISCIPLINAS</span>
          </div>
          <div className="sports-pill-list">
            {sportsList.map(sport => (
              <button
                key={sport.id}
                className={`sport-pill-btn ${selectedSport === sport.id ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport.id)}
              >
                <span className="sport-emoji">{sport.icon}</span>
                <span className="sport-name">{sport.name}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-promo-card">
            <WhistleLogo size={28} showText={false} />
            <p><strong>CaraboboSports</strong></p>
            <small>Plataforma unificada de gestión deportiva regional.</small>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-header">
            <div>
              <h1 className="content-heading">UPCOMING & LIVE EVENTS</h1>
              <p className="content-subheading">Sigue los partidos de Carabobo y asegura tu entrada digital</p>
            </div>

            <div className="search-filter-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar por equipo o sede..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION: LIVE NOW */}
          <section className="events-sub-section">
            <div className="section-title-row">
              <div className="live-header-pill">
                <span className="live-dot"></span>
                <span>LIVE NOW</span>
              </div>
            </div>

            {liveEvents.length === 0 ? (
              <div className="empty-state-card">
                <p>No hay eventos transmitiéndose en vivo en esta disciplina.</p>
              </div>
            ) : (
              <div className="live-cards-list">
                {liveEvents.map(event => (
                  <div key={event.id} className="live-match-banner-card">
                    <div className="live-banner-left">
                      <div className="live-badge-tag">
                        <span className="live-dot"></span>
                        LIVE NOW
                      </div>

                      <div className="live-teams-display">
                        <div className="team-col">
                          <div className="team-avatar-emblem">
                            <span className="emblem-text">{event.teamA.charAt(0)}</span>
                          </div>
                          <h4>{event.teamA}</h4>
                        </div>

                        <div className="score-live-box">
                          <span className="score-digits">{event.scoreA} - {event.scoreB}</span>
                          <span className="game-clock-badge">
                            <Clock size={12} />
                            {event.gameTime || 'En Vivo'}
                          </span>
                        </div>

                        <div className="team-col">
                          <div className="team-avatar-emblem secondary">
                            <span className="emblem-text">{event.teamB.charAt(0)}</span>
                          </div>
                          <h4>{event.teamB}</h4>
                        </div>
                      </div>

                      <div className="match-meta-line">
                        <span className="meta-item"><MapPin size={14} /> {event.venue}</span>
                        <span className="meta-item"><Calendar size={14} /> {event.date}</span>
                      </div>

                      <div className="live-actions-row">
                        <button
                          className="btn-details-outline"
                          onClick={() => onSelectEventDetails(event.id)}
                        >
                          <BarChart3 size={16} /> VER DETALLES
                        </button>
                        <button
                          className="btn-reserve-primary"
                          onClick={() => onOpenBookModal(event)}
                        >
                          <Ticket size={16} /> RESERVAR ENTRADA
                        </button>
                      </div>
                    </div>

                    <div className="live-banner-right-art">
                      <WhistleLogo size={70} showText={false} />
                      <span className="art-subtitle">{event.sport.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION: UPCOMING EVENTS */}
          <section className="events-sub-section">
            <h2 className="section-title">UPCOMING EVENTS</h2>

            {upcomingEvents.length === 0 ? (
              <div className="empty-state-card">
                <p>No hay eventos programados en esta categoría actualmente.</p>
              </div>
            ) : (
              <div className="upcoming-cards-grid">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="upcoming-match-card">
                    <div className="card-top-tag">
                      <span className="scheduled-label">SCHEDULED</span>
                      <span className="scheduled-date">{event.date}</span>
                    </div>

                    <div className="card-clock-row">
                      <Clock size={16} color="#F36F21" />
                      <span className="card-time-text">{event.time}</span>
                    </div>

                    <div className="card-matchup-row">
                      <div className="versus-team">
                        <div className="small-emblem">{event.teamA.charAt(0)}</div>
                        <p>{event.teamA}</p>
                      </div>
                      <span className="vs-divider">VS</span>
                      <div className="versus-team">
                        <div className="small-emblem secondary">{event.teamB.charAt(0)}</div>
                        <p>{event.teamB}</p>
                      </div>
                    </div>

                    <div className="card-venue-row">
                      <MapPin size={14} />
                      <small>{event.venue}</small>
                    </div>

                    <div className="card-pricing-hint">
                      <span>Desde <strong>${event.prices.normal}</strong></span>
                      <span className="tier-pill">VIP ${event.prices.vip}</span>
                    </div>

                    <div className="card-actions-grid">
                      <button
                        className="btn-details-outline small"
                        onClick={() => onSelectEventDetails(event.id)}
                      >
                        VER DETALLES
                      </button>
                      <button
                        className="btn-reserve-primary small"
                        onClick={() => onOpenBookModal(event)}
                      >
                        RESERVAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
