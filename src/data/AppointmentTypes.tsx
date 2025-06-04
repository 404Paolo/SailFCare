import type { AppointmentType } from "../models/AppointmentType";
import hivtestImage from "../assets/hiv-test.jpg";
import hivtreatmentImage from "../assets/start-hiv-treatment.jpg";
import preptreatmentImage from "../assets/start-prep.png";
import doctorconsultationImage from "../assets/doctor-consultation.jpg";

export const appointmentTypes: Record<string, AppointmentType> = {
  "Rapid HIV Test": {
    appointmentHeader: "Rapid HIV Test",
    appointmentImage: hivtestImage,
    appointmentDuration: "20 Minutes",
    appointmentDescription: "A quick and confidential HIV screening that provides accurate results within minutes, helping you know your HIV status and take timely next steps for your health.",
  },
  "Start your HIV Treatment": {
    appointmentHeader: "Start your HIV Treatment",
    appointmentImage: hivtreatmentImage,
    appointmentDuration: "1 hour",
    appointmentDescription: "Antiretroviral therapy (ART) is the medication that people living with HIV take to control the virus, improve immune function, and prevent transmission to others."
  },
  "Start your PrEP": {
    appointmentHeader: "Start your PrEP",
    appointmentImage: preptreatmentImage,
    appointmentDuration: "50 minutes",
    appointmentDescription: "PrEP (Pre-Exposure Prophylaxis) is a medicine that people at risk for HIV take to prevent getting HIV from sex or injection drug use."
  },
  "ARV Refill Pickup": {
    appointmentHeader: "ARV Refill Pickup",
    appointmentImage: hivtreatmentImage,
    appointmentDuration: "30 minutes",
    appointmentDescription: "Antiretroviral therapy (ART) is the medication that people living with HIV take to control the virus, improve immune function, and prevent transmission to others."
  },
  "PrEP Refill Pickup": {
    appointmentHeader: "PrEP Refill Pickup",
    appointmentImage: preptreatmentImage,
    appointmentDuration: "20 minutes",
    appointmentDescription: "PrEP (Pre-Exposure Prophylaxis) is a medicine that people at risk for HIV take to prevent getting HIV from sex or injection drug use."
  },
  "Doctor Consultation": {
    appointmentHeader: "Doctor Consultation",
    appointmentImage: doctorconsultationImage,
    appointmentDuration: "1 hour",
    appointmentDescription: "In-person consultation with experienced and licensed healthcare providers for sexual health concerns, treatment guidance, and personalized care.",
    doctorLists: ["John Christopher Gardiola", "Martin Diones", "Russel Wagan"]
  }
};