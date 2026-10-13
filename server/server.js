import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (for receipt preview)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Sport-Flow API (CaraboboSports)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Frontend compilado (npm run build) servido desde el mismo puerto
const CLIENT_DIST = path.join(__dirname, '../client/dist');
app.use(express.static(CLIENT_DIST));
app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'), err => err && next());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🏆 SPORT-FLOW API Server corriendo en puerto ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`📁 Uploads estáticos en http://localhost:${PORT}/uploads`);
  console.log(`===============================================`);
});
