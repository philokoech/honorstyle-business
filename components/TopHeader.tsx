import React, { useState, useEffect, useRef } from 'react';

interface TopHeaderProps {
    currentPage: string;
    onAddClick: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ currentPage, onAddClick }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer";
  const activeClasses = "bg-[#fceef4] text-[#b30549]";
  const inactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClass = (path: string) => {
    return `${navLinkClasses} ${currentPage === path ? activeClasses : inactiveClasses}`;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (window.location.hash !== path) {
      window.location.hash = path;
    }
    setProfileOpen(false); // Close dropdown on navigation
  };

  return (
    <header className="bg-white border-b border-slate-200 w-full z-30">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Brand and Navigation */}
          <div className="flex items-center">
            <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className="flex items-center">
              <img src="/assets/logo.svg" alt="ProCal logo" className="h-8 w-auto" />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className={getLinkClass('#/')} aria-current={currentPage === '#/' ? "page" : undefined}>Home/Dashboard</a>
                <a href="#/calendar" onClick={(e) => handleNavClick(e, '#/calendar')} className={getLinkClass('#/calendar')} aria-current={currentPage === '#/calendar' ? "page" : undefined}>Resource Calendar</a>
                <a href="#/appointments" onClick={(e) => handleNavClick(e, '#/appointments')} className={getLinkClass('#/appointments')} aria-current={currentPage === '#/appointments' ? "page" : undefined}>Appointments</a>
                <a href="#/analytics" onClick={(e) => handleNavClick(e, '#/analytics')} className={getLinkClass('#/analytics')} aria-current={currentPage === '#/analytics' ? "page" : undefined}>Analytics</a>
              </div>
            </div>
          </div>

          {/* Right Section: Actions and Profile */}
          <div className="flex items-center gap-4">
             <button
                onClick={onAddClick}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#b30549] text-white text-sm font-medium rounded-md hover:bg-[#a10442] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b30549]"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add
            </button>
            <button
                onClick={onAddClick}
                className="sm:hidden p-2 bg-[#b30549] text-white rounded-full hover:bg-[#a10442]"
                aria-label="Add"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100" aria-haspopup="true" aria-expanded={isProfileOpen}>
                 <img className="h-8 w-8 rounded-full object-cover" src="https://i.pravatar.cc/150?u=user" alt="User profile" />
                 <span className="hidden md:inline text-sm font-medium text-slate-700">Jane Doe</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 hidden md:inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              {isProfileOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <a href="#/profile" onClick={(e) => handleNavClick(e, '#/profile')} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</a>
                    {/* Add more links like Settings, Sign out etc. here */}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;