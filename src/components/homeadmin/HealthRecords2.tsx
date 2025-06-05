// src/components/HealthRecords2.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Clock, FolderHeart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Parse a Firestore timestamp‐string (e.g. "2025-03-27 at 09:00:00 AM UTC+8")
// into a JS Date.  If you’ve already migrated `test_date` to be a Firestore Timestamp,
// you can simplify this to `ts.toDate()`. But here we assume it’s still a string.
// ─────────────────────────────────────────────────────────────────────────────
function parseTestDate(ts: unknown): Date | null {
  if (!ts) return null;
  if (typeof ts !== 'string') return null;

  // Example string: "2025-03-27 at 09:00:00 AM UTC+8"
  const [datePart, timeTzPart] = ts.split(' at ');
  if (!datePart || !timeTzPart) return null;

  // Separate “09:00:00 AM” from “UTC+8”
  const lastSpace = timeTzPart.lastIndexOf(' ');
  const timePart = timeTzPart.slice(0, lastSpace); // "09:00:00 AM"
  const tzPart = timeTzPart.slice(lastSpace + 1); // "UTC+8"

  // Parse “09:00:00 AM” into hours/minutes/seconds
  const [hourMinSec, meridiem] = timePart.split(' ');
  let [hh, mm, ss] = hourMinSec.split(':').map((x) => parseInt(x, 10));
  if (meridiem === 'PM' && hh < 12) hh += 12;
  if (meridiem === 'AM' && hh === 12) hh = 0;

  // Parse “UTC+8” or “UTC+08:00” into “+08:00”
  const offsetMatch = tzPart.match(/UTC([+-]\d{1,2})(?::(\d{2}))?/);
  let offset = '+00:00';
  if (offsetMatch) {
    const hoursOffset = offsetMatch[1].padStart(3, '0'); // e.g. "+08"
    const minsOffset = offsetMatch[2] ?? '00';
    offset = `${hoursOffset}:${minsOffset}`;
  }

  // Build an ISO string, e.g. "2025-03-27T09:00:00+08:00"
  const isoString = `${datePart}T${hh.toString().padStart(2, '0')}:${mm
    .toString()
    .padStart(2, '0')}:${ss.toString().padStart(2, '0')}${offset}`;

  const d = new Date(isoString);
  return isNaN(d.getTime()) ? null : d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Format a JS Date into “Month D, YYYY” (e.g. “Mar 27, 2025”).
// Returns “—” if passed null.
// ─────────────────────────────────────────────────────────────────────────────
function formatDateHuman(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Type for a single health record (as stored in Firestore).
// Adjust if your schema differs slightly.
// ─────────────────────────────────────────────────────────────────────────────
type HealthRecord = {
  id: string;             // Firestore document ID
  clinician: string;
  patient_name: string;
  patient_uid: string;
  record_type: string;    // e.g. “HIV Test Result” or “STI Test Result” or “Lab Test Result”
  result: string;         // e.g. “Positive” / “Negative”
  service_type: string;   // e.g. “Trichomoniasis”
  test_date: unknown;     // string or Timestamp
};

const HealthRecords2: React.FC = () => {
  const auth = getAuth();
  const db = getFirestore();

  // ───────────────────────────────────────────────────────────────────────────
  // State: all fetched records for this patient
  // ───────────────────────────────────────────────────────────────────────────
  const [records, setRecords] = useState<HealthRecord[]>([]);

  // ───────────────────────────────────────────────────────────────────────────
  // Sorting & Filtering controls
  // ───────────────────────────────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest');
  const [filterType, setFilterType] = useState<'All Records' | 'HIV Test' | 'Lab Test'>(
    'All Records'
  );

  // ───────────────────────────────────────────────────────────────────────────
  // 1) On mount, subscribe to Firestore `health_records` where patient_uid == currentUser.uid
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const colRef = collection(db, 'health_records');
    const q = query(colRef, where('patient_uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr: HealthRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        arr.push({
          id: docSnap.id,
          clinician: data.clinician,
          patient_name: data.patient_name,
          patient_uid: data.patient_uid,
          record_type: data.record_type,
          result: data.result,
          service_type: data.service_type,
          test_date: data.test_date,
        });
      });
      setRecords(arr);
    });

    return () => unsubscribe();
  }, [auth, db]);

  // ───────────────────────────────────────────────────────────────────────────
  // 2) Derive header-card values:
  //    • totalRecords = all records length
  //    • hivTestThisYear = count of records whose record_type includes “HIV”
  //       AND whose parsed test_date is in the current year
  //    • labTestThisYear = analogous for “Lab”
  // ───────────────────────────────────────────────────────────────────────────
  const totalRecords = records.length;

  const now = new Date();
  const thisYear = now.getFullYear();

  let hivTestThisYear = 0;
  let labTestThisYear = 0;

  records.forEach((rec) => {
    const dt = parseTestDate(rec.test_date);
    if (!dt) return;

    if (dt.getFullYear() === thisYear) {
      if (rec.record_type.toLowerCase().includes('hiv')) {
        hivTestThisYear += 1;
      } else if (rec.record_type.toLowerCase().includes('lab')) {
        labTestThisYear += 1;
      }
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3) Apply filtering (“All Records” / “HIV Test” / “Lab Test”) and sorting
  // ───────────────────────────────────────────────────────────────────────────
  const filteredRecords = records.filter((rec) => {
    if (filterType === 'All Records') return true;

    if (filterType === 'HIV Test') {
      return rec.record_type.toLowerCase().includes('hiv');
    }
    if (filterType === 'Lab Test') {
      return rec.record_type.toLowerCase().includes('lab');
    }
    return true;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const da = parseTestDate(a.test_date);
    const db = parseTestDate(b.test_date);
    if (!da || !db) return 0;

    return sortOrder === 'Newest'
      ? db.getTime() - da.getTime()
      : da.getTime() - db.getTime();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* ───── HEADER CARDS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Total Health Records</p>
            <p className="text-3xl font-semibold m-4">{totalRecords}</p>
            <p className="text-sm text-gray-500">Total number of your health records</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">HIV Tests This Year</p>
            <p className="text-3xl font-semibold m-4">{hivTestThisYear}</p>
            <p className="text-sm text-gray-500">
              Number of HIV tests conducted in {thisYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Lab Tests This Year</p>
            <p className="text-3xl font-semibold m-4">{labTestThisYear}</p>
            <p className="text-sm text-gray-500">
              Number of lab tests conducted in {thisYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ───── SORT & FILTER BAR ───── */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-10 py-2 text-md font-bold flex justify-between">
          <div className="flex space-x-6 w-[50%]">
            {/* SORT BY NEWEST/OLDEST */}
            <div className="flex items-center text-sm hover:underline">
              <Clock className="h-5 w-5" />
              <div>
                <Select
                  onValueChange={(val) => setSortOrder(val as 'Newest' | 'Oldest')}
                  defaultValue={sortOrder}
                >
                  <SelectTrigger className="w-full text-md space-x-2">
                    <SelectValue placeholder={sortOrder} />
                  </SelectTrigger>
                  <SelectContent className="text-md">
                    <SelectItem value="Newest">Newest</SelectItem>
                    <SelectItem value="Oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* FILTER BY RECORD TYPE */}
            <div className="flex items-center text-sm hover:underline">
              <FolderHeart className="h-5 w-5" />
              <div>
                <Select
                  onValueChange={(val) =>
                    setFilterType(val as 'All Records' | 'HIV Test' | 'Lab Test')
                  }
                  defaultValue={filterType}
                >
                  <SelectTrigger className="w-full text-md space-x-2">
                    <SelectValue placeholder={filterType} />
                  </SelectTrigger>
                  <SelectContent className="text-md">
                    <SelectItem value="All Records">All Records</SelectItem>
                    <SelectItem value="HIV Test">HIV Test</SelectItem>
                    <SelectItem value="Lab Test">Lab Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="w-[50%] flex items-center justify-center text-lg">
            Health Records
          </div>
        </div>

        {/* ───── TABLE ───── */}
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[12%]">Record ID</th>
                  <th className="p-3 text-center w-[18%]">Test Date</th>
                  <th className="p-3 text-center w-[16%]">Service Type</th>
                  <th className="p-3 text-center w-[16%]">Record Type</th>
                  <th className="p-3 text-center w-[12%]">Result</th>
                  <th className="p-3 text-center w-[18%]">Clinician</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((rec) => {
                  const dt = parseTestDate(rec.test_date);
                  return (
                    <tr key={rec.id} className="border-b">
                      <td className="p-3 text-center">{rec.id}</td>
                      <td className="p-3 text-center">
                        {dt
                          ? `${formatDateHuman(dt)} ${dt.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}`
                          : '—'}
                      </td>
                      <td className="p-3 text-center">{rec.service_type}</td>
                      <td className="p-3 text-center">{rec.record_type}</td>
                      <td className="p-3 text-center">{rec.result}</td>
                      <td className="p-3 text-center">{rec.clinician}</td>
                    </tr>
                  );
                })}

                {sortedRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No records found.
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

export default HealthRecords2;