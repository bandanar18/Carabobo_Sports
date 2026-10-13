import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import UserDashboardView from './components/UserDashboardView';
import EventDetailsView from './components/EventDetailsView';
import MyBookingsView from './components/MyBookingsView';
import BookTicketModal from './components/BookTicketModal';
import DigitalPassModal from './components/DigitalPassModal';
import AdminExecutiveDashboard from './components/AdminExecutiveDashboard';
import AdminCreateEventModal from './components/AdminCreateEventModal';
import AdminPaymentVerificationModal from './components/AdminPaymentVerificationModal';
import AdminScoreStatsModal from './components/AdminScoreStatsModal';
import AdminAllEventsView from './components/AdminAllEventsView';
import AdminSalesReportView from './components/AdminSalesReportView';
import AdminAllPaymentsView from './components/AdminAllPaymentsView';
import AuthModal from './components/AuthModal';
import './App.css';

export default function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState('landing');
  const [selectedSport, setSelectedSport] = useState('all');

  const [events, setEvents] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);

  // Modals state
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [bookEventModal, setBookEventModal] = useState(null);
  const [digitalPassModal, setDigitalPassModal] = useState(null);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [paymentAuditModalOpen, setPaymentAuditModalOpen] = useState(false);
  const [scoreStatsModalEvent, setScoreStatsModalEvent] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [meRes, usersRes, eventsRes, kpiRes, bookingsRes, paymentsRes] = await Promise.all([
        api.getMe(),
        api.getUsers(),
        api.getEvents(),
        api.getAdminDashboard(),
        api.getMyBookings(),
        api.getPendingPayments()
      ]);

      if (meRes.success) setActiveUser(meRes.user);
      if (usersRes.success) setUsers(usersRes.users);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (kpiRes.success) setKpis(kpiRes.kpis);
      if (bookingsRes.success) setMyBookings(bookingsRes.bookings);
      if (paymentsRes.success) {
        setPendingPayments(paymentsRes.pendingPayments || []);
        setAllPayments(paymentsRes.allPayments || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const reloadEventsAndDashboard = async () => {
    try {
      const [eventsRes, kpiRes, paymentsRes, bookingsRes] = await Promise.all([
        api.getEvents(),
        api.getAdminDashboard(),
        api.getPendingPayments(),
        api.getMyBookings()
      ]);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (kpiRes.success) setKpis(kpiRes.kpis);
      if (paymentsRes.success) {
        setPendingPayments(paymentsRes.pendingPayments || []);
        setAllPayments(paymentsRes.allPayments || []);
      }
      if (bookingsRes.success) setMyBookings(bookingsRes.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  // User Switch
  const handleSwitchUser = async (userId) => {
    try {
      const res = await api.switchUser(userId);
      if (res.success) {
        setActiveUser(res.user);
        await reloadEventsAndDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Book Ticket Submit
  const handleSubmitBooking = async (formData) => {
    try {
      const res = await api.createBooking(formData);
      if (res.success) {
        setBookEventModal(null);
        await reloadEventsAndDashboard();
        setCurrentView('my-bookings');
        alert('¡Reserva enviada con éxito! Está en espera de verificación por administración.');
      } else {
        alert(res.message || 'Error al procesar la reserva.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al enviar la reserva.');
    }
  };

  // Admin Payment Approval
  const handleApprovePayment = async (id, notes) => {
    try {
      const res = await api.approvePayment(id, notes);
      if (!res.success) alert(res.message);
      await reloadEventsAndDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Payment Rejection
  const handleRejectPayment = async (id, reason) => {
    try {
      const res = await api.rejectPayment(id, reason);
      if (!res.success) alert(res.message);
      await reloadEventsAndDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Create Event
  const handleCreateEvent = async (eventData) => {
    try {
      const res = await api.createEvent(eventData);
      if (res.success) {
        await reloadEventsAndDashboard();
        setCreateEventModalOpen(false);
        alert('¡Nuevo evento publicado exitosamente en el catálogo regional!');
      } else {
        alert(res.message || 'No se pudo crear el evento.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Update Event Status
  const handleUpdateEventStatus = async (id, status) => {
    try {
      const res = await api.updateEventStatus(id, status);
      if (res.success) {
        await reloadEventsAndDashboard();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Save Scores
  const handleSaveScores = async (id, payload) => {
    try {
      const res = await api.updateScoreAndStats(id, payload);
      if (res.success) {
        await reloadEventsAndDashboard();
        if (selectedEventDetails && selectedEventDetails.id === id) {
          const detailRes = await api.getEventById(id);
          if (detailRes.success) setSelectedEventDetails(detailRes.event);
        }
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Demo
  const handleResetDemo = async () => {
    if (window.confirm('¿Desea restablecer todos los datos del demo al estado original?')) {
      await api.resetDemo();
      await loadInitialData();
      alert('Datos de demo restablecidos con éxito.');
    }
  };

  // Open Details
  const handleSelectEventDetails = async (id) => {
    try {
      const res = await api.getEventById(id);
      if (res.success) {
        setSelectedEventDetails(res.event);
        setCurrentView('event-details');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = activeUser?.role === 'ADMIN';

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeUser={activeUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onResetDemo={handleResetDemo}
      />

      {/* Main View Router */}
      <main className="main-viewport">
        {currentView === 'landing' && (
          <LandingView
            onNavigateToEvents={() => setCurrentView('events')}
            onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
            onSelectEventForDetails={handleSelectEventDetails}
            featuredEvents={events}
          />
        )}

        {currentView === 'events' && (
          <UserDashboardView
            events={events}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            onOpenBookModal={(event) => setBookEventModal(event)}
            onSelectEventDetails={handleSelectEventDetails}
          />
        )}

        {currentView === 'event-details' && (
          <EventDetailsView
            event={selectedEventDetails}
            onBack={() => setCurrentView('events')}
            onOpenBookModal={(event) => setBookEventModal(event)}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsView
            bookings={myBookings}
            onOpenPassModal={(b) => setDigitalPassModal(b)}
            onNavigateToEvents={() => setCurrentView('events')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminExecutiveDashboard
            kpis={kpis}
            setKpis={setKpis}
            events={events}
            onOpenCreateEvent={() => setCreateEventModalOpen(true)}
            onOpenPaymentAudit={() => setPaymentAuditModalOpen(true)}
            onOpenScoreStats={(evt) => setScoreStatsModalEvent(evt || events[0])}
            onNavigateToAllEvents={() => setCurrentView('admin-all-events')}
            onNavigateToSalesReport={() => setCurrentView('admin-sales')}
            onNavigateToAllPayments={() => setCurrentView('admin-payments')}
            onUpdateEventStatus={handleUpdateEventStatus}
          />
        )}

        {currentView === 'admin-all-events' && (
          <AdminAllEventsView
            events={events}
            onBackToDashboard={() => setCurrentView('admin-dashboard')}
            onOpenScoreStats={(evt) => setScoreStatsModalEvent(evt)}
            onOpenCreateEvent={() => setCreateEventModalOpen(true)}
            onUpdateEventStatus={handleUpdateEventStatus}
          />
        )}

        {currentView === 'admin-sales' && (
          <AdminSalesReportView
            onBackToDashboard={() => setCurrentView('admin-dashboard')}
            onOpenCreateEvent={() => setCreateEventModalOpen(true)}
          />
        )}

        {currentView === 'admin-payments' && (
          <AdminAllPaymentsView
            refreshKey={allPayments}
            onBackToDashboard={() => setCurrentView('admin-dashboard')}
            onOpenPaymentAudit={() => setPaymentAuditModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Demo Controller (Facilitates immediate presentation) */}
      <div className="demo-floating-bar">
        <span className="demo-bar-badge">DEMO INTERACTIVO</span>
        <span className="demo-bar-text">
          Viendo como: <strong>{activeUser?.name || 'Cargando...'}</strong> ({isAdmin ? 'Administrador' : 'Aficionado'})
        </span>
        <button
          className="btn-demo-switch-role"
          onClick={() => {
            if (isAdmin) {
              const normalUser = users.find(u => u.role === 'USER') || users[0];
              handleSwitchUser(normalUser.id);
              setCurrentView('events');
            } else {
              const adminUser = users.find(u => u.role === 'ADMIN');
              if (adminUser) {
                handleSwitchUser(adminUser.id);
                setCurrentView('admin-dashboard');
              }
            }
          }}
        >
          {isAdmin ? '🔄 Cambiar a Vista Aficionado' : '🛡️ Cambiar a Vista Administrador'}
        </button>
      </div>

      {/* MODALS */}
      {bookEventModal && (
        <BookTicketModal
          event={bookEventModal}
          onClose={() => setBookEventModal(null)}
          onSubmitBooking={handleSubmitBooking}
        />
      )}

      {digitalPassModal && (
        <DigitalPassModal
          booking={digitalPassModal}
          onClose={() => setDigitalPassModal(null)}
        />
      )}

      {createEventModalOpen && (
        <AdminCreateEventModal
          onClose={() => setCreateEventModalOpen(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}

      {paymentAuditModalOpen && (
        <AdminPaymentVerificationModal
          pendingPayments={pendingPayments}
          allPayments={allPayments}
          onClose={() => setPaymentAuditModalOpen(false)}
          onApprovePayment={handleApprovePayment}
          onRejectPayment={handleRejectPayment}
        />
      )}

      {scoreStatsModalEvent && (
        <AdminScoreStatsModal
          event={scoreStatsModalEvent}
          onClose={() => setScoreStatsModalEvent(null)}
          onSaveScores={handleSaveScores}
        />
      )}

      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onLoginSuccess={async (user) => {
            setActiveUser(user);
            await reloadEventsAndDashboard();
            if (user.role === 'ADMIN') setCurrentView('admin-dashboard');
            else setCurrentView('events');
            setAuthModal({ open: false, mode: 'login' });
          }}
        />
      )}
    </div>
  );
}
