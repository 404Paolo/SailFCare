import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const appointmentsToday = 29;
const walkInsToday = 3;
const upcomingAppointments = 31;

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

const AppointmentFrag = () => {
  const [appointments, setAppointments] = useState(appointmentData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 4, 6)); // May 6, 2025

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...appointments];
    updated[index].status = newStatus;
    setAppointments(updated);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Appointments Today</p>
            <p className="text-5xl font-semibold m-4">{appointmentsToday}</p>
            <p className="text-md text-gray-500">Number of appointments today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Walk-In Today</p>
            <p className="text-5xl font-semibold m-4">{walkInsToday}</p>
            <p className="text-md text-gray-500">Number of walk-in patients today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Upcoming Appointments</p>
            <p className="text-5xl font-semibold m-4">{upcomingAppointments}</p>
            <p className="text-md text-gray-500">Number of upcoming appointments tomorrow</p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white rounded-md px-4 py-2 font-semibold flex justify-between items-center">
          <div className="flex items-center gap-2 w-[33%]">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-white text-md hover:underline">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-md font-bold w-[33%] text-center">Appointments & Walk-in List</div>
          <div className="text-md collapse w-[33%]">Edit Status</div>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[14.28%]">Appointment ID</th>
                  <th className="p-3 text-center w-[14.28%]">Date</th>
                  <th className="p-3 text-center w-[14.28%]">Time</th>
                  <th className="p-3 text-center w-[14.28%]">Name</th>
                  <th className="p-3 text-center w-[14.28%]">Service Type</th>
                  <th className="p-3 text-center w-[14.28%]">Visit Type</th>
                  <th className="p-3 text-center w-[14.28%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={appt.id} className="border-b">
                    <td className="p-3 text-center">{appt.id}</td>
                    <td className="p-3 text-center">{appt.date}</td>
                    <td className="p-3 text-center">{appt.time}</td>
                    <td className="p-3 text-center">First Name Surname</td>
                    <td className="p-3 text-center">{appt.service}</td>
                    <td className="p-3 text-center">{appt.visit}</td>
                    <td className="p-3 text-center">
                      <Select value={appt.status} onValueChange={(val) => handleStatusChange(index, val)}>
                        <SelectTrigger className="w-full text-md">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="text-md">
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="On-going">In-Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFrag;