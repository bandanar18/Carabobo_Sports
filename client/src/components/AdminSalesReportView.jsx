import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Search, Plus, Download, FileSpreadsheet, Map as MapIcon, Ticket, DollarSign, CalendarCheck, TrendingUp, ArrowUpDown, X } from 'lucide-react';
import { api } from '../services/api';
import './AdminSalesReportView.css';

const SPORTS = [
  { id: 'all', name: 'Todos', icon: '🏆' },
  { id: 'basketball', name: 'Baloncesto', icon: '🏀' },
  { id: 'soccer', name: 'Fútbol', icon: '⚽' },
  { id: 'baseball', name: 'Béisbol', icon: '⚾' },
  { id: 'volleyball', name: 'Voleibol', icon: '🏐' },
  { id: 'running', name: 'Atletismo', icon: '🏃' },
  { id: 'swimming', name: 'Natación', icon: '🏊' },
  { id: 'tennis', name: 'Tenis', icon: '🎾' }
];
const SPORT_ICONS = Object.fromEntries(SPORTS.map(s => [s.id, s.icon]));

// ponytail: capacidad fija por zona; mover a la sede (venue) si cada recinto tiene aforo distinto
const CAPACITY = { vip: 500, primeraFila: 1000, normal: 3000 };
const PAGE_SIZE = 10;

const nf = new Intl.NumberFormat('es-VE', { useGrouping: 'always', maximumFractionDigits: 0 });
const fmt = n => nf.format(n);
const pct = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

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

// Número que se anima hasta su valor al cambiar los filtros
function CountUp({ value, prefix = '' }) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let frame;
    const tick = now => {
      const t = Math.min(1, (now - start) / 450);
      const v = from + (value - from) * (1 - Math.pow(1 - t, 3));
      setShown(v);
      fromRef.current = v;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{fmt(shown)}</>;
}

function TierBar({ item }) {
  const total = item.totalSold;
  if (!total) return <span className="sr-muted">Sin ventas</span>;
  return (
    <div className="sr-tierbar" title={`Normal ${item.normalSold} · Primera Fila ${item.primeraFilaSold} · VIP ${item.vipSold}`}>
      <div className="sr-tierbar-track">
        <span className="seg normal" style={{ width: `${pct(item.normalSold, total)}%` }} />
        <span className="seg primera" style={{ width: `${pct(item.primeraFilaSold, total)}%` }} />
        <span className="seg vip" style={{ width: `${pct(item.vipSold, total)}%` }} />
      </div>
      <div className="sr-tierbar-legend">
        <span><i className="dot normal" />{fmt(item.normalSold)}</span>
        <span><i className="dot primera" />{fmt(item.primeraFilaSold)}</span>
        <span><i className="dot vip" />{fmt(item.vipSold)}</span>
      </div>
    </div>
  );
}

function SortHeader({ k, sort, onSort, className = '', children }) {
  const active = sort.key === k;
  return (
    <th
      className={`sr-sortable ${className} ${active ? 'active' : ''}`}
      onClick={() => onSort(k)}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {children} <ArrowUpDown size={12} />
    </th>
  );
}

export default function AdminSalesReportView({ onBackToDashboard, onOpenCreateEvent }) {
  const [allSales, setAllSales] = useState(null);
  const [sport, setSport] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'revenue', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [seatMap, setSeatMap] = useState(null);

  // Una sola carga; filtros, orden y paginación se resuelven en memoria (instantáneo)
  useEffect(() => {
    api.getSalesReport('all', '', 1, 500)
      .then(res => setAllSales(res.success ? res.sales : []))
      .catch(() => setAllSales([]));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = (allSales || []).filter(s =>
      (sport === 'all' || s.sport === sport) &&
      (!q || `${s.eventName} ${s.venue} ${s.eventId}`.toLowerCase().includes(q))
    );
    const dir = sort.dir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir;
    });
  }, [allSales, sport, search, sort]);

  const summary = useMemo(() => {
    const sold = filtered.reduce((s, x) => s + x.totalSold, 0);
    const revenue = filtered.reduce((s, x) => s + x.revenue, 0);
    return { sold, revenue, withSales: filtered.filter(x => x.totalSold > 0).length, avg: sold ? revenue / sold : 0 };
  }, [filtered]);

  const sportCounts = useMemo(() => {
    const counts = { all: (allSales || []).length };
    (allSales || []).forEach(s => { counts[s.sport] = (counts[s.sport] || 0) + 1; });
    return counts;
  }, [allSales]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const maxRevenue = Math.max(1, ...filtered.map(s => s.revenue));

  const toggleSort = key => {
    // Textos empiezan A→Z, números de mayor a menor; el segundo clic invierte
    const firstDir = ['eventName', 'eventDateTime'].includes(key) ? 'asc' : 'desc';
    setSort(s => ({ key, dir: s.key === key ? (s.dir === 'asc' ? 'desc' : 'asc') : firstDir }));
    setPage(1);
  };

  const handleDownloadBuyers = async item => {
    const res = await api.getEventBuyers(item.eventId);
    if (!res.success) return alert(res.message);
    if (res.buyers.length === 0) return alert('Este evento aún no tiene compradores con pago confirmado.');
    downloadCsv(
      `compradores-evento-${item.eventId}.csv`,
      ['Código', 'Comprador', 'Tipo de Entrada', 'Cantidad', 'Monto ($)', 'Fecha Reserva'],
      res.buyers.map(b => [b.bookingCode, b.userName, b.tier, b.quantity, b.total, new Date(b.createdAt).toLocaleString('es-ES')])
    );
  };

  const handleGlobalReport = () => downloadCsv(
    'reporte-global-ingresos.csv',
    ['ID Evento', 'Deporte', 'Evento', 'Fecha/Hora', 'Sede', 'Normal', 'Primera Fila', 'VIP', 'Total Vendidas', 'Recaudación ($)', 'Estado'],
    filtered.map(s => [s.eventId, s.sport, s.eventName, s.eventDateTime, s.venue, s.normalSold, s.primeraFilaSold, s.vipSold, s.totalSold, s.revenue, s.status])
  );

  const kpis = [
    { label: 'Entradas vendidas', value: summary.sold, icon: Ticket, tone: 'orange' },
    { label: 'Recaudación total', value: summary.revenue, prefix: '$', icon: DollarSign, tone: 'green' },
    { label: 'Eventos con ventas', value: summary.withSales, icon: CalendarCheck, tone: 'blue' },
    { label: 'Ingreso por entrada', value: summary.avg, prefix: '$', icon: TrendingUp, tone: 'purple' }
  ];

  return (
    <div className="sr-page container">
      <button className="sr-back" onClick={onBackToDashboard}>
        <ArrowLeft size={16} /> Volver al Resumen Ejecutivo
      </button>

      <header className="sr-header">
        <div>
          <span className="sr-eyebrow">Reportes · Ventas</span>
          <h1>Ventas por Evento</h1>
          <p>Desglose por tipo de entrada, ocupación y recaudación en tiempo real.</p>
        </div>
        <div className="sr-header-actions">
          <button className="sr-btn ghost" onClick={handleGlobalReport} disabled={!filtered.length}>
            <FileSpreadsheet size={16} /> Exportar CSV
          </button>
          <button className="sr-btn primary" onClick={onOpenCreateEvent}>
            <Plus size={16} /> Nuevo Evento
          </button>
        </div>
      </header>

      <section className="sr-kpis">
        {kpis.map(({ label, value, prefix, icon: Icon, tone }) => (
          <div key={label} className={`sr-kpi ${tone}`}>
            <div className="sr-kpi-icon"><Icon size={20} /></div>
            <div>
              <span className="sr-kpi-label">{label}</span>
              <strong className="sr-kpi-value">{allSales ? <CountUp value={value} prefix={prefix} /> : '—'}</strong>
            </div>
          </div>
        ))}
      </section>

      <section className="sr-toolbar">
        <div className="sr-chips" role="tablist" aria-label="Filtrar por deporte">
          {SPORTS.filter(s => s.id === 'all' || sportCounts[s.id]).map(s => (
            <button
              key={s.id}
              role="tab"
              aria-selected={sport === s.id}
              className={`sr-chip ${sport === s.id ? 'active' : ''}`}
              onClick={() => { setSport(s.id); setPage(1); }}
            >
              <span>{s.icon}</span> {s.name}
              <em>{sportCounts[s.id] || 0}</em>
            </button>
          ))}
        </div>
        <label className="sr-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar evento, sede o ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setSearch('')}><X size={14} /></button>}
        </label>
      </section>

      <section className="sr-card">
        <div className="sr-legend">
          <span><i className="dot normal" /> Normal</span>
          <span><i className="dot primera" /> Primera Fila</span>
          <span><i className="dot vip" /> VIP</span>
          <span className="sr-count">{filtered.length} evento{filtered.length === 1 ? '' : 's'}</span>
        </div>

        <div className="sr-table-wrap">
          <table className="sr-table">
            <thead>
              <tr>
                <SortHeader k="eventName" sort={sort} onSort={toggleSort}>Evento</SortHeader>
                <SortHeader k="eventDateTime" sort={sort} onSort={toggleSort} className="hide-sm">Fecha</SortHeader>
                <SortHeader k="totalSold" sort={sort} onSort={toggleSort} className="num">Vendidas</SortHeader>
                <th className="hide-md">Distribución por entrada</th>
                <SortHeader k="revenue" sort={sort} onSort={toggleSort} className="num">Recaudación</SortHeader>
                <th className="actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!allSales && Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="sr-skeleton"><td colSpan={6}><span /></td></tr>
              ))}
              {allSales && pageRows.length === 0 && (
                <tr><td colSpan={6} className="sr-empty">No hay eventos que coincidan con los filtros.</td></tr>
              )}
              {pageRows.map(item => (
                <tr key={item.eventId}>
                  <td>
                    <div className="sr-event">
                      <span className="sr-event-icon">{SPORT_ICONS[item.sport] || '🏆'}</span>
                      <div>
                        <strong>{item.eventName}</strong>
                        <small>#{item.eventId} · {item.venue}</small>
                      </div>
                      {item.status !== 'Programado' && (
                        <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span>
                      )}
                    </div>
                  </td>
                  <td className="hide-sm sr-date">{item.eventDateTime}</td>
                  <td className="num"><strong>{fmt(item.totalSold)}</strong></td>
                  <td className="hide-md"><TierBar item={item} /></td>
                  <td className="num">
                    {item.status === 'Cancelado' ? <span className="sr-cancelled">Cancelado</span> : (
                      <div className="sr-revenue">
                        <strong>${fmt(item.revenue)}</strong>
                        <span className="sr-revenue-bar"><span style={{ width: `${pct(item.revenue, maxRevenue)}%` }} /></span>
                      </div>
                    )}
                  </td>
                  <td className="actions">
                    <button className="sr-icon-btn" title="Ver mapa de asientos" aria-label="Ver mapa de asientos" onClick={() => setSeatMap(item)}>
                      <MapIcon size={16} />
                    </button>
                    <button className="sr-icon-btn" title="Descargar compradores (CSV)" aria-label="Descargar compradores" onClick={() => handleDownloadBuyers(item)}>
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="sr-pagination">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={n === currentPage ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="Página siguiente">›</button>
          </div>
        )}
      </section>

      {seatMap && (
        <div className="modal-backdrop" onClick={() => setSeatMap(null)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label="Mapa de asientos">
            <div className="sr-modal-head">
              <div>
                <span className="sr-eyebrow">Mapa de asientos</span>
                <h3>{seatMap.eventName}</h3>
              </div>
              <button className="sr-icon-btn" aria-label="Cerrar" onClick={() => setSeatMap(null)}><X size={18} /></button>
            </div>
            <div className="sr-court">CAMPO / PISTA DE JUEGO</div>
            {[
              { key: 'vip', label: 'Zona VIP', sold: seatMap.vipSold },
              { key: 'primeraFila', label: 'Primera Fila', sold: seatMap.primeraFilaSold },
              { key: 'normal', label: 'Graderías Generales', sold: seatMap.normalSold }
            ].map(z => {
              const occ = pct(z.sold, CAPACITY[z.key]);
              return (
                <div key={z.key} className={`sr-zone ${z.key}`}>
                  <div className="sr-zone-row">
                    <strong>{z.label}</strong>
                    <span>{fmt(z.sold)} / {fmt(CAPACITY[z.key])} · <b>{occ}%</b></span>
                  </div>
                  <div className="sr-zone-track"><span style={{ width: `${Math.min(occ, 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
