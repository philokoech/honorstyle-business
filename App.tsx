import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentModal from './components/AppointmentModal';
import { Appointment, Professional, Client } from './types';
import { PROFESSIONALS, CLIENTS, INITIAL_APPOINTMENTS } from './constants';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [professionals] = useState<Professional[]>(PROFESSIONALS);
  const [clients] = useState<Client[]>(CLIENTS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ date: Date, professionalId: string } | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash === '') {
        window.location.hash = '#/calendar'; // Default to calendar view
        setRoute('#/calendar');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleAddButtonClick = () => {
    setSelectedAppointment(null);
    setModalDefaults(null);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalDefaults(null);
    setIsModalOpen(true);
  };

  const handleSlotClick = (date: Date, professionalId: string) => {
    setSelectedAppointment(null);
    setModalDefaults({ date, professionalId });
    setIsModalOpen(true);
  };
  
  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (selectedAppointment) {
      // Edit existing
      setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...appointmentData, id: a.id } : a));
    } else {
      // Add new
      setAppointments(prev => [...prev, { ...appointmentData, id: String(Date.now()) }]);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setModalDefaults(null);
  }

  const renderPage = () => {
    const calendarPageProps = {
      appointments,
      professionals,
      clients,
      onAppointmentClick: handleAppointmentClick,
      onSlotClick: handleSlotClick,
      onAddClick: handleAddButtonClick,
    };

    switch (route) {
      case '#/':
        return <HomePage />;
      case '#/calendar':
        return <CalendarPage {...calendarPageProps} />;
      case '#/appointments':
        return <AppointmentsPage />;
      case '#/analytics':
        return <AnalyticsPage />;
      case '#/profile':
        return <ProfilePage />;
      default:
        // For any unknown hash, default to calendar
        return <CalendarPage {...calendarPageProps} />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white text-slate-800">
      <TopHeader currentPage={route} onAddClick={handleAddButtonClick} />
      {renderPage()}
      <AppointmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAppointment}
          professionals={professionals}
          clients={clients}
          appointment={selectedAppointment}
          defaultDate={modalDefaults?.date}
          defaultProfessionalId={modalDefaults?.professionalId}
      />
    </div>
  );
};

export default App;