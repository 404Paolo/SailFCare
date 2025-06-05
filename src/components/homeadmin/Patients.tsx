// src/components/Patients.tsx

import { useState, useEffect} from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Query,
  CollectionReference,
} from "firebase/firestore";
import type {ChangeEvent} from "react";
import type {FormEvent} from "react";
import type { DocumentData } from "firebase/firestore";
import { format } from "date-fns";
import { db } from "../../firebase"; // adjust path to your Firestore init
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Patient {
  id: string; // Firestore document ID
  first_name: string;
  last_name: string;
  contact_numbers: string;
  email_address: string;
  registration_date: string;
}

export const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchInputs, setSearchInputs] = useState({
    patientId: "",
    firstName: "",
    lastName: "",
  });

  // Fetch patients from Firestore, applying any search filters
  const fetchPatients = async () => {
    try {
      // Explicitly type patientsRef as a CollectionReference<DocumentData>
      const patientsRef = collection(db, "patients") as CollectionReference<DocumentData>;

      // Now explicitly type q as Query<DocumentData>
      let q: Query<DocumentData> = patientsRef;

      const { patientId, firstName, lastName } = searchInputs;

      // If Patient ID is provided, query by document ID
      if (patientId.trim() !== "") {
        q = query(patientsRef, where("__name__", "==", patientId.trim()));
      } else {
        // Otherwise, apply first_name / last_name filters if present
        const constraints: Array<ReturnType<typeof where>> = [];

        if (firstName.trim() !== "") {
          constraints.push(where("first_name", "==", firstName.trim()));
        }
        if (lastName.trim() !== "") {
          constraints.push(where("last_name", "==", lastName.trim()));
        }

        if (constraints.length > 0) {
          // Spread the array of `where` constraints into query()
          q = query(patientsRef, ...constraints);
        }
      }

      const snapshot = await getDocs(q);
      const list: Patient[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Patient, "id">;
        return {
          id: doc.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          contact_numbers: data.contact_numbers || "",
          email_address: data.email_address || "",
          registration_date: data.registration_date || "",
        };
      });

      setPatients(list);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch all patients on component mount
  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes in any search input field
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // When user clicks “Search”, re-fetch with current filters
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  // Format "registration_date" (string) → MM-DD-YY
  const formatDate = (dateString: string) => {
    try {
      const parsed = new Date(dateString);
      return format(parsed, "MM-dd-yy");
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-10">
      {/* ─── Summary Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">Total Registered Patients</p>
            <p className="text-5xl font-semibold m-8">{patients.length}</p>
            <p className="text-md text-gray-500">
              Total number of registered patient accounts in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">New Patients This Week</p>
            <p className="text-5xl font-semibold m-8">
              {(() => {
                const now = new Date();
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);

                const count = patients.filter((p) => {
                  const reg = new Date(p.registration_date);
                  return reg >= weekAgo && reg <= now;
                }).length;

                return count > 0 ? `+${count}` : "0";
              })()}
            </p>
            <p className="text-md text-gray-500">
              Number of registered patients this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">New Patients This Month</p>
            <p className="text-5xl font-semibold m-8">
              {(() => {
                const now = new Date();
                const count = patients.filter((p) => {
                  const reg = new Date(p.registration_date);
                  return (
                    reg.getFullYear() === now.getFullYear() &&
                    reg.getMonth() === now.getMonth()
                  );
                }).length;
                return count > 0 ? `+${count}` : "0";
              })()}
            </p>
            <p className="text-md text-gray-500">
              Number of registered patients this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">New Patients This Year</p>
            <p className="text-5xl font-semibold m-8">
              {(() => {
                const now = new Date();
                const count = patients.filter((p) => {
                  const reg = new Date(p.registration_date);
                  return reg.getFullYear() === now.getFullYear();
                }).length;
                return count > 0 ? `+${count}` : "0";
              })()}
            </p>
            <p className="text-md text-gray-500">
              Number of registered patients this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Search Form ──────────────────────────────────────────────────────────── */}
      <div className="px-12 py-8 bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <p className="text-xl font-semibold mb-6">Search Patient</p>
        <form onSubmit={handleSearch} className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            name="patientId"
            value={searchInputs.patientId}
            onChange={handleInputChange}
            placeholder="Patient ID"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="text"
            name="firstName"
            value={searchInputs.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="text"
            name="lastName"
            value={searchInputs.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <div className="flex items-center">
            <button
              type="submit"
              className="w-full bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition flex justify-center items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* ─── Patients Table ──────────────────────────────────────────────────────── */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-4 py-2 text-center text-md font-bold">
          Registered Patients
        </div>
        <div className="overflow-hidden rounded-md text-sm border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[14.28%]">Patient ID</th>
                  <th className="p-3 text-center w-[14.28%]">Last Name</th>
                  <th className="p-3 text-center w-[14.28%]">First Name</th>
                  <th className="p-3 text-center w-[14.28%]">Contact Number</th>
                  <th className="p-3 text-center w-[14.28%]">Email Address</th>
                  <th className="p-3 text-center w-[14.28%]">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="p-3 text-center">{p.id}</td>
                      <td className="p-3 text-center">{p.last_name}</td>
                      <td className="p-3 text-center">{p.first_name}</td>
                      <td className="p-3 text-center">{p.contact_numbers}</td>
                      <td className="p-3 text-center">{p.email_address}</td>
                      <td className="p-3 text-center">
                        {p.registration_date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={6}>
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;