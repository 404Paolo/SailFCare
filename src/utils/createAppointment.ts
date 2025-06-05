// src/utils/createAppointment.ts
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // ← your firebase.ts that exports `db`

interface AppointmentPayload {
  firstName: string;
  lastName: string;
  subOption: string;         // e.g. "Rapid HIV Test", "Doctor Consultation", etc.
  appointmentType: string;   // e.g. "First Visit to the Clinic"
  date: string;              // e.g. “Jun 20”
  time: string;              // e.g. “2:00 PM”
  // you can add more fields as needed (e.g. phone/email if you want to store them here)
}

/**
 * createAppointment:
 *   - Reads the number of existing docs in "appointments" to compute newID = size + 1
 *   - Saves a new doc at appointments/{newID}
 *   - The new doc will contain:
 *       full_name, service_type, visit_type, date, time, status="On-Going", timestamp=serverTimestamp(), uid
 */
export async function createAppointment(
  uid: string,
  payload: AppointmentPayload
): Promise<void> {
  // 1) Get a snapshot of the collection to figure out how many docs exist
  const colRef = collection(db, "appointments");
  const snapshot = await getDocs(colRef);
  const newNumericId = snapshot.size + 1; // if 100 docs exist, next ID is "101"

  // 2) Build the new-document data
  const newDocData = {
    full_name: `${payload.firstName.trim()} ${payload.lastName.trim()}`,
    service_type: payload.subOption,      // the subOption string
    visit_type: payload.appointmentType,  // e.g. "First Visit to the Clinic"
    date: payload.date,                   // e.g. "Jun 20"
    time: payload.time,                   // e.g. "2:00 PM"
    status: "On-Going",
    timestamp: serverTimestamp(),
    uid,
    // you can add other fields here if you want (phone/email/...)
  };

  // 3) Write the document using ID = newNumericId.toString()
  const newDocRef = doc(db, "appointments", newNumericId.toString());
  await setDoc(newDocRef, newDocData);
}