// import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";
import {Search, Logs} from "lucide-react";

const appointmentData = [
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
  { id: "HIV Rapid Test Kits", date: "Manufacturer Name", time: "Medical", service: "Box (25s)", visit: "0", status: "Out of Stock", attachments: "06-25-26" },
];

const Inventory = () => {
  const appointments = appointmentData;
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 4, 6)); // May 6, 2025

  // const handleStatusChange = (index: number, newStatus: string) => {
  //   const updated = [...appointments];
  //   updated[index].status = newStatus;
  //   setAppointments(updated);
  // };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Total Supplies in Inventory</h4>
            <p className="text-5xl font-semibold m-8">1.2k</p>
            <p className="text-md text-gray-500">All medical and medication supplies currently in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Low Stock Supplies</h4>
            <p className="text-5xl font-semibold m-8">59</p>
            <p className="text-md text-gray-500">Number of supplies below the minimum 100 quantity threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <h4 className="text-md font-semibold">Out Of Stock Supplies</h4>
            <p className="text-5xl font-semibold m-8">20</p>
            <p className="text-md text-gray-500">Number of supplies with zero remaining stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <h4 className="text-md font-semibold mb-10">Search Product</h4>
        <div className="grid grid-cols-4 mb-6">
          <input
            type="text"
            placeholder="Product Name"
            className="w-[90%] p-3 rounded-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="text"
            placeholder="Manufacturer"
            className="w-[90%] p-3 rounded-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <Select onValueChange={() => alert()}>
            <SelectTrigger className="w-[90%] p-3 py-6 text-md rounded-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-400">
              <SelectValue placeholder=""/>
            </SelectTrigger>
            <SelectContent className="text-md">
              <SelectItem value="Upcoming">Medical</SelectItem>
              <SelectItem value="On-going">Medication</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full flex justify-start">
              <button
              className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex justify-center align-items-center pr-5">
              <Search className="w-5 h-5 mr-2" />Search
              </button>
          </div>
        </div>
      </div>

      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-4 py-2 text-center text-md font-bold flex justify-between items-center">
          <div className="w-[33%]">

          </div>
          <div className="w-[33%]">
            Supply Tracking
          </div>
          <div className="w-[33%] flex justify-end">
            <button className="w-[33%] flex justify-end items-center text-sm hover:underline">
              <Logs className="h-5 w-5"/>
              <div>
                <Select>
                  <SelectTrigger className="w-full text-md space-x-2">
                    <SelectValue placeholder="Actions" />
                  </SelectTrigger>
                  <SelectContent className="text-md">
                    <SelectItem value="Add Product">Add Product</SelectItem>
                    <SelectItem value="Edit Product">Edit Product</SelectItem>
                    <SelectItem value="Delete Product">Delete Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[14.28%]">Product Name</th>
                  <th className="p-3 text-center w-[14.28%]">Manufacturer</th>
                  <th className="p-3 text-center w-[14.28%]">Supply Type</th>
                  <th className="p-3 text-center w-[14.28%]">Unit</th>
                  <th className="p-3 text-center w-[14.28%]">Quantity</th>
                  <th className="p-3 text-center w-[14.28%]">Status</th>
                  <th className="p-3 text-center w-[14.28%]">Expiration Date</th>
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
                    <td className="p-3 text-center">{appt.attachments}</td>
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

export default Inventory;