import express from 'express';
import { store } from '../data/store.js';
import { requireAdmin, paginate } from './helpers.js';

const router = express.Router();
const VALID_STATUSES = ['Programado', 'En Curso', 'Finalizado', 'Cancelado', 'Pospuesto'];

router.get('/meta/sports', (req, res) => {
  res.json({ success: true, sports: store.data.sports });
});

router.get('/meta/venues', (req, res) => {
  res.json({ success: true, venues: store.data.venues });
});

// Listado con filtros, búsqueda y paginación
router.get('/', (req, res) => {
  const { sport, status, search, page, limit = 100 } = req.query;
  const { items, pagination } = paginate(store.getEvents({ sport, status, search }), page, limit);
  res.json({ success: true, data: items, pagination });
});

router.get('/:id', (req, res) => {
  const event = store.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento no encontrado' });
  }
  res.json({ success: true, event });
});

// Crear evento (Admin)
router.post('/', requireAdmin, (req, res) => {
  const { sport, teamA, teamB, venue, date, time, priceNormal, pricePrimeraFila, priceVip } = req.body;
  if (!teamA?.trim() || !teamB?.trim()) {
    return res.status(400).json({ success: false, message: 'Debe ingresar el Equipo A y el Equipo B' });
  }
  if ([priceNormal, pricePrimeraFila, priceVip].some(p => p !== undefined && p !== '' && !(Number(p) > 0))) {
    return res.status(400).json({ success: false, message: 'Los precios deben ser mayores a 0' });
  }

  const newEvent = store.createEvent({
    sport, teamA: teamA.trim(), teamB: teamB.trim(), venue, date, time, priceNormal, pricePrimeraFila, priceVip
  });
  res.status(201).json({ success: true, message: 'Evento publicado exitosamente', event: newEvent });
});

// Cambiar estado (Posponer, Cancelar, En Curso, Finalizado)
router.put('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: `Estado inválido. Use: ${VALID_STATUSES.join(', ')}` });
  }
  const updated = store.updateEventStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Evento no encontrado' });
  }
  res.json({ success: true, message: `Estado actualizado a "${status}"`, event: updated });
});

// Actualizar marcador y estadísticas (Admin)
router.put('/:id/scores-stats', requireAdmin, (req, res) => {
  const { scoreA, scoreB, possessionA, gameTime, playerStats } = req.body;
  const updated = store.updateEventScoreAndStats(req.params.id, { scoreA, scoreB, possessionA, gameTime, playerStats });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Evento no encontrado' });
  }
  res.json({ success: true, message: 'Marcador y estadísticas actualizados correctamente', event: updated });
});

export default router;
