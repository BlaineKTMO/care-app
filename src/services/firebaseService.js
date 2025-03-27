import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Patient Services
export const patientService = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'patients'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get patient by ID
  getPatientById: async (patientId) => {
    try {
      const docRef = doc(db, 'patients', patientId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Patient not found');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  // Create new patient
  createPatient: async (patientData) => {
    try {
      // Add createAt timestamp
      const dataWithTimestamp = {
        ...patientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'patients'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...patientData
      };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (patientId, patientData) => {
    try {
      const docRef = doc(db, 'patients', patientId);
      
      // Add updatedAt timestamp
      const dataWithTimestamp = {
        ...patientData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
      return {
        id: patientId,
        ...patientData
      };
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Delete patient
  deletePatient: async (patientId) => {
    try {
      const docRef = doc(db, 'patients', patientId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};

// Sensor Reading Services
export const sensorService = {
  // Get all sensor readings for a patient
  getPatientSensorReadings: async (patientId, sensorType, limit = 100) => {
    try {
      const q = query(
        collection(db, 'sensorReadings'),
        where('patientId', '==', patientId),
        where('sensorType', '==', sensorType),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      throw error;
    }
  },

  // Add a new sensor reading
  addSensorReading: async (readingData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...readingData,
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'sensorReadings'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...readingData
      };
    } catch (error) {
      console.error('Error adding sensor reading:', error);
      throw error;
    }
  }
};

// Medical Record Services
export const medicalRecordService = {
  // Get all medical records for a patient
  getPatientMedicalRecords: async (patientId) => {
    try {
      const q = query(
        collection(db, 'medicalRecords'),
        where('patientId', '==', patientId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }
  },

  // Add a new medical record
  addMedicalRecord: async (recordData) => {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...recordData,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'medicalRecords'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...recordData
      };
    } catch (error) {
      console.error('Error adding medical record:', error);
      throw error;
    }
  },

  // Update a medical record
  updateMedicalRecord: async (recordId, recordData) => {
    try {
      const docRef = doc(db, 'medicalRecords', recordId);
      
      // Add updatedAt timestamp
      const dataWithTimestamp = {
        ...recordData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
      return {
        id: recordId,
        ...recordData
      };
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  }
};

// Device Services
export const deviceService = {
  // Get all devices
  getAllDevices: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'devices'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },

  // Get patient devices
  getPatientDevices: async (patientId) => {
    try {
      const q = query(
        collection(db, 'devices'),
        where('assignedPatient', '==', patientId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching patient devices:', error);
      throw error;
    }
  },

  // Register new device
  registerDevice: async (deviceData) => {
    try {
      const dataWithTimestamp = {
        ...deviceData,
        registeredAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'devices'), dataWithTimestamp);
      return {
        id: docRef.id,
        ...deviceData
      };
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  },

  // Update device
  updateDevice: async (deviceId, deviceData) => {
    try {
      const docRef = doc(db, 'devices', deviceId);
      
      const dataWithTimestamp = {
        ...deviceData,
        lastUpdated: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
      return {
        id: deviceId,
        ...deviceData
      };
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }
};