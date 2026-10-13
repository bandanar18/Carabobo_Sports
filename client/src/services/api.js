const API_BASE = '/api';

export const api = {
  // --- Auth & Users ---
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },
  switchUser: async (userId) => {
    const res = await fetch(`${API_BASE}/auth/switch-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  adminLogin: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // --- Events ---
  getEvents: async ({ sport, status, search, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (sport && sport !== 'all') params.append('sport', sport);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const res = await fetch(`${API_BASE}/events?${params.toString()}`);
    return res.json();
  },
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}`);
    return res.json();
  },
  createEvent: async (eventData) => {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return res.json();
  },
  updateEventStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/events/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  updateScoreAndStats: async (id, payload) => {
    const res = await fetch(`${API_BASE}/events/${id}/scores-stats`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // --- Bookings ---
  createBooking: async (formData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      body: formData // multipart/form-data
    });
    return res.json();
  },
  getMyBookings: async (filter = 'all') => {
    const res = await fetch(`${API_BASE}/bookings/my-bookings?filter=${filter}`);
    return res.json();
  },

  // --- Admin ---
  getAdminDashboard: async (sport) => {
    const qs = sport && sport !== 'all' ? `?sport=${encodeURIComponent(sport)}` : '';
    const res = await fetch(`${API_BASE}/admin/dashboard${qs}`);
    return res.json();
  },
  getPendingPayments: async () => {
    const res = await fetch(`${API_BASE}/admin/payments/pending`);
    return res.json();
  },
  approvePayment: async (id, notes) => {
    const res = await fetch(`${API_BASE}/admin/payments/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    return res.json();
  },
  rejectPayment: async (id, reason) => {
    const res = await fetch(`${API_BASE}/admin/payments/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },
  getSalesReport: async (sport, search, page, limit) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (sport && sport !== 'all') params.append('sport', sport);
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    const res = await fetch(`${API_BASE}/admin/sales-report?${params.toString()}`);
    return res.json();
  },
  getEventBuyers: async (eventId) => {
    const res = await fetch(`${API_BASE}/admin/events/${eventId}/buyers`);
    return res.json();
  },
  getTransactions: async (sport, search, page, status) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (sport && sport !== 'all') params.append('sport', sport);
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    const res = await fetch(`${API_BASE}/admin/transactions?${params.toString()}`);
    return res.json();
  },
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/admin/reset-demo`, { method: 'POST' });
    return res.json();
  }
};
