import React, { useRef, useEffect } from 'react';
import { Appointment, Professional, Client, AppointmentStatus, ViewType } from '../types';
import { TIME_SLOTS, DAYS_OF_WEEK } from '../constants';
import { processAppointmentsForLayout } from './calendarUtils';

interface CalendarProps {
  currentDate: Date;
  currentTime: Date;
  appointments: Appointment[];
  professionals: Professional[];
  clients: Client[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date, professionalId: string) => void;
  onViewChange: (view: ViewType, date: Date) => void;
}

const SLOT_ROW_HEIGHT_REM = 1.25; // 20px
const MINUTES_PER_REM = 60 / (SLOT_ROW_HEIGHT_REM * 4); // Minutes per 1 rem

const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
        case 'Approved': return { dot: 'bg-green-500' };
        case 'Completed': return { dot: 'bg-blue-500' };
        case 'Requested': return { dot: 'bg-yellow-500' };
        case 'Cancelled': return { dot: 'bg-red-500', lineThrough: 'line-through' };
        case 'Missing': return { dot: 'bg-gray-500' };
        case 'Rescheduled': return { dot: 'bg-purple-500' };
        default: return { dot: 'bg-gray-400' };
    }
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
    });
};

const formatTimeGutter = (time: string) => {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    if (hour === 0) return { main: '12', period: 'am'};
    if (hour < 12) return { main: String(hour), period: 'am' };
    if (hour === 12) return { main: '12', period: 'pm' };
    return { main: String(hour - 12), period: 'pm' };
};

const TimeIndicator: React.FC<{ currentTime: Date }> = ({ currentTime }) => {
    const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const topPositionRem = totalMinutes / MINUTES_PER_REM;

    return (
        <div style={{ top: `${topPositionRem}rem` }} className="absolute -left-2 right-0 h-px bg-red-500 z-30 flex items-center pointer-events-none">
            <div className="h-2 w-2 rounded-full bg-red-500 -ml-1"></div>
        </div>
    );
};


const CalendarDayView: React.FC<CalendarProps> = ({
  currentDate,
  currentTime,
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
      const totalMinutes = 8 * 60; // Start of business day
      const topPositionRem = totalMinutes / MINUTES_PER_REM;
      const topPositionPx = topPositionRem * 16;
      scrollRef.current.scrollTo({
        top: topPositionPx - 50,
        behavior: 'smooth',
      });
    }
  }, [currentDate]);

  const isToday = currentDate.toDateString() === new Date().toDateString();

  const appointmentsForDay = appointments.filter(appt => new Date(appt.start).toDateString() === currentDate.toDateString());
  const appointmentsByProfessional = professionals.map(prof => 
    processAppointmentsForLayout(appointmentsForDay.filter(appt => appt.staff_id === prof.id))
  );

  return (
    <div ref={scrollRef} className="flex-grow overflow-auto bg-white">
      <div className="min-w-[800px] flex">
        {/* Time Gutter */}
        <div className="sticky top-0 left-0 bg-white z-20 w-16 text-right pr-2">
           <div className="h-20 border-b border-slate-200"></div>
           <div className="relative">
                {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="h-20 text-sm text-slate-400 relative border-t border-slate-100">
                        <span className="absolute -top-2.5 right-2">
                            <span className="font-semibold text-slate-500">{formatTimeGutter(`${hour}:00`).main}</span>
                            <span className="text-xs ml-0.5">{formatTimeGutter(`${hour}:00`).period}</span>
                        </span>
                    </div>
                ))}
           </div>
        </div>
        
        {/* Main Grid */}
        <div className="flex-grow grid" style={{ gridTemplateColumns: `repeat(${professionals.length}, minmax(0, 1fr))` }}>
            {/* Header Row */}
            {professionals.map((prof) => (
                <div key={prof.id} className="sticky top-0 bg-white z-20 p-2 text-center border-b border-l border-slate-200 flex flex-col items-center justify-center h-20">
                    <img src={prof.image} alt={prof.staff_name} className="h-8 w-8 rounded-full object-cover mb-1" />
                    <h3 className="font-medium text-sm text-slate-700">{prof.staff_name}</h3>
                </div>
            ))}
            
            {/* Content Columns */}
            {professionals.map((prof, profIndex) => (
                <div key={prof.id} className="relative border-l border-slate-200">
                    {/* Background grid lines */}
                    {Array.from({ length: 24 * 4 }).map((_, i) => (
                        <div key={i} className={`h-5 border-t ${i % 4 === 0 ? 'border-slate-200' : 'border-slate-100'}`}></div>
                    ))}
                    
                    {isToday && profIndex === 0 && <TimeIndicator currentTime={currentTime} />}

                    {/* Appointments */}
                    {appointmentsByProfessional[profIndex].map(appt => {
                        const client = clientsMap.get(appt.client_id);
                        if (!client) return null;
                        
                        const top = (appt.start.getHours() * 60 + appt.start.getMinutes()) / MINUTES_PER_REM;
                        const end = (appt.end.getHours() * 60 + appt.end.getMinutes()) / MINUTES_PER_REM;
                        const height = end - top;
                        
                        const width = 100 / appt.h_total;
                        const left = appt.h_pos * width;

                        return (
                            <div
                                key={appt.id}
                                className={`absolute rounded p-2 cursor-pointer transition-all duration-200 ease-in-out text-xs flex flex-col overflow-hidden`}
                                style={{
                                    top: `${top}rem`,
                                    height: `${height}rem`,
                                    left: `calc(${left}% + 2px)`,
                                    width: `calc(${width}% - 4px)`,
                                    backgroundColor: prof.color,
                                    color: prof.textColor,
                                }}
                                onClick={() => onAppointmentClick(appt)}
                            >
                                <p className="font-bold truncate">{appt.service_name}</p>
                                <p className="truncate">{client.client_name}</p>
                                <p className="mt-auto opacity-80">{`${formatTime(appt.start)} - ${formatTime(appt.end)}`}</p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}


// These views are not the focus of the redesign but are kept to avoid breaking the app.
// Their styling has not been updated to the new design system.
const CalendarWeekView: React.FC<CalendarProps> = ({
  currentDate,
  currentTime,
  appointments,
  professionals,
  clients,
  onAppointmentClick,
  onSlotClick
}) => {
  const professionalsMap = new Map<string, Professional>(professionals.map(p => [p.id, p]));
  const clientsMap = new Map<string, Client>(clients.map(c => [c.id, c]));
  const scrollRef = useRef<HTMLDivElement>(null);
  const oldSlotHeightRem = 1.5;

  useEffect(() => {
    const isTodayInView = getWeekDays(currentDate).some(d => d.toDateString() === new Date().toDateString());
    if (scrollRef.current && isTodayInView) {
      const totalMinutes = 8 * 60; // Start of the business day
      const topPositionRem = (totalMinutes / 15) * oldSlotHeightRem;
      const topPositionPx = topPositionRem * 16;
      scrollRef.current.scrollTo({
        top: topPositionPx - 50,
        behavior: 'smooth',
      });
    }
  }, [currentDate]);

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

  const getGridPosition = (date: Date) => {
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    const row = Math.floor(totalMinutes / 15) + 1;
    return row;
  };
  
  const appointmentsByDay = weekDays.map(day => 
    appointments.filter(appt => new Date(appt.start).toDateString() === day.toDateString())
  );

  return (
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-auto bg-slate-50">
      <div className="grid gap-px bg-slate-200 min-w-[1200px]" style={{
        gridTemplateColumns: `50px repeat(7, 1fr)`,
      }}>
        <div className="sticky top-0 left-0 bg-white z-30 border-b border-slate-200"></div>
        {weekDays.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className="sticky top-0 bg-white z-20 p-2 text-center border-b border-slate-200 flex flex-col items-center justify-center">
                <span className={`text-xs font-medium uppercase text-slate-500`}>{DAYS_OF_WEEK[day.getDay()]}</span>
                <p className={`text-2xl font-bold mt-1 ${isToday ? 'bg-sky-600 text-white rounded-full h-8 w-8 flex items-center justify-center' : 'text-slate-800'}`}>{day.getDate()}</p>
              </div>
            )
        })}
        
        <div className="sticky left-0 bg-white z-10 row-start-2 col-start-1 grid" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${oldSlotHeightRem}rem)`}}>
            {TIME_SLOTS.map((time, index) => (
                <div key={index} className="relative -top-3 flex items-start justify-end pr-2 text-xs text-slate-400 h-full">
                    {time.endsWith(':00') && formatTime(new Date(2022, 0, 1, parseInt(time.split(':')[0], 10)))}
                </div>
            ))}
        </div>

        {weekDays.map((day, dayIndex) => (
            <div key={day.toISOString()} className="relative row-start-2" style={{ gridColumn: `${dayIndex + 2} / span 1`}}>
                 <div className="absolute inset-0 grid grid-cols-subgrid" style={{ gridTemplateColumns: `repeat(${professionals.length}, 1fr)`}}>
                     {professionals.map((prof, profIndex) => (
                         <div key={`${prof.id}-${day.toISOString()}`} className="bg-white grid" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${oldSlotHeightRem}rem)`}}>
                             {TIME_SLOTS.map((_, slotIndex) => {
                                 const slotDate = new Date(day);
                                 const [hour, minute] = TIME_SLOTS[slotIndex].split(':').map(Number);
                                 slotDate.setHours(hour, minute, 0, 0);
                                 return (
                                     <div key={slotIndex} className={`hover:bg-sky-50 cursor-pointer h-full border-t border-slate-100`} onClick={() => onSlotClick(slotDate, prof.id)}></div>
                                 )
                             })}
                         </div>
                     ))}
                 </div>
                 <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${oldSlotHeightRem}rem)`, gridTemplateColumns: `repeat(${professionals.length}, 1fr)` }}>
                    {appointmentsByDay[dayIndex].map(appt => {
                        const startRow = getGridPosition(appt.start);
                        const endRow = getGridPosition(appt.end);
                        const prof = professionalsMap.get(appt.staff_id);
                        const client = clientsMap.get(appt.client_id);
                        const profIndex = professionals.findIndex(p => p.id === appt.staff_id);
                        if (profIndex === -1 || !prof || !client) return null;
                        const statusStyle = getStatusStyles(appt.status);
                        return (
                        <div
                            key={appt.id}
                            className={`p-2 m-px rounded cursor-pointer overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-sky-500 ${prof.color} ${prof.textColor} opacity-95 pointer-events-auto flex flex-col text-xs`}
                            style={{ gridColumn: `${profIndex + 1} / span 1`, gridRow: `${startRow} / ${endRow}` }}
                            onClick={() => onAppointmentClick(appt)}
                        >
                           <p className={`font-semibold truncate ${statusStyle.lineThrough}`}>{appt.service_name}</p>
                           <p className={`truncate opacity-80 ${statusStyle.lineThrough}`}>{client.client_name}</p>
                        </div>
                        );
                    })}
                 </div>
            </div>
        ))}
      </div>
    </div>
  );
};

const getMonthViewDays = (dateInMonth: Date) => {
  const date = new Date(dateInMonth);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = [];
  const startDayOfWeek = firstDayOfMonth.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    const prevMonthDay = new Date(firstDayOfMonth);
    prevMonthDay.setDate(firstDayOfMonth.getDate() - (startDayOfWeek - i));
    daysInMonth.push({ day: prevMonthDay, isCurrentMonth: false });
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push({ day: new Date(year, month, i), isCurrentMonth: true });
  }
  const lastDayOfWeek = lastDayOfMonth.getDay();
  if (lastDayOfWeek < 6) {
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
        const nextMonthDay = new Date(lastDayOfMonth);
        nextMonthDay.setDate(lastDayOfMonth.getDate() + i);
        daysInMonth.push({ day: nextMonthDay, isCurrentMonth: false });
    }
  }
  return daysInMonth;
};

const CalendarMonthView: React.FC<CalendarProps> = ({
  currentDate,
  appointments,
  professionals,
  onAppointmentClick,
  onViewChange,
}) => {
  const professionalsMap = new Map<string, Professional>(professionals.map(p => [p.id, p]));
  const monthDays = getMonthViewDays(currentDate);

  const appointmentsByDate = appointments.reduce((acc, appt) => {
    const dateKey = appt.start.toDateString();
    if (!acc[dateKey]) { acc[dateKey] = []; }
    acc[dateKey].push(appt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div className="flex-grow p-4 md:p-6 overflow-auto bg-slate-50">
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="bg-white p-2 text-center text-sm font-semibold text-slate-600">
            {day}
          </div>
        ))}
        {monthDays.map(({ day, isCurrentMonth }) => {
          const dayKey = day.toDateString();
          const dayAppointments = appointmentsByDate[dayKey] || [];
          const isToday = dayKey === new Date().toDateString();

          return (
            <div
              key={dayKey}
              className={`bg-white min-h-[120px] p-1 flex flex-col cursor-pointer hover:bg-slate-50 transition-colors ${isCurrentMonth ? '' : 'bg-slate-100'}`}
              onClick={() => onViewChange('day', day)}
            >
              <div className="flex justify-end mb-1">
                <span className={`text-sm font-semibold ${isToday ? 'bg-sky-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : 'text-slate-800'} ${!isCurrentMonth ? 'text-slate-400' : ''}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1 overflow-y-auto">
                {dayAppointments.slice(0, 3).map(appt => {
                  const prof = professionalsMap.get(appt.staff_id);
                  if (!prof) return null;
                  return (
                    <div
                      key={appt.id}
                      className={`p-1 rounded text-xs border-l-2 bg-opacity-20 flex items-center gap-1`}
                      style={{ borderColor: prof.color.replace('bg-', 'border-'), backgroundColor: prof.color.replace('400', '100') }}
                      onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt); }}
                    >
                      <p className={`font-semibold truncate`}>{formatTime(appt.start)}</p>
                       <p className={`truncate`}>{appt.service_name}</p>
                    </div>
                  );
                })}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-slate-500 pt-1">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const ResponsiveCalendar: React.FC<CalendarProps & { view: ViewType }> = (props) => {
    const { view } = props;

    if (view === 'month') {
        return <CalendarMonthView {...props} />;
    }
    if (view === 'week') {
        return <CalendarWeekView {...props} />;
    }
    
    return <CalendarDayView {...props} />;
};

export default ResponsiveCalendar;