import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Paper,
  Avatar,
  Chip,
  Collapse,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './App.css';

const patients = [
  { 
    id: 1, 
    name: 'John Doe', 
    age: 65, 
    condition: 'Diabetes',
    nextAppointment: '2024-03-25',
    medications: ['Metformin', 'Insulin'],
    status: 'Stable',
    details: {
      bloodPressure: '120/80',
      bloodSugar: '140 mg/dL',
      lastVisit: '2024-02-25',
      notes: 'Patient responding well to current medication regimen',
      allergies: ['Penicillin'],
      emergencyContact: 'Mary Doe (Wife) - 555-0123'
    }
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    age: 70, 
    condition: 'Hypertension',
    nextAppointment: '2024-03-26',
    medications: ['Lisinopril', 'Amlodipine'],
    status: 'Needs Review',
    details: {
      bloodPressure: '145/90',
      bloodSugar: 'Normal',
      lastVisit: '2024-02-20',
      notes: 'Blood pressure slightly elevated, may need medication adjustment',
      allergies: ['Sulfa drugs'],
      emergencyContact: 'Tom Smith (Son) - 555-0124'
    }
  },
  { 
    id: 3, 
    name: 'Sam Johnson', 
    age: 80, 
    condition: 'Arthritis',
    nextAppointment: '2024-03-27',
    medications: ['Ibuprofen', 'Celebrex'],
    status: 'Stable',
    details: {
      bloodPressure: '130/85',
      bloodSugar: 'Normal',
      lastVisit: '2024-02-15',
      notes: 'Mobility improving with current treatment plan',
      allergies: ['None'],
      emergencyContact: 'Sarah Johnson (Daughter) - 555-0125'
    }
  },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function HeartRateMonitor({ patientId }) {
  const [heartRate, setHeartRate] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      // Simulate heart rate monitoring with random variations
      const baseRate = 70 + Math.random() * 20;
      setHeartRate(Math.round(baseRate));
      
      interval = setInterval(() => {
        const variation = Math.random() * 6 - 3; // Random variation of ±3 BPM
        setHeartRate(prev => Math.round(prev + variation));
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <FavoriteIcon 
        sx={{ 
          color: 'error.main',
          animation: isMonitoring ? 'pulse 1s infinite' : 'none',
          mr: 1,
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          }
        }} 
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Heart Rate Monitor
        </Typography>
        {isMonitoring ? (
          <Typography variant="h6" color="error">
            {heartRate} BPM
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Monitor is off
          </Typography>
        )}
      </Box>
      <Button 
        size="small" 
        variant={isMonitoring ? "contained" : "outlined"} 
        color={isMonitoring ? "error" : "primary"}
        onClick={() => setIsMonitoring(!isMonitoring)}
      >
        {isMonitoring ? 'Stop' : 'Start'}
      </Button>
    </Box>
  );
}

function PatientCard({ patient }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Card>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="div"
            sx={{
              height: 140,
              backgroundColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80,
                backgroundColor: 'white',
                color: 'primary.main'
              }}
            >
              {patient.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
          </CardMedia>
          <Chip
            label={patient.status}
            color={patient.status === 'Stable' ? 'success' : 'warning'}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {patient.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Age: {patient.age}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Condition: {patient.condition}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Next Appointment: {patient.nextAppointment}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {patient.medications.map((med, index) => (
              <Chip
                key={index}
                label={med}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <HeartRateMonitor patientId={patient.id} />
        </CardContent>
        <CardActions>
          <Button
            onClick={handleExpandClick}
            sx={{ width: '100%' }}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Blood Pressure" 
                  secondary={patient.details.bloodPressure} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Blood Sugar" 
                  secondary={patient.details.bloodSugar} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Last Visit" 
                  secondary={patient.details.lastVisit} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Allergies" 
                  secondary={patient.details.allergies.join(', ') || 'None'} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Emergency Contact" 
                  secondary={patient.details.emergencyContact} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Notes" 
                  secondary={patient.details.notes} 
                />
              </ListItem>
            </List>
          </CardContent>
        </Collapse>
      </Card>
    </Paper>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <LocalHospitalIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CareConnect
            </Typography>
            <MedicalServicesIcon />
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Patient Dashboard
          </Typography>

          <Grid container spacing={3}>
            {patients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} key={patient.id}>
                <PatientCard patient={patient} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;