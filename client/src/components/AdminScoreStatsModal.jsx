import React, { useState } from 'react';
import { X, Trophy, Save, Edit3, Activity } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function AdminScoreStatsModal({ event, onClose, onSaveScores }) {
  const [scoreA, setScoreA] = useState(event.scoreA || 0);
  const [scoreB, setScoreB] = useState(event.scoreB || 0);
  const [possessionA, setPossessionA] = useState(event.teamStats?.possessionA || 50);
  const [gameTime, setGameTime] = useState(event.gameTime || 'Finalizado');
  const [players, setPlayers] = useState(
    event.playerStats && event.playerStats.length > 0
      ? event.playerStats.map(p => ({ ...p }))
      : [
          { id: '1', name: 'Player A', position: 'Base', points: 12, assists: 3, fouls: 1 },
          { id: '2', name: 'Player B', position: 'Escolta', points: 10, assists: 4, fouls: 0 },
          { id: '3', name: 'Player C', position: 'Alero', points: 10, assists: 5, fouls: 0 }
        ]
  );
  const [isSaving, setIsSaving] = useState(false);

  const handlePlayerChange = (index, field, value) => {
    setPlayers(players.map((p, i) => (i === index ? { ...p, [field]: Number(value) } : p)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveScores(event.id, {
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        possessionA: Number(possessionA),
        gameTime,
        playerStats: players
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="score-stats-modal-card">
        {/* Header */}
        <div className="modal-top-bar">
          <div className="brand-group">
            <WhistleLogo size={22} />
            <div>
              <h3>Carga de Resultados y Estadísticas (Admin)</h3>
              <p>Actualiza el resultado y estadísticas en tiempo real</p>
            </div>
          </div>
          <button className="close-btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="score-stats-form">
          {/* Match Identifier */}
          <div className="match-identifier-badge">
            <span className="sport-tag">{event.sport.toUpperCase()}</span>
            <h4>{event.teamA} vs {event.teamB}</h4>
            <small>{event.venue} • {event.date}</small>
          </div>

          {/* ACTUALIZAR EL PARTIDO */}
          <div className="form-section-block">
            <label className="section-label">ACTUALIZAR EL PARTIDO (MARCADOR)</label>
            <div className="score-inputs-pair">
              <div className="team-score-input-col">
                <label>{event.teamA}</label>
                <div className="input-with-pencil">
                  <input
                    type="number"
                    min="0"
                    value={scoreA}
                    onChange={e => setScoreA(e.target.value)}
                    required
                  />
                  <Edit3 size={15} />
                </div>
              </div>

              <span className="vs-symbol">-</span>

              <div className="team-score-input-col">
                <label>{event.teamB}</label>
                <div className="input-with-pencil">
                  <input
                    type="number"
                    min="0"
                    value={scoreB}
                    onChange={e => setScoreB(e.target.value)}
                    required
                  />
                  <Edit3 size={15} />
                </div>
              </div>
            </div>
          </div>

          {/* POSSESSION & GAME TIME */}
          <div className="form-section-block">
            <label className="section-label">POSESIÓN Y TIEMPO DE JUEGO</label>
            <div className="possession-inputs-row">
              <div className="possession-cell">
                <label>Posesión {event.teamA}: <strong>{possessionA}%</strong></label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={possessionA}
                  onChange={e => setPossessionA(e.target.value)}
                />
              </div>
              <div className="possession-cell">
                <label>Tiempo / Estado:</label>
                <input
                  type="text"
                  placeholder="ej. 4to Cuarto - 02:45 / Finalizado"
                  value={gameTime}
                  onChange={e => setGameTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ACTUALIZAR JUGADORES */}
          <div className="form-section-block">
            <label className="section-label">ACTUALIZAR ESTADÍSTICAS DE JUGADORES</label>
            <div className="players-editor-table-wrapper">
              <table className="players-editor-table">
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Posición</th>
                    <th>Puntos</th>
                    <th>Asistencias</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.position || 'Alero'}</td>
                      <td>
                        <input
                          type="number"
                          className="table-num-input"
                          value={p.points}
                          onChange={e => handlePlayerChange(idx, 'points', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="table-num-input"
                          value={p.assists}
                          onChange={e => handlePlayerChange(idx, 'assists', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="modal-actions-col">
            <button
              type="submit"
              className="btn-save-score"
              disabled={isSaving}
            >
              <Save size={16} /> {isSaving ? 'GUARDANDO...' : 'GUARDAR MARCADOR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
