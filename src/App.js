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

// Add Fitbit configuration
const FITBIT_CONFIG = {
  clientId: '23Q53D',
  clientSecret: '069419eb237705422f993a04c5bdccb2',
  redirectUri: 'http://localhost:3000/callback',
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  tokenUri: 'https://api.fitbit.com/oauth2/token',
  scope: 'heartrate profile activity',
  apiEndpoint: 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json'
};

// Add authentication helper
function FitbitAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState(null);

  const login = () => {
    // Create state parameter for security
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('fitbitState', state);

    const authUrl = `${FITBIT_CONFIG.authorizationUri}?` +
      `response_type=code` +
      `&client_id=${FITBIT_CONFIG.clientId}` +
      `&redirect_uri=${encodeURIComponent(FITBIT_CONFIG.redirectUri)}` +
      `&scope=${encodeURIComponent(FITBIT_CONFIG.scope)}` +
      `&state=${state}`;
    
    window.location.href = authUrl;
  };

  const getAccessToken = async (code) => {
    try {
      const tokenResponse = await fetch(FITBIT_CONFIG.tokenUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${FITBIT_CONFIG.clientId}:${FITBIT_CONFIG.clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: FITBIT_CONFIG.redirectUri,
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to get access token');
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);
      setIsAuthenticated(true);
      
      // Store tokens securely
      sessionStorage.setItem('fitbitAccessToken', tokenData.access_token);
      sessionStorage.setItem('fitbitRefreshToken', tokenData.refresh_token);
      sessionStorage.setItem('fitbitTokenExpiry', Date.now() + (tokenData.expires_in * 1000));
    } catch (error) {
      console.error('Error getting access token:', error);
      setError(error.message);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const tokenResponse = await fetch(FITBIT_CONFIG.tokenUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${FITBIT_CONFIG.clientId}:${FITBIT_CONFIG.clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to refresh token');
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);
      
      // Update stored tokens
      sessionStorage.setItem('fitbitAccessToken', tokenData.access_token);
      sessionStorage.setItem('fitbitRefreshToken', tokenData.refresh_token);
      sessionStorage.setItem('fitbitTokenExpiry', Date.now() + (tokenData.expires_in * 1000));

      return tokenData.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      setIsAuthenticated(false);
      // Clear stored tokens on refresh failure
      sessionStorage.removeItem('fitbitAccessToken');
      sessionStorage.removeItem('fitbitRefreshToken');
      sessionStorage.removeItem('fitbitTokenExpiry');
      throw error;
    }
  };

  useEffect(() => {
    // Check for authorization code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('fitbitState');
    
    if (code) {
      // Verify state parameter
      if (state !== storedState) {
        console.error('State mismatch - possible CSRF attack');
        return;
      }
      
      getAccessToken(code);
      // Clean up URL and state
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('fitbitState');
    } else {
      // Check for existing tokens
      const storedAccessToken = sessionStorage.getItem('fitbitAccessToken');
      const storedRefreshToken = sessionStorage.getItem('fitbitRefreshToken');
      const tokenExpiry = sessionStorage.getItem('fitbitTokenExpiry');

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);

        // Check if token needs refresh
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry) - 300000) { // Refresh 5 minutes before expiry
          refreshAccessToken().catch(() => {
            // Handle refresh failure - user will need to re-authenticate
            login();
          });
        }
      }
    }
  }, []);

  return { 
    isAuthenticated, 
    accessToken, 
    login,
    refreshAccessToken 
  };
}

function HeartRateMonitor({ patientId }) {
  const [heartRate, setHeartRate] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    // Check if the Web Bluetooth API is available
    if (!navigator.bluetooth) {
      setError("Bluetooth is not available on this device or browser");
      return;
    }

    const setupHeartRateSensor = async () => {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['heart_rate']
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');
        
        setSensor({ device, characteristic });
        setError(null);
      } catch (err) {
        console.error('Error setting up heart rate sensor:', err);
        setError(err.message || 'Failed to set up heart rate sensor');
        setIsMonitoring(false);
      }
    };

    if (isMonitoring && !sensor) {
      setupHeartRateSensor();
    }
  }, [isMonitoring, sensor]);

  useEffect(() => {
    let notificationHandler;

    const startMonitoring = async () => {
      if (!sensor) return;

      try {
        setIsLoading(true);
        
        // Setup notification handler
        notificationHandler = (event) => {
          const value = event.target.value;
          const heartRate = value.getUint8(1);
          setHeartRate(heartRate);
          setLastUpdateTime(Date.now());
          setError(null);
        };

        await sensor.characteristic.startNotifications();
        sensor.characteristic.addEventListener('characteristicvaluechanged', notificationHandler);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error starting heart rate monitoring:', err);
        setError(err.message || 'Failed to start heart rate monitoring');
        setIsMonitoring(false);
        setIsLoading(false);
      }
    };

    const stopMonitoring = async () => {
      if (!sensor) return;

      try {
        await sensor.characteristic.stopNotifications();
        if (notificationHandler) {
          sensor.characteristic.removeEventListener('characteristicvaluechanged', notificationHandler);
        }
        await sensor.device.gatt.disconnect();
        setSensor(null);
        setHeartRate(null);
        setLastUpdateTime(null);
      } catch (err) {
        console.error('Error stopping heart rate monitoring:', err);
      }
    };

    if (isMonitoring && sensor) {
      startMonitoring();
    } else if (!isMonitoring && sensor) {
      stopMonitoring();
    }

    return () => {
      if (sensor && notificationHandler) {
        stopMonitoring();
      }
    };
  }, [isMonitoring, sensor]);

  // Add last update time display
  const getLastUpdateText = () => {
    if (!lastUpdateTime) return '';
    const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    return `Last updated ${seconds} seconds ago`;
  };

  if (!navigator.bluetooth) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="error">
          Heart rate monitoring not available (Bluetooth not supported)
        </Typography>
      </Box>
    );
  }

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
          Heart Rate Monitor (Bluetooth)
        </Typography>
        {error ? (
          <Typography variant="body2" color="error">
            Error: {error}
          </Typography>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Loading...</Typography>
          </Box>
        ) : isMonitoring ? (
          <>
            <Typography variant="h6" color="error">
              {heartRate ? `${heartRate} BPM` : 'Waiting for data...'}
            </Typography>
            {lastUpdateTime && (
              <Typography variant="caption" color="textSecondary">
                {getLastUpdateText()}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Click Start to connect to a heart rate monitor
          </Typography>
        )}
      </Box>
      <Button 
        size="small" 
        variant={isMonitoring ? "contained" : "outlined"} 
        color={isMonitoring ? "error" : "primary"}
        onClick={() => setIsMonitoring(!isMonitoring)}
        disabled={!!error || isLoading}
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