/**
 * batchWrite.js
 *
 * This script reads four JSON files (each an array of objects, each object having an "id" field) and
 * batch‐writes them into Firestore using the Admin SDK. Document IDs are taken from obj.id.
 *
 * Usage:    node batchWrite.js
 * Prereq:   - serviceAccountKey.json in same folder
 *           - npm install firebase-admin
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// ─── 1) Initialize Firebase Admin ───────────────────────────────────────────────

const serviceAccount = require(path.join(__dirname, "sailfcare-c8e45-firebase-adminsdk-fbsvc-fd11b72c29.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ─── 2) Helper to read a JSON file and parse as array ───────────────────────────

function loadJsonArray(filename) {
  const raw = fs.readFileSync(path.join(__dirname, filename), "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error(`${filename} must be an array of objects.`);
  }
  return data;
}

// ─── 3) Batch Upload Function ───────────────────────────────────────────────────

async function uploadCollection(collectionName, jsonFilename) {
  const arr = loadJsonArray(jsonFilename); // e.g. [{ id: "apt_001", ... }, { id: "apt_002", ... }, …]

  // Firestore limits each batch to 500 operations. We’ll split into chunks of 500.
  const BATCH_SIZE = 500;

  console.log(`\n⏳ Uploading ${arr.length} items to "${collectionName}"…`);

  for (let i = 0; i < arr.length; i += BATCH_SIZE) {
    const chunk = arr.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach((item) => {
      if (!item.id) {
        throw new Error(`Missing 'id' field in item: ${JSON.stringify(item)}`);
      }
      const docRef = db.collection(collectionName).doc(item.id);
      // We’ll write all fields EXCEPT “id” itself (Firestore doc fields shouldn’t include the “id” key
      // since doc.id is already that).
      const { id, ...fields } = item;
      batch.set(docRef, fields);
    });

    await batch.commit();
    console.log(`  ✔️  Committed documents ${i + 1}–${Math.min(i + BATCH_SIZE, arr.length)}`);
  }

  console.log(`✅ Done uploading to "${collectionName}".`);
}

// ─── 4) Main: Upload All Four Collections ────────────────────────────────────────

async function main() {
  try {
    await uploadCollection("appointments", "appointments.json");
    await uploadCollection("health_records", "medical_records.json");
    await uploadCollection("patients", "patient_information.json");
    await uploadCollection("products", "medical_supplies.json");
    console.log("\n🎉 All four collections uploaded successfully!");
  } catch (err) {
    console.error("❌ Error during upload:", err);
  } finally {
    process.exit(0);
  }
}

// Kick it off:
main();