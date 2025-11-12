import React, { useState, useEffect } from 'react';
import { Appointment, Professional, Client, AppointmentStatus } from '../types';

interface AppointmentSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>, idToUpdate?: string) => void;
  professionals: Professional[];
  clients: Client[];
  appointment: Appointment | null;
  defaultDate?: Date;
  defaultProfessionalId?: string;
}

const APPOINTMENT_STATUSES: AppointmentStatus[] = ['Requested', 'Approved', 'Completed', 'Cancelled', 'Missing', 'Rescheduled'];

const AppointmentSidePanel: React.FC<AppointmentSidePanelProps> = ({
  isOpen,
  onClose,
  onSave,
  professionals,
  clients,
  appointment,
  defaultDate,
  defaultProfessionalId,
}) => {
  const [title, setTitle] = useState('');
  const [professionalId, setProfessionalId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<AppointmentStatus>('Requested');
  const [show, setShow] = useState(false);
  
  const formatToYMD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (isOpen) {
        setShow(true);
        if (appointment) {
          setTitle(appointment.service_name);
          setProfessionalId(appointment.staff_id);
          setClientId(appointment.client_id);
          setStatus(appointment.status);
    
          const startDate = new Date(appointment.start);
          setDate(formatToYMD(startDate));
          
          const hours = String(startDate.getHours()).padStart(2, '0');
          const minutes = String(startDate.getMinutes()).padStart(2, '0');
          setStartTime(`${hours}:${minutes}`);
    
          const diff = appointment.end.getTime() - appointment.start.getTime();
          setDuration(Math.round(diff / (1000 * 60)));
    
        } else {
          const initialDate = defaultDate || new Date();
          setTitle('');
          setProfessionalId(defaultProfessionalId || (professionals.length > 0 ? professionals[0].id : ''));
          setClientId(clients.length > 0 ? clients[0].id : '');
          setDate(formatToYMD(initialDate));
          
          const roundedMinutes = Math.floor(initialDate.getMinutes() / 15) * 15;
          const roundedStartTime = new Date(initialDate);
          roundedStartTime.setMinutes(roundedMinutes, 0, 0);
          const hours = String(roundedStartTime.getHours()).padStart(2, '0');
          const minutes = String(roundedStartTime.getMinutes()).padStart(2, '0');
          setStartTime(`${hours}:${minutes}`);
    
          setDuration(60);
          setStatus('Requested');
        }
    } else {
        setShow(false);
    }
  }, [appointment, isOpen, professionals, clients, defaultDate, defaultProfessionalId]);

  if (!isOpen && !show) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Corresponds to transition duration
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    onSave({
      service_name: title,
      staff_id: professionalId,
      client_id: clientId,
      start: startDate,
      end: endDate,
      status: status,
    }, appointment?.id);
    handleClose();
  };


  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${show ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} onClick={handleClose} aria-hidden="true"></div>

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
                <button type="button" onClick={handleClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Service Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Professional</label>
                    <select value={professionalId} onChange={e => setProfessionalId(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500">
                        {professionals.map(p => <option key={p.id} value={p.id}>{p.staff_name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Client</label>
                    <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500">
                        {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as AppointmentStatus)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500">
                        {APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500" required />
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Start Time</label>
                        <input type="time" value={startTime} step="900" onChange={e => setStartTime(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Duration (min)</label>
                        <input type="number" value={duration} step="15" min="15" onChange={e => setDuration(parseInt(e.target.value, 10))} className="w-full p-2 border border-slate-300 rounded-md bg-slate-50 focus:ring-sky-500 focus:border-sky-500" required />
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">Save</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentSidePanel;
