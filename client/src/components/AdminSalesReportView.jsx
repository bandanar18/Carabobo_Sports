import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { api } from '../services/api';

const SPORT_ICONS = {
  basketball: '🏀', soccer: '⚽', baseball: '⚾', volleyball: '🏐',
  running: '🏃', swimming: '🏊', tennis: '🎾'
};

// Descarga un CSV generado en el navegador (Excel lo abre directamente)
function downloadCsv(filename, header, rows) {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map(r => r.map(escape).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const pct = (sold, total) => (total > 0 ? Math.round((sold / total) * 100) : 0);

export default function AdminSalesReportView({ onBackToDashboard, onOpenCreateEvent }) {
  const [sportFilter, setSportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [report, setReport] = useState({ sales: [], summary: null, pagination: { currentPage: 1, totalPages: 1 } });
  const [seatMapModal, setSeatMapModal] = useState(null);

  useEffect(() => {
    api.getSalesReport(sportFilter, searchTerm, currentPage)
      .then(res => res.success && setReport(res))
      .catch(err => console.error(err));
  }, [sportFilter, searchTerm, currentPage]);

  const handleDownloadBuyers = async (item) => {
    const res = await api.getEventBuyers(item.eventId);
    if (!res.success) return alert(res.message);
    if (res.buyers.length === 0) return alert('Este evento aún no tiene compradores con pago confirmado.');
    downloadCsv(
      `compradores-evento-${item.eventId}.csv`,
      ['Código', 'Comprador', 'Tipo de Entrada', 'Cantidad', 'Monto ($)', 'Fecha Reserva'],
      res.buyers.map(b => [b.bookingCode, b.userName, b.tier, b.quantity, b.total, new Date(b.createdAt).toLocaleString('es-ES')])
    );
  };

  const handleGlobalReport = async () => {
    const res = await api.getSalesReport(sportFilter, searchTerm, 1, 500);
    if (!res.success) return alert(res.message);
    downloadCsv(
      'reporte-global-ingresos.csv',
      ['ID Evento', 'Deporte', 'Evento', 'Fecha/Hora', 'Sede', 'Normal', 'Primera Fila', 'VIP', 'Total Vendidas', 'Recaudación ($)', 'Estado'],
      res.sales.map(s => [s.eventId, s.sport, s.eventName, s.eventDateTime, s.venue, s.normalSold, s.primeraFilaSold, s.vipSold, s.totalSold, s.revenue, s.status])
    );
  };

  const { sales, summary, pagination } = report;

  return (
    <div className="admin-sales-report-container container">
      {/* Header Bar */}
      <div className="sales-top-header">
        <div>
          <button className="back-link-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={16} /> Volver al Resumen Ejecutivo
          </button>
          <h1>Listado Detallado de Ventas por Evento</h1>
          <p className="sales-period-sub">
            Desglosado por tipo de entrada | Total Entradas Vendidas: <strong>{(summary?.totalSold ?? 0).toLocaleString()}</strong> | Total Recaudado: <strong>${(summary?.totalRevenue ?? 0).toLocaleString()}</strong> | Eventos con ventas: <strong>{summary?.totalEventsWithSales ?? 0}</strong>
          </p>
        </div>

        <div className="sales-top-actions">
          <button className="btn-primary" onClick={onOpenCreateEvent}>
            + Crear Nuevo Evento
          </button>
          <button className="btn-secondary" onClick={handleGlobalReport}>
            Reporte Global de Ingresos (CSV)
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="sales-filter-bar">
        <div className="filter-item">
          <span>Filtrar Ventas por Deporte:</span>
          <select
            value={sportFilter}
            onChange={e => { setSportFilter(e.target.value); setCurrentPage(1); }}
            className="sales-dropdown"
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

        <div className="search-input-group">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por evento, equipo o sede..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="sales-table-card">
        <div className="table-scroll-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>ID Evento</th>
                <th>Deporte</th>
                <th>Nombre del Evento</th>
                <th>Fecha/Hora Evento</th>
                <th>Total Vendidas (Cant.)</th>
                <th>Entradas Normales (Cant.)</th>
                <th>Entradas Primera Fila (Cant.)</th>
                <th>Entradas VIP (Cant.)</th>
                <th>Recaudación Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr><td colSpan={10} style={{ textAlign: 'center' }}>No hay eventos que coincidan con el filtro.</td></tr>
              )}
              {sales.map(item => (
                <tr key={item.eventId}>
                  <td><strong>{item.eventId}</strong></td>
                  <td><span className="sport-icon-cell" title={item.sport}>{SPORT_ICONS[item.sport] || '🏆'}</span></td>
                  <td><strong>{item.eventName}</strong></td>
                  <td>{item.eventDateTime}</td>
                  <td><span className="badge-qty total">{item.totalSold.toLocaleString()}</span></td>
                  <td><span className="badge-qty normal">{item.normalSold}</span></td>
                  <td><span className="badge-qty primera">{item.primeraFilaSold}</span></td>
                  <td><span className="badge-qty vip">{item.vipSold}</span></td>
                  <td>
                    <strong className={item.status === 'Cancelado' ? 'rev-cancelled' : 'rev-amount'}>
                      {item.status === 'Cancelado' ? 'Cancelado' : `$${item.revenue.toLocaleString()}`}
                    </strong>
                  </td>
                  <td>
                    <div className="sales-action-btns">
                      <button className="btn-sale-action" onClick={() => setSeatMapModal(item)}>
                        Ver Mapa Asientos
                      </button>
                      <button className="btn-sale-action" onClick={() => handleDownloadBuyers(item)}>
                        Descargar Listado Compradores
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-bar">
          <button
            className="page-nav-btn"
            disabled={pagination.currentPage <= 1}
            onClick={() => setCurrentPage(pagination.currentPage - 1)}
          >
            &lt; Anterior
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`page-num-btn ${pagination.currentPage === n ? 'active' : ''}`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="page-nav-btn"
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => setCurrentPage(pagination.currentPage + 1)}
          >
            Siguiente &gt;
          </button>
        </div>
      </div>

      {/* Seat Map Modal: ocupación calculada sobre la capacidad por zona */}
      {seatMapModal && (
        <div className="modal-backdrop">
          <div className="seat-map-modal-card">
            <div className="modal-top-bar">
              <h3>Mapa de Asientos & Tiers: {seatMapModal.eventName}</h3>
              <button className="close-btn-circle" onClick={() => setSeatMapModal(null)}>×</button>
            </div>
            {/* ponytail: capacidad fija por zona; mover a la sede (venue) si cada recinto tiene aforo distinto */}
            <div className="stadium-layout-visual">
              <div className="stage-court-box">CAMPO / PISTA DE JUEGO</div>
              <div className="tier-zone vip-zone">
                <span>ZONA VIP ({seatMapModal.vipSold} / 500 Asientos)</span>
                <small>Ocupación: {pct(seatMapModal.vipSold, 500)}%</small>
              </div>
              <div className="tier-zone primera-zone">
                <span>ZONA PRIMERA FILA ({seatMapModal.primeraFilaSold} / 1,000 Asientos)</span>
                <small>Ocupación: {pct(seatMapModal.primeraFilaSold, 1000)}%</small>
              </div>
              <div className="tier-zone normal-zone">
                <span>GRADERÍAS GENERALES ({seatMapModal.normalSold} / 3,000 Asientos)</span>
                <small>Ocupación: {pct(seatMapModal.normalSold, 3000)}%</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
