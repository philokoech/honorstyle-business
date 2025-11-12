import { Professional, Client, Appointment } from './types';

// New professionals and color scheme based on user's reference images
export const PROFESSIONALS: Professional[] = [
  { id: 'prof_1', staff_name: 'Carrie Hawkins', specialty: 'Hair Stylist', color: 'bg-rose-400', textColor: 'text-white', image: 'https://i.pravatar.cc/150?u=prof_1' },
  { id: 'prof_2', staff_name: 'Samantha Burke', specialty: 'Masseuse', color: 'bg-teal-400', textColor: 'text-white', image: 'https://i.pravatar.cc/150?u=prof_2' },
  { id: 'prof_3', staff_name: 'Harold Long', specialty: 'Nail Technician', color: 'bg-violet-400', textColor: 'text-white', image: 'https://i.pravatar.cc/150?u=prof_3' },
  { id: 'prof_4', staff_name: 'Isaiah Lopez', specialty: 'Hair Stylist', color: 'bg-sky-400', textColor: 'text-white', image: 'https://i.pravatar.cc/150?u=prof_4' },
  { id: 'prof_5', staff_name: 'Sarah Stephens', specialty: 'Esthetician', color: 'bg-amber-400', textColor: 'text-white', image: 'https://i.pravatar.cc/150?u=prof_5' },
];


export const CLIENTS: Client[] = [
  { id: 'client_1', client_name: 'John Smith' },
  { id: 'client_2', client_name: 'Sarah Miller' },
  { id: 'client_3', client_name: 'Alfred Massey' },
  { id: 'client_4', client_name: 'Emily White' },
  { id: 'client_5', client_name: 'Bessie Medina' },
  { id: 'client_6', client_name: 'Lydia Ford' },
  { id: 'client_7', client_name: 'John Garner' },
  { id: 'client_8', client_name: 'Fannie Barber' },
  { id: 'client_9', client_name: 'Winnie Fisher' },
  { id: 'client_10', client_name: 'Gene Barker' },
  { id: 'client_11', client_name: 'Shawn Duncan' },
];

const getAppointmentOn = (hour: number, minute: number = 0): Date => {
    // new Date(year, monthIndex, day, hours, minutes) is the most reliable
    // way to create a local date. November is month 10.
    return new Date(2025, 10, 12, hour, minute);
};


// New dense schedule with overlaps to showcase the new layout
export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Carrie Hawkins
  { id: 'appt_1', staff_id: 'prof_1', client_id: 'client_5', service_name: 'Hair Cut', start: getAppointmentOn(11, 0), end: getAppointmentOn(12, 0), status: 'Approved', },
  { id: 'appt_2', staff_id: 'prof_1', client_id: 'client_10', service_name: 'Hair Colouring', start: getAppointmentOn(12, 30), end: getAppointmentOn(14, 0), status: 'Approved', },
  
  // Samantha Burke
  { id: 'appt_3', staff_id: 'prof_2', client_id: 'client_3', service_name: 'Traditional Balinese Massage', start: getAppointmentOn(10, 0), end: getAppointmentOn(11, 0), status: 'Completed', },
  { id: 'appt_4', staff_id: 'prof_2', client_id: 'client_11', service_name: 'Eyebrow Waxing', start: getAppointmentOn(12, 0), end: getAppointmentOn(13, 0), status: 'Approved', },
  { id: 'appt_5', staff_id: 'prof_2', client_id: 'client_3', service_name: 'Traditional Balinese Massage', start: getAppointmentOn(14, 0), end: getAppointmentOn(15, 0), status: 'Requested', },
  
  // Harold Long (with overlaps)
  { id: 'appt_6', staff_id: 'prof_3', client_id: 'client_6', service_name: 'Refining Facial', start: getAppointmentOn(10, 0), end: getAppointmentOn(10, 30), status: 'Approved', },
  { id: 'appt_7', staff_id: 'prof_3', client_id: 'client_7', service_name: 'Manicure', start: getAppointmentOn(10, 30), end: getAppointmentOn(11, 0), status: 'Approved', },
  { id: 'appt_8', staff_id: 'prof_3', client_id: 'client_9', service_name: 'Refining Facial', start: getAppointmentOn(12, 0), end: getAppointmentOn(13, 0), status: 'Approved', },
  { id: 'appt_9', staff_id: 'prof_3', client_id: 'client_8', service_name: 'Pedicure', start: getAppointmentOn(11, 30), end: getAppointmentOn(12, 30), status: 'Approved', }, // Overlap
  
  // Isaiah Lopez
  { id: 'appt_10', staff_id: 'prof_4', client_id: 'client_5', service_name: 'Hair Cut', start: getAppointmentOn(10, 0), end: getAppointmentOn(11, 0), status: 'Approved', },
  { id: 'appt_11', staff_id: 'prof_4', client_id: 'client_4', service_name: 'Hot Stone Massage', start: getAppointmentOn(11, 30), end: getAppointmentOn(13, 30), status: 'Approved', },
  
  // Sarah Stephens (with overlaps)
  { id: 'appt_12', staff_id: 'prof_5', client_id: 'client_3', service_name: 'Traditional Balinese Massage', start: getAppointmentOn(9, 0), end: getAppointmentOn(10, 0), status: 'Approved', },
  { id: 'appt_13', staff_id: 'prof_5', client_id: 'client_6', service_name: 'Eyebrow Waxing', start: getAppointmentOn(9, 0), end: getAppointmentOn(9, 30), status: 'Approved', }, // Overlap
  { id: 'appt_14', staff_id: 'prof_5', client_id: 'client_7', service_name: 'Facial', start: getAppointmentOn(9, 30), end: getAppointmentOn(10, 30), status: 'Approved', }, // Overlap
  { id: 'appt_15', staff_id: 'prof_5', client_id: 'client_8', service_name: 'Hair Colouring', start: getAppointmentOn(10, 30), end: getAppointmentOn(11, 0), status: 'Completed', },
  { id: 'appt_16', staff_id: 'prof_5', client_id: 'client_10', service_name: 'Deep Tissue Massage', start: getAppointmentOn(11, 0), end: getAppointmentOn(12, 0), status: 'Approved', },
  { id: 'appt_17', staff_id: 'prof_5', client_id: 'client_11', service_name: 'Eyebrow Waxing', start: getAppointmentOn(12, 0), end: getAppointmentOn(13, 0), status: 'Approved', },
];


export const TIME_SLOTS = Array.from({ length: 24 * 4 }, (_, i) => {
    const totalMinutes = i * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});


export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];