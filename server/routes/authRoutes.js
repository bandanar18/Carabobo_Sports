import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Usuario activo de la sesión demo
router.get('/me', (req, res) => {
  res.json({ success: true, user: store.getActiveUser() });
});

// Cuentas demo para el conmutador rápido
router.get('/users', (req, res) => {
  res.json({ success: true, users: store.getUsers() });
});

// Cambio rápido de perfil (barra de demostración)
router.post('/switch-user', (req, res) => {
  const user = store.setActiveUser(req.body.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
  res.json({ success: true, message: `Cambiado a ${user.name}`, user });
});

// Login de aficionado
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Ingrese su correo y contraseña' });
  }
  const user = store.authenticate(email, password, 'USER');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
  }
  res.json({ success: true, message: 'Inicio de sesión exitoso', user });
});

// Login de administrador
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;
  const user = store.authenticate(email, password, 'ADMIN');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas para administrador' });
  }
  res.json({ success: true, message: 'Acceso concedido al Portal Administrativo', user });
});

// Registro de aficionado
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name?.trim() || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nombre, correo y contraseña son requeridos' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'Correo electrónico inválido' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
  }
  if (store.findUserByEmail(email)) {
    return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
  }

  const user = store.createUser({ name, email, phone, password });
  res.status(201).json({ success: true, message: 'Cuenta creada con éxito', user });
});

export default router;
