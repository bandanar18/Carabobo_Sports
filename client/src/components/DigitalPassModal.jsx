import React from 'react';
import { X, CheckCircle, Shield, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import WhistleLogo from './WhistleLogo';

export default function DigitalPassModal({ booking, onClose }) {
  if (!booking) return null;

  const qrValue = booking.qrToken || `SPORTFLOW-PASS-${booking.id}-${booking.tier}-${booking.bookingCode || '2026'}`;

  return (
    <div className="modal-backdrop">
      <div className="digital-pass-modal-card">
        <button className="close-pass-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Stadium Ticket Styling */}
        <div className="ticket-pass-container">
          {/* Ticket Header */}
          <div className="ticket-header-navy">
            <div className="ticket-brand-row">
              <WhistleLogo size={24} />
              <span className="ticket-seal"><Shield size={14} /> OFICIAL CARABOBOSPORTS</span>
            </div>
            <div className="ticket-event-hero">
              <h2>{booking.eventName}</h2>
              <p className="ticket-venue-text">{booking.venue || 'Forum de Valencia Pérez'}</p>
            </div>
          </div>

          {/* Ticket Stub Notch */}
          <div className="ticket-notch-row">
            <div className="notch left"></div>
            <div className="notch-line"></div>
            <div className="notch right"></div>
          </div>

          {/* Ticket Details Body */}
          <div className="ticket-body">
            <div className="ticket-info-grid">
              <div className="info-cell">
                <small>FECHA</small>
                <strong>{booking.eventDate}</strong>
              </div>
              <div className="info-cell">
                <small>HORA</small>
                <strong>{booking.eventTime || '12:00 PM'}</strong>
              </div>
              <div className="info-cell">
                <small>NIVEL / TIER</small>
                <span className="tier-badge-pill">{booking.tier}</span>
              </div>
              <div className="info-cell">
                <small>CANTIDAD</small>
                <strong>{booking.quantity} Entrada(s)</strong>
              </div>
              <div className="info-cell full-width">
                <small>TITULAR DE LA ENTRADA</small>
                <strong>{booking.userName} ({booking.userHandle})</strong>
              </div>
            </div>

            {/* Live QR Code Box */}
            <div className="ticket-qr-display-area">
              <div className="qr-box-bordered">
                <QRCodeSVG
                  value={qrValue}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="qr-sub-details">
                <span className="qr-badge-success">
                  <CheckCircle size={14} /> ENTRADA VÁLIDA
                </span>
                <span className="code-text-mono">{booking.bookingCode || `SP-${booking.id}`}</span>
                <small>Escanee este código en los torniquetes de acceso del estadio.</small>
              </div>
            </div>
          </div>

          {/* Ticket Action Footer */}
          <div className="ticket-footer-actions">
            <button
              className="btn-print"
              onClick={() => window.print()}
            >
              <Printer size={16} /> Imprimir Pase
            </button>
            <button
              className="btn-download"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
