// src/components/Dashboard2.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Clock, Logs, PenBox, Trash } from 'lucide-react';
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
  orderBy as fbOrderBy,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

// --- Helper to format a JS Date into "Month D, YYYY" (e.g. "May 6, 2025") ---
function formatDateHuman(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// --- Parse a Firestore Timestamp or a custom string into a JS Date ---
// If you already store a proper Firestore Timestamp, you can skip string parsing.
function parseTimestampField(ts: unknown): Date | null {
  if (!ts) return null;
  if (ts instanceof Timestamp) {
    return ts.toDate();
  }
  if (typeof ts === 'string') {
    // Example string: "2025-03-28 at 10:00:00 AM UTC+8"
    const [datePart, timeTzPart] = ts.split(' at ');
    if (!datePart || !timeTzPart) return null;
    const [timePart, tzPart] = (() => {
      const idx = timeTzPart.lastIndexOf(' ');
      return [timeTzPart.slice(0, idx), timeTzPart.slice(idx + 1)];
    })();
    const [hourMinSec, meridiem] = timePart.split(' ');
    let [hh, mm, ss] = hourMinSec.split(':').map((x) => parseInt(x, 10));
    if (meridiem === 'PM' && hh < 12) hh += 12;
    if (meridiem === 'AM' && hh === 12) hh = 0;

    const offsetMatch = tzPart.match(/UTC([+-]\d{1,2})(?::(\d{2}))?/);
    let offset = '+00:00';
    if (offsetMatch) {
      const hoursOffset = offsetMatch[1].padStart(3, '0'); // e.g. "+08"
      const minsOffset = offsetMatch[2] ?? '00';
      offset = `${hoursOffset}:${minsOffset}`;
    }

    const isoString = `${datePart}T${hh.toString().padStart(2, '0')}:${mm
      .toString()
      .padStart(2, '0')}:${ss.toString().padStart(2, '0')}${offset}`;
    const d = new Date(isoString);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

type Appointment = {
  id: string;
  full_name: string;
  service_type: string;
  status: string;
  time: number;
  timestamp: unknown; // Firestore Timestamp or custom string
  uid: string;
  visit_type: string;
};

const Dashboard2: React.FC = () => {
  const auth = getAuth();
  const db = getFirestore();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest');

  // Modal state for “Reschedule”
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apptToReschedule, setApptToReschedule] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>(''); // "YYYY-MM-DD"
  const [newTime, setNewTime] = useState<string>(''); // "HH:MM"

  // 1) Subscribe to Firestore “appointments” for this user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const apptCol = collection(db, 'appointments');
    const q = query(apptCol, where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list: Appointment[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          full_name: data.full_name,
          service_type: data.service_type,
          status: data.status,
          time: data.time,
          timestamp: data.timestamp,
          uid: data.uid,
          visit_type: data.visit_type,
        });
      });
      setAppointments(list);
    });
    return () => unsub();
  }, [auth, db]);

  // 2) Derived values: last HIV test, suggested next, upcoming appointment
  const lastHIVTestDate = appointments
    .filter((a) => a.service_type === 'HIV Testing' && a.status === 'Completed')
    .map((a) => parseTimestampField(a.timestamp))
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  const suggestedNextTestDate = lastHIVTestDate
    ? (() => {
        const d = new Date(lastHIVTestDate);
        d.setDate(d.getDate() + 90);
        return d;
      })()
    : null;

  const now = new Date();
  const upcomingAppts = appointments
    .map((a) => ({ appt: a, dt: parseTimestampField(a.timestamp) }))
    .filter((x) => x.dt instanceof Date && x.dt.getTime() > now.getTime())
    .sort((a, b) => a.dt!.getTime() - b.dt!.getTime());

  const nextUpcomingApptDate = upcomingAppts.length > 0 ? upcomingAppts[0].dt! : null;

  // 3) Sort appointments for the table
  const sortedAppointments = [...appointments].sort((a, b) => {
    const da = parseTimestampField(a.timestamp);
    const db = parseTimestampField(b.timestamp);
    if (!da || !db) return 0;
    return sortOrder === 'Newest'
      ? db.getTime() - da.getTime()
      : da.getTime() - db.getTime();
  });

  // 4) Open modal & initialize fields
  function openRescheduleModal(appt: Appointment) {
    const dt = parseTimestampField(appt.timestamp);
    if (dt) {
      const yyyy = dt.getFullYear();
      const mm = (dt.getMonth() + 1).toString().padStart(2, '0');
      const dd = dt.getDate().toString().padStart(2, '0');
      setNewDate(`${yyyy}-${mm}-${dd}`);
      const hh = dt.getHours().toString().padStart(2, '0');
      const min = dt.getMinutes().toString().padStart(2, '0');
      setNewTime(`${hh}:${min}`);
    } else {
      setNewDate('');
      setNewTime('');
    }
    setApptToReschedule(appt);
    setIsModalOpen(true);
  }

  // 5) Save new date/time back to Firestore
  async function handleSaveReschedule() {
    if (!apptToReschedule || !newDate || !newTime) return;
    const [year, month, day] = newDate.split('-').map((x) => parseInt(x, 10));
    const [hour, minute] = newTime.split(':').map((x) => parseInt(x, 10));
    const newDt = new Date(year, month - 1, day, hour, minute);
    const newFireTs = Timestamp.fromDate(newDt);

    try {
      const docRef = doc(db, 'appointments', apptToReschedule.id);
      await updateDoc(docRef, {
        timestamp: newFireTs,
        // Optionally: update a separate `time` field if you store minutes‐since‐midnight
        // time: hour * 60 + minute,
      });
      setIsModalOpen(false);
      setApptToReschedule(null);
      setNewDate('');
      setNewTime('');
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  }

  // 6) Cancel the modal
  function handleCancelModal() {
    setIsModalOpen(false);
    setApptToReschedule(null);
    setNewDate('');
    setNewTime('');
  }

  return (
    <div className="space-y-10">
      {/* ───── HEADER CARDS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Last HIV Test Date</p>
            <p className="text-3xl font-semibold m-4">
              {lastHIVTestDate ? formatDateHuman(lastHIVTestDate) : '—'}
            </p>
            <p className="text-sm text-gray-500">Your most recent recorded HIV test date</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Suggested Next HIV Test Date</p>
            <p className="text-3xl font-semibold m-4">
              {suggestedNextTestDate ? formatDateHuman(suggestedNextTestDate) : '—'}
            </p>
            <p className="text-sm text-gray-500">
              Suggested next test date based on the WHO’s 3-month guideline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-12 py-8">
            <p className="text-lg font-semibold">Upcoming Appointment</p>
            <p className="text-3xl font-semibold m-4">
              {nextUpcomingApptDate ? formatDateHuman(nextUpcomingApptDate) : '—'}
            </p>
            <p className="text-sm text-gray-500">
              Stay prepared with your next scheduled visit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ───── TABLE WITH SORT + ACTIONS ───── */}
      <div className="overflow-auto bg-white shadow-[0_0_32px_4px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="bg-red-500 text-white w-full rounded-md px-10 py-2 text-center text-md font-bold flex justify-between">
          {/* SORT DROPDOWN */}
          <div className="flex space-x-6 w-[33%]">
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
          </div>

          <div className="w-[33%] text-lg flex items-center justify-center">
            Clinic Activity History
          </div>

          {/* (Placeholder for a global actions dropdown—unused in this example) */}
          <div className="w-[33%] flex justify-end items-center text-sm hover:underline">
            <Logs className="h-5 w-5" />
            <div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="max-h-[700px] overflow-y-auto custom-scroll">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center w-[2%]"></th>
                  <th className="p-3 text-center w-[15%]">Appt ID</th>
                  <th className="p-3 text-center w-[15%]">Date</th>
                  <th className="p-3 text-center w-[15%]">Time</th>
                  <th className="p-3 text-center w-[15%]">Service Type</th>
                  <th className="p-3 text-center w-[15%]">Visit Type</th>
                  <th className="p-3 text-center w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((appt) => {
                  const dt = parseTimestampField(appt.timestamp);
                  return (
                    <tr key={appt.id} className="border-b">
                      <td className="p-3 text-center">
                        <PenBox 
                          className='w-5 h-5 hover:cursor-pointer hover:scale-[102%] text-gray-500'
                          onClick={() => openRescheduleModal(appt)}/>
                      </td>
                      <td className="p-3 text-center">{appt.id}</td>
                      <td className="p-3 text-center">
                        {dt ? dt.toLocaleDateString('en-CA') : '—'}
                      </td>
                      <td className="p-3 text-center">
                        {dt
                          ? dt.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })
                          : '—'}
                      </td>
                      <td className="p-3 text-center">{appt.service_type}</td>
                      <td className="p-3 text-center">{appt.visit_type}</td>
                      <td className="p-3 text-center">{appt.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ───── CUSTOM MODAL FOR RESCHEDULING ───── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Reschedule Appointment{' '}
              <span className="font-mono text-sm">{apptToReschedule?.id}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700">
                  New Date
                </label>
                <input
                  id="date-input"
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="time-input" className="block text-sm font-medium text-gray-700">
                  New Time
                </label>
                <input
                  id="time-input"
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard2;