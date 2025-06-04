import { Card, CardContent } from '@/components/ui/card';
import { Clock, FolderHeart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import AddHealthRecordModal from '../modal/AddHealthRecordModal';
// import InfoAlertModal from '../modal/InfoAlertModal';
// import ConfirmationAlertModal from '../modal/ConfirmationAlertModal';

// const appointmentsToday = 29;
// const walkInsToday = 3;
// const upcomingAppointments = 31;

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

const HealthRecords2 = () => {
  const appointments = appointmentData;
  // const [isAlertOpen, setIsAlertOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isInfoOpen, setIsInfoOpen] = useState(false);
  // const handleConfirm = () => {
  //   console.log('Confirmed!');
  //   setIsAlertOpen(false);
  // };

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
            <p className="text-lg font-semibold">Total Health Records</p>
            <p className="text-3xl font-semibold m-4">46</p>
            <p className="text-sm text-gray-500">Total number of your health records in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">HIV Test This Year</p>
            <p className="text-3xl font-semibold m-4">1</p>
            <p className="text-sm text-gray-500">Number of HIV test conducted this year </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Lab Test This Year</p>
            <p className="text-3xl font-semibold m-4">5</p>
            <p className="text-sm text-gray-500">Number of lab test conducted this year </p>
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
            <button className="flex items-center text-sm hover:underline">
              <FolderHeart className="h-5 w-5"/>
              <div>
                <Select>
                  <SelectTrigger className="w-full text-md space-x-2">
                    <SelectValue placeholder="All Records" />
                  </SelectTrigger>
                  <SelectContent className="text-md">
                    <SelectItem value="All Records">All Records</SelectItem>
                    <SelectItem value="HIV Test">HIV Test</SelectItem>
                    <SelectItem value="Lab Test">Lab Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </button>
          </div>
          <div className="w-[33%] text-lg flex items-center justify-center">Health Records</div>
          <div className="w-[33%]">
          </div>
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

export default HealthRecords2;