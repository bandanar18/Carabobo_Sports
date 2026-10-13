// Datos iniciales de demostración basados en las capturas del requerimiento Sport-Flow / CaraboboSports

export const initialSports = [
  { id: 'all', name: 'Todos los Deportes', icon: '🏆' },
  { id: 'soccer', name: 'Fútbol', icon: '⚽' },
  { id: 'basketball', name: 'Baloncesto', icon: '🏀' },
  { id: 'baseball', name: 'Béisbol', icon: '⚾' },
  { id: 'volleyball', name: 'Voleibol', icon: '🏐' },
  { id: 'running', name: 'Atletismo / Maratón', icon: '🏃' },
  { id: 'tennis', name: 'Tenis', icon: '🎾' },
  { id: 'swimming', name: 'Natación', icon: '🏊' }
];

export const initialVenues = [
  'Forum de Valencia Pérez',
  'Polideportivo Misael Delgado',
  'Estadio José Bernardo Pérez',
  'Gimnasio Teodoro Gubaira',
  'Piscina Olímpica de Valencia',
  'Complejo Deportivo Bicentenario'
];

export const initialEvents = [
  {
    id: 1,
    name: 'Uora A vs Uora B - Baloncesto',
    sport: 'basketball',
    teamA: 'Uora A',
    teamB: 'Uora B',
    venue: 'Forum de Valencia Pérez',
    date: '2026-10-14',
    time: '12:00 PM',
    status: 'En Curso', // Live Now
    scoreA: 84,
    scoreB: 82,
    gameTime: '4to Cuarto - 02:45',
    isLive: true,
    prices: {
      normal: 30,
      primeraFila: 60,
      vip: 100
    },
    sales: {
      normal: 800,
      primeraFila: 250,
      vip: 150,
      totalSold: 1200,
      totalRevenue: 54000
    },
    teamStats: {
      possessionA: 52,
      possessionB: 48,
      shotsOnTargetA: 38,
      shotsOnTargetB: 35,
      foulsA: 14,
      foulsB: 18
    },
    playerStats: [
      { id: 'p1', name: 'Player A', team: 'Uora A', position: 'Base', points: 22, rebounds: 4, assists: 8, fouls: 2 },
      { id: 'p2', name: 'Player B', team: 'Uora A', position: 'Escolta', points: 19, rebounds: 5, assists: 4, fouls: 1 },
      { id: 'p3', name: 'Player C', team: 'Uora A', position: 'Alero', points: 14, rebounds: 7, assists: 3, fouls: 3 },
      { id: 'p4', name: 'Player D', team: 'Uora A', position: 'Ala-Pívot', points: 12, rebounds: 10, assists: 1, fouls: 4 },
      { id: 'p5', name: 'Player E', team: 'Uora B', position: 'Pívot', points: 18, rebounds: 12, assists: 2, fouls: 2 },
      { id: 'p6', name: 'Player F', team: 'Uora B', position: 'Base', points: 20, rebounds: 3, assists: 7, fouls: 3 }
    ]
  },
  {
    id: 2,
    name: 'Trotamundos BC vs Cocodrilos',
    sport: 'basketball',
    teamA: 'Trotamundos BC',
    teamB: 'Cocodrilos',
    venue: 'Forum de Valencia Pérez',
    date: '2026-10-18',
    time: '07:00 PM',
    status: 'Programado',
    scoreA: 0,
    scoreB: 0,
    gameTime: 'Programado',
    isLive: false,
    prices: {
      normal: 25,
      primeraFila: 50,
      vip: 100
    },
    sales: {
      normal: 450,
      primeraFila: 180,
      vip: 90,
      totalSold: 720,
      totalRevenue: 29250
    },
    teamStats: {
      possessionA: 50,
      possessionB: 50,
      shotsOnTargetA: 0,
      shotsOnTargetB: 0,
      foulsA: 0,
      foulsB: 0
    },
    playerStats: []
  },
  {
    id: 3,
    name: 'Carabobo FC vs Deportivo Táchira',
    sport: 'soccer',
    teamA: 'Carabobo FC',
    teamB: 'Deportivo Táchira',
    venue: 'Polideportivo Misael Delgado',
    date: '2026-10-15',
    time: '05:00 PM',
    status: 'En Curso',
    scoreA: 2,
    scoreB: 1,
    gameTime: '78 min',
    isLive: true,
    prices: {
      normal: 15,
      primeraFila: 35,
      vip: 80
    },
    sales: {
      normal: 1200,
      primeraFila: 400,
      vip: 200,
      totalSold: 1800,
      totalRevenue: 48000
    },
    teamStats: {
      possessionA: 58,
      possessionB: 42,
      shotsOnTargetA: 7,
      shotsOnTargetB: 4,
      foulsA: 11,
      foulsB: 15
    },
    playerStats: [
      { id: 'f1', name: 'Carlos Silva', team: 'Carabobo FC', position: 'Delantero', points: 0, goals: 2, yellowCards: 0, redCards: 0, assists: 0, fouls: 1 },
      { id: 'f2', name: 'Luis Pérez', team: 'Carabobo FC', position: 'Mediocampista', points: 0, goals: 0, yellowCards: 1, redCards: 0, assists: 1, fouls: 3 },
      { id: 'f3', name: 'José Romero', team: 'Deportivo Táchira', position: 'Delantero', points: 0, goals: 1, yellowCards: 0, redCards: 0, assists: 0, fouls: 2 }
    ]
  },
  {
    id: 18,
    name: 'Final del Torneo Profesional de Béisbol',
    sport: 'baseball',
    teamA: 'Navegantes del Magallanes',
    teamB: 'Leones del Caracas',
    venue: 'Estadio José Bernardo Pérez',
    date: '2026-10-25',
    time: '07:30 PM',
    status: 'Programado',
    scoreA: 0,
    scoreB: 0,
    gameTime: 'Programado',
    isLive: false,
    prices: {
      normal: 20,
      primeraFila: 45,
      vip: 90
    },
    sales: {
      normal: 2500,
      primeraFila: 800,
      vip: 350,
      totalSold: 3650,
      totalRevenue: 117500
    },
    teamStats: {
      possessionA: 50,
      possessionB: 50,
      shotsOnTargetA: 0,
      shotsOnTargetB: 0,
      foulsA: 0,
      foulsB: 0
    },
    playerStats: []
  },
  {
    id: 16,
    name: 'Maratón Carabobo 10K',
    sport: 'running',
    teamA: 'Club Valencia Runners',
    teamB: 'Atletas Invitados',
    venue: 'Polideportivo Misael Delgado',
    date: '2026-11-02',
    time: '06:30 AM',
    status: 'Programado',
    scoreA: 0,
    scoreB: 0,
    gameTime: 'Programado',
    isLive: false,
    prices: {
      normal: 25,
      primeraFila: 25,
      vip: 50
    },
    sales: {
      normal: 800,
      primeraFila: 250,
      vip: 150,
      totalSold: 1200,
      totalRevenue: 33750
    },
    teamStats: { possessionA: 50, possessionB: 50, shotsOnTargetA: 0, shotsOnTargetB: 0, foulsA: 0, foulsB: 0 },
    playerStats: []
  },
  {
    id: 21,
    name: 'Copa Regional de Voleibol Femenino',
    sport: 'volleyball',
    teamA: 'Club Carabobo Volley',
    teamB: 'Guaras de Lara',
    venue: 'Gimnasio Teodoro Gubaira',
    date: '2026-10-20',
    time: '04:00 PM',
    status: 'Programado',
    scoreA: 0,
    scoreB: 0,
    gameTime: 'Programado',
    isLive: false,
    prices: {
      normal: 10,
      primeraFila: 20,
      vip: 40
    },
    sales: {
      normal: 600,
      primeraFila: 250,
      vip: 150,
      totalSold: 1000,
      totalRevenue: 17000
    },
    teamStats: { possessionA: 50, possessionB: 50, shotsOnTargetA: 0, shotsOnTargetB: 0, foulsA: 0, foulsB: 0 },
    playerStats: []
  },
  {
    id: 25,
    name: 'Torneo Máster de Natación Carabobo',
    sport: 'swimming',
    teamA: 'Tiburones de Valencia',
    teamB: 'Delfines del Cabriales',
    venue: 'Piscina Olímpica de Valencia',
    date: '2026-10-12',
    time: '09:00 AM',
    status: 'Finalizado',
    scoreA: 145,
    scoreB: 132,
    gameTime: 'Finalizado',
    isLive: false,
    prices: { normal: 10, primeraFila: 15, vip: 30 },
    sales: { normal: 300, primeraFila: 100, vip: 50, totalSold: 450, totalRevenue: 6000 },
    teamStats: { possessionA: 52, possessionB: 48, shotsOnTargetA: 0, shotsOnTargetB: 0, foulsA: 0, foulsB: 0 },
    playerStats: []
  },
  {
    id: 37,
    name: 'Abierto de Tenis Carabobo Open',
    sport: 'tennis',
    teamA: 'Alejandro Gómez',
    teamB: 'Roberto Benítez',
    venue: 'Complejo Deportivo Bicentenario',
    date: '2026-10-08',
    time: '03:00 PM',
    status: 'Cancelado',
    scoreA: 0,
    scoreB: 0,
    gameTime: 'Cancelado por lluvia',
    isLive: false,
    prices: { normal: 20, primeraFila: 40, vip: 70 },
    sales: { normal: 0, primeraFila: 0, vip: 0, totalSold: 0, totalRevenue: 0 },
    teamStats: { possessionA: 50, possessionB: 50, shotsOnTargetA: 0, shotsOnTargetB: 0, foulsA: 0, foulsB: 0 },
    playerStats: []
  }
];

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Juan Pérez',
    username: '@user123',
    email: 'juan.perez@example.com',
    password: 'password123',
    phone: '+58 412 1234567',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-2',
    name: 'María López',
    username: '@user124',
    email: 'maria.lopez@example.com',
    password: 'password123',
    phone: '+58 414 9876543',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-admin',
    name: 'Administrador CaraboboSports',
    username: '@admin',
    email: 'admin@carabobosports.com',
    password: 'admin2026',
    phone: '+58 424 5550000',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];

export const initialBookings = [
  {
    id: 101,
    bookingCode: 'SP-101',
    userId: 'usr-1',
    userName: 'Juan Pérez',
    userHandle: '@user123',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    eventId: 1,
    eventName: 'Uora A vs Uora B - Baloncesto',
    eventDate: '2026-10-14',
    eventTime: '12:00 PM',
    venue: 'Forum de Valencia Pérez',
    tier: 'VIP',
    unitPrice: 100,
    quantity: 2,
    subtotal: 200,
    discount: 0,
    total: 200,
    status: 'CONFIRMADO', // CONFIRMADO | EN ESPERA | RECHAZADO
    paymentMethod: 'Transferencia Bancaria Banesco',
    paymentExplanation: 'Abono de 50% por transferencia bancaria (Banesco) - ref. 123456',
    receiptImage: '/uploads/receipt_sample.svg',
    qrToken: 'SPORTFLOW-PASS-101-VIP-QR2026',
    createdAt: '2026-10-12T10:30:00Z',
    auditNotes: 'Pago verificado correctamente en cuenta de CaraboboSports'
  },
  {
    id: 102,
    bookingCode: 'SP-102',
    userId: 'usr-2',
    userName: 'María López',
    userHandle: '@user124',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    eventId: 3,
    eventName: 'Carabobo FC vs Deportivo Táchira',
    eventDate: '2026-10-15',
    eventTime: '05:00 PM',
    venue: 'Polideportivo Misael Delgado',
    tier: 'Normal',
    unitPrice: 15,
    quantity: 2,
    subtotal: 30,
    discount: 1,
    total: 29,
    status: 'EN ESPERA',
    paymentMethod: 'Pago Móvil Mercantil',
    paymentExplanation: 'Pago Móvil Mercantil ref 987654. Abono de $29.',
    receiptImage: '/uploads/receipt_sample.svg',
    qrToken: null,
    createdAt: '2026-10-13T09:15:00Z',
    auditNotes: ''
  },
  {
    id: 103,
    bookingCode: 'SP-103',
    userId: 'usr-1',
    userName: 'Juan Pérez',
    userHandle: '@user123',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    eventId: 18,
    eventName: 'Final del Torneo Profesional de Béisbol',
    eventDate: '2026-10-25',
    eventTime: '07:30 PM',
    venue: 'Estadio José Bernardo Pérez',
    tier: 'Primera Fila',
    unitPrice: 45,
    quantity: 1,
    subtotal: 45,
    discount: 0,
    total: 45,
    status: 'RECHAZADO',
    paymentMethod: 'Transferencia Bancaria',
    paymentExplanation: 'Transferencia de $45 - banco Venezuela ref 002341',
    receiptImage: '/uploads/receipt_sample.svg',
    qrToken: null,
    createdAt: '2026-10-11T14:20:00Z',
    auditNotes: 'Rechazado (Motivo: recibo ilegible y número de referencia no coincide)'
  }
];

export const initialTransactions = [
  { id: 116, date: '29/06/2023', sport: 'basketball', sportIcon: '🏀', concept: 'Inscripción Final Torneo', client: 'Juan Pérez', amount: 100.00, status: 'Pagado' },
  { id: 117, date: '29/06/2023', sport: 'running', sportIcon: '🏃', concept: 'Pago Cuota Maratón', client: 'María López', amount: 75.00, status: 'Pendiente' },
  { id: 118, date: '29/06/2023', sport: 'baseball', sportIcon: '⚾', concept: 'Pago Cuota Maratón', client: 'Juan Pérez', amount: 100.00, status: 'Pendiente' },
  { id: 109, date: '29/06/2023', sport: 'soccer', sportIcon: '⚽', concept: 'Pago Cuota Maratón', client: 'María López', amount: 150.00, status: 'Pagado' },
  { id: 180, date: '18/06/2023', sport: 'basketball', sportIcon: '🏀', concept: 'Pago Cuota Final Torneo', client: 'María López', amount: 100.00, status: 'Pendiente' },
  { id: 171, date: '18/06/2023', sport: 'volleyball', sportIcon: '🏐', concept: 'Pago Cuota Maratón', client: 'María Pérez', amount: 30.00, status: 'Vencido' },
  { id: 172, date: '18/06/2023', sport: 'tennis', sportIcon: '🎾', concept: 'Pago Cuota Maratón', client: 'Juan Grumez', amount: 50.00, status: 'Rechazado' },
  { id: 133, date: '18/06/2023', sport: 'volleyball', sportIcon: '🏐', concept: 'Copa Regional de Voleibol Femenino', client: 'María Pérez', amount: 25.00, status: 'Pagado' },
  { id: 13, date: '18/06/2023', sport: 'volleyball', sportIcon: '🏐', concept: 'Copa Regional de Voleibol Femenino', client: 'Jartin Pérez', amount: 15.00, status: 'Pagado' },
  { id: 132, date: '18/06/2023', sport: 'volleyball', sportIcon: '🏐', concept: 'Copa Regional de Voleibol Femenino', client: 'Jarrin Pérez', amount: 20.00, status: 'Pendiente' },
  { id: 134, date: '18/06/2023', sport: 'volleyball', sportIcon: '🏐', concept: 'Pago Cuota Maratón', client: 'María López', amount: 15.00, status: 'Vencido' },
  { id: 135, date: '18/06/2023', sport: 'basketball', sportIcon: '🏀', concept: 'Pago Cuota Maratón', client: 'María López', amount: 10.00, status: 'Rechazado' },
  { id: 136, date: '18/06/2023', sport: 'basketball', sportIcon: '🏀', concept: 'Pago Cuota Maratón', client: 'María Romoz', amount: 20.00, status: 'Rechazado' },
  { id: 137, date: '18/06/2023', sport: 'basketball', sportIcon: '🏀', concept: 'Pago Cuota Maratón', client: 'Janes Pérez', amount: 20.00, status: 'Pagado' }
];
