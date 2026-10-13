# Carabobo Sports — SPORT-FLOW - MVP Demostrativo 100% Funcional

Plataforma unificada para la gestión, seguimiento en vivo, reserva y auditoría de eventos deportivos en el estado Carabobo, desarrollada con **Node.js (Backend)** y **React.js (Frontend)**.

---

## 🌟 Características Principales Implementadas

### 1. Portal del Aficionado / Usuario (User Flow)
- **Landing Page Deportiva Oficial**:
  - Hero banner con eslogan *"COMPETE. FOLLOW. ACHIEVE. Your Central Hub for All Local Sports Events."*.
  - Torneos destacados y últimos marcadores con badges en vivo.
  - Sección explicativa *"How It Works"* con iconografía temática (Globe, Whistle, Trophy).
- **Dashboard de Eventos**:
  - Filtro por disciplinas deportivas (Baloncesto, Fútbol, Voleibol, Béisbol, Atletismo, Natación, Tenis).
  - Sección **Live Now** con tarjeta en vivo (marcador, tiempo de juego, sede y acciones).
  - Cuadrícula de **Eventos Programados** con fecha, hora, sede y rangos de precios.
- **Detalle de Partido y Estadísticas en Vivo**:
  - Marcador en vivo (Live Scoreboard).
  - Gráfico donut interactivo de **Posesión de Balón**.
  - Comparativa de tiros al arco y faltas por equipo.
  - Tabla dinámica de estadísticas individuales de jugadores (Puntos, Asistencias, Goles, Tarjetas).
- **Reserva de Entradas (Book Ticket)**:
  - Selección de nivel: *Normal*, *Primera Fila* y *VIP*.
  - Selector de cantidad con cálculo dinámico de subtotales y totales.
  - Subida y previsualización de comprobante bancario (Banesco / Pago Móvil).
  - Campo explicativo para referencia bancaria o abono adicional.
- **Mis Reservas & Pase Digital QR**:
  - Filtros por estado: *Todas*, *Pendientes* y *Confirmadas*.
  - Transición reactiva de estado: de `EN ESPERA (Admin Verificación)` a `CONFIRMADO (QR Generado)`.
  - **Pase Digital de Estadio**: Modal estilo boleto oficial con código QR dinámico generado con `qrcode.react`, listo para escaneo o impresión.

---

### 2. Portal Administrativo (CaraboboSports Admin Portal)
- **Resumen Ejecutivo (Dashboard Principal)**:
  - Métricas en tiempo real (KPIs) calculadas desde los datos: **Total Eventos**, **Pagos Pendientes**, **Entradas Vendidas**, **Recaudación Total** (recalculables por disciplina).
  - Acciones rápidas: *+ Crear Nuevo Evento*, *Verificar Pagos*, *Cargar Resultados*.
  - Tabla de eventos programados con acciones para posponer o cancelar.
- **Creación de Nuevos Eventos**:
  - Formulario completo con deporte, Equipo A, Equipo B, selector de sedes oficiales de Carabobo (*Forum de Valencia*, *Misael Delgado*, *José Bernardo Pérez*, etc.), fecha, hora y configuración de precios por tier.
- **Auditoría y Verificación de Pagos (Payment Verification)**:
  - Bandeja interactiva con solicitudes de pago pendientes.
  - Modal de inspección de comprobante con zoom en alta resolución.
  - Desglose de entradas solicitadas y explicación de pago del usuario.
  - Botones de acción directa: **APROBAR (Approve)** y **RECHAZAR (Reject)** con registro de motivo.
- **Carga de Resultados y Estadísticas**:
  - Modal para actualizar marcador de partidos (Puntos de Equipo A y B), porcentaje de posesión y métricas por jugador.
- **Listados Masivos de Alta Densidad**:
  - **Listado Detallado de Eventos**: Tabla con filtros por deporte, búsqueda, estados (*Finalizado*, *Programado*, *En Curso*, *Pospuesto*, *Cancelado*) y paginación real.
  - **Listado de Ventas por Evento**: Desglose por tipo de ticket (Normal, Primera Fila, VIP), ocupación por zona, exportación CSV de compradores y reporte global de ingresos.
  - **Listado de Pagos de Todos los Eventos**: Auditoría histórica con ID transacción, montos y estados (*Pagado*, *Pendiente*, *Vencido*, *Rechazado*).

---

### 3. Facilidad de Demostración (Demo Switcher)
- **Conmutador Rápido de Roles (Floating Controller)**:
  - Barra flotante inferior permanente para alternar con un solo clic entre:
    - 👤 **Vista Usuario (Aficionado)**: *Juan Pérez* o *María López*.
    - 🛡️ **Vista Administrador**: *CaraboboSports Admin*.
  - Botón para restablecer los datos de demostración al estado original en cualquier momento.

---

## 🔐 Credenciales de Demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Aficionado | juan.perez@example.com | password123 |
| Aficionado | maria.lopez@example.com | password123 |
| Administrador | admin@carabobosports.com | admin2026 |

Las contraseñas se guardan con hash `scrypt` + salt. Los endpoints administrativos responden 403 si el usuario activo no es administrador.

> **Nota:** el "usuario activo" es global del servidor (pensado para presentar la demo desde un solo navegador). Para uso multiusuario real se debe migrar a sesiones/JWT por petición.

---

## 🚀 Instrucciones para Ejecución Local

### Prerrequisitos
- Node.js v18+ y npm v9+.

### Opción A — Un solo comando (recomendado para la entrega)
```bash
npm run install:all
npm start
```
Compila el frontend y lo sirve junto con la API en 👉 **http://localhost:5000/**

### Opción B — Modo desarrollo (recarga en caliente)
```bash
npm run dev:server   # API en http://localhost:5000
npm run dev:client   # Frontend en http://localhost:5173 (proxy a la API)
```

### Pruebas
```bash
npm test
```
Verifica login con contraseña, el ciclo reserva → aprobación → ventas/QR y el restablecimiento del demo.

### Datos
- La base de datos se guarda en `server/data/db.json` (se crea automáticamente desde `server/data/initialData.js`).
- El botón **Restablecer demo** devuelve todo al estado inicial.
- Los comprobantes subidos se guardan en `server/uploads/` (JPG, PNG, WEBP o PDF, máx. 5 MB).
