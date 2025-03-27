import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Initial patient data
const patientsData = [
  { 
    name: 'John Doe', 
    age: 65, 
    condition: 'Diabetes',
    nextAppointment: '2025-03-25',
    medications: ['Metformin', 'Insulin'],
    status: 'Stable',
    details: {
      bloodPressure: '120/80',
      bloodSugar: '140 mg/dL',
      lastVisit: '2025-02-25',
      notes: 'Patient responding well to current medication regimen',
      allergies: ['Penicillin'],
      emergencyContact: 'Mary Doe (Wife) - 555-0123'
    }
  },
  { 
    name: 'Jane Smith', 
    age: 70, 
    condition: 'Hypertension',
    nextAppointment: '2025-03-26',
    medications: ['Lisinopril', 'Amlodipine'],
    status: 'Needs Review',
    details: {
      bloodPressure: '145/90',
      bloodSugar: 'Normal',
      lastVisit: '2025-02-20',
      notes: 'Blood pressure slightly elevated, may need medication adjustment',
      allergies: ['Sulfa drugs'],
      emergencyContact: 'Tom Smith (Son) - 555-0124'
    }
  },
  { 
    name: 'Sam Johnson', 
    age: 80, 
    condition: 'Arthritis',
    nextAppointment: '2025-03-27',
    medications: ['Ibuprofen', 'Celebrex'],
    status: 'Stable',
    details: {
      bloodPressure: '130/85',
      bloodSugar: 'Normal',
      lastVisit: '2025-02-15',
      notes: 'Mobility improving with current treatment plan',
      allergies: ['None'],
      emergencyContact: 'Sarah Johnson (Daughter) - 555-0125'
    }
  },
];

// Seed devices data
const seedDevicesData = async (patientId, devicesList) => {
  try {
    for (const device of devicesList) {
      await addDoc(collection(db, 'devices'), {
        ...device,
        assignedPatient: patientId,
        registeredAt: new Date(),
        lastUpdated: new Date()
      });
    }
    console.log(`Added devices for patient ${patientId}`);
  } catch (error) {
    console.error("Error adding devices: ", error);
  }
};

// Main seeding function
export const seedFirestore = async () => {
  console.log("Starting to seed Firestore database...");
  
  try {
    // Check if data already exists to avoid duplicates
    const querySnapshot = await getDocs(collection(db, 'patients'));
    console.log("Query snapshot size:", querySnapshot.size, "- Empty:", querySnapshot.empty);
    
    if (!querySnapshot.empty) {
      console.log("Data already exists in Firestore, skipping seeding");
      return;
    }
    
    console.log("No existing data found, proceeding with seeding process...");
    
    // Add patients
    for (const patient of patientsData) {
      try {
        const docRef = await addDoc(collection(db, 'patients'), {
          ...patient,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`Successfully added patient with ID: ${docRef.id}`);
        
        // Create device data for this patient
        const patientId = docRef.id;
        const patientIndex = patientsData.indexOf(patient) + 1;
        
        console.log(`Creating devices for patient index ${patientIndex}`);
        
        // Create devices based on patient index
        if (patientIndex === 1) {
          await seedDevicesData(patientId, [
            { id: 'hr001', type: 'Heart Rate', status: 'Connected', battery: 85, lastSync: '2 minutes ago' },
            { id: 'bp002', type: 'Blood Pressure', status: 'Connected', battery: 92, lastSync: '5 minutes ago' },
            { id: 'ox003', type: 'Pulse Oximeter', status: 'Connected', battery: 67, lastSync: '3 minutes ago' },
            { id: 'gl004', type: 'Glucose Monitor', status: 'Connected', battery: 73, lastSync: '8 minutes ago' },
            { id: 'tp005', type: 'Temperature', status: 'Connected', battery: 78, lastSync: '10 minutes ago' },
          ]);
        } else if (patientIndex === 2) {
          await seedDevicesData(patientId, [
            { id: 'hr006', type: 'Heart Rate', status: 'Connected', battery: 55, lastSync: '15 minutes ago' },
            { id: 'bp007', type: 'Blood Pressure', status: 'Connected', battery: 90, lastSync: '7 minutes ago' },
            { id: 'ox008', type: 'Pulse Oximeter', status: 'Low Battery', battery: 15, lastSync: '20 minutes ago' },
            { id: 'gl009', type: 'Glucose Monitor', status: 'Connected', battery: 68, lastSync: '12 minutes ago' },
          ]);
        } else if (patientIndex === 3) {
          await seedDevicesData(patientId, [
            { id: 'hr010', type: 'Heart Rate', status: 'Connected', battery: 91, lastSync: '1 minute ago' },
            { id: 'bp011', type: 'Blood Pressure', status: 'Connected', battery: 83, lastSync: '9 minutes ago' },
            { id: 'tp012', type: 'Temperature', status: 'Not Connected', battery: 45, lastSync: '1 hour ago' },
          ]);
        }
        
        // Add sample sensor readings
        const sensorTypes = ['heartRate', 'bloodPressure', 'temperature', 'bloodOxygen', 'glucose'];
        for (const sensorType of sensorTypes) {
          for (let i = 0; i < 24; i++) {
            let value;
            switch (sensorType) {
              case 'heartRate':
                value = Math.floor(Math.random() * 20) + 65;
                break;
              case 'bloodPressure':
                value = {
                  systolic: Math.floor(Math.random() * 30) + 110,
                  diastolic: Math.floor(Math.random() * 15) + 70
                };
                break;
              case 'temperature':
                value = (Math.random() * 1.5 + 97).toFixed(1);
                break;
              case 'bloodOxygen':
                value = Math.floor(Math.random() * 4) + 95;
                break;
              case 'glucose':
                value = Math.floor(Math.random() * 50) + 80;
                break;
              default:
                value = 0;
            }
            
            const date = new Date();
            date.setHours(date.getHours() - i);
            
            await addDoc(collection(db, 'sensorReadings'), {
              patientId,
              sensorType,
              value,
              timestamp: date
            });
          }
        }
        
        console.log(`Added sensor readings for patient ${patientId}`);
      } catch (patientError) {
        console.error("Error adding individual patient:", patientError);
      }
    }
    
    console.log("Firestore seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
};

// Export a function to check if seeding is needed
export const checkAndSeedFirestore = async () => {
  console.log("Checking if Firestore needs seeding...");
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    console.log("Patient collection size:", querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log("No patients found, seeding database...");
      await seedFirestore();
    } else {
      console.log("Database already contains patient data", 
        querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    }
  } catch (error) {
    console.error("Error checking Firestore:", error);
  }
};