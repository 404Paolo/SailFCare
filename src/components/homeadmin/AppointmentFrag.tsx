import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';

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

interface Props {
  appointments?: Appointment[];
}

const AppointmentCalendar: React.FC<Props> = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(null);

  const months = ["January", "February", "March"];
  console.log(selectedDate);

  const handleDateClick = (date: Date) => {
    if (!appointments) return; // No appointments to find
    const appointment = appointments.find((appt) => isSameDay(new Date(appt.dateTime), date));
    if (appointment) {
      setSelectedDate(date);
      setModalAppointment(appointment);
    } else {
      // Optional: close modal if clicking a date without appointment
      setModalAppointment(null);
      setSelectedDate(null);
    }
  };

  const renderCalendar = (monthIndex: number) => {
    const now = new Date(2025, monthIndex, 1);
    const startDay = now.getDay();
    const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();

    const rows = [];
    let day = 1;

    for (let week = 0; week < 6; week++) {
      const cells = [];
      for (let i = 0; i < 7; i++) {
        if ((week === 0 && i < (startDay === 0 ? 6 : startDay - 1)) || day > daysInMonth) {
          cells.push(<td key={i}></td>);
        } else {
          const currentDate = new Date(2025, monthIndex, day);
          const hasAppointment = appointments
            ? appointments.some((appt) => isSameDay(new Date(appt.dateTime), currentDate))
            : false;
          cells.push(
            <td
              key={i}
              className={`p-2 text-center rounded cursor-pointer ${hasAppointment ? 'bg-red-200' : ''}`}
              onClick={() => handleDateClick(currentDate)}
            >
              {day++}
            </td>
          );
        }
      }
      rows.push(<tr key={week}>{cells}</tr>);
    }

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-center font-bold mb-2">{months[monthIndex]}</h2>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <th key={d} className="text-sm font-semibold text-gray-700">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {months.map((_, i) => renderCalendar(i))}

      {modalAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button onClick={() => setModalAppointment(null)} className="text-gray-600 hover:text-gray-800">&times;</button>
            </div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {modalAppointment.firstName} {modalAppointment.lastName}</p>
              <p><strong>Phone:</strong> {modalAppointment.phoneNumber}</p>
              <p><strong>Email:</strong> {modalAppointment.email}</p>
              <p><strong>Type:</strong> {modalAppointment.appointmentType}</p>
              <p><strong>Date:</strong> {format(new Date(modalAppointment.dateTime), 'PPP p')}</p>
              {modalAppointment.appointmentDoctor && <p><strong>Doctor:</strong> {modalAppointment.appointmentDoctor}</p>}
              {modalAppointment.ohasisReferralCode && <p><strong>Ohasis Code:</strong> {modalAppointment.ohasisReferralCode}</p>}
              {modalAppointment.ohasisTransferKey && <p><strong>Transfer Key:</strong> {modalAppointment.ohasisTransferKey}</p>}
              {modalAppointment.csbMotivatorName && <p><strong>CSB Motivator:</strong> {modalAppointment.csbMotivatorName}</p>}
              <p><strong>Made on:</strong> {format(new Date(modalAppointment.dateMade), 'PPP')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;