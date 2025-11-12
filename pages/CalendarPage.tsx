import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import ResponsiveCalendar from '../components/Calendar';
import { Appointment, Professional, Client, ViewType } from '../types';

interface CalendarPageProps {
  appointments: Appointment[];
  professionals: Professional[];
  clients: Client[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date, professionalId: string) => void;
  onAddClick: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ appointments, professionals, clients, onAppointmentClick, onSlotClick, onAddClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-11-12T00:00:00'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [view, setView] = useState<ViewType>('day');
  
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

  const isTodayInView = (() => {
    const today = new Date();
    today.setHours(0,0,0,0);

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
    const currentDay = new Date(currentDate);
    currentDay.setHours(0,0,0,0);
    return currentDay.getTime() === today.getTime();
  })();
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
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
          onAppointmentClick={onAppointmentClick}
          onSlotClick={onSlotClick}
          view={view}
          onViewChange={handleDateAndVIewChange}
        />
        <button 
          onClick={onAddClick}
          className="absolute bottom-6 right-6 bg-sky-600 text-white rounded-full p-4 shadow-lg hover:bg-sky-700 transition-colors z-30"
          aria-label="Add new appointment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
    </div>
  );
};

export default CalendarPage;