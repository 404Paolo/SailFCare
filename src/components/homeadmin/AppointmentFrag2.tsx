"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  doc as firestoreDoc,
  updateDoc,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";

import type {
  AppointmentDoc,
  AppointmentRow,
} from "../../types/appointment";

/**
 * Accepts either:
 *   • A Firestore Timestamp object  (Timestamp)
 *   • A string in one of two formats:
 *       1) "yyyy-MM-dd 'at' hh:mm:ss a"       (e.g. "2025-05-28 at 05:00:00 PM")
 *       2) "MMMM d, yyyy 'at' h:mm:ss a"      (e.g. "June 1, 2025 at 1:43:00 PM")
 *
 * Returns a JS Date if parsing succeeds, otherwise null.
 */
function parseFirestoreTimestamp(
  ts: string | FirestoreTimestamp | null | undefined
): Date | null {
  if (!ts) {
    return null;
  }

  // 1) If it's already a Firestore Timestamp, just convert:
  if (
    typeof ts === "object" &&
    // Firestore Timestamp has a .toDate() method
    typeof (ts as FirestoreTimestamp).toDate === "function"
  ) {
    return (ts as FirestoreTimestamp).toDate();
  }

  // 2) Otherwise, assume it's a string
  if (typeof ts === "string") {
    try {
      // Remove any " UTC+…" suffix (e.g. " UTC+8")
      const [mainPart] = ts.split(" UTC");
      // Normalize narrow no-break spaces (U+202F) to ordinary spaces
      const normalized = mainPart.replace(/\u202F/g, " ");

      // First attempt: "2025-05-28 at 05:00:00 PM"
      let parsed = parse(
        normalized,
        "yyyy-MM-dd 'at' hh:mm:ss a",
        new Date()
      );

      if (!isValid(parsed)) {
        // Fallback: "June 1, 2025 at 1:43:00 PM"
        parsed = parse(
          normalized,
          "MMMM d, yyyy 'at' h:mm:ss a",
          new Date()
        );
      }

      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  // If it's neither a string nor a Firestore Timestamp, bail:
  return null;
}

function mapDocToRow(id: string, data: AppointmentDoc): AppointmentRow {
  const rawTs = (data.timestamp as unknown) as string | FirestoreTimestamp;
  const parsedDate = parseFirestoreTimestamp(rawTs);
  let formattedDate = "";
  let formattedTime = "";

  if (parsedDate) {
    formattedDate = format(parsedDate, "MM-dd-yy");
    formattedTime = format(parsedDate, "h:mm a");
  } else if (typeof data.time === "number") {
    // Fallback to a numeric hour field if timestamp parsing failed
    const fallback = new Date();
    fallback.setHours(data.time, 0, 0, 0);
    formattedTime = format(fallback, "h:mm a");
  }

  return {
    id,
    date: formattedDate,
    time: formattedTime,
    service: data.service_type,
    visit: data.visit_type,
    status: data.status,
    full_name: data.full_name,
  };
}

const AppointmentFrag: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  // Default to “today”; users can pick another date in the Calendar.
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const q = query(collection(db, "appointments"));
    const unsubscribe = onSnapshot(
      q,
      (querySnap: QuerySnapshot<DocumentData>) => {
        const rows: AppointmentRow[] = [];
        querySnap.forEach((docSnap) => {
          const data = docSnap.data() as AppointmentDoc;
          rows.push(mapDocToRow(docSnap.id, data));
        });

        // Sort by date + time (lexical compare of "MM-dd-yy h:mm a")
        rows.sort((a, b) => {
          const aKey = a.date + " " + a.time;
          const bKey = b.date + " " + b.time;
          return aKey.localeCompare(bKey);
        });

        setAppointments(rows);
      },
      (error) => {
        console.error("Error fetching appointments:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // ─── Derive a “MM-dd-yy” key from the selected date ─────────────────────────────
  const selectedKey = selectedDate ? format(selectedDate, "MM-dd-yy") : null;

  // ─── 1) How many appointments exactly on selectedDate ──────────────────────────
  const appointmentsOnDateCount = useMemo(() => {
    if (!selectedKey) return 0;
    return appointments.filter((row) => row.date === selectedKey).length;
  }, [appointments, selectedKey]);

  // ─── 2) How many walk-ins on selectedDate ──────────────────────────────────────
  const walkInsOnDateCount = useMemo(() => {
    if (!selectedKey) return 0;
    return appointments.filter(
      (row) => row.date === selectedKey && row.visit === "Walk-In"
    ).length;
  }, [appointments, selectedKey]);

  // ─── 3) How many “upcoming” on the day after selectedDate ───────────────────────
  const upcomingOnNextDateCount = useMemo(() => {
    if (!selectedDate) return 0;
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    const nextKey = format(next, "MM-dd-yy");
    return appointments.filter(
      (row) => row.date === nextKey && row.status !== "Canceled"
    ).length;
  }, [appointments, selectedDate]);

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      const apptRef = firestoreDoc(db, "appointments", docId);
      await updateDoc(apptRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="space-y-10">
      {/* ─── Dashboard Cards (now based on selectedDate) ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">
              Appointments on{" "}
              {selectedDate ? format(selectedDate, "PPP") : "—"}
            </p>
            <p className="text-5xl font-semibold m-4">
              {appointmentsOnDateCount}
            </p>
            <p className="text-md text-gray-500">
              Number of appointments on this date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">
              Walk-Ins on{" "}
              {selectedDate ? format(selectedDate, "PPP") : "—"}
            </p>
            <p className="text-5xl font-semibold m-4">
              {walkInsOnDateCount}
            </p>
            <p className="text-md text-gray-500">
              Number of walk-in patients on this date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-xl font-semibold">
              Upcoming (Next Day) Appointments
            </p>
            <p className="text-5xl font-semibold m-4">
              {upcomingOnNextDateCount}
            </p>
            <p className="text-md text-gray-500">
              Number of upcoming appointments on{" "}
              {selectedDate
                ? format(
                    new Date(
                      selectedDate.setDate(selectedDate.getDate())
                    ),
                    "PPP"
                  )
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Calendar Picker + Table Header ───────────────────────────────────── */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white rounded-md px-4 py-2 font-semibold flex justify-between items-center">
          <div className="flex items-center gap-2 w-[33%]">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-white text-md hover:underline">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="text-md font-bold w-[33%] text-center">
            Appointments & Walk-In List
          </div>
          <div className="text-md collapse w-[33%]">Edit Status</div>
        </div>

        {/* ─── Table (filtered by selectedDate) ─────────────────────────────────┐ */}
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-md table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[14.28%]">
                    Appointment ID
                  </th>
                  <th className="p-3 text-center w-[14.28%]">Date</th>
                  <th className="p-3 text-center w-[14.28%]">Time</th>
                  <th className="p-3 text-center w-[14.28%]">Name</th>
                  <th className="p-3 text-center w-[14.28%]">
                    Service Type
                  </th>
                  <th className="p-3 text-center w-[14.28%]">Visit Type</th>
                  <th className="p-3 text-center w-[14.28%]">Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments
                  .filter((row) => row.date === selectedKey)
                  .map((appt) => (
                    <tr key={appt.id} className="border-b">
                      <td className="p-3 text-center">{appt.id}</td>
                      <td className="p-3 text-center">{appt.date}</td>
                      <td className="p-3 text-center">{appt.time}</td>
                      <td className="p-3 text-center">{appt.full_name}</td>
                      <td className="p-3 text-center">{appt.service}</td>
                      <td className="p-3 text-center">{appt.visit}</td>
                      <td className="p-3 text-center">
                        <Select
                          value={appt.status}
                          onValueChange={(val) =>
                            handleStatusChange(appt.id, val)
                          }
                        >
                          <SelectTrigger className="w-full text-md">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="text-md">
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="On-Going">In-Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                {appointments.filter((row) => row.date === selectedKey)
                  .length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No appointments found for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────────────────────┘ */}
      </div>
    </div>
  );
};

export default AppointmentFrag;