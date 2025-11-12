import React, { useRef, useEffect } from 'react';
import { Appointment, Professional, Client, AppointmentStatus, ViewType } from '../types';
import { TIME_SLOTS, DAYS_OF_WEEK } from '../constants';

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

const SLOT_ROW_HEIGHT_REM = 1.5; // 24px

const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
        case 'Approved': return { dot: 'bg-green-500', text: 'text-green-800' };
        case 'Completed': return { dot: 'bg-blue-500', text: 'text-blue-800' };
        case 'Requested': return { dot: 'bg-yellow-500', text: 'text-yellow-800' };
        case 'Cancelled': return { dot: 'bg-red-500', text: 'text-red-800', lineThrough: 'line-through' };
        case 'Missing': return { dot: 'bg-gray-500', text: 'text-gray-800' };
        case 'Rescheduled': return { dot: 'bg-purple-500', text: 'text-purple-800' };
        default: return { dot: 'bg-gray-400', text: 'text-gray-700' };
    }
};

const TimeIndicator: React.FC<{ currentTime: Date }> = ({ currentTime }) => {
    const totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const topPositionRem = (totalMinutes / 15) * SLOT_ROW_HEIGHT_REM;

    return (
        <div style={{ top: `${topPositionRem}rem` }} className="absolute left-0 right-0 h-0.5 bg-red-500 z-30 flex items-center pointer-events-none">
            <div className="h-2 w-2 rounded-full bg-red-500 -ml-1"></div>
        </div>
    );
};


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

  useEffect(() => {
    const isTodayInView = getWeekDays(currentDate).some(d => d.toDateString() === new Date().toDateString());
    if (scrollRef.current && isTodayInView) {
      const totalMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const topPositionRem = (totalMinutes / 15) * SLOT_ROW_HEIGHT_REM;
      const topPositionPx = topPositionRem * 16; // Assuming 1rem = 16px
      scrollRef.current.scrollTo({
        top: topPositionPx - scrollRef.current.clientHeight / 2,
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
    const row = Math.floor(totalMinutes / 15) + 1; // +1 for 1-based grid-row index
    return row;
  };
  
  const appointmentsByDay = weekDays.map(day => 
    appointments.filter(appt => new Date(appt.start).toDateString() === day.toDateString())
  );

  return (
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-auto bg-slate-100">
      <div className="grid gap-px bg-slate-200 min-w-[1200px]" style={{
        gridTemplateColumns: `60px repeat(7, 1fr)`,
      }}>
        {/* Time Gutter Header */}
        <div className="sticky top-0 left-0 bg-white z-30 border-b border-slate-200"></div>

        {/* Day Headers */}
        {weekDays.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className="sticky top-0 bg-white z-20 p-2 text-center border-b border-slate-200 flex flex-col items-center justify-center">
                <span className={`text-xs font-medium uppercase text-slate-500`}>{DAYS_OF_WEEK[day.getDay()]}</span>
                <p className={`text-2xl font-bold mt-1 ${isToday ? 'bg-sky-600 text-white rounded-full h-8 w-8 flex items-center justify-center' : 'text-slate-800'}`}>{day.getDate()}</p>
              </div>
            )
        })}
        
        {/* Time Gutter Column */}
        <div className="sticky left-0 bg-white z-10 row-start-2 col-start-1 grid" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${SLOT_ROW_HEIGHT_REM}rem)`}}>
            {TIME_SLOTS.map((time, index) => (
                <div key={index} className="relative -top-2 flex items-start justify-center text-xs text-slate-500 h-full">
                    {time.endsWith(':00') && time}
                </div>
            ))}
        </div>

        {/* Calendar Grid for each day */}
        {weekDays.map((day, dayIndex) => (
            <div key={day.toISOString()} className="relative row-start-2" style={{ gridColumn: `${dayIndex + 2} / span 1`}}>
                 <div className="absolute inset-0 grid grid-cols-subgrid" style={{ gridTemplateColumns: `repeat(${professionals.length}, 1fr)`}}>
                     {professionals.map((prof, profIndex) => (
                         <div key={`${prof.id}-${day.toISOString()}`} className="bg-white grid" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${SLOT_ROW_HEIGHT_REM}rem)`}}>
                             {TIME_SLOTS.map((_, slotIndex) => {
                                 const slotDate = new Date(day);
                                 const [hour, minute] = TIME_SLOTS[slotIndex].split(':').map(Number);
                                 slotDate.setHours(hour, minute, 0, 0);
                                 return (
                                     <div
                                         key={slotIndex}
                                         className={`hover:bg-sky-50 cursor-pointer h-full ${slotIndex % 4 === 0 ? 'border-t border-slate-200' : 'border-t border-slate-100'}`}
                                         onClick={() => onSlotClick(slotDate, prof.id)}
                                     ></div>
                                 )
                             })}
                         </div>
                     ))}
                 </div>
                 <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${SLOT_ROW_HEIGHT_REM}rem)`, gridTemplateColumns: `repeat(${professionals.length}, 1fr)` }}>
                    {day.toDateString() === new Date().toDateString() && <TimeIndicator currentTime={currentTime} />}
                    {appointmentsByDay[dayIndex].map(appt => {
                        const startRow = getGridPosition(appt.start);
                        const endRow = getGridPosition(appt.end);
                        const prof = professionalsMap.get(appt.staff_id);
                        const client = clientsMap.get(appt.client_id);
                        const profIndex = professionals.findIndex(p => p.id === appt.staff_id);
                        if (profIndex === -1 || !prof || !client) return null;
                        
                        const statusStyle = getStatusStyles(appt.status);
                        const duration = (appt.end.getTime() - appt.start.getTime()) / 60000;
                        const timeFormat: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

                        return (
                        <div
                            key={appt.id}
                            className={`p-1 m-px rounded border cursor-pointer overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-offset-1 hover:ring-sky-500 ${prof.color} ${prof.borderColor} opacity-90 pointer-events-auto flex flex-col text-[10px]`}
                            style={{
                            gridColumn: `${profIndex + 1} / span 1`,
                            gridRow: `${startRow} / ${endRow}`,
                            }}
                            onClick={() => onAppointmentClick(appt)}
                        >
                           <p className={`font-bold truncate ${statusStyle.text} ${statusStyle.lineThrough}`}>{appt.service_name}</p>
                           <p className={`truncate opacity-80 ${statusStyle.text} ${statusStyle.lineThrough}`}>{client.client_name}</p>
                           <div className="mt-auto opacity-70">
                                <p>{`${appt.start.toLocaleTimeString([], timeFormat)} - ${appt.end.toLocaleTimeString([], timeFormat)} (${duration} min)`}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`}></span>
                                    <span>{appt.status}</span>
                                </div>
                           </div>
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


const CalendarDayView: React.FC<CalendarProps> = ({
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

  useEffect(() => {
    if (scrollRef.current) {
      const totalMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const topPositionRem = (totalMinutes / 15) * SLOT_ROW_HEIGHT_REM;
      const topPositionPx = topPositionRem * 16; // Assuming 1rem = 16px
      scrollRef.current.scrollTo({
        top: topPositionPx - scrollRef.current.clientHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentDate]);


  const getGridPosition = (date: Date) => {
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    const row = Math.floor(totalMinutes / 15) + 1; // +1 for 1-based grid-row index
    return row;
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div ref={scrollRef} className="flex-grow p-4 md:p-6 overflow-auto bg-slate-100">
        <div className="grid gap-px bg-slate-200 min-w-[800px]" style={{
            gridTemplateColumns: `60px repeat(${professionals.length}, 1fr)`,
            gridTemplateRows: `auto repeat(${TIME_SLOTS.length}, ${SLOT_ROW_HEIGHT_REM}rem)`,
        }}>
            {/* Header Row */}
            <div className="sticky top-0 left-0 bg-white z-30 p-2 text-center border-b border-slate-200 flex flex-col justify-center items-center">
                <span className={`text-xs font-medium uppercase text-slate-500`}>{DAYS_OF_WEEK[currentDate.getDay()]}</span>
                <p className={`text-2xl font-bold mt-1 ${isToday ? 'bg-sky-600 text-white rounded-full h-8 w-8 flex items-center justify-center' : 'text-slate-800'}`}>{currentDate.getDate()}</p>
             </div>
            {professionals.map((prof) => (
                <div key={prof.id} className="sticky top-0 bg-white z-20 p-2 text-center border-b border-slate-200 flex items-center justify-center gap-2">
                    {prof.image && <img src={prof.image} alt={prof.staff_name} className="h-8 w-8 rounded-full object-cover" />}
                    <h3 className="font-semibold text-slate-700">{prof.staff_name}</h3>
                </div>
            ))}

            {/* Time Gutter */}
            <div className="sticky left-0 bg-white z-10 row-start-2 row-end-[-1] grid" style={{ gridTemplateRows: `repeat(${TIME_SLOTS.length}, ${SLOT_ROW_HEIGHT_REM}rem)`}}>
                {TIME_SLOTS.map((time, index) => (
                    <div key={index} className="relative -top-2 flex items-start justify-center text-xs text-slate-500 h-full">
                        {time.endsWith(':00') && time}
                    </div>
                ))}
            </div>

            {/* Main content grid */}
            <div className="relative col-start-2 col-end-[-1] row-start-2 row-end-[-1] grid grid-cols-subgrid">
                 {professionals.map((prof) => (
                    <div key={prof.id} className="bg-white grid grid-rows-subgrid row-start-1 row-end-[-1]">
                       {TIME_SLOTS.map((_, slotIndex) => {
                          const slotDate = new Date(currentDate);
                          const [hour, minute] = TIME_SLOTS[slotIndex].split(':').map(Number);
                          slotDate.setHours(hour, minute, 0, 0);
                          return (
                            <div key={slotIndex} className={`hover:bg-sky-50 cursor-pointer h-full ${slotIndex % 4 === 0 ? 'border-t border-slate-200' : 'border-t border-slate-100'}`}
                                 onClick={() => onSlotClick(slotDate, prof.id)}></div>
                          )
                       })}
                    </div>
                 ))}
                 <div className="absolute inset-0 grid grid-rows-subgrid row-start-1 row-end-[-1] grid-cols-subgrid col-start-1 col-end-[-1] pointer-events-none">
                 {isToday && <TimeIndicator currentTime={currentTime} />}
                 {appointments
                    .filter(appt => new Date(appt.start).toDateString() === currentDate.toDateString())
                    .map(appt => {
                        const startRow = getGridPosition(appt.start);
                        const endRow = getGridPosition(appt.end);
                        const prof = professionalsMap.get(appt.staff_id);
                        const client = clientsMap.get(appt.client_id);
                        const profIndex = professionals.findIndex(p => p.id === appt.staff_id);
                        if (profIndex === -1 || !prof || !client) return null;

                        const statusStyle = getStatusStyles(appt.status);
                        const duration = (appt.end.getTime() - appt.start.getTime()) / 60000;
                        const timeFormat: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

                        return (
                            <div
                                key={appt.id}
                                className={`m-px p-1 rounded border cursor-pointer overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-offset-1 hover:ring-sky-500 ${prof.color} ${prof.borderColor} opacity-90 pointer-events-auto flex flex-col text-[10px]`}
                                style={{
                                gridColumn: `${profIndex + 1} / span 1`,
                                gridRow: `${startRow} / ${endRow}`,
                                }}
                                onClick={() => onAppointmentClick(appt)}
                            >
                                <p className={`font-bold truncate ${statusStyle.text} ${statusStyle.lineThrough}`}>{appt.service_name}</p>
                                <p className={`truncate opacity-80 ${statusStyle.text} ${statusStyle.lineThrough}`}>{client.client_name}</p>
                                <div className="mt-auto opacity-70">
                                    <p>{`${appt.start.toLocaleTimeString([], timeFormat)} - ${appt.end.toLocaleTimeString([], timeFormat)} (${duration} min)`}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`}></span>
                                        <span>{appt.status}</span>
                                    </div>
                               </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
}

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
    <div className="flex-grow p-4 md:p-6 overflow-auto bg-slate-100">
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
              className={`bg-white min-h-[120px] p-1 flex flex-col cursor-pointer hover:bg-slate-50 transition-colors ${isCurrentMonth ? '' : 'bg-slate-50'}`}
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
                      className={`p-1 rounded text-xs border ${prof.color} ${prof.borderColor} opacity-90 flex items-center gap-1`}
                      onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt); }}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusStyles(appt.status).dot}`}></span>
                      <p className="font-semibold truncate">{appt.service_name}</p>
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
