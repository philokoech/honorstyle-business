import { Professional, Client, Appointment } from './types';

// Mock data based on the new Firestore-like schema
export const PROFESSIONALS: Professional[] = [
  { id: 'prof_1', staff_name: 'Dr. Evelyn Reed', specialty: 'Dentist', color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-300', image: 'https://i.pravatar.cc/150?u=prof_1' },
  { id: 'prof_2', staff_name: 'Alex Chen', specialty: 'Therapist', color: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-300', image: 'https://i.pravatar.cc/150?u=prof_2' },
  { id: 'prof_3', staff_name: 'Maria Garcia', specialty: 'Stylist', color: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-300', image: 'https://i.pravatar.cc/150?u=prof_3' },
  { id: 'prof_4', staff_name: 'Ben Carter', specialty: 'Physio', color: 'bg-purple-100', textColor: 'text-purple-800', borderColor: 'border-purple-300', image: 'https://i.pravatar.cc/150?u=prof_4' },
];


export const CLIENTS: Client[] = [
  { id: 'client_1', client_name: 'John Smith' },
  { id: 'client_2', client_name: 'Sarah Miller' },
  { id: 'client_3', client_name: 'Walk-In Client' }, // Representing a walk-in this way
  { id: 'client_4', client_name: 'Emily White' },
  { id: 'client_5', client_name: 'Walk-In Emergency' },
  { id: 'client_6', client_name: 'Michael Brown' },
];

const today = new Date();
const getTodayAt = (hour: number, minute: number = 0): Date => {
    const d = new Date(today);
    d.setHours(hour, minute, 0, 0);
    return d;
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt_1',
    staff_id: 'prof_1',
    client_id: 'client_1',
    service_name: 'Routine Check-up',
    start: getTodayAt(9, 15),
    end: getTodayAt(9, 45),
    status: 'Approved',
  },
  {
    id: 'appt_2',
    staff_id: 'prof_2',
    client_id: 'client_2',
    service_name: 'Therapy Session',
    start: getTodayAt(10, 30),
    end: getTodayAt(11, 30),
    status: 'Completed',
  },
  {
    id: 'appt_3',
    staff_id: 'prof_3',
    client_id: 'client_3',
    service_name: 'Haircut & Style',
    start: getTodayAt(13, 0),
    end: getTodayAt(14, 0),
    status: 'Requested',
  },
  {
    id: 'appt_4',
    staff_id: 'prof_4',
    client_id: 'client_4',
    service_name: 'Knee Injury Rehab',
    start: getTodayAt(14, 30),
    end: getTodayAt(15, 15),
    status: 'Approved',
  },
  {
    id: 'appt_5',
    staff_id: 'prof_1',
    client_id: 'client_5',
    service_name: 'Emergency Filling',
    start: getTodayAt(11, 0),
    end: getTodayAt(12, 0),
    status: 'Cancelled',
  },
  {
    id: 'appt_6',
    staff_id: 'prof_3',
    client_id: 'client_6',
    service_name: 'Color Consultation',
    start: getTodayAt(15, 0),
    end: getTodayAt(15, 30),
    status: 'Rescheduled',
  },
];


export const TIME_SLOTS = Array.from({ length: 24 * 4 }, (_, i) => {
    const totalMinutes = i * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});


export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];