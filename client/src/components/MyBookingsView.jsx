import React, { useState } from 'react';
import { QrCode, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, MapPin, Eye, Ticket } from 'lucide-react';

export default function MyBookingsView({ bookings, onOpenPassModal, onNavigateToEvents }) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | PENDING | CONFIRMED

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'PENDING') return b.status === 'EN ESPERA';
    if (activeTab === 'CONFIRMED') return b.status === 'CONFIRMADO';
    return true;
  });

  return (
    <div className="my-bookings-container container">
      <div className="bookings-page-header">
        <div>
          <h1>MY BOOKINGS (Mis Reservas)</h1>
          <p>Gestiona tus entradas, verifica el estado de pago y accede a tus pases digitales con QR.</p>
        </div>
        <button className="btn-primary" onClick={onNavigateToEvents}>
          + Explorar Más Eventos
        </button>
      </div>

      {/* Tabs */}
      <div className="bookings-tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          TODAS ({bookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          PENDIENTES ({bookings.filter(b => b.status === 'EN ESPERA').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
          onClick={() => setActiveTab('CONFIRMED')}
        >
          CONFIRMADAS ({bookings.filter(b => b.status === 'CONFIRMADO').length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="empty-bookings-box">
          <Ticket size={40} color="#94A3B8" />
          <h3>No tienes reservas en esta sección</h3>
          <p>Explora los eventos en vivo o próximos para reservar tus entradas oficiales.</p>
          <button className="btn-primary" onClick={onNavigateToEvents}>Ver Eventos Disponibles</button>
        </div>
      ) : (
        <div className="bookings-cards-grid">
          {filteredBookings.map(b => (
            <div key={b.id} className={`booking-card-item ${b.status.toLowerCase()}`}>
              <div className="booking-card-header">
                <div className="match-title-row">
                  <div className="event-icon-badge">🎟️</div>
                  <div>
                    <h3>{b.eventName}</h3>
                    <small><Calendar size={12} /> {b.eventDate} • {b.eventTime || '12:00 PM'}</small>
                  </div>
                </div>

                {/* Status Badge matching screenshot */}
                {b.status === 'CONFIRMADO' && (
                  <span className="badge-status confirmed">
                    <CheckCircle2 size={14} /> CONFIRMADO (QR Generado)
                  </span>
                )}
                {b.status === 'EN ESPERA' && (
                  <span className="badge-status waiting">
                    <Clock size={14} /> EN ESPERA (Admin Verificación)
                  </span>
                )}
                {b.status === 'RECHAZADO' && (
                  <span className="badge-status rejected">
                    <XCircle size={14} /> RECHAZADO
                  </span>
                )}
              </div>

              <div className="booking-venue-sub">
                <MapPin size={14} /> {b.venue || 'Forum de Valencia Pérez'}
              </div>

              {/* Order Summary */}
              <div className="order-summary-box">
                <div className="summary-title">TICKET ORDER SUMMARY</div>
                <div className="summary-line">
                  <span>Entrada ({b.tier}):</span>
                  <span>{b.quantity} x ${b.unitPrice}</span>
                </div>
                <div className="summary-line total">
                  <span>Total Pagado / En Verificación:</span>
                  <strong>${b.total}.00</strong>
                </div>
                <div className="payment-method-hint">
                  <small>Método: {b.paymentMethod}</small>
                  {b.paymentExplanation && (
                    <small className="expl-text">Ref: {b.paymentExplanation}</small>
                  )}
                </div>
              </div>

              {/* Status Specific Footer */}
              {b.status === 'CONFIRMADO' && (
                <div className="confirmed-pass-action-box">
                  <div className="pass-preview-info">
                    <div className="mini-qr-icon">
                      <QrCode size={32} color="#0B1E36" />
                    </div>
                    <div>
                      <strong>DIGITAL PASS ACTIVO</strong>
                      <small>Código: {b.bookingCode || `SP-${b.id}`}</small>
                    </div>
                  </div>
                  <button
                    className="btn-view-pass"
                    onClick={() => onOpenPassModal(b)}
                  >
                    <Eye size={16} /> VIEWABLE PASS (VER QR)
                  </button>
                </div>
              )}

              {b.status === 'EN ESPERA' && (
                <div className="waiting-info-box">
                  <AlertCircle size={16} color="#F59E0B" />
                  <span>
                    El comprobante adjunto está siendo auditado por el equipo de administración. El QR se activará automáticamente al aprobarse.
                  </span>
                </div>
              )}

              {b.status === 'RECHAZADO' && (
                <div className="rejected-info-box">
                  <AlertCircle size={16} color="#EF4444" />
                  <div>
                    <strong>Motivo de rechazo:</strong>
                    <p>{b.auditNotes || 'Comprobante ilegible o referencia bancaria no coincide.'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
