import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, CheckSquare, Trophy, Calendar, DollarSign, Ticket, Hourglass, BarChart3 } from 'lucide-react';

export default function AdminExecutiveDashboard({
  kpis,
  setKpis,
  events,
  onOpenCreateEvent,
  onOpenPaymentAudit,
  onOpenScoreStats,
  onNavigateToAllEvents,
  onNavigateToSalesReport,
  onNavigateToAllPayments,
  onUpdateEventStatus
}) {
  const [selectedSport, setSelectedSport] = useState('all');

  // Recalcula los KPIs en el backend al cambiar de disciplina
  useEffect(() => {
    api.getAdminDashboard(selectedSport).then(res => res.success && setKpis(res.kpis)).catch(() => {});
  }, [selectedSport, events, setKpis]);

  const sportsOptions = [
    { id: 'all', name: 'Todos los Deportes' },
    { id: 'basketball', name: 'Baloncesto' },
    { id: 'soccer', name: 'Fútbol' },
    { id: 'baseball', name: 'Béisbol' },
    { id: 'volleyball', name: 'Voleibol' },
    { id: 'running', name: 'Maratón / Atletismo' }
  ];

  const filteredEvents = events.filter(e => {
    if (selectedSport === 'all') return true;
    return e.sport.toLowerCase() === selectedSport.toLowerCase();
  });

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

  return (
    <div className="admin-dashboard-wrapper container">
      {/* Cabecera Ejecutiva */}
      <div className="executive-header-box">
        <div className="title-area">
          <div className="brand-badge-row">
            <span className="carabobo-pill">Carabobo Sports Admin</span>
            <span className="live-pill"><span className="live-dot"></span> Modo Gestión Activo</span>
          </div>
          <h1>Resumen Ejecutivo</h1>
          <p>Métricas en tiempo real y gestión general de torneos deportivos en Carabobo</p>
        </div>

        {/* Barra de Acciones Principales */}
        <div className="executive-actions-bar">
          <button className="btn-admin-action primary-blue" onClick={onOpenCreateEvent}>
            <Plus size={16} /> Crear Nuevo Evento
          </button>
          <button className="btn-admin-action primary-teal" onClick={onOpenPaymentAudit}>
            <CheckSquare size={16} /> Verificar Pagos ({kpis?.pendingPayments ?? 0})
          </button>
          <button className="btn-admin-action primary-gold" onClick={() => onOpenScoreStats(events[0])}>
            <Trophy size={16} /> Cargar Resultados
          </button>
        </div>
      </div>

      {/* Accesos Directos a Vistas Detalladas */}
      <div className="admin-nav-shortcuts">
        <button className="shortcut-btn" onClick={onNavigateToAllEvents}>
          <Calendar size={15} /> Ver Listado Detallado de Eventos ({events.length}) &gt;
        </button>
        <button className="shortcut-btn" onClick={onNavigateToSalesReport}>
          <BarChart3 size={15} /> Listado de Ventas por Evento &gt;
        </button>
        <button className="shortcut-btn" onClick={onNavigateToAllPayments}>
          <DollarSign size={15} /> Listado de Pagos de Todos los Eventos &gt;
        </button>
      </div>

      {/* Barra de Filtro por Deporte */}
      <div className="filter-sport-bar">
        <div className="filter-label-group">
          <span className="target-icon">🎯</span>
          <div>
            <strong>Filtrar Estadísticas por Deporte</strong>
            <small>Selecciona una disciplina para recalcular los indicadores</small>
          </div>
        </div>

        <select
          className="select-sport-filter"
          value={selectedSport}
          onChange={e => setSelectedSport(e.target.value)}
        >
          {sportsOptions.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Tarjetas de Indicadores Clave (KPIs) */}
      <div className="kpis-grid">
        <div className="kpi-card">
          <div className="kpi-content">
            <span className="kpi-label">TOTAL EVENTOS</span>
            <h2 className="kpi-value">{kpis?.totalEvents ?? 0}</h2>
          </div>
          <div className="kpi-icon-box blue">
            <Calendar size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={onOpenPaymentAudit} style={{ cursor: 'pointer' }}>
          <div className="kpi-content">
            <span className="kpi-label">PAGOS PENDIENTES</span>
            <h2 className="kpi-value warning">{kpis?.pendingPayments ?? 0}</h2>
            <small className="kpi-alert-hint">Haga clic para auditar comprobantes</small>
          </div>
          <div className="kpi-icon-box amber">
            <Hourglass size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-content">
            <span className="kpi-label">ENTRADAS VENDIDAS</span>
            <h2 className="kpi-value">{(kpis?.ticketsSold ?? 0).toLocaleString()}</h2>
          </div>
          <div className="kpi-icon-box pink">
            <Ticket size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-content">
            <span className="kpi-label">RECAUDACIÓN TOTAL</span>
            <h2 className="kpi-value success">${(kpis?.totalRevenue ?? 0).toLocaleString()}</h2>
          </div>
          <div className="kpi-icon-box green">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Tabla de Eventos Programados */}
      <div className="admin-table-panel">
        <div className="table-panel-header">
          <div>
            <h2>Eventos Programados</h2>
            <p>Listado general de torneos y encuentros locales</p>
          </div>
          <button className="link-create-btn" onClick={onOpenCreateEvent}>
            + Crear Evento
          </button>
        </div>

        <div className="table-scroll-container">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Deporte</th>
                <th>Nombre del Evento</th>
                <th>Equipos / Rivales</th>
                <th>Lugar (Sede)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.slice(0, 6).map(evt => (
                <tr key={evt.id}>
                  <td>
                    <div className="date-time-cell">
                      <strong>{evt.date}</strong>
                      <small>{evt.time}</small>
                    </div>
                  </td>
                  <td>
                    <span className="table-sport-icon" title={evt.sport}>
                      {getSportIcon(evt.sport)}
                    </span>
                  </td>
                  <td>
                    <strong>{evt.name}</strong>
                  </td>
                  <td>
                    <span className="teams-text">{evt.teamA} v {evt.teamB}</span>
                  </td>
                  <td>
                    <span className="venue-text">{evt.venue}</span>
                  </td>
                  <td>
                    <div className="actions-flex-cell">
                      <button
                        className="btn-action-postpone"
                        onClick={() => onUpdateEventStatus(evt.id, 'Pospuesto')}
                      >
                        Posponer Evento
                      </button>
                      <button
                        className="btn-action-cancel"
                        onClick={() => onUpdateEventStatus(evt.id, 'Cancelado')}
                      >
                        Cancelar Evento
                      </button>
                      <button
                        className="btn-action-scores"
                        onClick={() => onOpenScoreStats(evt)}
                        title="Cargar marcador"
                      >
                        Resultados
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
