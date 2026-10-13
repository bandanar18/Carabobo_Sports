import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from '../data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const TIERS = ['Normal', 'Primera Fila', 'VIP'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

// Comprobantes de pago: solo imágenes/PDF, máx. 5 MB
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `receipt-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ALLOWED_EXT.includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Formato de comprobante no permitido (use JPG, PNG, WEBP o PDF)'), ok);
  }
});

// Crear reserva con comprobante
router.post('/', (req, res) => {
  upload.single('receipt')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'El comprobante supera los 5 MB' : err.message;
      return res.status(400).json({ success: false, message });
    }

    const { eventId, tier = 'Normal', quantity, paymentMethod, paymentExplanation } = req.body;
    const qty = parseInt(quantity) || 1;
    const event = store.getEventById(eventId);

    if (!event) {
      return res.status(400).json({ success: false, message: 'Debe especificar un evento válido' });
    }
    if (['Cancelado', 'Finalizado'].includes(event.status)) {
      return res.status(400).json({ success: false, message: `No se pueden reservar entradas: evento ${event.status.toLowerCase()}` });
    }
    if (!TIERS.includes(tier)) {
      return res.status(400).json({ success: false, message: 'Tipo de entrada inválido' });
    }
    if (qty < 1 || qty > 10) {
      return res.status(400).json({ success: false, message: 'La cantidad debe estar entre 1 y 10 entradas' });
    }

    const activeUser = store.getActiveUser();
    const booking = store.createBooking({
      eventId,
      tier,
      quantity: qty,
      paymentMethod,
      paymentExplanation,
      // ponytail: sin archivo se usa el comprobante de muestra para agilizar la demo
      receiptImage: req.file ? `/uploads/${req.file.filename}` : '/uploads/receipt_sample.svg',
      userId: activeUser.id
    });

    res.status(201).json({
      success: true,
      message: 'Reserva enviada exitosamente. Está en espera de verificación por administración.',
      booking
    });
  });
});

// Reservas del usuario activo
router.get('/my-bookings', (req, res) => {
  const { filter } = req.query; // all | pending | confirmed
  let bookings = store.getBookings(store.getActiveUser().id);

  if (filter === 'pending') bookings = bookings.filter(b => b.status === 'EN ESPERA');
  else if (filter === 'confirmed') bookings = bookings.filter(b => b.status === 'CONFIRMADO');

  res.json({ success: true, bookings });
});

// Detalle de reserva (solo dueño o admin)
router.get('/:id', (req, res) => {
  const booking = store.getBookingById(req.params.id);
  const user = store.getActiveUser();
  if (!booking || (booking.userId !== user.id && user.role !== 'ADMIN')) {
    return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
  }
  res.json({ success: true, booking });
});

export default router;
