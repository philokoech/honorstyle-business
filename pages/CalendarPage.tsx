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
  const [view, setView] = useState<ViewType>('day');
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  
  const handlePrev = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'day' || view === 'list') {
        newDate.setDate(prevDate.getDate() - 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() - 7);
      }
      return newDate;
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (view === 'day' || view === 'list') {
        newDate.setDate(prevDate.getDate() + 1);
      } else if (view === 'week') {
        newDate.setDate(prevDate.getDate() + 7);
      }
      return newDate;
    });
  }, [view]);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };
  
  const handleDateAndVIewChange = (newView: ViewType, newDate: Date) => {
    setView(newView);
    setCurrentDate(newDate);
  }

  const handleSelectedProfessionalChange = (id: string | null) => {
    setSelectedProfessional(id);
  }
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          currentDate={currentDate} 
          view={view}
          onViewChange={handleViewChange}
          onPrev={handlePrev} 
          onNext={handleNext}
        />
        <ResponsiveCalendar
          currentDate={currentDate}
          appointments={appointments}
          professionals={professionals}
          clients={clients}
          onAppointmentClick={onAppointmentClick}
          onSlotClick={onSlotClick}
          view={view}
          onViewChange={handleDateAndVIewChange}
          selectedProfessional={selectedProfessional}
          onSelectedProfessionalChange={handleSelectedProfessionalChange}
        />
        <button 
          onClick={onAddClick}
          className="absolute bottom-6 right-6 bg-[#b30549] text-white rounded-full p-4 shadow-lg hover:bg-[#a10442] transition-colors z-30"
          aria-label="Add new appointment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
    </div>
  );
};

export default CalendarPage;