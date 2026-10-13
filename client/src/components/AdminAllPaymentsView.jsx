import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { api } from '../services/api';

export default function AdminAllPaymentsView({ refreshKey, onBackToDashboard, onOpenPaymentAudit }) {
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({ transactions: [], totalTransactions: 0, pagination: { currentPage: 1, totalPages: 1 } });
  const [previewReceiptModal, setPreviewReceiptModal] = useState(null);

  // refreshKey cambia cuando el admin aprueba/rechaza un pago
  useEffect(() => {
    api.getTransactions(sportFilter, searchTerm, currentPage, statusFilter)
      .then(res => res.success && setData(res))
      .catch(err => console.error(err));
  }, [sportFilter, statusFilter, searchTerm, currentPage, refreshKey]);

  const { transactions, totalTransactions, pagination } = data;
  const receiptSrc = previewReceiptModal?.receiptImage || '/uploads/receipt_sample.svg';

  return (
    <div className="admin-all-payments-container container">
      {/* Header */}
      <div className="section-title-bar">
        <div>
          <button className="back-link-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={16} /> Volver al Resumen Ejecutivo
          </button>
          <h1>Listado Detallado de Pagos de Todos los Eventos</h1>
          <p className="sub-caption">
            Total Transacciones: <strong>{totalTransactions}</strong> | Ordenado por fecha descendente
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenPaymentAudit}>
          Abrir Módulo de Auditoría
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-filters-toolbar">
        <div className="filter-select-group">
          <Filter size={16} />
          <span>Filtrar Transacciones por Deporte:</span>
          <select
            value={sportFilter}
            onChange={e => { setSportFilter(e.target.value); setCurrentPage(1); }}
            className="filter-dropdown"
          >
            <option value="all">Todos los Deportes</option>
            <option value="basketball">Baloncesto</option>
            <option value="soccer">Fútbol</option>
            <option value="baseball">Béisbol</option>
            <option value="volleyball">Voleibol</option>
            <option value="running">Maratón / Atletismo</option>
            <option value="swimming">Natación</option>
            <option value="tennis">Tenis</option>
          </select>
          <span>Estado:</span>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="filter-dropdown"
          >
            <option value="all">Todos</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Vencido">Vencido</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div className="search-box-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por cliente, concepto o estado..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="payments-table-card">
        <div className="table-scroll-wrap">
          <table className="detailed-payments-table">
            <thead>
              <tr>
                <th>ID Trans.</th>
                <th>Fecha/Hora</th>
                <th>Deporte</th>
                <th>Concepto / Evento</th>
                <th>Cliente / Aficionado</th>
                <th>Monto ($)</th>
                <th>Estado del Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center' }}>No hay transacciones que coincidan con el filtro.</td></tr>
              )}
              {transactions.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong></td>
                  <td>{item.date}</td>
                  <td><span className="sport-icon-center">{item.sportIcon}</span></td>
                  <td><strong>{item.concept}</strong></td>
                  <td>{item.client}</td>
                  <td><strong className="amount-text">${Number(item.amount).toFixed(2)}</strong></td>
                  <td>
                    <span className={`payment-status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-action-buttons">
                      <button className="btn-tbl-action" onClick={() => setPreviewReceiptModal(item)}>
                        Ver Recibo
                      </button>
                      {item.status === 'Pendiente' && (
                        <button className="btn-tbl-action postpone" onClick={onOpenPaymentAudit}>
                          Auditar
                        </button>
                      )}
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

      {/* Quick Receipt Viewer Modal */}
      {previewReceiptModal && (
        <div className="modal-backdrop">
          <div className="quick-receipt-modal">
            <div className="modal-top-bar">
              <h3>Comprobante Transacción #{previewReceiptModal.id}</h3>
              <button className="close-btn-circle" onClick={() => setPreviewReceiptModal(null)}>×</button>
            </div>
            <div className="receipt-view-body">
              <p>Cliente: <strong>{previewReceiptModal.client}</strong> | Concepto: <strong>{previewReceiptModal.concept}</strong></p>
              <div className="receipt-img-frame">
                {receiptSrc.toLowerCase().endsWith('.pdf')
                  ? <a href={receiptSrc} target="_blank" rel="noreferrer">Abrir comprobante PDF</a>
                  : <img src={receiptSrc} alt="Comprobante Bancario" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
