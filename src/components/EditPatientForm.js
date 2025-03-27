import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { patientService } from '../services/firebaseService';

const EditPatientForm = ({ open, patient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    condition: '',
    nextAppointment: '',
    medications: [],
    status: 'Stable',
    details: {
      bloodPressure: '',
      bloodSugar: '',
      lastVisit: '',
      notes: '',
      allergies: [],
      emergencyContact: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  // Initialize form with patient data when a patient is provided
  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        // Convert numeric strings to numbers for form inputs
        age: patient.age.toString(),
        // Ensure nested objects are properly initialized
        details: {
          ...patient.details,
          allergies: Array.isArray(patient.details?.allergies) 
            ? patient.details.allergies 
            : []
        },
        // Ensure medications is initialized as an array
        medications: Array.isArray(patient.medications) 
          ? patient.medications 
          : []
      });
    }
  }, [patient]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested fields (e.g., details.bloodPressure)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle adding a medication
  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setFormData({
        ...formData,
        medications: [...formData.medications, newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  // Handle removing a medication
  const handleRemoveMedication = (index) => {
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  // Handle adding an allergy
  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          allergies: [...formData.details.allergies, newAllergy.trim()]
        }
      });
      setNewAllergy('');
    }
  };

  // Handle removing an allergy
  const handleRemoveAllergy = (index) => {
    const updatedAllergies = formData.details.allergies.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        allergies: updatedAllergies
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert age to number
      const processedData = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      if (patient && patient.id) {
        // Update existing patient
        await patientService.updatePatient(patient.id, processedData);
        onSave({ id: patient.id, ...processedData });
      } else {
        // Create new patient
        const newPatient = await patientService.createPatient(processedData);
        onSave(newPatient);
      }
      onClose();
    } catch (err) {
      console.error("Error saving patient:", err);
      setError(err.message || "Failed to save patient data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {patient && patient.id ? 'Edit Patient' : 'Add New Patient'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Basic Patient Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                name="age"
                label="Age"
                fullWidth
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Stable">Stable</MenuItem>
                  <MenuItem value="Needs Review">Needs Review</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="condition"
                label="Primary Condition"
                fullWidth
                value={formData.condition}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="nextAppointment"
                label="Next Appointment"
                type="date"
                fullWidth
                value={formData.nextAppointment}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Medications */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Medications
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add Medication"
                  fullWidth
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleAddMedication}
                  sx={{ ml: 1 }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.medications.map((med, index) => (
                  <Chip
                    key={index}
                    label={med}
                    onDelete={() => handleRemoveMedication(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {/* Health Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Health Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="details.bloodPressure"
                label="Blood Pressure"
                fullWidth
                value={formData.details.bloodPressure}
                onChange={handleChange}
                placeholder="e.g., 120/80"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="details.bloodSugar"
                label="Blood Sugar"
                fullWidth
                value={formData.details.bloodSugar}
                onChange={handleChange}
                placeholder="e.g., 100 mg/dL or Normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="details.lastVisit"
                label="Last Visit"
                type="date"
                fullWidth
                value={formData.details.lastVisit}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="details.emergencyContact"
                label="Emergency Contact"
                fullWidth
                value={formData.details.emergencyContact}
                onChange={handleChange}
                placeholder="Name (Relation) - Phone"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add Allergy"
                  fullWidth
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleAddAllergy}
                  sx={{ ml: 1 }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.details.allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => handleRemoveAllergy(index)}
                    color="error"
                    variant="outlined"
                  />
                ))}
                {formData.details.allergies.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No allergies recorded
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="details.notes"
                label="Notes"
                fullWidth
                multiline
                rows={4}
                value={formData.details.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPatientForm;