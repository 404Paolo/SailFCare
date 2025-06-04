// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";
import {Search} from "lucide-react";

// const appointmentsToday = 29;
// const walkInsToday = 3;
// const upcomingAppointments = 31;

const appointmentData = [
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
  { id: "Last Name", date: "First Name", time: "emailaddress@gmail.com", service: "+639123456789", visit: "admin", status: "Active" },
];

const Users = () => {
  const appointments = appointmentData;
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 4, 6)); // May 6, 2025

  // const handleStatusChange = (index: number, newStatus: string) => {
  //   const updated = [...appointments];
  //   updated[index].status = newStatus;
  //   setAppointments(updated);
  // };

  return (
    <div className="space-y-10">
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <p className="text-xl font-semibold mb-10">Search User</p>
        <div className="grid grid-cols-4 mb-6">
            <input
              type="text"
              placeholder="Patient ID"
              className="w-[90%] p-3 rounded-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <input
              type="text"
              placeholder="First Name"
              className="w-[90%] p-3 rounded-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="w-full flex justify-start">
                <button
                className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex justify-center align-items-center pr-5">
                <Search className="w-5 h-5 mr-2" />Search
                </button>
            </div>
        </div>
      </div>
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-4 py-2 text-center text-md font-bold">
          Registered Patients
        </div>
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[14.28%]">Last Name</th>
                  <th className="p-3 text-center w-[14.28%]">First Name</th>
                  <th className="p-3 text-center w-[14.28%]">Email Address</th>
                  <th className="p-3 text-center w-[14.28%]">Contact Number</th>
                  <th className="p-3 text-center w-[14.28%]">Role</th>
                  <th className="p-3 text-center w-[14.28%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b">
                    <td className="p-3 text-center">{appt.id}</td>
                    <td className="p-3 text-center">{appt.date}</td>
                    <td className="p-3 text-center">{appt.time}</td>
                    <td className="p-3 text-center">{appt.service}</td>
                    <td className="p-3 text-center">{appt.visit}</td>
                    <td className="p-3 text-center">{appt.status}</td>
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

export default Users;