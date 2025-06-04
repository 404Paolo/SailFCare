export interface Appointment {
  appointmentType: string;
  dateTime: number; // timestamp in milliseconds
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  appointmentDoctor?: string;
  creatineResultImage?: File;
  ohasisReferralCode?: string;
  ohasisTransferKey?: string;
  csbMotivatorName?: string;
  dateMade: number; // timestamp when the appointment was made
}