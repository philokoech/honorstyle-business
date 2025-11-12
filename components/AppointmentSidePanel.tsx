import React, { useState, useEffect } from 'react';

interface AppointmentSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentSidePanel: React.FC<AppointmentSidePanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setShow(true);
    }
  }, [isOpen]);

  const handleClose = () => {
      setShow(false);
      setTimeout(onClose, 300); // Corresponds to transition duration
  }

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${show ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={handleClose} aria-hidden="true"></div>

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">New Tab</h2>
                <button onClick={handleClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-500 italic">This is an empty tab. Content can be added here.</p>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Close</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSidePanel;
