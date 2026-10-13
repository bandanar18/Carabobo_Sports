import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, Trophy } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function AdminCreateEventModal({ onClose, onCreateEvent }) {
  const [sport, setSport] = useState('soccer');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [venue, setVenue] = useState('Forum de Valencia Pérez');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('07:00 PM');
  const [priceNormal, setPriceNormal] = useState(25);
  const [pricePrimeraFila, setPricePrimeraFila] = useState(50);
  const [priceVip, setPriceVip] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const venuesList = [
    'Forum de Valencia Pérez',
    'Polideportivo Misael Delgado',
    'Estadio José Bernardo Pérez',
    'Gimnasio Teodoro Gubaira',
    'Piscina Olímpica de Valencia',
    'Complejo Deportivo Bicentenario'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamA.trim() || !teamB.trim()) {
      alert('Por favor ingrese ambos equipos o competidores.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateEvent({
        sport,
        teamA,
        teamB,
        venue,
        date,
        time,
        priceNormal: Number(priceNormal),
        pricePrimeraFila: Number(pricePrimeraFila),
        priceVip: Number(priceVip)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="create-event-modal-card">
        <div className="create-modal-header">
          <div className="header-brand-wrap">
            <WhistleLogo size={24} customText="Carabobo Sports" />
            <h2>CREAR NUEVO EVENTO</h2>
          </div>
          <button className="close-btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-card-badge-header">
            <div className="badge-text-group">
              <WhistleLogo size={28} showText={false} />
              <div>
                <strong>Carabobo Sports</strong>
                <p>Gestión Oficial de Torneos</p>
              </div>
            </div>

            <div className="select-sport-col">
              <label>SELECCIONAR DEPORTE</label>
              <select
                value={sport}
                onChange={e => setSport(e.target.value)}
                className="select-field"
              >
                <option value="soccer">Fútbol</option>
                <option value="basketball">Baloncesto</option>
                <option value="baseball">Béisbol</option>
                <option value="volleyball">Voleibol</option>
                <option value="running">Atletismo</option>
                <option value="tennis">Tenis</option>
                <option value="swimming">Natación</option>
              </select>
            </div>
          </div>

          {/* EQUIPOS */}
          <div className="form-section-block">
            <div className="section-title-icon">
              <Trophy size={16} color="#F36F21" />
              <label>EQUIPOS O COMPETIDORES</label>
            </div>
            <div className="teams-input-row">
              <div className="team-input-cell">
                <label>EQUIPO A</label>
                <input
                  type="text"
                  placeholder="Ej. Trotamundos BC"
                  value={teamA}
                  onChange={e => setTeamA(e.target.value)}
                  required
                />
              </div>
              <div className="team-input-cell">
                <label>EQUIPO B</label>
                <input
                  type="text"
                  placeholder="Ej. Marineros de Carabobo"
                  value={teamB}
                  onChange={e => setTeamB(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* SEDE / LUGAR */}
          <div className="form-section-block">
            <div className="section-title-icon">
              <MapPin size={16} color="#F36F21" />
              <label>SEDE / LUGAR</label>
            </div>
            <select
              value={venue}
              onChange={e => setVenue(e.target.value)}
              className="full-select"
            >
              {venuesList.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* FECHA Y HORA */}
          <div className="form-section-block">
            <div className="date-time-grid">
              <div className="input-cell">
                <label>FECHA DEL EVENTO</label>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-cell">
                <label>HORA DEL EVENTO</label>
                <div className="input-with-icon">
                  <Clock size={16} />
                  <input
                    type="text"
                    placeholder="19:00 o 07:00 PM"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRECIOS DE ENTRADAS POR ZONA */}
          <div className="form-section-block">
            <label className="tier-section-title">PRECIOS DE ENTRADAS POR ZONA ($)</label>
            <div className="pricing-inputs-grid">
              <div className="pricing-cell">
                <label>Normal (General)</label>
                <div className="price-input-wrap">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    value={priceNormal}
                    onChange={e => setPriceNormal(e.target.value)}
                  />
                </div>
              </div>

              <div className="pricing-cell">
                <label>Primera Fila</label>
                <div className="price-input-wrap">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    value={pricePrimeraFila}
                    onChange={e => setPricePrimeraFila(e.target.value)}
                  />
                </div>
              </div>

              <div className="pricing-cell">
                <label>VIP</label>
                <div className="price-input-wrap">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    value={priceVip}
                    onChange={e => setPriceVip(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN DE PUBLICACIÓN */}
          <button
            type="submit"
            className="btn-publish-event"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR EVENTO'}
          </button>
        </form>
      </div>
    </div>
  );
}
