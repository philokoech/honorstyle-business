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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash === '') {
        window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleAddButtonClick = () => {
    setIsSidePanelOpen(true);
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

  const renderPage = () => {
    switch (route) {
      case '#/':
        return <HomePage />;
      case '#/calendar':
        return <CalendarPage 
                  appointments={appointments}
                  professionals={professionals}
                  clients={clients}
                  onSaveAppointment={handleSaveAppointment} 
                />;
      case '#/appointments':
        return <AppointmentsPage />;
      case '#/analytics':
        return <AnalyticsPage />;
      case '#/profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-white text-slate-800">
      <TopHeader currentPage={route} onAddClick={handleAddButtonClick} />
      {renderPage()}
      {isSidePanelOpen && (
        <AppointmentSidePanel
            isOpen={isSidePanelOpen}
            onClose={() => setIsSidePanelOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
