// generateSeedFiles.js

// STI/STD Testing Center Dummy Data Generator
// Generates 100 records for each collection (except "users"), then writes each collection
// to its own JSON file in the same folder.

const fs = require('fs');

// (A) UTILITY FUNCTIONS
// ----------------------

// Generate a random date string within the last X days, formatted as "YYYY-MM-DD at HH:MM:SS AM UTC+8"
const getRandomDate = (daysBack = 180) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));

  // hour between 8 and 19 (8 AM to 7 PM). Using 12-hour format with "AM/PM" label.
  const hour24 = Math.floor(Math.random() * 12) + 8;
  const hour12 = ((hour24 + 11) % 12) + 1; // converts 0–23 to 1–12
  const ampm = hour24 < 12 ? 'AM' : 'PM';

  // Always “:00:00” for minutes/seconds
  const hh = String(hour12).padStart(2, '0');
  const mmss = '00:00';

  const datePart = date.toISOString().split('T')[0];
  return `${datePart} at ${hh}:${mmss} ${ampm} UTC+8`;
};

// Generate a random Philippine-style mobile number: "09XXXXXXXXX"
const getRandomPhone = () => {
  return '09' + Math.floor(Math.random() * 900000000 + 100000000);
};

// Generate a random 28-character UID (alphanumeric)
const generateUID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 28; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// (B) STATIC DATA ARRAYS
// -----------------------
const firstNames = [
  'John','Maria','Robert','Sarah','Michael','Emily','David','Lisa','James','Jennifer',
  'William','Michelle','Christopher','Amanda','Daniel','Stephanie','Matthew','Jessica',
  'Andrew','Ashley','Joshua','Nicole','Ryan','Elizabeth','Brandon','Samantha','Tyler',
  'Rachel','Justin','Lauren','Kevin','Megan','Steven','Kayla','Jacob','Christina',
  'Zachary','Amy','Nathan','Melissa','Nicholas','Heather','Kyle','Danielle','Anthony',
  'Rebecca','Mark','Kimberly','Jason','Angela'
];

const lastNames = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
  'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
  'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green',
  'Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter'
];

const stiTypes = [
  'Chlamydia','Gonorrhea','Syphilis','HIV','Herpes HSV-1','Herpes HSV-2','HPV',
  'Hepatitis B','Hepatitis C','Trichomoniasis'
];

const testResults = ['Negative','Positive','Pending','Inconclusive'];

const visitTypes = ["Scheduled", "Walk-In"];

const appointmentStatuses = ['Completed', "On-Going", "Upcoming"];

const serviceTypes = [
  'STI Panel','HIV Testing','Chlamydia/Gonorrhea','Syphilis Test','Herpes Testing',
  'HPV Screening','Hepatitis Testing','Follow-up Consultation',
  'Pre-exposure Prophylaxis','Post-exposure Prophylaxis'
];

const clinicians = [
  'Dr. Santos','Dr. Cruz','Dr. Reyes','Dr. Dela Cruz',
  'Nurse Garcia','Dr. Mendoza','Dr. Villanueva','Nurse Lopez'
];

const genders = ['Male','Female','Non-binary','Prefer not to say'];

const supplyTypes = ['Test Kit','Medication','Medical Supply','Laboratory Reagent'];

const manufacturers = [
  'Abbott','Roche','BD','Qiagen','Cepheid','GenProbe','BioMerieux','Siemens'
];

const testKits = [
  'HIV Rapid Test Kit','Chlamydia Test Kit','Gonorrhea Test Kit','Syphilis RPR Kit',
  'Herpes HSV-1/2 Kit','Hepatitis B Test Kit','Hepatitis C Test Kit','HPV DNA Test Kit',
  'Trichomoniasis Test Kit','Multi-STI Panel Kit','Urine Collection Cup','Blood Collection Tube',
  'Swab Collection Kit','Pregnancy Test Kit','Specimen Transport Medium','Laboratory Gloves',
  'Disinfectant Solution','Rapid Test Cassettes','PCR Test Kit','ELISA Test Kit'
];

// (C) MAIN GENERATION
// --------------------
const generateDummyData = () => {
  // We purposely do NOT generate "users" here, since the user requested to omit that.
  // Instead, we still need 100 user‐like entries to pick from (for UID, names, phone, etc.),
  // but we never output them as a "users" collection. We can generate them in memory only.

  //–– Generate 100 in‐memory users (just for reference) ––
  const inMemoryUsers = [];
  for (let i = 1; i <= 100; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    inMemoryUsers.push({
      firstName: fn,
      lastName: ln,
      phone: getRandomPhone(),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`,
      uid: generateUID(),
      role: Math.random() > 0.9 ? 'staff' : 'patient'
    });
  }

  //–– 1) Appointments (100 records) ––
  const appointments = [];
  for (let i = 1; i <= 100; i++) {
    const user = inMemoryUsers[Math.floor(Math.random() * inMemoryUsers.length)];
    appointments.push({
      attachment: '',
      full_name: `${user.firstName} ${user.lastName}`,
      id: `${String(i)}`,
      service_type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
      time: Math.floor(Math.random() * 9) + 8, // integer between 8 and 16 (8 AM–4 PM)
      timestamp: getRandomDate(100),            // within last 30 days
      uid: user.uid,
      visit_type: visitTypes[Math.floor(Math.random() * visitTypes.length)]
    });
  }

  //–– 2) Medical Records (100 records) ––
  const medicalRecords = [];
  for (let i = 1; i <= 100; i++) {
    const user = inMemoryUsers[Math.floor(Math.random() * inMemoryUsers.length)];
    const testType = stiTypes[Math.floor(Math.random() * stiTypes.length)];
    medicalRecords.push({
      Attachments: '',
      'clinician': clinicians[Math.floor(Math.random() * clinicians.length)],
      Encoder: clinicians[Math.floor(Math.random() * clinicians.length)],
      id: `${String(i)}`,
      record_type: 'STI Test Result',
      result: testResults[Math.floor(Math.random() * testResults.length)],
      service_type: testType,
      test_date: getRandomDate(100),  // within last 60 days
      patient_uid: user.uid,
      patient_name: `${user.firstName} ${user.lastName}`
    });
  }

  //–– 3) Patient Information (100 records) ––
  const patientInformation = [];
  for (let i = 1; i <= 100; i++) {
    const user = inMemoryUsers[i - 1]; // ensure each user is used once
    const birthYear = 1970 + Math.floor(Math.random() * 35);
    patientInformation.push({
      address: `${Math.floor(Math.random() * 9999) + 1} ${
        ['Quezon Ave','EDSA','Commonwealth Ave','Katipunan Ave','Ortigas Ave'][Math.floor(Math.random() * 5)]
      }, Quezon City`,
      birth_date: `January ${Math.floor(Math.random() * 28) + 1}, ${birthYear} at 12:00:00 AM UTC+8`,
      contact_numbers: user.phone,
      email_address: user.email,
      first_name: user.firstName,
      gender: genders[Math.floor(Math.random() * genders.length)],
      id: `${String(i)}`,
      last_name: user.lastName,
      registration_date: getRandomDate(365),  // within last year
      sex: Math.random() > 0.5 ? 'Male' : 'Female',
      uid: user.uid,
      emergency_contact: getRandomPhone(),
      insurance_provider:
        Math.random() > 0.7
          ? ['PhilHealth','Maxicare','Medicard','Intellicare'][Math.floor(Math.random() * 4)]
          : ''
    });
  }

  //–– 4) Medical Supplies / Products (100 records) ––
  const medicalSupplies = [];
  for (let i = 1; i <= 100; i++) {
    const productName = testKits[Math.floor(Math.random() * testKits.length)];
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + Math.floor(Math.random() * 24) + 6);

    medicalSupplies.push({
      expiration_date: expirationDate.toISOString().split('T')[0] + ' at 12:00:00 AM UTC+8',
      id: `${String(i)}`,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      name: productName,
      quantity: Math.floor(Math.random() * 500) + 10,
      status: Math.random() > 0.1 ? 'In Stock' : 'Low Stock',
      supply_type: supplyTypes[Math.floor(Math.random() * supplyTypes.length)],
      unit: Math.random() > 0.5 ? 'pieces' : 'boxes',
      cost_per_unit: (Math.random() * 2000 + 50).toFixed(2),
      reorder_level: Math.floor(Math.random() * 50) + 10
    });
  }

  return {
    appointments,
    medical_records: medicalRecords,
    patient_information: patientInformation,
    medical_supplies: medicalSupplies
  };

};

// (D) WRITE JSON FILES
// ---------------------
const allData = generateDummyData();

// 1) appointments.json
fs.writeFileSync(
  'appointments.json',
  JSON.stringify(allData.appointments, null, 2),
  'utf8'
);

// 2) medical_records.json
fs.writeFileSync(
  'medical_records.json',
  JSON.stringify(allData.medical_records, null, 2),
  'utf8'
);

// 3) patient_information.json
fs.writeFileSync(
  'patient_information.json',
  JSON.stringify(allData.patient_information, null, 2),
  'utf8'
);

// 4) medical_supplies.json
fs.writeFileSync(
  'medical_supplies.json',
  JSON.stringify(allData.medical_supplies, null, 2),
  'utf8'
);

console.log('✔️  Four JSON files have been created:\n   • appointments.json\n   • medical_records.json\n   • patient_information.json\n   • medical_supplies.json');
