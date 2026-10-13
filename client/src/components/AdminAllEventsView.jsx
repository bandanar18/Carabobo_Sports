import React, { useState } from 'react';
import { Search, ArrowLeft, Filter } from 'lucide-react';

export default function AdminAllEventsView({
  events,
  onBackToDashboard,
  onOpenScoreStats,
  onOpenCreateEvent,
  onUpdateEventStatus
}) {
  const [sportFilter, setSportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'basketball': return '🏀';
      case 'soccer': return '⚽';
      case 'baseball': return '⚾';
      case 'volleyball': return '🏐';
      case 'running': return '🏃';
      case 'swimming': return '🏊';
      case 'tennis': return '🎾';
      default: return '🏆';
    }
  };

  const PAGE_SIZE = 15;
  const mergedRows = events.map(e => ({
    id: e.id,
    date: `${e.date} ${e.time || ''}`,
    sport: e.sport,
    sportIcon: getSportIcon(e.sport),
    name: e.name,
    teams: `${e.teamA} v ${e.teamB}`,
    venue: e.venue,
    status: e.status,
    event: e
  }));

  const filteredRows = mergedRows.filter(row => {
    const matchSport = sportFilter === 'all' || row.sport.toLowerCase() === sportFilter.toLowerCase();
    const matchSearch = !searchTerm ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.teams.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSport && matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);

  return (
    <div className="admin-all-events-container container">
      {/* Header bar */}
      <div className="section-title-bar">
        <div>
          <button className="back-link-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={16} /> Volver al Resumen Ejecutivo
          </button>
          <h1>Listado Detallado de Todos los Eventos</h1>
          <p className="sub-caption">Total Eventos: <strong>{events.length}</strong> | Visto en detalle, ordenado por fecha descendente</p>
        </div>

        <button className="btn-primary" onClick={onOpenCreateEvent}>
          + Crear Evento
        </button>
      </div>

      {/* Filters and Search Bar (Screenshot 192057) */}
      <div className="table-filters-toolbar">
        <div className="filter-select-group">
          <Filter size={16} />
          <span>Filtrar Estadísticas por Deporte:</span>
          <select
            value={sportFilter}
            onChange={e => { setSportFilter(e.target.value); setCurrentPage(1); }}
            className="filter-dropdown"
          >
            <option value="all">Todos Deportes</option>
            <option value="basketball">Baloncesto</option>
            <option value="soccer">Fútbol</option>
            <option value="baseball">Béisbol</option>
            <option value="volleyball">Voleibol</option>
            <option value="running">Maratón / Atletismo</option>
            <option value="swimming">Natación</option>
            <option value="tennis">Tenis</option>
          </select>
        </div>

        <div className="search-box-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar evento, sede o equipo..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="events-table-card">
        <div className="table-scroll-wrap">
          <table className="detailed-events-table">
            <thead>
              <tr>
                <th>ID Evento</th>
                <th>Fecha/Hora</th>
                <th>Deporte</th>
                <th>Nombre del Evento</th>
                <th>Equipos / Competidores</th>
                <th>Lugar (Venue)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(row => (
                <tr key={row.id}>
                  <td><strong>{row.id}</strong></td>
                  <td>{row.date}</td>
                  <td>
                    <span className="sport-symbol-cell" title={row.sport}>
                      {row.sportIcon}
                    </span>
                  </td>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.teams}</td>
                  <td>{row.venue}</td>
                  <td>
                    <span className={`status-pill ${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-action-buttons">
                      <button
                        className="btn-tbl-action"
                        onClick={() => onOpenScoreStats(row.event)}
                      >
                        Actualizar Puntuación
                      </button>
                      <button
                        className="btn-tbl-action postpone"
                        onClick={() => onUpdateEventStatus(row.id, 'Pospuesto')}
                      >
                        Posponer
                      </button>
                      <button
                        className="btn-tbl-action cancel"
                        onClick={() => onUpdateEventStatus(row.id, 'Cancelado')}
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación real sobre los eventos filtrados */}
        <div className="pagination-bar">
          <button
            className="page-nav-btn"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
          >
            &lt; Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`page-num-btn ${page === n ? 'active' : ''}`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="page-nav-btn"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(page + 1)}
          >
            Siguiente &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
