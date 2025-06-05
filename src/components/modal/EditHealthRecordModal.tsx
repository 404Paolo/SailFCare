// src/components/modal/EditHealthRecordModal.tsx
import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface EditHealthRecordModalProps {
  record: {
    id: string;
    test_date: string;
    service_type: string;
    record_type: string;
    result: string;
    clinician_staff: string;
    encoder: string;
    attachments: string;
    patient_uid: string;
  };
  onClose: () => void;
  onSave: (updatedRecord: {
    id: string;
    test_date: string;
    service_type: string;
    record_type: string;
    result: string;
    clinician_staff: string;
    encoder: string;
    attachments: string;
    patient_uid: string;
  }) => void;
}

const EditHealthRecordModal: React.FC<EditHealthRecordModalProps> = ({
  record,
  onClose,
  onSave,
}) => {
  // Break the existing record.test_date (e.g. "2025-05-16 at 04:00:00 PM UTC+8")
  // into date + time fields:
  const parseDateString = (full: string) => {
    // If format is exactly "YYYY-MM-DD at hh:mm:ss AM/PM UTC+8",
    // split on " at ":
    const [datePart, timePartWithTZ] = full.split(" at ");
    // timePartWithTZ is like "04:00:00 PM UTC+8"
    const [time12h, _tz] = timePartWithTZ.split(" UTC"); // ["04:00:00 PM", "+8"]
    // Convert "04:00:00 PM" → "HH:MM" in 24-hour format:
    let [hms, period] = time12h.split(" "); // ["04:00:00", "PM"]
    const [hh, mm, ss] = hms.split(":").map((v) => parseInt(v, 10));
    let hours24 = hh;
    if (period === "PM" && hh < 12) hours24 = hh + 12;
    if (period === "AM" && hh === 12) hours24 = 0;
    const hh24Str = hours24.toString().padStart(2, "0");
    const mmStr = mm.toString().padStart(2, "0");
    return { datePart, time24: `${hh24Str}:${mmStr}` };
  };

  const { datePart, time24 } = parseDateString(record.test_date);

  // Controlled form fields, pre‐filled:
  const [testDate, setTestDate] = useState(datePart);
  const [testTime, setTestTime] = useState(time24);
  const [serviceType, setServiceType] = useState(record.service_type);
  const [recordType, setRecordType] = useState(record.record_type);
  const [result, setResult] = useState(record.result);
  const [clinicianStaff, setClinicianStaff] = useState(record.clinician_staff);
  const [encoder, setEncoder] = useState(record.encoder);
  const [attachments, setAttachments] = useState(record.attachments);

  useEffect(() => {
    // If `record` prop ever changes, re‐initialize
    const { datePart: d, time24: t } = parseDateString(record.test_date);
    setTestDate(d);
    setTestTime(t);
    setServiceType(record.service_type);
    setRecordType(record.record_type);
    setResult(record.result);
    setClinicianStaff(record.clinician_staff);
    setEncoder(record.encoder);
    setAttachments(record.attachments);
  }, [record]);

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
    // Re‐compose test_date in the correct format
    const [hours, minutes] = testTime.split(":").map((v) => parseInt(v, 10));
    const period = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
    const hhmmss = `${twelveHour.toString().padStart(2, "0")}:` +
                   `${minutes.toString().padStart(2, "0")}:00 ${period}`;
    const composedDate = `${testDate} at ${hhmmss} UTC+8`;

    onSave({
      id: record.id,
      patient_uid: record.patient_uid,
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
        <h2 className="text-xl font-semibold text-center mb-4">Edit Health Record</h2>

        <div className="space-y-4">
          {/* Same layout as Add, but pre‐filled */}
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
                {/* … */}
              </select>
            </div>
          </div>

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
                {/* … */}
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHealthRecordModal;