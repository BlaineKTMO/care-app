const express = require('express');
const path = require('path');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const app = express();

// Initialize Firebase Admin
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : {
      projectId: process.env.FIREBASE_PROJECT_ID || "cairtaker",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

const firebaseAdmin = initializeApp({
  credential: cert(serviceAccount)
});

const adminAuth = getAuth(firebaseAdmin);
const adminDb = getFirestore(firebaseAdmin);

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Middleware to verify Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized');
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).send('Unauthorized');
  }
}

// Middleware to check if user has admin role
async function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).send('Unauthorized: Authentication required');
  }
  
  try {
    // Check if user has admin claims or is in admin collection
    const userDoc = await adminDb.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    if (userData && userData.role === 'admin') {
      next();
    } else {
      return res.status(403).send('Unauthorized: Admin privileges required');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).send('Server error while checking permissions');
  }
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint for Fitbit token proxy (to avoid exposing client secret in browser)
app.post('/api/fitbit/token', async (req, res) => {
  try {
    const { code, redirectUri, grantType, refreshToken } = req.body;
    const clientId = process.env.REACT_APP_FITBIT_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_FITBIT_CLIENT_SECRET;
    
    const params = new URLSearchParams();
    params.append('grant_type', grantType);
    
    if (grantType === 'authorization_code') {
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
    } else if (grantType === 'refresh_token') {
      params.append('refresh_token', refreshToken);
    }
    
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: params
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying Fitbit token request:', error);
    res.status(500).json({ error: 'Failed to get token from Fitbit' });
  }
});

// New API endpoint to fetch heart rate data from Fitbit
app.get('/api/fitbit/heartrate/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Determine the date range based on the requested period
    let url;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    switch(period) {
      case '1d':
        url = `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d/1min.json`;
        break;
      case '7d':
        // Get data for the past 7 days with 1-hour detail level
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
        url = `https://api.fitbit.com/1/user/-/activities/heart/date/${sevenDaysAgoStr}/${today}/1hour.json`;
        break;
      case '30d':
        // Get data for the past 30 days with 1-day detail level
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
        url = `https://api.fitbit.com/1/user/-/activities/heart/date/${thirtyDaysAgoStr}/${today}/1day.json`;
        break;
      default:
        url = `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d/1min.json`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Fitbit API error:', errorData);
      
      // If token expired, return a specific status code so the client can refresh
      if (response.status === 401) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }
      
      return res.status(response.status).json({ error: 'Error fetching data from Fitbit' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying Fitbit heart rate request:', error);
    res.status(500).json({ error: 'Failed to fetch heart rate data from Fitbit' });
  }
});

// Protected API endpoint example - requires Firebase authentication
app.get('/api/patient-data', verifyFirebaseToken, async (req, res) => {
  try {
    // Example of accessing Firestore data
    const userId = req.user.uid;
    const userDoc = await adminDb.collection('patients').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Patient data not found' });
    }
    
    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({ error: 'Failed to fetch patient data' });
  }
});

// ======== PATIENT API ENDPOINTS ========

// Get all patients (admin only)
app.get('/api/patients', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const patientsSnapshot = await adminDb.collection('patients').get();
    const patients = [];
    
    patientsSnapshot.forEach(doc => {
      patients.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get a specific patient
app.get('/api/patients/:patientId', verifyFirebaseToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if user is admin or the patient themselves
    const isAdmin = await checkIfUserIsAdmin(req.user.uid);
    if (!isAdmin && req.user.uid !== patientId) {
      return res.status(403).json({ error: 'Unauthorized to access this patient data' });
    }
    
    const patientDoc = await adminDb.collection('patients').doc(patientId).get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({
      id: patientDoc.id,
      ...patientDoc.data()
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient data' });
  }
});

// Create a new patient
app.post('/api/patients', verifyFirebaseToken, async (req, res) => {
  try {
    // Validate required fields
    const { name, age, condition, medications = [], status = 'Stable', details = {} } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    
    // Only admin can create patients for other users
    const isAdmin = await checkIfUserIsAdmin(req.user.uid);
    let patientId = req.body.id;
    
    if (!isAdmin && patientId && patientId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized to create patient with custom ID' });
    }
    
    // If patientId is not provided and user is not admin, use their uid
    if (!patientId && !isAdmin) {
      patientId = req.user.uid;
    }
    
    // Prepare patient data
    const patientData = {
      name,
      age: parseInt(age, 10),
      condition,
      medications,
      status,
      details: ensurePatientDetailsStructure(details),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user.uid,
    };
    
    // If specific ID is provided
    let result;
    if (patientId) {
      // Check if patient already exists
      const existingPatient = await adminDb.collection('patients').doc(patientId).get();
      if (existingPatient.exists) {
        return res.status(409).json({ error: 'Patient with this ID already exists' });
      }
      
      await adminDb.collection('patients').doc(patientId).set(patientData);
      result = { id: patientId, ...patientData };
    } else {
      // Let Firestore generate an ID
      const docRef = await adminDb.collection('patients').add(patientData);
      result = { id: docRef.id, ...patientData };
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Update a patient
app.put('/api/patients/:patientId', verifyFirebaseToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if user is admin or the patient themselves
    const isAdmin = await checkIfUserIsAdmin(req.user.uid);
    if (!isAdmin && req.user.uid !== patientId) {
      return res.status(403).json({ error: 'Unauthorized to update this patient data' });
    }
    
    // Check if patient exists
    const patientRef = adminDb.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Prepare update data - only include fields that are provided
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.age !== undefined) updateData.age = parseInt(req.body.age, 10);
    if (req.body.condition !== undefined) updateData.condition = req.body.condition;
    if (req.body.medications !== undefined) updateData.medications = req.body.medications;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    
    // Handle nested details object
    if (req.body.details) {
      const currentDetails = patientDoc.data().details || {};
      updateData.details = {
        ...currentDetails,
        ...req.body.details
      };
    }
    
    // Add metadata
    updateData.updatedAt = new Date();
    updateData.updatedBy = req.user.uid;
    
    await patientRef.update(updateData);
    
    // Get the updated document
    const updatedDoc = await patientRef.get();
    
    res.json({
      id: patientId,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete a patient (admin only)
app.delete('/api/patients/:patientId', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patientRef = adminDb.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();
    
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Delete any related records first (like sensor readings)
    // This is a simple implementation; for large datasets you would use batch operations
    const sensorReadingsSnapshot = await adminDb
      .collection('sensorReadings')
      .where('patientId', '==', patientId)
      .get();
      
    const batch = adminDb.batch();
    sensorReadingsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete devices associated with patient
    const devicesSnapshot = await adminDb
      .collection('devices')
      .where('patientId', '==', patientId)
      .get();
      
    devicesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the patient document
    batch.delete(patientRef);
    
    await batch.commit();
    
    res.json({ message: 'Patient and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

// ======== SENSOR READINGS API ENDPOINTS ========

// Add sensor reading
app.post('/api/sensor-readings', verifyFirebaseToken, async (req, res) => {
  try {
    const { patientId, sensorType, value, timestamp = new Date() } = req.body;
    
    if (!patientId || !sensorType || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields (patientId, sensorType, value)' });
    }
    
    // Check if user is admin or the patient themselves
    const isAdmin = await checkIfUserIsAdmin(req.user.uid);
    if (!isAdmin && req.user.uid !== patientId) {
      return res.status(403).json({ error: 'Unauthorized to add readings for this patient' });
    }
    
    // Validate patient exists
    const patientDoc = await adminDb.collection('patients').doc(patientId).get();
    if (!patientDoc.exists) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const readingData = {
      patientId,
      sensorType,
      value,
      timestamp: timestamp instanceof Date ? timestamp : new Date(timestamp),
      createdAt: new Date(),
      createdBy: req.user.uid
    };
    
    const docRef = await adminDb.collection('sensorReadings').add(readingData);
    
    res.status(201).json({
      id: docRef.id,
      ...readingData
    });
  } catch (error) {
    console.error('Error adding sensor reading:', error);
    res.status(500).json({ error: 'Failed to add sensor reading' });
  }
});

// Get sensor readings for a patient
app.get('/api/sensor-readings/:patientId/:sensorType', verifyFirebaseToken, async (req, res) => {
  try {
    const { patientId, sensorType } = req.params;
    const { limit = 100, startDate, endDate } = req.query;
    
    // Check if user is admin or the patient themselves
    const isAdmin = await checkIfUserIsAdmin(req.user.uid);
    if (!isAdmin && req.user.uid !== patientId) {
      return res.status(403).json({ error: 'Unauthorized to view readings for this patient' });
    }
    
    let query = adminDb.collection('sensorReadings')
      .where('patientId', '==', patientId)
      .where('sensorType', '==', sensorType)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit, 10));
      
    // Add date filters if provided
    if (startDate && endDate) {
      query = query
        .where('timestamp', '>=', new Date(startDate))
        .where('timestamp', '<=', new Date(endDate));
    } else if (startDate) {
      query = query.where('timestamp', '>=', new Date(startDate));
    } else if (endDate) {
      query = query.where('timestamp', '<=', new Date(endDate));
    }
    
    const snapshot = await query.get();
    
    const readings = [];
    snapshot.forEach(doc => {
      readings.push({
        id: doc.id,
        ...doc.data(),
        // Ensure timestamp is serializable
        timestamp: doc.data().timestamp.toDate().toISOString()
      });
    });
    
    res.json(readings);
  } catch (error) {
    console.error('Error fetching sensor readings:', error);
    res.status(500).json({ error: 'Failed to fetch sensor readings' });
  }
});

// ======== HELPER FUNCTIONS ========

// Check if user is admin
async function checkIfUserIsAdmin(userId) {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    return userData && userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Ensure patient details has correct structure
function ensurePatientDetailsStructure(details) {
  return {
    bloodPressure: details.bloodPressure || '',
    bloodSugar: details.bloodSugar || '',
    lastVisit: details.lastVisit || '',
    notes: details.notes || '',
    allergies: Array.isArray(details.allergies) ? details.allergies : [],
    emergencyContact: details.emergencyContact || ''
  };
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});