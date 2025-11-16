import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentSidePanel from './components/AppointmentSidePanel';
import { Appointment, Professional, Client } from './types';
import { PROFESSIONALS, CLIENTS, INITIAL_APPOINTMENTS } from './constants';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [professionals] = useState<Professional[]>(PROFESSIONALS);
  const [clients] = useState<Client[]>(CLIENTS);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [panelDefaults, setPanelDefaults] = useState<{ date: Date, professionalId: string } | null>(null);

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
    setPanelDefaults(null);
    setIsPanelOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPanelDefaults(null);
    setIsPanelOpen(true);
  };

  const handleSlotClick = (date: Date, professionalId: string) => {
    setSelectedAppointment(null);
    setPanelDefaults({ date, professionalId });
    setIsPanelOpen(true);
  };
  
  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>, idToUpdate?: string) => {
    if (idToUpdate) {
      // Edit existing
      setAppointments(prev => prev.map(a => a.id === idToUpdate ? { ...appointmentData, id: a.id } : a));
    } else {
      // Add new
      setAppointments(prev => [...prev, { ...appointmentData, id: String(Date.now()) }]);
    }
  };
  
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAppointment(null);
    setPanelDefaults(null);
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
      <AppointmentSidePanel
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onSave={handleSaveAppointment}
          professionals={professionals}
          clients={clients}
          appointment={selectedAppointment}
          defaultDate={panelDefaults?.date}
          defaultProfessionalId={panelDefaults?.professionalId}
      />
    </div>
  );
};

export default App;