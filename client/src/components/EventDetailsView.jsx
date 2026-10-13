import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Calendar, Ticket, Trophy, Activity, Shield } from 'lucide-react';

export default function EventDetailsView({ event, onBack, onOpenBookModal }) {
  if (!event) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <p>Seleccione un evento para ver sus estadísticas.</p>
        <button className="btn-primary" onClick={onBack}>Volver a Eventos</button>
      </div>
    );
  }

  const possessionA = event.teamStats?.possessionA || 50;
  const possessionB = 100 - possessionA;
  const shotsA = event.teamStats?.shotsOnTargetA || 16;
  const shotsB = event.teamStats?.shotsOnTargetB || 11;
  const foulsA = event.teamStats?.foulsA || 6;
  const foulsB = event.teamStats?.foulsB || 9;

  // Cálculo de circunferencia para el gráfico donut
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (possessionA / 100) * circumference;

  const players = event.playerStats && event.playerStats.length > 0 ? event.playerStats : [
    { id: '1', name: 'Jugador A', team: event.teamA, position: 'Base / Alero', points: 13, assists: 1, goals: 3, yellowCards: 1, redCards: 0, fouls: 2 },
    { id: '2', name: 'Jugador B', team: event.teamA, position: 'Escolta', points: 10, assists: 1, goals: 2, yellowCards: 0, redCards: 0, fouls: 1 },
    { id: '3', name: 'Jugador C', team: event.teamA, position: 'Alero', points: 8, assists: 0, goals: 0, yellowCards: 0, redCards: 0, fouls: 3 },
    { id: '4', name: 'Jugador D', team: event.teamB, position: 'Pívot', points: 5, assists: 0, goals: 0, yellowCards: 0, redCards: 0, fouls: 2 },
    { id: '5', name: 'Jugador E', team: event.teamB, position: 'Base', points: 3, assists: 0, goals: 0, yellowCards: 0, redCards: 0, fouls: 4 }
  ];

  return (
    <div className="event-details-container container">
      <button className="back-link-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Volver a Lista de Eventos
      </button>

      {/* Banner de Marcador */}
      <div className="scoreboard-banner-card">
        <div className="scoreboard-header-tag">
          <span className="live-dot"></span>
          <span>MARCADOR EN VIVO • TIEMPO REAL</span>
        </div>

        <div className="scoreboard-matchup">
          <div className="team-side">
            <div className="team-emblem-large">{event.teamA.charAt(0)}</div>
            <h2>{event.teamA}</h2>
          </div>

          <div className="score-center-display">
            <span className="score-number-big">{event.scoreA}</span>
            <span className="score-colon">:</span>
            <span className="score-number-big">{event.scoreB}</span>
            <span className="game-status-tag">{event.gameTime || 'En Vivo'}</span>
          </div>

          <div className="team-side">
            <div className="team-emblem-large secondary">{event.teamB.charAt(0)}</div>
            <h2>{event.teamB}</h2>
          </div>
        </div>

        <div className="scoreboard-footer-meta">
          <span><MapPin size={14} /> Sede: {event.venue}</span>
          <span><Calendar size={14} /> {event.date} • {event.time}</span>
          <span><Trophy size={14} /> Torneo Oficial Carabobo Sports</span>
        </div>

        <div className="scoreboard-cta-box">
          <button className="btn-reserve-primary" onClick={() => onOpenBookModal(event)}>
            <Ticket size={18} /> RESERVAR ENTRADA PARA ESTE ENCUENTRO
          </button>
        </div>
      </div>

      {/* Sección de Estadísticas */}
      <div className="stats-dashboard-grid">
        {/* ESTADÍSTICAS DEL PARTIDO */}
        <div className="stats-box-card">
          <div className="stats-box-header">
            <h3>ESTADÍSTICAS DEL PARTIDO</h3>
            <span className="sport-badge-tag">{event.sport.toUpperCase()}</span>
          </div>

          {/* Donut de Posesión */}
          <div className="possession-chart-block">
            <h4>Posesión de Balón</h4>
            <div className="donut-chart-wrapper">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#0B1E36"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#F36F21"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="donut-legend">
                <div className="legend-item">
                  <span className="dot orange"></span>
                  <strong>{event.teamA}: {possessionA}%</strong>
                </div>
                <div className="legend-item">
                  <span className="dot navy"></span>
                  <strong>{event.teamB}: {possessionB}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Barras Comparativas */}
          <div className="comparative-stat-row">
            <div className="stat-label-bar">
              <span>Tiros al Arco / Intentos de Campo</span>
              <div className="bar-numbers">
                <strong>{shotsA}</strong> vs <strong>{shotsB}</strong>
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className="bar-fill orange"
                style={{ width: `${(shotsA / (shotsA + shotsB || 1)) * 100}%` }}
              ></div>
              <div
                className="bar-fill navy"
                style={{ width: `${(shotsB / (shotsA + shotsB || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="comparative-stat-row">
            <div className="stat-label-bar">
              <span>Faltas Cometidas</span>
              <div className="bar-numbers">
                <strong>{foulsA}</strong> vs <strong>{foulsB}</strong>
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className="bar-fill orange"
                style={{ width: `${(foulsA / (foulsA + foulsB || 1)) * 100}%` }}
              ></div>
              <div
                className="bar-fill navy"
                style={{ width: `${(foulsB / (foulsA + foulsB || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS DE JUGADORES */}
        <div className="stats-box-card wide">
          <div className="stats-box-header">
            <h3>ESTADÍSTICAS DE JUGADORES</h3>
            <div className="table-controls-inline">
              <span className="control-label">Rendimiento Individual</span>
            </div>
          </div>

          <div className="player-stats-table-wrapper">
            <table className="stats-custom-table">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Posición</th>
                  <th>Puntos</th>
                  <th>Asist.</th>
                  <th>Goles / Cestas</th>
                  <th>Amarillas</th>
                  <th>Rojas</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="player-name-cell">
                        <span className="player-avatar-circle">{p.name.charAt(p.name.length - 1)}</span>
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td><span className="pos-badge">{p.position}</span></td>
                    <td><strong>{p.points}</strong></td>
                    <td>{p.assists || 0}</td>
                    <td>{p.goals || p.points || 0}</td>
                    <td>{p.yellowCards || 0}</td>
                    <td>{p.redCards || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
