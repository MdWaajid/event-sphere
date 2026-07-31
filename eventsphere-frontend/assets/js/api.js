/* ============================================================
   EventSphere — Data Layer (localStorage + REST API fallback)
   ============================================================
   Priority: Spring Boot REST API → localStorage mock
   Admin default: us@eventsphere.com / Admin@1234
   ============================================================ */

// Local dev (Live Server, file://, etc.) talks to a local backend on :8080.
// A deployed frontend talks to the deployed backend — fill in PRODUCTION_API_URL
// below once your Render backend is live (e.g. "https://eventsphere-backend.onrender.com").
const PRODUCTION_API_URL = 'https://eventsphere-backend-wo2d.onrender.com'; // <-- Render backend

const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const host = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const API_BASE    = isLocal ? `http://${host}:8080/api` : `${PRODUCTION_API_URL}/api`;
const SERVER_BASE = isLocal ? `http://${host}:8080`      : PRODUCTION_API_URL;
const USE_MOCK  = false; // Set true to use localStorage mock instead of real backend

/** Turns a backend-relative image path ("/uploads/events/x.jpg") into a fully-qualified URL. */
function resolveImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return SERVER_BASE + path;
}

// ── Utilities ──────────────────────────────────────────────
const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem('es_' + k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem('es_' + k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem('es_' + k),
};

// ── Seed Data ───────────────────────────────────────────────
function seedInitialData() {
  if (storage.get('seeded')) return;

  const adminPw = btoa('Admin@1234'); // simple obfuscation for demo

  const users = [
    {
      id: 1,
      fullName: 'System Administrator',
      email: 'us@eventsphere.com',
      username: 'us',
      password: adminPw,
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    }
  ];

  const categories = [
    'Technical', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Placement', 'Club Activity'
  ];

  const events = [
    {
      id: 1,
      title: 'AI & Machine Learning Summit 2026',
      description: 'Join industry experts for a deep dive into the latest trends in artificial intelligence, machine learning, and data science. Hands-on workshops, keynotes, and networking sessions included.',
      date: '2026-08-15',
      time: '09:00',
      venue: 'Main Auditorium, Block A',
      category: 'Technical',
      capacity: 200,
      registeredCount: 47,
      imageUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Full Stack Web Development Workshop',
      description: 'A comprehensive 2-day workshop covering React, Node.js, and cloud deployment. Build a real-world project from scratch with mentorship from senior developers.',
      date: '2026-08-20',
      time: '10:00',
      venue: 'Computer Lab 3, Block C',
      category: 'Workshop',
      capacity: 40,
      registeredCount: 38,
      imageUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Campus Cultural Fest — Euphoria 2026',
      description: 'The biggest cultural event of the year! Music, dance, drama, art exhibitions, and food stalls. Open for all students and faculty.',
      date: '2026-09-05',
      time: '16:00',
      venue: 'Open Air Theatre',
      category: 'Cultural',
      capacity: 1000,
      registeredCount: 312,
      imageUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Resume Building & Interview Prep Seminar',
      description: 'HR professionals from top companies will guide you on crafting the perfect resume, acing technical interviews, and soft skills development.',
      date: '2026-08-28',
      time: '11:00',
      venue: 'Seminar Hall, Block B',
      category: 'Placement',
      capacity: 150,
      registeredCount: 95,
      imageUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Inter-College Cricket Tournament',
      description: 'Annual cricket championship open to all departments. Register your team of 11 players. Prizes worth ₹50,000 for the winners.',
      date: '2026-09-12',
      time: '08:00',
      venue: 'College Cricket Ground',
      category: 'Sports',
      capacity: 200,
      registeredCount: 80,
      imageUrl: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Entrepreneurship & Startup Seminar',
      description: 'Learn from successful founders who started from college. Topics: ideation, funding, team building, and the startup ecosystem in India.',
      date: '2026-09-18',
      time: '14:00',
      venue: 'Innovation Hub, Block D',
      category: 'Seminar',
      capacity: 100,
      registeredCount: 22,
      imageUrl: null,
      createdAt: new Date().toISOString()
    }
  ];

  const registrations = [];

  storage.set('users', users);
  storage.set('categories', categories);
  storage.set('events', events);
  storage.set('registrations', registrations);
  storage.set('nextUserId', 2);
  storage.set('nextEventId', 7);
  storage.set('nextRegId', 1);
  storage.set('seeded', true);
}

// ── Mock API ────────────────────────────────────────────────
const Mock = {
  // Auth
  login(email, password) {
    const users = storage.get('users') || [];
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { error: 'No account found with this email.' };
    const encodedPw = btoa(password);
    if (user.password !== encodedPw) return { error: 'Incorrect password.' };
    const { password: _, ...safeUser } = user;
    storage.set('session', safeUser);
    return { user: safeUser };
  },

  register(fullName, email, password) {
    const users = storage.get('users') || [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    const id = storage.get('nextUserId') || (users.length + 2);
    const newUser = {
      id,
      fullName,
      email,
      username: email.split('@')[0],
      password: btoa(password),
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    storage.set('users', users);
    storage.set('nextUserId', id + 1);
    const { password: _, ...safeUser } = newUser;
    storage.set('session', safeUser);
    return { user: safeUser };
  },

  logout() {
    storage.del('session');
    return { success: true };
  },

  getMe() {
    return storage.get('session');
  },

  // Events
  getEvents() {
    return storage.get('events') || [];
  },

  getEvent(id) {
    const events = storage.get('events') || [];
    return events.find(e => e.id === parseInt(id)) || null;
  },

  createEvent(data) {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    const events = storage.get('events') || [];
    const id = storage.get('nextEventId') || (events.length + 1);
    const newEvent = {
      id,
      ...data,
      registeredCount: 0,
      imageUrl: data.imageUrl || null,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    storage.set('events', events);
    storage.set('nextEventId', id + 1);
    return { event: newEvent };
  },

  updateEvent(id, data) {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    const events = storage.get('events') || [];
    const idx = events.findIndex(e => e.id === parseInt(id));
    if (idx === -1) return { error: 'Event not found.' };
    events[idx] = { ...events[idx], ...data };
    storage.set('events', events);
    return { event: events[idx] };
  },

  deleteEvent(id) {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    const events = storage.get('events') || [];
    const filtered = events.filter(e => e.id !== parseInt(id));
    storage.set('events', filtered);
    // Also remove registrations for this event
    const regs = storage.get('registrations') || [];
    storage.set('registrations', regs.filter(r => r.eventId !== parseInt(id)));
    return { success: true };
  },

  // Registrations
  register_event(eventId) {
    const session = storage.get('session');
    if (!session) return { error: 'Please login to register for events.' };
    const events = storage.get('events') || [];
    const regs   = storage.get('registrations') || [];
    const event  = events.find(e => e.id === parseInt(eventId));
    if (!event) return { error: 'Event not found.' };
    if (regs.find(r => r.eventId === parseInt(eventId) && r.userId === session.id)) {
      return { error: 'You have already registered for this event.' };
    }
    if (event.registeredCount >= event.capacity) return { error: 'Event is fully booked.' };
    const id = storage.get('nextRegId') || (regs.length + 1);
    const reg = {
      id,
      userId: session.id,
      userFullName: session.fullName,
      userEmail: session.email,
      eventId: parseInt(eventId),
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventCategory: event.category,
      eventImageUrl: event.imageUrl || null,
      registeredAt: new Date().toISOString()
    };
    regs.push(reg);
    // Increment count
    const eIdx = events.findIndex(e => e.id === parseInt(eventId));
    events[eIdx].registeredCount++;
    storage.set('registrations', regs);
    storage.set('events', events);
    storage.set('nextRegId', id + 1);
    return { registration: reg };
  },

  cancelRegistration(eventId) {
    const session = storage.get('session');
    if (!session) return { error: 'Not logged in.' };
    const regs   = storage.get('registrations') || [];
    const events = storage.get('events') || [];
    const filtered = regs.filter(r => !(r.eventId === parseInt(eventId) && r.userId === session.id));
    if (filtered.length === regs.length) return { error: 'Registration not found.' };
    storage.set('registrations', filtered);
    const eIdx = events.findIndex(e => e.id === parseInt(eventId));
    if (eIdx !== -1 && events[eIdx].registeredCount > 0) events[eIdx].registeredCount--;
    storage.set('events', events);
    return { success: true };
  },

  getMyRegistrations() {
    const session = storage.get('session');
    if (!session) return [];
    const regs = storage.get('registrations') || [];
    return regs.filter(r => r.userId === session.id);
  },

  isRegistered(eventId) {
    const session = storage.get('session');
    if (!session) return false;
    const regs = storage.get('registrations') || [];
    return !!regs.find(r => r.eventId === parseInt(eventId) && r.userId === session.id);
  },

  // Admin
  getAllRegistrations() {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    return storage.get('registrations') || [];
  },

  getAllUsers() {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    const users = storage.get('users') || [];
    return users.map(({ password: _, ...u }) => u);
  },

  deleteUser(id) {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    if (session.id === id) return { error: 'You cannot delete your own account.' };
    const users = storage.get('users') || [];
    const target = users.find(u => u.id === id);
    if (!target) return { error: 'User not found.' };
    if (target.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1) {
      return { error: 'Cannot delete the last remaining admin.' };
    }
    storage.set('users', users.filter(u => u.id !== id));
    const regs = (storage.get('registrations') || []).filter(r => r.userId !== id);
    storage.set('registrations', regs);
    return { message: 'User deleted.' };
  },

  addAdmin(fullName, email, password) {
    const session = storage.get('session');
    if (!session || session.role !== 'ADMIN') return { error: 'Admin access required.' };
    const users = storage.get('users') || [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    const id = storage.get('nextUserId') || (users.length + 2);
    const newAdmin = {
      id,
      fullName,
      email,
      username: email.split('@')[0],
      password: btoa(password),
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };
    users.push(newAdmin);
    storage.set('users', users);
    storage.set('nextUserId', id + 1);
    const { password: _, ...safeAdmin } = newAdmin;
    return { user: safeAdmin };
  },

  getStats() {
    const events = storage.get('events') || [];
    const regs   = storage.get('registrations') || [];
    const users  = (storage.get('users') || []).filter(u => u.role === 'USER');
    const admins = (storage.get('users') || []).filter(u => u.role === 'ADMIN');
    return {
      totalEvents: events.length,
      totalRegistrations: regs.length,
      totalUsers: users.length,
      totalAdmins: admins.length,
      upcomingEvents: events.filter(e => {
        const d = String(e.date).substring(0,10);
        const t = new Date().toISOString().substring(0,10);
        return d >= t;
      }).length,
    };
  },

  getCategories() {
    return storage.get('categories') || [];
  }
};

// ── Real REST API (when backend is running) ─────────────────
async function apiFetch(path, options = {}) {
  const token = storage.get('token');
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || 'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}


// ── Public API Surface ──────────────────────────────────────
const API = {
  async login(email, password) {
    if (USE_MOCK) return Mock.login(email, password);
    const result = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (result && result.user) storage.set('session', result.user);
    if (result && result.token) storage.set('token', result.token);
    return result;
  },
  async register(fullName, email, password) {
    if (USE_MOCK) return Mock.register(fullName, email, password);
    const result = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ fullName, email, password }) });
    if (result && result.user) storage.set('session', result.user);
    if (result && result.token) storage.set('token', result.token);
    return result;
  },
  async logout() {
    if (USE_MOCK) return Mock.logout();
    storage.del('session');
    storage.del('token');
    return apiFetch('/auth/logout', { method: 'POST' });
  },
  async getMe() {
    if (USE_MOCK) return Mock.getMe();
    try {
      const result = await apiFetch('/auth/me');
      if (result && result.user) storage.set('session', result.user);
      return result ? result.user : null;
    } catch {
      storage.del('session');
      return null;
    }
  },

  async getEvents() {
    if (USE_MOCK) return Mock.getEvents();
    return apiFetch('/events');
  },
  async getEvent(id) {
    if (USE_MOCK) return Mock.getEvent(id);
    return apiFetch('/events/' + id);
  },
  async createEvent(data) {
    if (USE_MOCK) return Mock.createEvent(data);
    return apiFetch('/events', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateEvent(id, data) {
    if (USE_MOCK) return Mock.updateEvent(id, data);
    return apiFetch('/events/' + id, { method: 'PUT', body: JSON.stringify(data) });
  },
  async uploadEventImage(file) {
    if (USE_MOCK) {
      // No real storage in mock mode — just preview locally via object URL.
      return { url: URL.createObjectURL(file) };
    }
    const formData = new FormData();
    formData.append('file', file);
    const token = storage.get('token');
    const res = await fetch(API_BASE + '/uploads/event-image', {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData,
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error || 'Image upload failed');
    return result;
  },
  async deleteEvent(id) {
    if (USE_MOCK) return Mock.deleteEvent(id);
    return apiFetch('/events/' + id, { method: 'DELETE' });
  },

  async registerForEvent(eventId) {
    if (USE_MOCK) return Mock.register_event(eventId);
    return apiFetch('/registrations', { method: 'POST', body: JSON.stringify({ eventId }) });
  },
  async cancelRegistration(eventId) {
    if (USE_MOCK) return Mock.cancelRegistration(eventId);
    return apiFetch('/registrations/' + eventId, { method: 'DELETE' });
  },
  async getMyRegistrations() {
    if (USE_MOCK) return Mock.getMyRegistrations();
    return apiFetch('/registrations/my');
  },
  async isRegistered(eventId) {
    if (USE_MOCK) return Mock.isRegistered(eventId);
    return apiFetch('/registrations/check/' + eventId);
  },

  async getAllRegistrations() {
    if (USE_MOCK) return Mock.getAllRegistrations();
    return apiFetch('/admin/registrations');
  },
  async getAllUsers() {
    if (USE_MOCK) return Mock.getAllUsers();
    return apiFetch('/admin/users');
  },
  async deleteUser(id) {
    if (USE_MOCK) return Mock.deleteUser(id);
    return apiFetch('/admin/users/' + id, { method: 'DELETE' });
  },
  async addAdmin(fullName, email, password) {
    if (USE_MOCK) return Mock.addAdmin(fullName, email, password);
    return apiFetch('/admin/users', { method: 'POST', body: JSON.stringify({ fullName, email, password, role: 'ADMIN' }) });
  },
  async getStats() {
    if (USE_MOCK) return Mock.getStats();
    return apiFetch('/admin/stats');
  },
  async getCategories() {
    if (USE_MOCK) return Mock.getCategories();
    return apiFetch('/categories');
  }
};

// ── Helpers ─────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const date = new Date(); date.setHours(+h, +m);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}


function isEventPast(dateStr) {
  if (!dateStr) return false;
  // Compare date strings at day level to avoid timezone issues
  const eventDate = String(dateStr).substring(0, 10);
  const today = new Date().toISOString().substring(0, 10);
  return eventDate < today;
}

function getCapacityPercent(registered, capacity) {
  return Math.min(100, Math.round((registered / capacity) * 100));
}

function toast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const iconNames = { success: 'checkCircle', danger: 'xCircle', info: 'info' };
  t.className = 'toast toast-' + type;
  t.innerHTML = `${iconHTML(iconNames[type] || 'info', 'icon-sm')}<span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function initPage() {
  seedInitialData();
  // Navbar scroll
  const nav = document.querySelector('.navbar');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
  }
}

// Auto-run on every page
document.addEventListener('DOMContentLoaded', initPage);
