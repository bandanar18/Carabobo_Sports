import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, ZoomIn, Eye, AlertTriangle, FileText, User } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function AdminPaymentVerificationModal({
  pendingPayments,
  allPayments,
  onClose,
  onApprovePayment,
  onRejectPayment
}) {
  const [selectedPayment, setSelectedPayment] = useState(
    pendingPayments.length > 0 ? pendingPayments[0] : (allPayments && allPayments[0]) || null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleApprove = async () => {
    if (!selectedPayment) return;
    try {
      await onApprovePayment(selectedPayment.id, 'Comprobante verificado con éxito en banco');
      setActionFeedback({ type: 'success', message: `¡Pago #${selectedPayment.id} aprobado con éxito!` });
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    try {
      await onRejectPayment(selectedPayment.id, rejectReason || 'Comprobante ilegible o referencia inconsistente');
      setActionFeedback({ type: 'error', message: `Pago #${selectedPayment.id} marcado como rechazado.` });
      setShowRejectInput(false);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="payment-verification-container">
        {/* Top Bar */}
        <div className="audit-top-bar">
          <div className="brand-group">
            <WhistleLogo size={24} />
            <div>
              <h3>Resumen Ejecutivo - Verificación de Pagos</h3>
              <p>Pending Payments: <strong>[{pendingPayments.length}]</strong></p>
            </div>
          </div>
          <button className="close-btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {actionFeedback && (
          <div className={`action-feedback-toast ${actionFeedback.type}`}>
            {actionFeedback.message}
          </div>
        )}

        <div className="audit-split-layout">
          {/* Left / Background Table List of Payments */}
          <div className="payments-list-sidebar">
            <div className="list-header">
              <span>SOLICITUDES DE PAGO RECIBIDAS</span>
              <span className="count-pill">{allPayments?.length || 0}</span>
            </div>

            <div className="payments-scroll-items">
              {allPayments?.map(p => (
                <div
                  key={p.id}
                  className={`payment-list-row ${selectedPayment?.id === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPayment(p);
                    setShowRejectInput(false);
                  }}
                >
                  <img
                    src={p.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={p.userName}
                    className="avatar-sm"
                  />
                  <div className="user-text-col">
                    <strong>{p.userHandle || '@usuario'}</strong>
                    <small>{p.eventName?.substring(0, 24)}...</small>
                  </div>
                  <div className="amount-col">
                    <strong>${p.total}.00</strong>
                    {p.status === 'CONFIRMADO' && (
                      <span className="mini-status approved" title="Aprobado">
                        <CheckCircle2 size={13} /> Aprobado
                      </span>
                    )}
                    {p.status === 'EN ESPERA' && (
                      <span className="mini-status waiting" title="En Espera">
                        <Clock size={13} /> En Espera
                      </span>
                    )}
                    {p.status === 'RECHAZADO' && (
                      <span className="mini-status rejected" title="Rechazado">
                        <XCircle size={13} /> Rechazado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right / Center Detailed Audit Card (Matches the prominent modal in Screenshot 190414) */}
          <div className="payment-inspect-card">
            {selectedPayment ? (
              <div>
                {/* User Header */}
                <div className="inspect-user-header">
                  <div className="user-profile-meta">
                    <img
                      src={selectedPayment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={selectedPayment.userName}
                      className="avatar-md"
                    />
                    <div>
                      <h4>{selectedPayment.userName}</h4>
                      <p className="handle-link">Perfil Usuario: {selectedPayment.userHandle}</p>
                    </div>
                  </div>
                  <div className="order-id-badge">
                    <FileText size={16} />
                    <span>ID #{selectedPayment.id}</span>
                  </div>
                </div>

                <div className="inspect-content-grid">
                  {/* Receipt Preview Box */}
                  <div className="receipt-preview-box">
                    <div className="box-title-row">
                      <label>Comprobante de Pago Adjunto</label>
                      <button
                        type="button"
                        className="btn-zoom-toggle"
                        onClick={() => setIsZoomed(!isZoomed)}
                      >
                        <ZoomIn size={14} /> {isZoomed ? 'Reducir' : 'Zoom'}
                      </button>
                    </div>

                    <div
                      className={`image-preview-frame ${isZoomed ? 'zoomed' : ''}`}
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      {selectedPayment.receiptImage?.toLowerCase().endsWith('.pdf') ? (
                        <a href={selectedPayment.receiptImage} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                          Abrir comprobante PDF
                        </a>
                      ) : (
                        <img
                          src={selectedPayment.receiptImage || '/uploads/receipt_sample.svg'}
                          alt="Comprobante Bancario"
                        />
                      )}
                    </div>
                    <small className="receipt-hint">Comprobante de transferencia oficial adjuntado por el aficionado.</small>
                  </div>

                  {/* Payment Details & Explanation */}
                  <div className="payment-details-box">
                    <div className="explanation-section">
                      <label>Explicación del Pago (Payment Explanation):</label>
                      <div className="explanation-bubble">
                        "{selectedPayment.paymentExplanation || 'Transferencia bancaria directa - Banco Banesco'}"
                      </div>
                    </div>

                    <div className="tier-details-section">
                      <label>Detalles del Nivel de Entrada (Ticket Tier Details):</label>
                      <table className="tier-breakdown-table">
                        <thead>
                          <tr>
                            <th>Nivel (Tier)</th>
                            <th>Precio (Price)</th>
                            <th>Cantidad (Qty)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="tier-tag">{selectedPayment.tier}</span></td>
                            <td>${selectedPayment.unitPrice}.00</td>
                            <td><strong>{selectedPayment.quantity}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="total-audit-row">
                        <span>Total a Validar:</span>
                        <strong className="total-price">${selectedPayment.total}.00 USD</strong>
                      </div>
                    </div>

                    {/* Rejection input toggle */}
                    {showRejectInput && (
                      <div className="reject-reason-box">
                        <label>Motivo del Rechazo:</label>
                        <input
                          type="text"
                          placeholder="Especifique el motivo (ej. Recibo ilegible, referencia no encontrada)"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        />
                        <div className="reject-confirm-actions">
                          <button className="btn-confirm-reject" onClick={handleReject}>
                            Confirmar Rechazo
                          </button>
                          <button className="btn-cancel-reject" onClick={() => setShowRejectInput(false)}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions Row (Screenshot 190414) */}
                    <div className="audit-actions-row">
                      <label className="actions-title">Acciones (Actions):</label>
                      <div className="buttons-group">
                        <button
                          className="btn-approve"
                          onClick={handleApprove}
                          disabled={selectedPayment.status === 'CONFIRMADO'}
                        >
                          <CheckCircle2 size={16} /> APROBAR (Approve)
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => setShowRejectInput(true)}
                          disabled={selectedPayment.status === 'RECHAZADO'}
                        >
                          <XCircle size={16} /> RECHAZAR (Reject)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-selection-prompt">
                <p>Seleccione una solicitud de pago para auditar su comprobante.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
