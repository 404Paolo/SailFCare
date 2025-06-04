import { Card, CardContent } from '@/components/ui/card';
import {Clock, Logs} from "lucide-react";
// import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appointmentData = [
  { id: "050625-0001", date: "05-06-25", time: "1:00 pm", service: "Consultation", visit: "Scheduled", status: "Completed" },
  { id: "050625-0002", date: "05-06-25", time: "1:00 pm", service: "HIV Testing", visit: "Walk-In", status: "Completed" },
  { id: "050625-0003", date: "05-06-25", time: "1:00 pm", service: "Lab Testing", visit: "Scheduled", status: "Completed" },
  { id: "050625-0004", date: "05-06-25", time: "1:30 pm", service: "HIV Testing", visit: "Scheduled", status: "On-going" },
  { id: "050625-0005", date: "05-06-25", time: "2:00 pm", service: "Consultation", visit: "Scheduled", status: "On-going" },
  { id: "050625-0006", date: "05-06-25", time: "2:00 pm", service: "HIV Testing", visit: "Walk-In", status: "Upcoming" },
  { id: "050625-0007", date: "05-06-25", time: "2:30 pm", service: "PrEP Refill", visit: "Scheduled", status: "Upcoming" },
  { id: "050625-0008", date: "05-06-25", time: "2:30 pm", service: "Start PrEP", visit: "Scheduled", status: "Upcoming" },
  { id: "050625-0009", date: "05-06-25", time: "3:00 pm", service: "Start ARV", visit: "Scheduled", status: "Upcoming" },
  { id: "050625-0010", date: "05-06-25", time: "3:30 pm", service: "Lab Testing", visit: "Walk-In", status: "Upcoming" },
];

const Dashboard2 = () => {
  const appointments = appointmentData;
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 4, 6)); // May 6, 2025

  // const handleStatusChange = (index: number, newStatus: string) => {
  //   const updated = [...appointments];
  //   updated[index].status = newStatus;
  //   setAppointments(updated);
  // };
  
  return (
    <div className="space-y-10">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Last HIV Test Date</p>
            <p className="text-3xl font-semibold m-4">Feb 2, 2025</p>
            <p className="text-sm text-gray-500">Your most recent recorded HIV test date</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Suggested Next HIV Test Date</p>
            <p className="text-3xl font-semibold m-4">May 2, 2025</p>
            <p className="text-sm text-gray-500">Suggested next test date based on the WHO's 3-month testing guideline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Upcoming Appointment</p>
            <p className="text-3xl font-semibold m-4">May 6, 2025</p>
            <p className="text-sm text-gray-500">Stay prepared with your next schedules visit.</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-10 py-2 text-center text-md font-bold flex justify-between">
          <div className="flex space-x-6 w-[33%]">
            <button className="flex items-center text-sm hover:underline">
              <Clock className="h-5 w-5"/>
              <div>
                <Select>
                  <SelectTrigger className="w-full text-md space-x-2">
                    <SelectValue placeholder="Newest" />
                  </SelectTrigger>
                  <SelectContent className="text-md">
                    <SelectItem value="Newest">Newest</SelectItem>
                    <SelectItem value="Oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </button>
          </div>
          <div className="w-[33%] text-lg flex items-center justify-center">Clinic Activity History</div>
          <button className="w-[33%] flex justify-end items-center text-sm hover:underline">
            <Logs className="h-5 w-5"/>
            <div>
              <Select>
                <SelectTrigger className="w-full text-md space-x-2">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent className="text-md">
                  <SelectItem value="Reschedule">Reschedule</SelectItem>
                  <SelectItem value="Cancel">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </button>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[16%]">Appointment ID</th>
                  <th className="p-3 text-center w-[16%]">Date</th>
                  <th className="p-3 text-center w-[16%]">Time</th>
                  <th className="p-3 text-center w-[16%]">Service Type</th>
                  <th className="p-3 text-center w-[16%]">Visit Type</th>
                  <th className="p-3 text-center w-[16%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b">
                    <td className="p-3 text-center">{appt.id}</td>
                    <td className="p-3 text-center">{appt.date}</td>
                    <td className="p-3 text-center">{appt.time}</td>
                    <td className="p-3 text-center">First Name Surname</td>
                    <td className="p-3 text-center">{appt.service}</td>
                    <td className="p-3 text-center">{appt.visit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard2;