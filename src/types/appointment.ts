// types/appointment.ts

/** The raw Firestore data shape */
export interface AppointmentDoc {
  attachment: string;
  full_name: string;
  service_type: string;
  status: string;
  time: number;           // e.g. 9, 13, 14
  timestamp: string;      // e.g. "2025-06-02 at 12:00:00 PM UTC+8"
  uid: string;
  visit_type: string;
}

/** The shape our table component actually renders */
export interface AppointmentRow {
  id: string;            // firestore doc ID
  date: string;          // e.g. "05-06-25"
  time: string;          // e.g. "1:00 pm"
  service: string;       // (maps from service_type)
  visit: string;         // (maps from visit_type)
  status: string;        // (maps from status)
  full_name: string;     // to display the patient’s name
}