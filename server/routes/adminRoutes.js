import express from 'express';
import { store } from '../data/store.js';
import { requireAdmin, paginate } from './helpers.js';

const router = express.Router();

// Reset disponible para cualquier perfil (barra de demostración)
router.post('/reset-demo', (req, res) => {
  store.reset();
  res.json({ success: true, message: 'Datos demostrativos restablecidos al estado inicial.' });
});

router.use(requireAdmin);

// KPIs del Resumen Ejecutivo
router.get('/dashboard', (req, res) => {
  const { sport } = req.query;
  res.json({
    success: true,
    kpis: store.getDashboardKPIs(sport),
    scheduledEvents: store.getEvents({ sport }).slice(0, 6)
  });
});

// Bandeja de verificación de pagos
router.get('/payments/pending', (req, res) => {
  const all = store.getBookings();
  const pending = all.filter(b => b.status === 'EN ESPERA');
  res.json({ success: true, count: pending.length, pendingPayments: pending, allPayments: all });
});

router.post('/payments/:id/approve', (req, res) => {
  const booking = store.approveBooking(req.params.id, req.body.notes || 'Aprobado por administración');
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Pago / Reserva no encontrada' });
  }
  res.json({
    success: true,
    message: `Pago #${booking.id} aprobado exitosamente. Se ha generado el Pase Digital QR.`,
    booking
  });
});

router.post('/payments/:id/reject', (req, res) => {
  const booking = store.rejectBooking(req.params.id, req.body.reason || 'Recibo ilegible o inconsistente');
  if (!booking) {
    return res.status(400).json({ success: false, message: 'Reserva no encontrada o ya confirmada' });
  }
  res.json({ success: true, message: `Pago #${booking.id} rechazado con motivo registrado.`, booking });
});

// Ventas por evento con desglose por tipo de entrada
router.get('/sales-report', (req, res) => {
  const { sport, search, page, limit } = req.query;
  const events = store.getEvents({ sport, search });

  const sales = events.map(e => ({
    eventId: e.id,
    sport: e.sport,
    eventName: e.name,
    eventDateTime: `${e.date} ${e.time}`,
    venue: e.venue,
    totalSold: e.sales?.totalSold || 0,
    normalSold: e.sales?.normal || 0,
    primeraFilaSold: e.sales?.primeraFila || 0,
    vipSold: e.sales?.vip || 0,
    revenue: e.sales?.totalRevenue || 0,
    status: e.status
  }));

  const { items, pagination } = paginate(sales, page, limit);
  res.json({
    success: true,
    summary: {
      totalSold: sales.reduce((s, x) => s + x.totalSold, 0),
      totalRevenue: sales.reduce((s, x) => s + x.revenue, 0),
      totalEventsWithSales: sales.filter(x => x.totalSold > 0).length
    },
    sales: items,
    pagination
  });
});

// Compradores confirmados de un evento (para exportar CSV)
router.get('/events/:id/buyers', (req, res) => {
  const buyers = store.getBookings()
    .filter(b => Number(b.eventId) === Number(req.params.id) && b.status === 'CONFIRMADO')
    .map(({ bookingCode, userName, tier, quantity, total, createdAt }) => ({ bookingCode, userName, tier, quantity, total, createdAt }));
  res.json({ success: true, buyers });
});

// Auditoría de todas las transacciones
router.get('/transactions', (req, res) => {
  const { sport, search, status, page, limit } = req.query;
  const all = store.getTransactions({ sport, search, status });
  const { items, pagination } = paginate(all, page, limit);
  res.json({ success: true, totalTransactions: all.length, transactions: items, pagination });
});

export default router;
