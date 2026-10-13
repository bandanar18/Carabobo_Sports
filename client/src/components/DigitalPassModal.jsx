import React from 'react';
import { X, CheckCircle, Shield, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import WhistleLogo from './WhistleLogo';

export default function DigitalPassModal({ booking, onClose }) {
  if (!booking) return null;

  const qrValue = booking.qrToken || `CARABOBOSPORTS-PASS-${booking.id}-${booking.tier}-${booking.bookingCode || '2026'}`;

  return (
    <div className="modal-backdrop">
      <div className="digital-pass-modal-card">
        <button className="close-pass-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Diseño de Boleto Oficial de Estadio */}
        <div className="ticket-pass-container">
          {/* Cabecera del Boleto */}
          <div className="ticket-header-navy">
            <div className="ticket-brand-row">
              <WhistleLogo size={24} customText="Carabobo Sports" />
              <span className="ticket-seal"><Shield size={14} /> OFICIAL CARABOBO SPORTS</span>
            </div>
            <div className="ticket-event-hero">
              <h2>{booking.eventName}</h2>
              <p className="ticket-venue-text">{booking.venue || 'Forum de Valencia Pérez'}</p>
            </div>
          </div>

          {/* Ranura de Corte / Cupón */}
          <div className="ticket-notch-row">
            <div className="notch left"></div>
            <div className="notch-line"></div>
            <div className="notch right"></div>
          </div>

          {/* Cuerpo con Detalles */}
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
                <small>NIVEL / ZONA</small>
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

            {/* Código QR Interactivo */}
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
                <small>Escanee este código QR en los torniquetes de acceso del recinto deportivo.</small>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
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
