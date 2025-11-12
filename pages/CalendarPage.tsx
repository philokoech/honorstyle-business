import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import ResponsiveCalendar from '../components/Calendar';
import AppointmentModal from '../components/AppointmentModal';
import { Appointment, Professional, Client, ViewType } from '../types';

interface CalendarPageProps {
  appointments: Appointment[];
  professionals: Professional[];
  clients: Client[];
  onSaveAppointment: (appointmentData: Omit<Appointment, 'id'>, idToUpdate?: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ appointments, professionals, clients, onSaveAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [view, setView] = useState<ViewType>('day');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ date: Date, professionalId: string } | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'day') {
        newDate.setDate(prevDate.getDate() - 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() - 7);
      } else if (view === 'month') {
        newDate.setMonth(prevDate.getMonth() - 1);
      }
      return newDate;
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'day') {
        newDate.setDate(prevDate.getDate() + 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() + 7);
      } else if (view === 'month') {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };
  
  const handleDateAndVIewChange = (newView: ViewType, newDate: Date) => {
    setView(newView);
    setCurrentDate(newDate);
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSlotClick = (date: Date, professionalId: string) => {
    setSelectedAppointment(null);
    setModalDefaults({ date, professionalId });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setModalDefaults(null);
  };
  
  const handleModalSave = (appointmentData: Omit<Appointment, 'id'>) => {
    onSaveAppointment(appointmentData, selectedAppointment?.id);
  };

  const isTodayInView = (() => {
    const today = new Date();
    if (view === 'month') {
      return currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
    }
    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return today >= startOfWeek && today <= endOfWeek;
    }
    // 'day' view
    return currentDate.toDateString() === today.toDateString();
  })();
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentDate={currentDate} 
          view={view}
          onViewChange={handleViewChange}
          onPrev={handlePrev} 
          onNext={handleNext} 
          onToday={handleToday}
          isTodayInView={isTodayInView}
        />
        <ResponsiveCalendar
          currentDate={currentDate}
          currentTime={currentTime}
          appointments={appointments}
          professionals={professionals}
          clients={clients}
          onAppointmentClick={handleAppointmentClick}
          onSlotClick={handleSlotClick}
          view={view}
          onViewChange={handleDateAndVIewChange}
        />
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        professionals={professionals}
        clients={clients}
        appointment={selectedAppointment}
        defaultDate={modalDefaults?.date}
        defaultProfessionalId={modalDefaults?.professionalId}
      />
    </div>
  );
};

export default CalendarPage;