import React, { useState } from 'react';
import { X, Upload, Check, FileText, Lock } from 'lucide-react';
import WhistleLogo from './WhistleLogo';

export default function BookTicketModal({ event, onClose, onSubmitBooking }) {
  const [selectedTier, setSelectedTier] = useState('Normal');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod] = useState('Transferencia Bancaria Banesco');
  const [paymentExplanation, setPaymentExplanation] = useState('Abono por transferencia bancaria (Banesco) - ref. 884920');
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/uploads/receipt_sample.svg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculos de precios
  const unitPrice = selectedTier === 'VIP'
    ? (event.prices?.vip || 100)
    : selectedTier === 'Primera Fila'
      ? (event.prices?.primeraFila || 50)
      : (event.prices?.normal || 25);

  // El backend calcula el mismo total (precio x cantidad), sin descuentos
  const subtotal = unitPrice * quantity;
  const total = subtotal;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('eventId', event.id);
    formData.append('tier', selectedTier);
    formData.append('quantity', quantity);
    formData.append('paymentMethod', paymentMethod);
    formData.append('paymentExplanation', paymentExplanation);

    if (receiptFile) {
      formData.append('receipt', receiptFile);
    }

    try {
      await onSubmitBooking(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="book-ticket-modal-card">
        {/* Cabecera del Modal */}
        <div className="modal-top-bar">
          <div className="modal-brand-col">
            <WhistleLogo size={26} customText="Carabobo Sports" />
          </div>
          <button className="close-btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-ticket-form">
          {/* DETALLES DEL EVENTO */}
          <div className="booking-event-header-box">
            <span className="sub-tag">DETALLES DEL EVENTO</span>
            <h3>{event.teamA} vs {event.teamB}</h3>
            <p className="event-sport-type">PARTIDO OFICIAL ({event.sport.toUpperCase()})</p>
            <div className="event-date-row">
              <small>Fecha: {event.date} • {event.time}</small>
              <small>Sede: {event.venue}</small>
            </div>
          </div>

          {/* SELECCIONAR TIPO DE ENTRADA */}
          <div className="form-group-block">
            <label className="section-label">SELECCIONAR TIPO DE ENTRADA</label>
            <div className="ticket-tiers-grid">
              <button
                type="button"
                className={`tier-select-btn ${selectedTier === 'Normal' ? 'active' : ''}`}
                onClick={() => setSelectedTier('Normal')}
              >
                <div className="tier-name">Normal</div>
                <div className="tier-tag-sub">General</div>
                <div className="tier-price">${event.prices?.normal || 25}</div>
              </button>

              <button
                type="button"
                className={`tier-select-btn ${selectedTier === 'Primera Fila' ? 'active' : ''}`}
                onClick={() => setSelectedTier('Primera Fila')}
              >
                <div className="tier-name">Primera Fila</div>
                <div className="tier-tag-sub">Cercano</div>
                <div className="tier-price">${event.prices?.primeraFila || 50}</div>
              </button>

              <button
                type="button"
                className={`tier-select-btn ${selectedTier === 'VIP' ? 'active' : ''}`}
                onClick={() => setSelectedTier('VIP')}
              >
                <div className="tier-name">VIP</div>
                <div className="tier-tag-sub">Exclusivo</div>
                <div className="tier-price">${event.prices?.vip || 100}</div>
              </button>
            </div>
          </div>

          {/* CANTIDAD */}
          <div className="form-group-block">
            <label className="section-label">CANTIDAD DE ENTRADAS</label>
            <select
              className="custom-select-input"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                <option key={n} value={n}>{n} entrada{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* SUBIR COMPROBANTE DE PAGO */}
          <div className="form-group-block">
            <div className="label-with-badge">
              <label className="section-label">SUBIR COMPROBANTE DE PAGO</label>
              <span className="secure-badge"><Lock size={12} /> Verificación Segura</span>
            </div>

            <div className="receipt-upload-container">
              <input
                type="file"
                id="receiptFileInput"
                accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="receiptFileInput" className="upload-dropzone">
                <Upload size={22} color="#F36F21" />
                <span>{receiptFile ? receiptFile.name : 'Subir Comprobante (Haga clic o arrastre el archivo)'}</span>
                <small>Formatos: JPG, PNG, PDF (Comprobante Banesco, Pago Móvil, etc.)</small>
              </label>

              {previewUrl && (
                <div className="receipt-preview-pill">
                  <FileText size={16} />
                  <span>Comprobante listo: {receiptFile ? receiptFile.name : 'Recibo oficial Banesco (Demo precargado)'}</span>
                  <Check size={16} color="#10B981" />
                </div>
              )}
            </div>
          </div>

          {/* DETALLES DEL PAGO ADICIONAL */}
          <div className="form-group-block">
            <label className="section-label">DETALLES DEL PAGO ADICIONAL</label>
            <small className="label-instruction">(Explica cómo pagarás el resto / Número de referencia bancaria)</small>
            <textarea
              className="custom-textarea"
              rows={2}
              value={paymentExplanation}
              onChange={e => setPaymentExplanation(e.target.value)}
              placeholder="Explica cómo pagarás el resto (ej. Abono de 50% por transferencia bancaria Banesco - ref. 123456)"
              required
            ></textarea>
          </div>

          {/* RESUMEN DE PAGO */}
          <div className="booking-summary-receipt">
            <div className="receipt-line">
              <span>Subtotal:</span>
              <span>${subtotal}.00</span>
            </div>
            <div className="receipt-line total-highlight">
              <span>TOTAL A PAGAR:</span>
              <strong>${total}.00</strong>
            </div>
          </div>

          {/* BOTÓN DE ENVÍO */}
          <button
            type="submit"
            className="btn-submit-reservation"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'PROCESANDO RESERVA...' : 'ENVIAR RESERVA'}
          </button>
        </form>
      </div>
    </div>
  );
}
