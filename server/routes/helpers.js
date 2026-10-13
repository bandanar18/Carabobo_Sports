import { store } from '../data/store.js';

// ponytail: el "usuario activo" es global del servidor (demo de una sola sesión).
// Para multiusuario real: sesiones/JWT por petición.
export function requireAdmin(req, res, next) {
  if (store.getActiveUser()?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Acceso restringido al Portal Administrativo' });
  }
  next();
}

export function paginate(items, page = 1, limit = 15) {
  const limitNum = Math.min(Math.max(parseInt(limit) || 15, 1), 500);
  const totalPages = Math.max(1, Math.ceil(items.length / limitNum));
  const currentPage = Math.min(Math.max(parseInt(page) || 1, 1), totalPages);
  return {
    items: items.slice((currentPage - 1) * limitNum, currentPage * limitNum),
    pagination: { currentPage, totalPages, totalItems: items.length, limit: limitNum }
  };
}
