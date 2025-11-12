// Mapped from Firestore `Professionals` collection
export interface Professional {
  id: string; // Document ID from Firestore
  staff_name: string;
  specialty: string; // This might be derived from services, keeping for UI
  color: string; // UI specific
  textColor: string; // UI specific
  borderColor: string; // UI specific
  image?: string;
}

// Mapped from Firestore `Clients` collection
export interface Client {
  id: string; // `uid` from Firestore
  client_name: string;
}

export type AppointmentStatus = 'Requested' | 'Approved' | 'Completed' | 'Cancelled' | 'Missing' | 'Rescheduled';


// Mapped from Firestore `appointments` collection
export interface Appointment {
  id: string; // Document ID from Firestore
  staff_id: string;
  client_id: string;
  service_name: string;
  start: Date;
  end: Date;
  status: AppointmentStatus;
}

export type ViewType = 'day' | 'week' | 'month';
