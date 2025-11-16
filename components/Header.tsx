import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;

const Header: React.FC<HeaderProps> = ({ currentDate, view, onViewChange, onPrev, onNext }) => {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const ViewButton: React.FC<{
    targetView: ViewType;
    currentView: ViewType;
    onClick: (view: ViewType) => void;
    children: React.ReactNode;
    icon: React.ReactNode;
  }> = ({ targetView, currentView, onClick, children, icon }) => {
    const isActive = targetView === currentView;
    return (
      <button
        onClick={() => onClick(targetView)}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-[#fceef4] text-[#b30549]'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        {icon}
        {children}
      </button>
    );
  };

  return (
    <header className="p-4 bg-white sticky top-0 z-20 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <div className="w-1/4">
           <h1 className="text-xl font-bold text-slate-800 hidden lg:block">Resource Calendar</h1>
        </div>

        <div className="flex items-center justify-center gap-4 w-1/2">
            <button onClick={onPrev} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <ChevronLeftIcon />
            </button>
            <div className="text-center min-w-[280px]">
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                {currentDate.toDateString() === new Date().toDateString() ? 'Today' : <br/>}
              </div>
              <div className="text-sm font-semibold text-slate-700">{formatDate(currentDate)}</div>
            </div>
            <button onClick={onNext} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <ChevronRightIcon />
            </button>
        </div>

        <div className="flex items-center justify-end gap-2 w-1/4">
            <ViewButton targetView="day" currentView={view} onClick={onViewChange} icon={<GridIcon />}>DAY</ViewButton>
            <ViewButton targetView="week" currentView={view} onClick={onViewChange} icon={<CalendarIcon />}>WEEK</ViewButton>
            <ViewButton targetView="list" currentView={view} onClick={onViewChange} icon={<ListIcon />}>LIST</ViewButton>
        </div>
      </div>
    </header>
  );
};

export default Header;