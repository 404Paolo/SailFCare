// src/components/modal/AddHealthRecordModal.tsx
import React, { useState } from "react";
import { Upload } from "lucide-react";

interface AddHealthRecordModalProps {
  onClose: () => void;
  onSave: (newRecord: {
    test_date: string;
    service_type: string;
    record_type: string;
    result: string;
    clinician_staff: string;
    encoder: string;
    attachments: string;
  }) => void;
}

const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({
  onClose,
  onSave,
}) => {
  // Controlled form state:
  const [testDate, setTestDate] = useState(""); // e.g. "2025-05-16"
  const [testTime, setTestTime] = useState(""); // e.g. "16:00"
  const [serviceType, setServiceType] = useState("");
  const [recordType, setRecordType] = useState("");
  const [result, setResult] = useState("");
  const [clinicianStaff, setClinicianStaff] = useState("");
  const [encoder, setEncoder] = useState("");
  const [attachments, setAttachments] = useState(""); // for now a plain text URL or filename

  const handleSubmit = () => {
    if (
      !testDate ||
      !testTime ||
      !serviceType ||
      !recordType ||
      !result ||
      !clinicianStaff ||
      !encoder
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    // Compose a single string for test_date in the same format: "YYYY-MM-DD at hh:mm:ss AM/PM UTC+8"
    // For simplicity, we’ll do something like: "2025-05-16 at 04:00:00 PM UTC+8".
    // But since HTML <input type='date'> gives "YYYY-MM-DD" and <input type='time'> gives "HH:MM",
    // we need to convert "HH:MM" → "hh:mm:ss AM/PM" in UTC+8. For demo, we’ll assume local timezone is UTC+8,
    // and just do a quick formatting utility:

    const [hours, minutes] = testTime.split(":").map((v) => parseInt(v, 10));
    const period = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
    const hhmmss = `${twelveHour.toString().padStart(2, "0")}:` +
                   `${minutes.toString().padStart(2, "0")}:00 ${period}`;
    const composedDate = `${testDate} at ${hhmmss} UTC+8`;

    onSave({
      test_date: composedDate,
      service_type: serviceType,
      record_type: recordType,
      result,
      clinician_staff: clinicianStaff,
      encoder,
      attachments,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-700">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Add New Health Record</h2>

        <div className="space-y-4">
          {/* Row 1: Date & Time, Service Type */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Test Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Test Time
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Service Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="placeholder">Select Service Type</option>
                <option value="HIV">HIV</option>
                <option value="Lab Test">Lab Test</option>
                <option value="STI Test Result">STI Test Result</option>
              </select>
            </div>
          </div>

          {/* Row 2: Record Type, Result, Upload Attachment */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Record Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              >
                <option value="placeholder">Select Record Type</option>
                <option value="STI Test Result">STI Test Result</option>
                <option value="Routine Check">Routine Check</option>
                {/* Add more record types */}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Result
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="Result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Attachment (URL or Filename)
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Filename or URL"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                />
                <Upload className="w-5 h-5 ml-2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Row 3: Clinician/Staff, Encoder */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Clinician/Staff Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. Dr. Reyes"
                value={clinicianStaff}
                onChange={(e) => setClinicianStaff(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Encoder Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="e.g. Dr. Villanueva"
                value={encoder}
                onChange={(e) => setEncoder(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="flex-1 mr-2 border border-red-500 text-red-500 rounded-xl px-4 py-2 hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 ml-2 bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600"
          >
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHealthRecordModal;