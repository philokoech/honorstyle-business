import React from 'react';
import { DAYS_OF_WEEK } from '../constants';
import { ViewType } from '../types';

interface HeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isTodayInView: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentDate, view, onViewChange, onPrev, onNext, onToday, isTodayInView }) => {
  const getDateRangeDisplay = (date: Date, view: ViewType) => {
    if (view === 'month') {
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    
    if (view === 'day') {
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // week view logic
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
  };

  const ViewButton: React.FC<{
    targetView: ViewType;
    currentView: ViewType;
    onClick: (view: ViewType) => void;
    children: React.ReactNode;
  }> = ({ targetView, currentView, onClick, children }) => {
    const isActive = targetView === currentView;
    return (
      <button
        onClick={() => onClick(targetView)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-sky-600 text-white'
            : 'bg-white text-slate-700 hover:bg-slate-100'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="p-4 md:p-6 bg-white backdrop-blur-sm sticky top-0 z-20 border-b border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 hidden sm:block">Resource Calendar</h1>
          <div className="flex items-center gap-2">
            <button onClick={onPrev} className="p-2 rounded-full hover:bg-slate-200 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={onNext} className="p-2 rounded-full hover:bg-slate-200 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <h2 className="text-lg font-semibold text-slate-600">{getDateRangeDisplay(currentDate, view)}</h2>
        </div>
        <div className="flex items-center gap-4">
            <button
              onClick={onToday}
              disabled={isTodayInView}
              className={`px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 transition-colors ${
                isTodayInView
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-100'
              }`}
            >
            Today
            </button>
            <div className="flex items-center p-1 bg-slate-200 rounded-lg">
                <ViewButton targetView="day" currentView={view} onClick={onViewChange}>Day</ViewButton>
                <ViewButton targetView="week" currentView={view} onClick={onViewChange}>Week</ViewButton>
                <ViewButton targetView="month" currentView={view} onClick={onViewChange}>Month</ViewButton>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
