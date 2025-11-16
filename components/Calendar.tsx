import React, { useRef, useEffect } from 'react';
import { Appointment, Professional, Client, ViewType } from '../types';
import { processAppointmentsForLayout } from './calendarUtils';

interface CalendarProps {
  currentDate: Date;
  appointments: Appointment[];
  professionals: Professional[];
  clients: Client[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date, professionalId: string) => void;
  onViewChange: (view: ViewType, date: Date) => void;
  selectedProfessional: string | null;
  onSelectedProfessionalChange: (id: string | null) => void;
}

const HOUR_ROW_HEIGHT_PX = 60;
const businessHours = Array.from({ length: 16 }, (_, i) => i + 9); // 9am to midnight

const formatTimeShort = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();
};

const StaffFilter: React.FC<{
    professionals: Professional[],
    selectedProfessional: string | null,
    onSelectedProfessionalChange: (id: string | null) => void
}> = ({ professionals, selectedProfessional, onSelectedProfessionalChange }) => (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap gap-3">
      <button
        onClick={() => onSelectedProfessionalChange(null)}
        className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 text-sm font-semibold ${
          selectedProfessional === null
            ? 'border-[#b30549] bg-[#fceef4] text-[#b30549]' 
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-[#b30549] text-white flex items-center justify-center text-xs">
          👥
        </div>
        ALL STAFF
      </button>
      {professionals.map((prof) => (
        <button
          key={prof.id}
          onClick={() => onSelectedProfessionalChange(prof.id)}
          className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 text-sm font-semibold ${
            selectedProfessional === prof.id
              ? 'border-[#b30549] bg-[#fceef4] text-[#b30549]' 
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
          }`}
        >
          <img src={prof.image} alt={prof.staff_name} className="w-6 h-6 rounded-full object-cover" />
          {prof.staff_name.toUpperCase()}
        </button>
      ))}
    </div>
);

const CalendarDayView: React.FC<Omit<CalendarProps, 'view' | 'onViewChange' | 'selectedProfessional' | 'onSelectedProfessionalChange'>> = ({
  currentDate,
  appointments,
  professionals,
  clients,
  onAppointmentClick,
  onSlotClick
}) => {
  const clientsMap = new Map<string, Client>(clients.map(c => [c.id, c]));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: (9 * HOUR_ROW_HEIGHT_PX) - 50, // Scroll to 9am
            behavior: 'smooth',
        });
    }
  }, [currentDate]);

  const appointmentsForDay = appointments.filter(appt => new Date(appt.start).toDateString() === currentDate.toDateString());
  const appointmentsByProfessional = professionals.map(prof => 
    processAppointmentsForLayout(appointmentsForDay.filter(appt => appt.staff_id === prof.id))
  );

  return (
    <div ref={scrollRef} className="flex-grow overflow-auto bg-slate-50">
      <div className="min-w-[800px] flex">
        {/* Time Gutter */}
        <div className="sticky top-0 left-0 bg-white z-20 w-20 flex-shrink-0 border-r border-slate-200">
           <div className="h-[100px] border-b border-slate-200"></div>
           {businessHours.map((hour) => (
                <div key={hour} style={{ height: `${HOUR_ROW_HEIGHT_PX}px` }} className="border-b border-slate-200 px-2 py-1 text-right">
                    <div className="text-xs text-slate-600">
                        <span className="font-medium">{hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}</span>
                        <span className="text-[10px] ml-0.5">{hour >= 12 ? 'pm' : 'am'}</span>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Main Grid */}
        <div className="flex-grow flex">
            {professionals.map((prof, profIndex) => (
                <div key={prof.id} className="flex-1 min-w-[160px] border-r border-slate-200 bg-white">
                    {/* Header */}
                    <div className="sticky top-0 bg-white z-10 h-[100px] border-b border-slate-200 p-2 text-center flex flex-col items-center justify-center">
                        <img src={prof.image} alt={prof.staff_name} className="h-10 w-10 rounded-full object-cover mb-2" />
                        <h3 className="font-semibold text-sm text-slate-700">{prof.staff_name.split(' ')[0]}</h3>
                        <p className="text-xs text-slate-500">{prof.staff_name.split(' ')[1]}</p>
                    </div>
                    {/* Content */}
                    <div className="relative">
                        {businessHours.map((hour, hourIndex) => {
                            const slotDate = new Date(currentDate);
                            slotDate.setHours(hour, 0, 0, 0);
                            return (
                                <div 
                                    key={hour} 
                                    style={{ height: `${HOUR_ROW_HEIGHT_PX}px` }} 
                                    className="border-b border-slate-200 relative cursor-pointer hover:bg-[#fceef4] transition-colors"
                                    onClick={() => onSlotClick(slotDate, prof.id)}
                                ></div>
                            )
                        })}
                        {appointmentsByProfessional[profIndex].map(appt => {
                            const client = clientsMap.get(appt.client_id);
                            if (!client) return null;
                            
                            const top = (appt.start.getHours() * 60 + appt.start.getMinutes());
                            const height = (appt.end.getTime() - appt.start.getTime()) / (1000 * 60);

                            const width = 100 / appt.h_total;
                            const left = appt.h_pos * width;

                            return (
                                <div
                                    key={appt.id}
                                    className={`absolute rounded p-2 cursor-pointer transition-all duration-200 ease-in-out text-xs flex flex-col overflow-hidden shadow-md hover:shadow-lg`}
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        left: `calc(${left}% + 4px)`,
                                        width: `calc(${width}% - 8px)`,
                                    }}
                                    onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt); }}
                                >
                                    <div className={`absolute inset-0 ${prof.color} opacity-80`}></div>
                                    <div className={`relative ${prof.textColor}`}>
                                        <p className="font-bold truncate">{`${formatTimeShort(appt.start)} - ${formatTimeShort(appt.end)}`}</p>
                                        <p className="font-semibold truncate mt-0.5">{client.client_name}</p>
                                        <p className="truncate opacity-90">{appt.service_name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const CalendarWeekView: React.FC<Omit<CalendarProps, 'view' | 'onViewChange'>> = (props) => {
    const { currentDate, appointments, professionals, clients, onAppointmentClick, selectedProfessional, onSelectedProfessionalChange } = props;
    const scrollRef = useRef<HTMLDivElement>(null);
    const clientsMap = new Map<string, Client>(clients.map(c => [c.id, c]));

    const getWeekDays = (date: Date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays(currentDate);
    const filteredAppointments = appointments.filter(apt => selectedProfessional ? apt.staff_id === selectedProfessional : true);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <StaffFilter {...{professionals, selectedProfessional, onSelectedProfessionalChange}} />
            <div ref={scrollRef} className="flex-grow overflow-auto">
                <div className="min-w-[1200px] flex">
                    <div className="sticky top-0 left-0 bg-white z-20 w-20 flex-shrink-0 border-r border-slate-200">
                        <div className="h-[80px] border-b border-slate-200"></div>
                        {businessHours.map((hour) => (
                            <div key={hour} className="h-10 border-b border-slate-200 px-2 py-1 text-right">
                                <span className="text-[10px] text-slate-500">{hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'pm' : 'am'}</span>
                            </div>
                        ))}
                    </div>
                    {weekDays.map(day => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const dayAppointments = filteredAppointments.filter(a => new Date(a.start).toDateString() === day.toDateString());
                        return (
                            <div key={day.toISOString()} className="flex-1 min-w-[120px] border-r border-slate-200 bg-white">
                                <div className="sticky top-0 bg-white z-10 h-[80px] border-b border-slate-200 p-2 text-center flex flex-col items-center justify-center">
                                    <span className="text-xs font-medium text-slate-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <p className={`text-2xl font-bold mt-1 ${isToday ? 'text-[#b30549]' : 'text-slate-800'}`}>{day.getDate()}</p>
                                </div>
                                <div className="relative">
                                    {businessHours.map(hour => <div key={hour} className="h-10 border-b border-slate-200"></div>)}
                                    {dayAppointments.map(appt => {
                                        const prof = professionals.find(p => p.id === appt.staff_id);
                                        if (!prof) return null;
                                        const top = (appt.start.getHours() * 60 + appt.start.getMinutes() - (businessHours[0] * 60)) * (40/60); // 40px per hour
                                        const height = (appt.end.getTime() - appt.start.getTime()) / (1000 * 60) * (40/60);
                                        return (
                                            <div
                                                key={appt.id}
                                                className={`absolute left-1 right-1 p-1 rounded cursor-pointer overflow-hidden text-[10px] shadow-sm ${prof.color} ${prof.textColor}`}
                                                style={{ top: `${top}px`, height: `${height}px` }}
                                                onClick={() => onAppointmentClick(appt)}
                                            >
                                                <p className="font-bold truncate">{clientsMap.get(appt.client_id)?.client_name}</p>
                                                {selectedProfessional === null && <p className="truncate opacity-80">{prof.staff_name.split(' ')[0]}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const CalendarListView: React.FC<Omit<CalendarProps, 'view' | 'onViewChange'>> = (props) => {
    const { currentDate, appointments, professionals, clients, onAppointmentClick, selectedProfessional, onSelectedProfessionalChange } = props;
    const professionalsMap = new Map<string, Professional>(professionals.map(p => [p.id, p]));
    const clientsMap = new Map<string, Client>(clients.map(c => [c.id, c]));

    const dayAppointments = appointments
        .filter(apt => new Date(apt.start).toDateString() === currentDate.toDateString())
        .filter(apt => selectedProfessional ? apt.staff_id === selectedProfessional : true)
        .sort((a,b) => a.start.getTime() - b.start.getTime());

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <StaffFilter {...{professionals, selectedProfessional, onSelectedProfessionalChange}} />
            <div className="flex-grow overflow-auto p-6">
                {dayAppointments.length > 0 ? dayAppointments.map(appt => {
                    const prof = professionalsMap.get(appt.staff_id);
                    const client = clientsMap.get(appt.client_id);
                    if (!prof || !client) return null;
                    return (
                        <div key={appt.id} onClick={() => onAppointmentClick(appt)} className="bg-white border-l-4 p-4 mb-2 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" style={{ borderColor: prof.color.replace('bg-', 'border-').replace('-400', '-600') }}>
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${prof.color}`}></div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {formatTimeShort(appt.start)} - {formatTimeShort(appt.end)}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {Math.round((appt.end.getTime() - appt.start.getTime()) / 60000)} mins
                                    </div>
                                </div>
                                <div className="h-10 border-l border-slate-200 mx-2"></div>
                                <div className="flex items-center gap-3">
                                    <img src={prof.image} alt={prof.staff_name} className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800">{prof.staff_name}</div>
                                        <div className="text-xs text-slate-500">{prof.specialty}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-slate-800">{client.client_name}</div>
                                <div className="text-xs text-slate-500">{appt.service_name}</div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-16 text-slate-500">
                        <p>No appointments scheduled for this day.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResponsiveCalendar: React.FC<CalendarProps & { view: ViewType }> = (props) => {
    const { view } = props;

    if (view === 'list') {
        return <CalendarListView {...props} />;
    }
    if (view === 'week') {
        return <CalendarWeekView {...props} />;
    }
    
    return <CalendarDayView {...props} />;
};

export default ResponsiveCalendar;