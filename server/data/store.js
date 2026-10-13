import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initialEvents, initialUsers, initialBookings, initialTransactions, initialSports, initialVenues } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'db.json');

// --- Password helpers (scrypt + salt por usuario) ---
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(String(password), salt, 32).toString('hex')}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !password) return false;
  const [salt] = stored.split(':');
  const candidate = Buffer.from(hashPassword(password, salt));
  const expected = Buffer.from(stored);
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

// Nunca exponer el hash al cliente
export const publicUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

function seedData() {
  // structuredClone: el reset debe devolver los datos originales, no los objetos ya mutados
  const users = structuredClone(initialUsers).map(({ password, ...u }) => ({ ...u, passwordHash: hashPassword(password) }));
  return {
    events: structuredClone(initialEvents),
    users,
    bookings: structuredClone(initialBookings),
    transactions: structuredClone(initialTransactions),
    sports: structuredClone(initialSports),
    venues: structuredClone(initialVenues),
    activeUserId: users[0].id // Juan Pérez (aficionado) por defecto
  };
}

const tierKey = (tier = '') => {
  const t = tier.toLowerCase();
  if (t === 'vip') return 'vip';
  if (t.includes('primera')) return 'primeraFila';
  return 'normal';
};

class Store {
  constructor() {
    this.data = seedData();
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        this.data = { ...this.data, ...parsed };
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('Error loading DB file, using in-memory defaults:', err);
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // --- Users & Auth ---
  getUsers() {
    return this.data.users.map(publicUser);
  }

  getActiveUser() {
    const user = this.data.users.find(u => u.id === this.data.activeUserId) || this.data.users[0];
    return publicUser(user);
  }

  setActiveUser(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    this.data.activeUserId = user.id;
    this.saveToDisk();
    return publicUser(user);
  }

  findUserByEmail(email = '') {
    return this.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim());
  }

  authenticate(email, password, role) {
    const user = this.findUserByEmail(email);
    if (!user || (role && user.role !== role) || !verifyPassword(password, user.passwordHash)) return null;
    return this.setActiveUser(user.id);
  }

  createUser({ name, email, phone, password }) {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      username: `@user${Math.floor(100 + Math.random() * 900)}`,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      passwordHash: hashPassword(password)
    };
    this.data.users.push(newUser);
    this.data.activeUserId = newUser.id;
    this.saveToDisk();
    return publicUser(newUser);
  }

  // --- Events ---
  getEvents({ sport, status, search } = {}) {
    let result = [...this.data.events];
    if (sport && sport !== 'all') {
      result = result.filter(e => e.sport.toLowerCase() === sport.toLowerCase());
    }
    if (status && status !== 'all') {
      result = result.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.teamA.toLowerCase().includes(q) ||
        e.teamB.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getEventById(id) {
    return this.data.events.find(e => Number(e.id) === Number(id));
  }

  createEvent(eventData) {
    const newId = this.data.events.length > 0 ? Math.max(...this.data.events.map(e => Number(e.id))) + 1 : 1;
    const sport = eventData.sport || 'soccer';
    const newEvent = {
      id: newId,
      name: `${eventData.teamA} vs ${eventData.teamB} - ${sport.toUpperCase()}`,
      sport,
      teamA: eventData.teamA,
      teamB: eventData.teamB,
      venue: eventData.venue || 'Forum de Valencia Pérez',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '07:00 PM',
      status: 'Programado',
      scoreA: 0,
      scoreB: 0,
      gameTime: 'Programado',
      isLive: false,
      prices: {
        normal: Number(eventData.priceNormal) || 20,
        primeraFila: Number(eventData.pricePrimeraFila) || 40,
        vip: Number(eventData.priceVip) || 80
      },
      sales: { normal: 0, primeraFila: 0, vip: 0, totalSold: 0, totalRevenue: 0 },
      teamStats: {
        possessionA: 50,
        possessionB: 50,
        shotsOnTargetA: 0,
        shotsOnTargetB: 0,
        foulsA: 0,
        foulsB: 0
      },
      playerStats: []
    };

    this.data.events.unshift(newEvent);
    this.saveToDisk();
    return newEvent;
  }

  updateEventStatus(id, newStatus) {
    const event = this.getEventById(id);
    if (!event) return null;
    event.status = newStatus;
    event.isLive = newStatus === 'En Curso';
    if (newStatus !== 'En Curso') event.gameTime = newStatus;
    this.saveToDisk();
    return event;
  }

  updateEventScoreAndStats(id, { scoreA, scoreB, possessionA, gameTime, playerStats }) {
    const event = this.getEventById(id);
    if (!event) return null;
    if (scoreA !== undefined) event.scoreA = Math.max(0, Number(scoreA) || 0);
    if (scoreB !== undefined) event.scoreB = Math.max(0, Number(scoreB) || 0);
    if (possessionA !== undefined) {
      const pA = Math.min(100, Math.max(0, Number(possessionA) || 0));
      event.teamStats = { ...event.teamStats, possessionA: pA, possessionB: 100 - pA };
    }
    if (gameTime) event.gameTime = String(gameTime);
    if (Array.isArray(playerStats)) event.playerStats = playerStats;
    this.saveToDisk();
    return event;
  }

  // --- Bookings & Tickets ---
  getBookings(userId) {
    if (userId) return this.data.bookings.filter(b => b.userId === userId);
    return this.data.bookings;
  }

  getBookingById(id) {
    return this.data.bookings.find(b => Number(b.id) === Number(id));
  }

  createBooking(payload) {
    const event = this.getEventById(payload.eventId);
    if (!event) return null;

    const newId = this.data.bookings.length > 0 ? Math.max(...this.data.bookings.map(b => Number(b.id))) + 1 : 101;
    const user = this.data.users.find(u => u.id === payload.userId) || this.data.users[0];
    const unitPrice = event.prices[tierKey(payload.tier)];
    const qty = payload.quantity;
    const total = unitPrice * qty;

    const newBooking = {
      id: newId,
      bookingCode: `SP-${newId}`,
      userId: user.id,
      userName: user.name,
      userHandle: user.username,
      userAvatar: user.avatar,
      eventId: Number(event.id),
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      tier: payload.tier,
      unitPrice,
      quantity: qty,
      subtotal: total,
      discount: 0,
      total,
      status: 'EN ESPERA',
      paymentMethod: payload.paymentMethod || 'Transferencia Bancaria',
      paymentExplanation: payload.paymentExplanation || 'Comprobante de pago adjunto',
      receiptImage: payload.receiptImage,
      qrToken: null,
      createdAt: new Date().toISOString(),
      auditNotes: ''
    };

    this.data.bookings.unshift(newBooking);

    const sportInfo = this.data.sports.find(s => s.id === event.sport);
    this.data.transactions.unshift({
      id: 200 + newId,
      bookingId: newId,
      date: new Date().toLocaleDateString('es-ES'),
      sport: event.sport,
      sportIcon: sportInfo?.icon || '🎟️',
      concept: `Reserva ${newBooking.tier} - ${event.name}`,
      client: newBooking.userName,
      amount: total,
      receiptImage: newBooking.receiptImage,
      status: 'Pendiente'
    });

    this.saveToDisk();
    return newBooking;
  }

  setTransactionStatus(bookingId, status) {
    const trans = this.data.transactions.find(t => Number(t.bookingId) === Number(bookingId));
    if (trans) trans.status = status;
  }

  approveBooking(id, auditNotes = 'Aprobado por administración') {
    const booking = this.getBookingById(id);
    if (!booking) return null;
    if (booking.status === 'CONFIRMADO') return booking; // idempotente: no duplicar ventas

    booking.status = 'CONFIRMADO';
    booking.auditNotes = auditNotes;
    booking.qrToken = `SPORTFLOW-PASS-${booking.id}-${booking.tier.toUpperCase().replace(/\s+/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const event = this.getEventById(booking.eventId);
    if (event) {
      const key = tierKey(booking.tier);
      event.sales[key] = (event.sales[key] || 0) + booking.quantity;
      event.sales.totalSold = (event.sales.totalSold || 0) + booking.quantity;
      event.sales.totalRevenue = (event.sales.totalRevenue || 0) + booking.total;
    }

    this.setTransactionStatus(booking.id, 'Pagado');
    this.saveToDisk();
    return booking;
  }

  rejectBooking(id, reason = 'Recibo ilegible o referencia no válida') {
    const booking = this.getBookingById(id);
    if (!booking) return null;
    if (booking.status === 'CONFIRMADO') return null; // ya contabilizada: no se puede rechazar

    booking.status = 'RECHAZADO';
    booking.auditNotes = reason;
    booking.qrToken = null;

    this.setTransactionStatus(booking.id, 'Rechazado');
    this.saveToDisk();
    return booking;
  }

  // --- Transactions & Reports ---
  getTransactions({ sport, search, status } = {}) {
    let result = [...this.data.transactions];
    if (sport && sport !== 'all') {
      result = result.filter(t => t.sport.toLowerCase() === sport.toLowerCase());
    }
    if (status && status !== 'all') {
      result = result.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.concept.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getDashboardKPIs(sport) {
    const events = this.getEvents({ sport });
    const eventIds = new Set(events.map(e => Number(e.id)));
    const pendingPayments = this.data.bookings.filter(b => b.status === 'EN ESPERA' && eventIds.has(Number(b.eventId))).length;

    return {
      totalEvents: events.length,
      pendingPayments,
      ticketsSold: events.reduce((sum, e) => sum + (e.sales?.totalSold || 0), 0),
      totalRevenue: events.reduce((sum, e) => sum + (e.sales?.totalRevenue || 0), 0),
      liveEvents: events.filter(e => e.status === 'En Curso').length
    };
  }

  reset() {
    this.data = seedData();
    this.saveToDisk();
    return this.data;
  }
}

export const store = new Store();
