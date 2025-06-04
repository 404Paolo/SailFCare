import { useState } from "react";
import { Search, Clock, FolderHeart, Logs } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddHealthRecordModal from "../modal/AddHealthRecordModal";
// import InfoAlertModal from "../modal/InfoAlertModal";
import ConfirmationAlertModal from "../modal/ConfirmationAlertModal";
import EditHealthRecordModal from "../modal/EditHealthRecordModal";
import { PenBox, Trash } from "lucide-react";

// const appointmentsToday = 29;
// const walkInsToday = 3;
// const upcomingAppointments = 31;

const appointmentData = [
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
  { id: "05-26-25", date: "HIV Test", time: "Rapid HIV Test", service: "Normal", visit: "Clinician Name", status: "Encoder Name", attachments: "N/A" },
];

const HealthRecords = () => {
  const [appointments, setAppointments] = useState(appointmentData);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState("");

  const handleAction = (action: string) => {
    switch (action) {
      case "Add Record":
        setIsAddModal(true);
        break;
      case "Edit Record":
        setEditMode(true);
        break;
      case "Delete Record":
        setDeleteMode(true);
        break;
      default:
        break;
    }
    setSelectedAction("");
  };

  const handleRowClick = (index: number) => {
    if (editMode) {
      setSelectedRecordIndex(index);
      setIsEditModal(true);
      setEditMode(false);
    }
    else if(deleteMode) {
      setIsDeleteModal(true);
      setDeleteMode(false);
    }
  };

  const handleSaveEditedRecord = (updatedRecord: any) => {
    if (selectedRecordIndex !== null) {
      const updatedAppointments = [...appointments];
      updatedAppointments[selectedRecordIndex] = updatedRecord;
      setAppointments(updatedAppointments);
    }
    setIsEditModal(false);
    setSelectedRecordIndex(null);
  };
  
  return (
    <div className="space-y-10">
      <div className="px-12 py-8 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <h4 className="text-xl font-semibold mb-10">Search Patient</h4>
        <div className="grid grid-cols-4 mb-6">
          <input
            type="text"
            placeholder="Patient ID"
            className="w-[90%] p-3 rounded-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="text"
            placeholder="First Name"
            className="w-[90%] p-3 rounded-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-[90%] p-3 rounded-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <div className="w-full flex justify-start">
              <button
              className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex justify-center align-items-center pr-5">
              <Search className="w-5 h-5 mr-2" />Search
              </button>
          </div>
        </div>
      </div>
      <div className="px-12 py-6 space-y-4 overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl grid grid-cols-3">
        <p className="col-span-3 text-xl font-semibold mb-4">Patient Information</p>
        <p className="font-semibold text-gray-600 text-sm">Patient ID: <span className="font-normal text-gray-500 ml-1"> 202500000</span></p>
        <p className="font-semibold text-gray-600 text-sm">First Name: <span className="font-normal text-gray-500 ml-1"> First Name</span></p>
        <p className="font-semibold text-gray-600 text-sm">Last Name: <span className="font-normal text-gray-500 ml-1"> Last Name</span></p>
        <p className="font-semibold text-gray-600 text-sm">Gender: <span className="font-normal text-gray-500 ml-1"> Male</span></p>
        <p className="font-semibold text-gray-600 text-sm">Contact Number: <span className="font-normal text-gray-500 ml-1"> +639123456789</span></p>
        <p className="font-semibold text-gray-600 text-sm">Email Address: <span className="font-normal text-gray-500 ml-1"> emailaddress@gmail.com</span></p>
      </div>
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
          <button className="w-[33%] flex justify-end items-center text-sm hover:underline">
            {isAddModal &&
              <AddHealthRecordModal
                onClose={() => setIsAddModal(false)}
                onSave={() => {
                  // Save logic here
                 setIsAddModal(false);
                }}
              />
            }
            {isEditModal && selectedRecordIndex !== null && (
              <EditHealthRecordModal
                record={appointments[selectedRecordIndex]}
                onClose={() => setIsEditModal(false)}
                onSave={handleSaveEditedRecord}
              />
            )}
            {isDeleteModal && 
              <ConfirmationAlertModal
                header="Delete Health Record"
                message="Are you sure you want to delete this health record? This action is permanent and cannot be undone"
                onClose={() => setIsDeleteModal(false)}
                onConfirm={() => {
                  alert("Health record successfully deleted");
                  setIsDeleteModal(false);}
                }
              />
            }
            <Logs className="h-5 w-5"/>
            <div>
              <Select
                value={selectedAction}
                onValueChange={(value) => {
                  setSelectedAction(value);
                  handleAction(value);
                }}
              >
                <SelectTrigger className="w-full text-md space-x-2">
                  <SelectValue placeholder="Actions" />
                </SelectTrigger>
                <SelectContent className="text-md">
                  <SelectItem value="Add Record">Add Record</SelectItem>
                  <SelectItem value="Edit Record">Edit Record</SelectItem>
                  <SelectItem value="Delete Record">Delete Record</SelectItem>
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
                  {(editMode || deleteMode) && <th></th>}
                  <th className="p-3 text-center w-[14.28%]">Test Date</th>
                  <th className="p-3 text-center w-[14.28%]">Service Type</th>
                  <th className="p-3 text-center w-[14.28%]">Record Type</th>
                  <th className="p-3 text-center w-[14.28%]">Result</th>
                  <th className="p-3 text-center w-[14.28%]">Clinician/Staff</th>
                  <th className="p-3 text-center w-[14.28%]">Encoder</th>
                  <th className="p-3 text-center w-[14.28%]">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr
                    key={appt.id}
                    className={
                      (editMode || deleteMode) ? "cursor-pointer hover:scale-[101%] hover:bg-red-400 hover:text-white duration-300 " : ""
                    }
                    onClick={() => handleRowClick(index)}
                  >
                    {editMode && <td className="px-4"><PenBox className="w-4 h-4"/></td>}
                    {deleteMode && <td className="px-4"><Trash className="w-4 h-4"/></td>}
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
  )
}

export default HealthRecords;