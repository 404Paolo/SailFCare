// src/components/HealthRecords.tsx
import React, { useState, useEffect } from "react";
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase"; // <-- adjust to your path
import { Search, Clock, FolderHeart, Logs } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AddHealthRecordModal from "../modal/AddHealthRecordModal";
import ConfirmationAlertModal from "../modal/ConfirmationAlertModal";
import EditHealthRecordModal from "../modal/EditHealthRecordModal";
import { PenBox, Trash } from "lucide-react";

interface Patient {
  first_name: string;
  last_name: string;
  gender: string;
  contact_numbers: string;
  email_address: string;
  address: string;
  birth_date: string;
  insurance_provider?: string;
  emergency_contact?: string;
  registration_date?: string;
  uid: string; // Firebase UID
  // …any other fields you need
}

interface HealthRecord {
  id: string;             // doc ID in "health_records"
  test_date: string;      // e.g. "2025-05-16 at 04:00:00 PM UTC+8"
  service_type: string;   // e.g. "HIV"
  record_type: string;    // e.g. "STI Test Result"
  result: string;         // e.g. "Negative"
  clinician_staff: string;// e.g. "Dr. Reyes"
  encoder: string;        // e.g. "Dr. Villanueva"
  attachments: string;    // e.g. "N/A"
  patient_uid: string;    // Firebase UID
  // …any other fields
}

const HealthRecords: React.FC = () => {
  // ─── Search & Patient Info ────────────────────────────────────────────────
  const [searchPatientId, setSearchPatientId] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [patientDocId, setPatientDocId] = useState<string | null>(null); // Firestore doc ID of the patient

  // ─── Health Records State ────────────────────────────────────────────────
  const [records, setRecords] = useState<HealthRecord[]>([]);

  // ─── Loading / UI State ───────────────────────────────────────────────────
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Filter & Sort State ─────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [filterRecordType, setFilterRecordType] = useState<"" | "HIV" | "Lab Test" | "STI Test Result" | string>("");

  // ─── Modals & Actions ────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState<HealthRecord | null>(null);
  const [selectedRecordForDelete, setSelectedRecordForDelete] = useState<HealthRecord | null>(null);

  // ─── Effect: Whenever patientInfo changes, re‐fetch that patient’s records ─
  useEffect(() => {
    if (patientInfo) {
      fetchRecordsForPatient(patientInfo.uid);
    } else {
      setRecords([]);
    }
  }, [patientInfo]);

  // ─── Function: fetchRecordsForPatient ────────────────────────────────
  const fetchRecordsForPatient = async (patientUid: string) => {
    setLoadingRecords(true);
    setError(null);
    try {
      // Query health_records where patient_uid == patientUid
      const recordsRef = collection(db, "health_records");
      // We get them unsorted, then sort on client side
      const q = query(recordsRef, where("patient_uid", "==", patientUid));
      const snapshot = await getDocs(q);

      const fetched: HealthRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          test_date: data.test_date,
          service_type: data.service_type,
          record_type: data.record_type,
          result: data.result,
          clinician_staff: data["clinician"],
          encoder: data.Encoder || data.encoder,
          attachments: data.Attachments || data.attachments || "",
          patient_uid: data.patient_uid,
        };
      });

      setRecords(fetched);
    } catch (err) {
      console.error(err);
      setError("Failed to load health records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  // ─── Handler: Search Patient ────────────────────────────────────────────
  const handleSearch = async () => {
    setError(null);
    setPatientInfo(null);
    setPatientDocId(null);
    setRecords([]);

    try {
      // 1) If Patient ID (which is the Firestore doc ID) is provided, fetch directly
      if (searchPatientId.trim() !== "") {
        const patientDocRef = doc(db, "patients", searchPatientId.trim());
        const patientSnap = await getDoc(patientDocRef);
        if (!patientSnap.exists()) {
          setError("No patient found with that ID.");
          return;
        }
        const data = patientSnap.data() as Patient;
        setPatientInfo(data);
        setPatientDocId(patientSnap.id);
        return;
      }

      // 2) Else, search by First Name / Last Name (match both if provided)
      const patientsRef = collection(db, "patients");
      let q = patientsRef as any;

      // If both first & last provided
      if (searchFirstName.trim() !== "" && searchLastName.trim() !== "") {
        q = query(
          patientsRef,
          where("first_name", "==", searchFirstName.trim()),
          where("last_name", "==", searchLastName.trim())
        );
      } else if (searchFirstName.trim() !== "") {
        q = query(patientsRef, where("first_name", "==", searchFirstName.trim()));
      } else if (searchLastName.trim() !== "") {
        q = query(patientsRef, where("last_name", "==", searchLastName.trim()));
      } else {
        setError("Please enter Patient ID or First/Last Name to search.");
        return;
      }

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setError("No patient matches those search criteria.");
        return;
      }

      // If multiple matches, just pick the first one
      const docSnap = snapshot.docs[0];
      const data = docSnap.data() as Patient;
      setPatientInfo(data);
      setPatientDocId(docSnap.id);

      // Nothing more needed here; the useEffect above will trigger fetchRecordsForPatient
    } catch (err) {
      console.error(err);
      setError("Something went wrong during search.");
    }
  };

  // ─── Handler: Add New Health Record ────────────────────────────────────
  const handleAddRecord = async (newRecord: {
    test_date: string;
    service_type: string;
    record_type: string;
    result: string;
    clinician_staff: string;
    encoder: string;
    attachments: string;
  }) => {
    if (!patientInfo) {
      alert("No patient selected.");
      return;
    }
    try {
      const recordsRef = collection(db, "health_records");
      await addDoc(recordsRef, {
        ...newRecord,
        patient_uid: patientInfo.uid,
      });
      // Close modal and refresh
      setIsAddModalOpen(false);
      fetchRecordsForPatient(patientInfo.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to add health record.");
    }
  };

  // ─── Handler: Save Edited Record ───────────────────────────────────────
  const handleSaveEditedRecord = async (updatedRecord: HealthRecord) => {
    if (!patientInfo) return;
    try {
      const recordDocRef = doc(db, "health_records", updatedRecord.id);
      await updateDoc(recordDocRef, {
        test_date: updatedRecord.test_date,
        service_type: updatedRecord.service_type,
        record_type: updatedRecord.record_type,
        result: updatedRecord.result,
        clinician: updatedRecord.clinician_staff,
        Encoder: updatedRecord.encoder,
        Attachments: updatedRecord.attachments,
      });
      setIsEditModalOpen(false);
      setSelectedRecordForEdit(null);
      fetchRecordsForPatient(patientInfo.uid);
    } catch (err) {
      console.error(err);
      alert("Failed to update record.");
    }
  };

  // ─── Handler: Confirm Delete Record ────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!selectedRecordForDelete) return;
    try {
      await deleteDoc(doc(db, "health_records", selectedRecordForDelete.id));
      setIsDeleteModalOpen(false);
      setSelectedRecordForDelete(null);
      if (patientInfo) {
        fetchRecordsForPatient(patientInfo.uid);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    }
  };

  // ─── Computed: Apply Sort & Filter ─────────────────────────────────────
  const filteredAndSorted = React.useMemo(() => {
    let arr = [...records];

    if (filterRecordType.trim() !== "") {
      arr = arr.filter((r) => r.record_type === filterRecordType);
    }

    arr.sort((a, b) => {
      // Parse the `test_date` strings into actual Date objects.
      // Format is like: "2025-05-16 at 04:00:00 PM UTC+8"
      const parseDate = (s: string) => {
        // Remove “at” and the timezone suffix, then let JS parse
        // We do a quick replace: “ at ” → “ ”, and strip “ UTC+8”
        const cleaned = s.replace(" at ", " ").split(" UTC")[0];
        return new Date(cleaned);
      };
      const da = parseDate(a.test_date);
      const db_ = parseDate(b.test_date);
      if (sortOrder === "Newest") {
        return db_.getTime() - da.getTime();
      } else {
        return da.getTime() - db_.getTime();
      }
    });

    return arr;
  }, [records, filterRecordType, sortOrder]);

  return (
    <div className="space-y-10">
      {/* ─── Search Patient Section ──────────────────────────────────────────── */}
      <div className="px-12 py-8 overflow-auto bg-white shadow-lg rounded-2xl">
        <h4 className="text-xl font-semibold mb-6">Search Patient</h4>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <input
            type="text"
            placeholder="Patient ID"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
            value={searchPatientId}
            onChange={(e) => setSearchPatientId(e.target.value)}
          />
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
            value={searchFirstName}
            onChange={(e) => setSearchFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="w-[50%] bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* ─── Patient Info Card ───────────────────────────────────────────────── */}
      {patientInfo && (
        <div className="px-12 py-6 space-y-4 bg-white shadow-lg rounded-2xl grid grid-cols-3">
          <p className="col-span-3 text-xl font-semibold">Patient Information</p>
          <p className="font-semibold text-gray-600 text-sm">
            Patient ID:
            <span className="font-normal text-gray-500 ml-1">{patientDocId}</span>
          </p>
          <p className="font-semibold text-gray-600 text-sm">
            First Name:
            <span className="font-normal text-gray-500 ml-1">{patientInfo.first_name}</span>
          </p>
          <p className="font-semibold text-gray-600 text-sm">
            Last Name:
            <span className="font-normal text-gray-500 ml-1">{patientInfo.last_name}</span>
          </p>
          <p className="font-semibold text-gray-600 text-sm">
            Gender:
            <span className="font-normal text-gray-500 ml-1">{patientInfo.gender}</span>
          </p>
          <p className="font-semibold text-gray-600 text-sm">
            Contact Number:
            <span className="font-normal text-gray-500 ml-1">{patientInfo.contact_numbers}</span>
          </p>
          <p className="font-semibold text-gray-600 text-sm">
            Email Address:
            <span className="font-normal text-gray-500 ml-1">{patientInfo.email_address}</span>
          </p>
        </div>
      )}

      {/* ─── Health Records Table & Filters ─────────────────────────────────── */}
      <div className="overflow-auto bg-white shadow-lg rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-t-md px-8 py-3 flex justify-between items-center">
          {/* ─ Filter & Sort Controls ───────────────────────── */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <Select
                value={sortOrder}
                onValueChange={(val: "Newest" | "Oldest") => setSortOrder(val)}
              >
                <SelectTrigger className="w-[120px] text-md">
                  <SelectValue placeholder={sortOrder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newest">Newest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <FolderHeart className="h-5 w-5" />
              <Select
                value={filterRecordType}
                onValueChange={(val) => setFilterRecordType(val)}
              >
                <SelectTrigger className="w-[140px] text-md">
                  <SelectValue placeholder="All Records" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Records</SelectItem>
                  <SelectItem value="HIV">HIV</SelectItem>
                  <SelectItem value="Lab Test">Lab Test</SelectItem>
                  <SelectItem value="STI Test Result">STI Test Result</SelectItem>
                  {/* Add any other record types you may have */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xl font-bold">Health Records</div>

          {/* ─ Actions Dropdown ──────────────────────────────── */}
          <div className="flex items-center space-x-2">
            <Logs className="h-5 w-5" />
            <Select
              value={""}
              onValueChange={(action: string) => {
                if (action === "Add Record") {
                  setIsAddModalOpen(true);
                } else if (action === "Edit Record") {
                  if (filteredAndSorted.length === 0) {
                    alert("No record selected for editing. Click the pen icon on a row first.");
                    return;
                  }
                  // We leave the logic of “click on row” to set the selectedRecordForEdit
                  setEditMode(true);
                  setIsEditModalOpen(true);
                } else if (action === "Delete Record") {
                  if (filteredAndSorted.length === 0) {
                    alert("No record selected for deletion. Click the trash icon on a row first.");
                    return;
                  }
                  setIsDeleteModalOpen(true);
                }
              }}
            >
              <SelectTrigger className="w-[140px] text-md">
                <SelectValue placeholder="Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Add Record">Add Record</SelectItem>
                <SelectItem value="Edit Record">Edit Record</SelectItem>
                <SelectItem value="Delete Record">Delete Record</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ─── Table of Records ────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-b-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[5%]"></th>
                  <th className="p-3 text-center w-[15%]">Test Date</th>
                  <th className="p-3 text-center w-[15%]">Service Type</th>
                  <th className="p-3 text-center w-[15%]">Record Type</th>
                  <th className="p-3 text-center w-[15%]">Result</th>
                  <th className="p-3 text-center w-[15%]">Clinician/Staff</th>
                  <th className="p-3 text-center w-[15%]">Encoder</th>
                  <th className="p-3 text-center w-[5%]">Attachment</th>
                  <th className="p-3 text-center w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {loadingRecords && (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Loading…
                    </td>
                  </tr>
                )}
                {filteredAndSorted.length === 0 && !loadingRecords && (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
                {filteredAndSorted.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-gray-50 cursor-default"
                  >
                    <td className="px-2">
                      <div className="flex space-x-2 justify-center">
                        <PenBox
                          className="w-4 h-4 text-gray-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setSelectedRecordForEdit(rec);
                            setIsEditModalOpen(true);
                          }}
                        />
                        <Trash
                          className="w-4 h-4 text-gray-600 hover:text-red-800 cursor-pointer"
                          onClick={() => {
                            setSelectedRecordForDelete(rec);
                            setIsDeleteModalOpen(true);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">{rec.test_date}</td>
                    <td className="p-3 text-center">{rec.service_type}</td>
                    <td className="p-3 text-center">{rec.record_type}</td>
                    <td className="p-3 text-center">{rec.result}</td>
                    <td className="p-3 text-center">{rec.clinician_staff}</td>
                    <td className="p-3 text-center">{rec.encoder}</td>
                    <td className="p-3 text-center">{rec.attachments || "N/A"}</td>
                    <td className="p-3 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <AddHealthRecordModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newRec) => handleAddRecord(newRec)}
        />
      )}
      {isEditModalOpen && selectedRecordForEdit && (
        <EditHealthRecordModal
          record={selectedRecordForEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRecordForEdit(null);
          }}
          onSave={(updated) => handleSaveEditedRecord(updated)}
        />
      )}
      {isDeleteModalOpen && selectedRecordForDelete && (
        <ConfirmationAlertModal
          header="Delete Health Record"
          message="Are you sure you want to delete this health record? This action is permanent and cannot be undone."
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedRecordForDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default HealthRecords;