// Prueba del ciclo reserva -> aprobación -> ventas. Ejecutar: npm test (en /server)
import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'os';
import path from 'path';

process.env.DB_FILE = path.join(os.tmpdir(), `sportflow-test-${Date.now()}.json`);
const { store, verifyPassword } = await import('./data/store.js');

test('login valida contraseña y no expone el hash', () => {
  assert.equal(store.authenticate('juan.perez@example.com', 'mala', 'USER'), null);
  const user = store.authenticate('juan.perez@example.com', 'password123', 'USER');
  assert.equal(user.name, 'Juan Pérez');
  assert.equal(user.passwordHash, undefined);
  assert.equal(store.authenticate('juan.perez@example.com', 'password123', 'ADMIN'), null);
  assert.equal(verifyPassword('x', undefined), false);
});

test('reserva -> aprobación suma ventas una sola vez y reset restaura', () => {
  const before = store.getEventById(2).sales.totalSold;
  const booking = store.createBooking({ eventId: 2, tier: 'VIP', quantity: 2, userId: 'usr-1', receiptImage: '/uploads/receipt_sample.svg' });
  assert.equal(booking.total, 200);
  assert.equal(booking.status, 'EN ESPERA');

  store.approveBooking(booking.id);
  store.approveBooking(booking.id); // idempotente
  assert.equal(store.getEventById(2).sales.totalSold, before + 2);
  assert.ok(store.getBookingById(booking.id).qrToken);
  assert.equal(store.getTransactions().find(t => t.bookingId === booking.id).status, 'Pagado');
  assert.equal(store.rejectBooking(booking.id), null); // no se rechaza lo ya confirmado

  store.reset();
  assert.equal(store.getEventById(2).sales.totalSold, before);
  assert.equal(store.getBookingById(booking.id), undefined);
});
