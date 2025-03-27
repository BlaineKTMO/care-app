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
  CircularProgress,
  Switch,
  useMediaQuery,
  CssBaseline,
  Badge,
  LinearProgress,
  Menu,
  MenuItem,
  Drawer,
  Tabs,
  Tab,
  ButtonGroup,
  Stack,
  Tooltip,
  Hidden,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DevicesIcon from '@mui/icons-material/Devices';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SensorsIcon from '@mui/icons-material/Sensors';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import './App.css';

// Import recharts for advanced data visualization
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

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

// Enhanced theme with dark mode capability for a more professional look
function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#2196f3' : '#1976d2',
        light: mode === 'dark' ? '#4dabf5' : '#42a5f5',
        dark: mode === 'dark' ? '#1565c0' : '#0d47a1',
        contrastText: '#fff',
      },
      secondary: {
        main: '#e91e63',
        light: '#f06292',
        dark: '#c2185b',
        contrastText: '#fff',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      info: {
        main: '#03a9f4',
      },
      success: {
        main: '#4caf50',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f7fa',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        card: mode === 'dark' ? '#2d2d2d' : '#f0f4f8',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#2c3e50',
        secondary: mode === 'dark' ? '#b0bec5' : '#7f8c8d',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.08)',
            '&:hover': {
              boxShadow: mode === 'dark' ? 'none' : '0 4px 8px rgba(0,0,0,0.12)',
            },
          },
          containedPrimary: {
            backgroundImage: mode === 'dark' ? 
              'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)' : 
              'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          },
          containedSecondary: {
            backgroundImage: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: mode === 'dark' ? 
              '0 4px 20px 0 rgba(0,0,0,0.3)' : 
              '0 4px 20px 0 rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark' ? 
              '0 4px 20px 0 rgba(0,0,0,0.3)' : 
              '0 4px 20px 0 rgba(0,0,0,0.1)',
          }
        }
      }
    },
  });
}

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

// Add mock sensor data for visualization with different time ranges
const mockSensorData = {
  heartRateHistory: {
    '6h': Array(6).fill(0).map((_, i) => ({
      time: `${new Date().getHours() - 6 + i < 0 ? new Date().getHours() - 6 + i + 24 : new Date().getHours() - 6 + i}:00`,
      value: Math.floor(Math.random() * 20) + 65
    })),
    '24h': Array(24).fill(0).map((_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 20) + 65
    })),
    '7d': Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i - 1));
      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.floor(Math.random() * 20) + 65
      };
    })
  },
  bloodPressureHistory: {
    '6h': Array(6).fill(0).map((_, i) => ({
      time: `${new Date().getHours() - 6 + i < 0 ? new Date().getHours() - 6 + i + 24 : new Date().getHours() - 6 + i}:00`,
      systolic: Math.floor(Math.random() * 30) + 110,
      diastolic: Math.floor(Math.random() * 15) + 70
    })),
    '24h': Array(24).fill(0).map((_, i) => ({
      time: `${i}:00`,
      systolic: Math.floor(Math.random() * 30) + 110,
      diastolic: Math.floor(Math.random() * 15) + 70
    })),
    '7d': Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i - 1));
      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        systolic: Math.floor(Math.random() * 30) + 110,
        diastolic: Math.floor(Math.random() * 15) + 70
      };
    })
  },
  bloodOxygenHistory: {
    '6h': Array(6).fill(0).map((_, i) => ({
      time: `${new Date().getHours() - 6 + i < 0 ? new Date().getHours() - 6 + i + 24 : new Date().getHours() - 6 + i}:00`,
      value: Math.floor(Math.random() * 4) + 95
    })),
    '24h': Array(24).fill(0).map((_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 4) + 95
    })),
    '7d': Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i - 1));
      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.floor(Math.random() * 4) + 95
      };
    })
  },
  temperatureHistory: {
    '6h': Array(6).fill(0).map((_, i) => ({
      time: `${new Date().getHours() - 6 + i < 0 ? new Date().getHours() - 6 + i + 24 : new Date().getHours() - 6 + i}:00`,
      value: (Math.random() * 1.5 + 97).toFixed(1)
    })),
    '24h': Array(24).fill(0).map((_, i) => ({
      time: `${i}:00`,
      value: (Math.random() * 1.5 + 97).toFixed(1)
    })),
    '7d': Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i - 1));
      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: (Math.random() * 1.5 + 97).toFixed(1)
      };
    })
  },
  glucoseHistory: {
    '6h': Array(6).fill(0).map((_, i) => ({
      time: `${new Date().getHours() - 6 + i < 0 ? new Date().getHours() - 6 + i + 24 : new Date().getHours() - 6 + i}:00`,
      value: Math.floor(Math.random() * 50) + 80
    })),
    '24h': Array(24).fill(0).map((_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 50) + 80
    })),
    '7d': Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i - 1));
      return {
        time: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.floor(Math.random() * 50) + 80
      };
    })
  },
};

// Add mock device information associated with patients
const sensorDevices = {
  1: [ // John Doe's devices
    { id: 'hr001', type: 'Heart Rate', status: 'Connected', battery: 85, lastSync: '2 minutes ago' },
    { id: 'bp002', type: 'Blood Pressure', status: 'Connected', battery: 92, lastSync: '5 minutes ago' },
    { id: 'ox003', type: 'Pulse Oximeter', status: 'Connected', battery: 67, lastSync: '3 minutes ago' },
    { id: 'gl004', type: 'Glucose Monitor', status: 'Connected', battery: 73, lastSync: '8 minutes ago' },
    { id: 'tp005', type: 'Temperature', status: 'Connected', battery: 78, lastSync: '10 minutes ago' },
  ],
  2: [ // Jane Smith's devices
    { id: 'hr006', type: 'Heart Rate', status: 'Connected', battery: 55, lastSync: '15 minutes ago' },
    { id: 'bp007', type: 'Blood Pressure', status: 'Connected', battery: 90, lastSync: '7 minutes ago' },
    { id: 'ox008', type: 'Pulse Oximeter', status: 'Low Battery', battery: 15, lastSync: '20 minutes ago' },
    { id: 'gl009', type: 'Glucose Monitor', status: 'Connected', battery: 68, lastSync: '12 minutes ago' },
  ],
  3: [ // Sam Johnson's devices
    { id: 'hr010', type: 'Heart Rate', status: 'Connected', battery: 91, lastSync: '1 minute ago' },
    { id: 'bp011', type: 'Blood Pressure', status: 'Connected', battery: 83, lastSync: '9 minutes ago' },
    { id: 'tp012', type: 'Temperature', status: 'Not Connected', battery: 45, lastSync: '1 hour ago' },
  ],
};

// Enhanced health score calculation
function calculateHealthScore(patient) {
  // Simplified score based on various metrics (0-100)
  const baseScoreMap = { 'Stable': 85, 'Needs Review': 65, 'Critical': 40 };
  let score = baseScoreMap[patient.status] || 75;
  
  // Adjust based on vital signs
  const bp = patient.details.bloodPressure.split('/').map(Number);
  if (bp[0] > 140 || bp[0] < 90 || bp[1] > 90 || bp[1] < 60) {
    score -= 10;
  }
  
  // Add random small variation for demo
  score += (Math.random() * 6) - 3;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Add data visualization component for sensor readings
function SensorDataVisualizer({ patient, sensorType }) {
  const [timeRange, setTimeRange] = useState('24h');
  const [animateChart, setAnimateChart] = useState(false);
  
  // Get appropriate data based on sensor type and time range
  const getSensorData = () => {
    switch(sensorType) {
      case 'heartRate':
        return mockSensorData.heartRateHistory[timeRange];
      case 'bloodPressure':
        return mockSensorData.bloodPressureHistory[timeRange];
      case 'bloodOxygen':
        return mockSensorData.bloodOxygenHistory[timeRange];
      case 'temperature':
        return mockSensorData.temperatureHistory[timeRange];
      case 'glucose':
        return mockSensorData.glucoseHistory[timeRange];
      default:
        return [];
    }
  };
  
  const data = getSensorData();
  
  // Handle time range change with animation effect
  const handleTimeRangeChange = (newRange) => {
    if (newRange === timeRange) return;
    
    setAnimateChart(true);
    setTimeRange(newRange);
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setAnimateChart(false);
    }, 800);
  };
  
  // Format X-axis tick labels based on time range
  const formatXAxis = (value) => {
    if (timeRange === '7d') {
      return value; // Already formatted as weekday
    } else if (timeRange === '6h') {
      return value; // Already formatted as hour
    } else {
      // For 24h, show fewer labels for clarity
      const hour = parseInt(value.split(':')[0]);
      return hour % 4 === 0 ? value : '';
    }
  };

  // Get Y-axis domain based on sensor type and time range
  const getYAxisDomain = () => {
    switch(sensorType) {
      case 'heartRate':
        return [50, 120];
      case 'bloodPressure':
        return [60, 160];
      case 'bloodOxygen':
        return [90, 100];
      case 'temperature':
        return [96, 100];
      case 'glucose':
        return [70, 150];
      default:
        return [0, 100];
    }
  };
  
  // Get appropriate chart based on sensor type
  const renderChart = () => {
    const fadeAnimation = animateChart ? 
      { opacity: 0, transition: 'opacity 0.3s ease-out' } : 
      { opacity: 1, transition: 'opacity 0.5s ease-in' };
      
    switch(sensorType) {
      case 'heartRate':
        return (
          <Box sx={fadeAnimation}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f44336" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatXAxis} />
                <YAxis domain={getYAxisDomain()} />
                <RechartsTooltip 
                  formatter={(value) => [`${value} BPM`, 'Heart Rate']}
                  labelFormatter={(label) => timeRange === '7d' ? label : `Time: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f44336" 
                  fill="url(#heartRateGradient)" 
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'bloodPressure':
        return (
          <Box sx={fadeAnimation}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatXAxis} />
                <YAxis domain={getYAxisDomain()} />
                <RechartsTooltip
                  formatter={(value, name) => [
                    `${value} mmHg`, 
                    name === 'systolic' ? 'Systolic' : 'Diastolic'
                  ]}
                  labelFormatter={(label) => timeRange === '7d' ? label : `Time: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  name="Systolic"
                  stroke="#f44336" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  animationDuration={800}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  name="Diastolic"
                  stroke="#2196f3" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'bloodOxygen':
        return (
          <Box sx={fadeAnimation}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatXAxis} />
                <YAxis domain={getYAxisDomain()} />
                <RechartsTooltip 
                  formatter={(value) => [`${value}%`, 'SpO2']}
                  labelFormatter={(label) => timeRange === '7d' ? label : `Time: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2196f3" 
                  fill="url(#oxygenGradient)" 
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'temperature':
        return (
          <Box sx={fadeAnimation}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatXAxis} />
                <YAxis 
                  domain={getYAxisDomain()} 
                  tickFormatter={(value) => `${value}°F`}
                />
                <RechartsTooltip 
                  formatter={(value) => [`${value}°F`, 'Temperature']}
                  labelFormatter={(label) => timeRange === '7d' ? label : `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff9800" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'glucose':
        return (
          <Box sx={fadeAnimation}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatXAxis} />
                <YAxis 
                  domain={getYAxisDomain()} 
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip 
                  formatter={(value) => [`${value} mg/dL`, 'Glucose']}
                  labelFormatter={(label) => timeRange === '7d' ? label : `Time: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4caf50" 
                  fill="url(#glucoseGradient)" 
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        );
      default:
        return <Typography>No data available</Typography>;
    }
  };
  
  return (
    <Box>
      {renderChart()}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <ButtonGroup size="small">
          <Button 
            variant={timeRange === '6h' ? 'contained' : 'outlined'} 
            onClick={() => handleTimeRangeChange('6h')}
          >
            6H
          </Button>
          <Button 
            variant={timeRange === '24h' ? 'contained' : 'outlined'} 
            onClick={() => handleTimeRangeChange('24h')}
          >
            24H
          </Button>
          <Button 
            variant={timeRange === '7d' ? 'contained' : 'outlined'} 
            onClick={() => handleTimeRangeChange('7d')}
          >
            7D
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

// Add health score indicator component
function HealthScoreIndicator({ score }) {
  const getScoreColor = () => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      p: 2, 
      borderRadius: 2,
      backgroundColor: (theme) => 
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Health Score
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
          variant="determinate" 
          value={100} 
          size={80} 
          thickness={4} 
          sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} 
        />
        <CircularProgress 
          variant="determinate" 
          value={score} 
          size={80} 
          thickness={4} 
          color={getScoreColor()} 
          sx={{ 
            position: 'absolute',
            left: 0,
          }} 
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            color="textPrimary"
          >
            {score}
          </Typography>
        </Box>
      </Box>
      <Typography 
        variant="body2" 
        color={getScoreColor() + '.main'} 
        sx={{ mt: 1, fontWeight: 'medium' }}
      >
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention'}
      </Typography>
    </Box>
  );
}

// Add device status component
function SensorDeviceStatus({ device }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        py: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {device.type === 'Heart Rate' && <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />}
        {device.type === 'Blood Pressure' && <MonitorHeartIcon sx={{ mr: 1, color: 'primary.main' }} />}
        {device.type === 'Pulse Oximeter' && <WaterDropIcon sx={{ mr: 1, color: 'info.main' }} />}
        {device.type === 'Glucose Monitor' && <BloodtypeIcon sx={{ mr: 1, color: 'success.main' }} />}
        {device.type === 'Temperature' && <ThermostatIcon sx={{ mr: 1, color: 'warning.main' }} />}
        <Box>
          <Typography variant="body2">{device.type} Sensor</Typography>
          <Typography variant="caption" color="textSecondary">ID: {device.id}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          size="small" 
          label={device.status} 
          color={device.status === 'Connected' ? 'success' : 'error'} 
          sx={{ mr: 1 }} 
        />
        <Tooltip title={`Battery: ${device.battery}%`}>
          <Box sx={{ width: 40 }}>
            <LinearProgress 
              variant="determinate" 
              value={device.battery} 
              color={device.battery > 20 ? 'success' : 'error'} 
              sx={{ height: 8, borderRadius: 4 }} 
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

// Enhanced patient monitoring dashboard
function EnhancedPatientDashboard() {
  const [mode, setMode] = useState('light');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Jane Smith\'s blood pressure is elevated', time: '10 min ago', read: false },
    { id: 2, message: 'Sam Johnson\'s medication schedule updated', time: '25 min ago', read: false },
    { id: 3, message: 'Heart rate sensor needs calibration', time: '1 hour ago', read: true },
  ]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationsAnchor(null);
  };
  
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    handleNotificationClose();
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };
  
  const theme = createAppTheme(mode);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            background: mode === 'dark' ? 
              'linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)' : 
              'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 4 }, height: 64 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              p: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}>
              <IconButton 
                edge="start" 
                color="inherit" 
                aria-label="menu" 
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{ p: 0.5 }}
              >
                <HealthAndSafetyIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <MonitorHeartIcon sx={{ mr: 1.5 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.8) 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                iCare Central
              </Typography>
              <Box 
                component="span" 
                sx={{ 
                  opacity: 0.7, 
                  ml: 1, 
                  fontSize: '0.7rem', 
                  verticalAlign: 'super',
                  px: 0.8,
                  py: 0.2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 1,
                  fontWeight: 'bold'
                }}
              >
                BETA
              </Box>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  mr: 2,
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Typography variant="caption" sx={{ mr: 1 }}>
                  {new Date().toLocaleDateString()} • System Online
                </Typography>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#4caf50',
                    boxShadow: '0 0 10px #4caf50' 
                  }} 
                />
              </Box>
              
              <Tooltip title="Device Status">
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    mx: 0.5,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <DevicesIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={`${unreadNotifications} Unread Notifications`}>
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    mx: 0.5,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  }} 
                  onClick={handleNotificationClick}
                >
                  <Badge 
                    badgeContent={unreadNotifications} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        boxShadow: '0 0 0 2px #1976d2',
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={notificationsAnchor}
                open={Boolean(notificationsAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 5,
                  sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2 }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="medium">Notifications</Typography>
                  <Button size="small" onClick={handleMarkAllRead}>Mark all read</Button>
                </Box>
                <Divider />
                {notifications.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {notifications.map((notification) => (
                      <React.Fragment key={notification.id}>
                        <ListItem 
                          sx={{ 
                            backgroundColor: notification.read ? 'transparent' : (theme) =>
                              theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(33, 150, 243, 0.08)', 
                          }}
                        >
                          <ListItemText 
                            primary={notification.message} 
                            secondary={notification.time} 
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="textSecondary">No notifications</Typography>
                  </Box>
                )}
              </Menu>
              
              <Tooltip title={`Toggle ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
                <IconButton 
                  sx={{ ml: 0.5, backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }} 
                  onClick={toggleColorMode} 
                  color="inherit"
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              
              <Avatar 
                sx={{ 
                  ml: 2, 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    cursor: 'pointer',
                    border: '2px solid rgba(255,255,255,0.8)',
                  }
                }}
              >
                <PersonIcon />
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant={drawerOpen ? "persistent" : "temporary"}
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              top: ['48px', '56px', '64px'],
              height: 'auto',
              bottom: 0,
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              <ListItem button selected={true}>
                <PersonIcon sx={{ mr: 2 }} />
                <ListItemText primary="Patients" />
              </ListItem>
              <ListItem button>
                <DevicesIcon sx={{ mr: 2 }} />
                <ListItemText primary="Devices" />
              </ListItem>
              <ListItem button>
                <SensorsIcon sx={{ mr: 2 }} />
                <ListItemText primary="Sensors" />
              </ListItem>
              <ListItem button>
                <DashboardIcon sx={{ mr: 2 }} />
                <ListItemText primary="Analytics" />
              </ListItem>
              <ListItem button>
                <SettingsIcon sx={{ mr: 2 }} />
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: '100%',
            mt: ['48px', '56px', '64px'],
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(drawerOpen && {
              marginLeft: 0,
              [theme.breakpoints.up('sm')]: {
                marginLeft: 0
              },
            })
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: theme.palette.mode === 'dark' ? 
                  'linear-gradient(45deg, #90caf9 0%, #42a5f5 100%)' : 
                  'linear-gradient(45deg, #1976d2 0%, #42a5f5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Patient Monitoring Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Real-time health monitoring via our advanced sensor suite
            </Typography>
            
            <Alert 
              severity="info" 
              sx={{ mt: 2 }}
              action={
                <Button color="inherit" size="small">
                  View All
                </Button>
              }
            >
              3 patients need attention based on recent vital sign readings
            </Alert>
          </Box>
          
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 120,
              },
            }}
          >
            <Tab label="Overview" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Patients" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Devices" icon={<DevicesIcon />} iconPosition="start" />
            <Tab label="Analytics" icon={<SensorsIcon />} iconPosition="start" />
          </Tabs>
          
          {currentTab === 0 && (
            <Box>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Active Patient</Typography>
                  <Box sx={{ display: 'flex' }}>
                    {patients.map((patient) => (
                      <Button
                        key={patient.id}
                        variant={patient.id === selectedPatient.id ? "contained" : "outlined"}
                        size="small"
                        sx={{ mx: 0.5 }}
                        onClick={() => handlePatientSelect(patient)}
                      >
                        {patient.name.split(' ')[0]}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          mr: 2,
                          bgcolor: 'primary.main'
                        }}
                      >
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'space-between' }}>
                          <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {selectedPatient.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={selectedPatient.status}
                            color={selectedPatient.status === 'Stable' ? 'success' : 'warning'}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {selectedPatient.age} years
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            • {selectedPatient.condition}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            • Next: {selectedPatient.nextAppointment}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedPatient.medications.map((med, index) => (
                            <Chip
                              key={index}
                              label={med}
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      mt: 0, 
                      pt: 2, 
                      borderTop: 1, 
                      borderColor: 'divider',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                        <MonitorHeartIcon sx={{ fontSize: 20, mr: 1, color: 'primary.main', ml: '12px' }} />
                        <Typography variant="body2">
                          BP: <strong>{selectedPatient.details.bloodPressure}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                        <BloodtypeIcon sx={{ fontSize: 20, mr: 1, color: 'success.main' }} />
                        <Typography variant="body2">
                          Glucose: <strong>{selectedPatient.details.bloodSugar}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                        <EventIcon sx={{ fontSize: 20, mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          Last Visit: <strong>{selectedPatient.details.lastVisit}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HealthAndSafetyIcon sx={{ fontSize: 20, mr: 1, color: 'warning.main' }} />
                        <Typography variant="body2">
                          Allergies: <strong>{selectedPatient.details.allergies.join(', ') || 'None'}</strong>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                          <SensorsIcon sx={{ mr: 0.5, fontSize: 18 }} /> Connected Devices
                        </Typography>
                        <Chip 
                          label={`${sensorDevices[selectedPatient.id].length} Device${sensorDevices[selectedPatient.id].length !== 1 ? 's' : ''}`}
                          color="primary" 
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        flexGrow: 1,
                        overflow: 'auto'
                      }}>
                        {sensorDevices[selectedPatient.id].length > 0 ? (
                          <Stack spacing={1}>
                            {sensorDevices[selectedPatient.id].map((device) => (
                              <Box 
                                key={device.id}
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between',
                                  py: 0.5,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                  {device.type === 'Heart Rate' && <FavoriteIcon sx={{ mr: 1, color: 'error.main', fontSize: 18 }} />}
                                  {device.type === 'Blood Pressure' && <MonitorHeartIcon sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />}
                                  {device.type === 'Pulse Oximeter' && <WaterDropIcon sx={{ mr: 1, color: 'info.main', fontSize: 18 }} />}
                                  {device.type === 'Glucose Monitor' && <BloodtypeIcon sx={{ mr: 1, color: 'success.main', fontSize: 18 }} />}
                                  {device.type === 'Temperature' && <ThermostatIcon sx={{ mr: 1, color: 'warning.main', fontSize: 18 }} />}
                                  <Typography variant="body2" noWrap>{device.type}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                  <Box 
                                    sx={{ 
                                      width: 8, 
                                      height: 8, 
                                      borderRadius: '50%', 
                                      bgcolor: device.status === 'Connected' ? 'success.main' : 'error.main',
                                      mr: 1
                                    }} 
                                  />
                                  <Box sx={{ width: 30 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={device.battery} 
                                      color={device.battery > 20 ? 'success' : 'error'} 
                                      sx={{ height: 6, borderRadius: 3 }} 
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 2 }}>
                            <SensorsIcon sx={{ fontSize: 24, color: 'text.disabled', mb: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">No devices connected</Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: '#4caf50',
                                mr: 1
                              }} 
                            />
                            <Typography variant="caption" color="text.secondary">
                              Last check: {new Date().toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Button 
                          size="small" 
                          startIcon={<SensorsIcon />} 
                          color="primary"
                          variant="outlined"
                          sx={{ textTransform: 'none' }}
                        >
                          Manage Devices
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 0 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HealthScoreIndicator score={calculateHealthScore(selectedPatient)} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Emergency Contact
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.details.emergencyContact}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Tooltip title="View detailed patient history">
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mr: 1 }} 
                            startIcon={<HistoryIcon />}
                          >
                            Patient History
                          </Button>
                        </Tooltip>
                        <Tooltip title="Update treatment plan">
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<EditIcon />}
                          >
                            Update Plan
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Patient Vital Signs</Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Button startIcon={<MonitorHeartIcon />} size="small" sx={{ mr: 1 }}>
                          Add Sensor
                        </Button>
                        <Button variant="outlined" size="small">
                          Export Data
                        </Button>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />
                            <Typography variant="subtitle1">Heart Rate Monitoring</Typography>
                          </Box>
                          <SensorDataVisualizer patient={selectedPatient} sensorType="heartRate" />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MonitorHeartIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1">Blood Pressure</Typography>
                          </Box>
                          <SensorDataVisualizer patient={selectedPatient} sensorType="bloodPressure" />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WaterDropIcon sx={{ mr: 1, color: 'info.main' }} />
                            <Typography variant="subtitle1">Blood Oxygen</Typography>
                          </Box>
                          <SensorDataVisualizer patient={selectedPatient} sensorType="bloodOxygen" />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ThermostatIcon sx={{ mr: 1, color: 'warning.main' }} />
                            <Typography variant="subtitle1">Body Temperature</Typography>
                          </Box>
                          <SensorDataVisualizer patient={selectedPatient} sensorType="temperature" />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BloodtypeIcon sx={{ mr: 1, color: 'success.main' }} />
                            <Typography variant="subtitle1">Glucose Levels</Typography>
                          </Box>
                          <SensorDataVisualizer patient={selectedPatient} sensorType="glucose" />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Health Overview</Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {patients.map((patient, index) => (
                      <Box 
                        key={patient.id} 
                        sx={{ 
                          mb: 2, 
                          p: 1.5, 
                          borderRadius: 2,
                          backgroundColor: theme => theme.palette.mode === 'dark' 
                            ? (patient.id === selectedPatient.id ? 'rgba(33, 150, 243, 0.15)' : 'rgba(255,255,255,0.05)')
                            : (patient.id === selectedPatient.id ? 'rgba(33, 150, 243, 0.1)' : 'rgba(0,0,0,0.02)'),
                          border: patient.id === selectedPatient.id ? '1px solid' : 'none',
                          borderColor: 'primary.main',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: theme => theme.palette.mode === 'dark' 
                              ? 'rgba(33, 150, 243, 0.1)'
                              : 'rgba(33, 150, 243, 0.05)',
                          }
                        }}
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Avatar sx={{ mr: 2, bgcolor: patient.id === selectedPatient.id ? 'primary.main' : 'primary.light' }}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">{patient.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {patient.age} years • {patient.condition}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={patient.status}
                            color={patient.status === 'Stable' ? 'success' : 'warning'}
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" display="block">
                              BP: {patient.details.bloodPressure}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Glucose: {patient.details.bloodSugar}
                            </Typography>
                          </Box>
                          <HealthScoreIndicator score={calculateHealthScore(patient)} />
                        </Box>
                      </Box>
                    ))}
                    
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<PersonIcon />}
                      sx={{ mt: 1 }}
                    >
                      Add New Patient
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          {currentTab === 1 && <PatientsPage />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Add PatientsPage component
function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };
  
  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientDialogOpen(true);
  };
  
  // Handle patient dialog close
  const handleDialogClose = () => {
    setPatientDialogOpen(false);
  };
  
  // Handle sorting change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient => {
      // Filter by search term
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort patients based on selected sort field and direction
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'nextAppointment':
          comparison = new Date(a.nextAppointment) - new Date(b.nextAppointment);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // More detailed mock patient data for demo
  const patientDetails = {
    vitalHistory: Array(10).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i * 3);
      return {
        date: date.toLocaleDateString(),
        heartRate: Math.floor(Math.random() * 20) + 65,
        bloodPressure: `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 15) + 70}`,
        temperature: (Math.random() * 1.5 + 97).toFixed(1),
        bloodOxygen: Math.floor(Math.random() * 4) + 95,
        weight: (Math.random() * 5 + 160).toFixed(1)
      };
    }),
    labResults: [
      { 
        id: 'LAB001', 
        date: '2024-02-10', 
        type: 'Complete Blood Count', 
        result: 'Normal',
        details: 'WBC: 7.2, RBC: 4.8, Hemoglobin: 14.5, Hematocrit: 42%' 
      },
      { 
        id: 'LAB002', 
        date: '2024-01-15', 
        type: 'Comprehensive Metabolic Panel', 
        result: 'Abnormal',
        details: 'Glucose: 140 mg/dL (High), BUN: 18, Creatinine: 0.9, eGFR: >60' 
      },
      { 
        id: 'LAB003', 
        date: '2023-12-05', 
        type: 'Lipid Panel', 
        result: 'Normal',
        details: 'Total Cholesterol: 185, HDL: 55, LDL: 110, Triglycerides: 100' 
      }
    ],
    appointments: [
      { id: 'APT001', date: '2025-03-25', time: '10:00 AM', provider: 'Dr. Johnson', type: 'Follow-up', status: 'Scheduled' },
      { id: 'APT002', date: '2025-04-15', time: '2:30 PM', provider: 'Dr. Smith', type: 'Annual Physical', status: 'Scheduled' },
      { id: 'APT003', date: '2024-12-10', time: '11:15 AM', provider: 'Dr. Johnson', type: 'Follow-up', status: 'Completed' }
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2023-06-15', endDate: null },
      { name: 'Insulin', dosage: '10 units', frequency: 'Before meals', startDate: '2023-09-20', endDate: null },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2023-08-01', endDate: '2024-01-15' }
    ],
    notes: [
      { date: '2024-02-25', provider: 'Dr. Johnson', content: 'Patient responding well to current medication regimen. Blood glucose levels have stabilized. Continue current treatment plan.' },
      { date: '2023-11-10', provider: 'Dr. Smith', content: 'Patient reports occasional dizziness when standing up quickly. Blood pressure reading slightly low today. Adjusting medication dosage.' },
      { date: '2023-08-05', provider: 'Dr. Johnson', content: 'Initial diagnosis of Type 2 Diabetes. Starting on Metformin. Discussed lifestyle changes and diet modifications.' }
    ],
    insurance: {
      provider: 'BlueCross BlueShield',
      policyNumber: 'BCBS-12345678',
      group: 'GRP-987654',
      effective: '2023-01-01',
      copay: '$25',
      contactPhone: '1-800-555-1234'
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Patient Records
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="Search Patients"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Stable">Stable</MenuItem>
              <MenuItem value="Needs Review">Needs Review</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Patient
          </Button>
        </Box>
      </Box>
      
      <Paper elevation={1} sx={{ mb: 3, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'name'}
                    direction={sortBy === 'name' ? sortDirection : 'asc'}
                    onClick={() => handleSortChange('name')}
                  >
                    Patient Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'age'}
                    direction={sortBy === 'age' ? sortDirection : 'asc'}
                    onClick={() => handleSortChange('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortDirection : 'asc'}
                    onClick={() => handleSortChange('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'nextAppointment'}
                    direction={sortBy === 'nextAppointment' ? sortDirection : 'asc'}
                    onClick={() => handleSortChange('nextAppointment')}
                  >
                    Next Appointment
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id}
                    hover
                    onClick={() => handlePatientSelect(patient)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            bgcolor: 'primary.main'
                          }}
                        >
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body1">{patient.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={patient.status}
                        color={
                          patient.status === 'Stable' ? 'success' : 
                          patient.status === 'Needs Review' ? 'warning' : 
                          'error'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(patient.nextAppointment).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box sx={{ py: 3 }}>
                      <SearchOffIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                      <Typography color="text.secondary">
                        No patients found matching your criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button size="small" startIcon={<FileDownloadIcon />}>
            Export Data
          </Button>
        </Box>
      </Paper>
      
      {/* Patient Detail Dialog */}
      <Dialog
        open={patientDialogOpen}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedPatient.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.age} years • {selectedPatient.condition}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={selectedPatient.status}
                  color={
                    selectedPatient.status === 'Stable' ? 'success' : 
                    selectedPatient.status === 'Needs Review' ? 'warning' : 
                    'error'
                  }
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ my: 1 }}>
                <Tabs value={0}>
                  <Tab label="Summary" />
                  <Tab label="Vitals" />
                  <Tab label="Lab Results" />
                  <Tab label="Appointments" />
                  <Tab label="Medications" />
                  <Tab label="Notes" />
                </Tabs>
              </Box>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Patient Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" gutterBottom>{selectedPatient.name.toLowerCase().replace(' ', '.') + '@example.com'}</Typography>
                        
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" gutterBottom>(555) 123-4567</Typography>
                        
                        <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                        <Typography variant="body1" gutterBottom>{selectedPatient.details.emergencyContact}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Last Visit</Typography>
                        <Typography variant="body1" gutterBottom>{selectedPatient.details.lastVisit}</Typography>
                        
                        <Typography variant="body2" color="text.secondary">Next Appointment</Typography>
                        <Typography variant="body1" gutterBottom>{new Date(selectedPatient.nextAppointment).toLocaleDateString()}</Typography>
                        
                        <Typography variant="body2" color="text.secondary">Allergies</Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedPatient.details.allergies.join(', ') || 'None'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Vital Statistics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 70, 
                          height: 70, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          mb: 1
                        }}>
                          <FavoriteIcon color="error" fontSize="large" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                        <Typography variant="h6">
                          {65 + Math.floor(Math.random() * 20)} BPM
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 70, 
                          height: 70, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                          mb: 1
                        }}>
                          <MonitorHeartIcon color="primary" fontSize="large" sx={{ 
                            display: 'flex', 
                            alignSelf: 'center',
                            justifySelf: 'center'
                          }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                        <Typography variant="h6">
                          {selectedPatient.details.bloodPressure}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 70, 
                          height: 70, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          mb: 1
                        }}>
                          <BloodtypeIcon color="success" fontSize="large" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">Glucose</Typography>
                        <Typography variant="h6">
                          {selectedPatient.details.bloodSugar}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Current Medications
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPatient.medications.map((med, index) => (
                        <Chip key={index} label={med} size="small" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Recent Notes
                      </Typography>
                      <Button size="small" startIcon={<AddIcon />}>
                        Add Note
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                      {patientDetails.notes.map((note, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="subtitle2">
                                    {note.provider}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {note.date}
                                  </Typography>
                                </Box>
                              }
                              secondary={note.content}
                            />
                          </ListItem>
                          {index < patientDetails.notes.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Connected Devices
                      </Typography>
                      <Button size="small" startIcon={<SensorsIcon />}>
                        Manage Devices
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {sensorDevices[selectedPatient.id].map((device) => (
                        <Grid item xs={12} sm={6} md={4} key={device.id}>
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {device.type === 'Heart Rate' && <FavoriteIcon sx={{ mr: 1.5, color: 'error.main' }} />}
                              {device.type === 'Blood Pressure' && <MonitorHeartIcon sx={{ mr: 1.5, color: 'primary.main' }} />}
                              {device.type === 'Pulse Oximeter' && <WaterDropIcon sx={{ mr: 1.5, color: 'info.main' }} />}
                              {device.type === 'Glucose Monitor' && <BloodtypeIcon sx={{ mr: 1.5, color: 'success.main' }} />}
                              {device.type === 'Temperature' && <ThermostatIcon sx={{ mr: 1.5, color: 'warning.main' }} />}
                              <Box>
                                <Typography variant="body2" fontWeight="medium">{device.type}</Typography>
                                <Typography variant="caption" color="text.secondary">Last sync: {device.lastSync}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  width: 10, 
                                  height: 10, 
                                  borderRadius: '50%', 
                                  bgcolor: device.status === 'Connected' ? 'success.main' : 'error.main',
                                  mr: 1
                                }} 
                              />
                              <Typography variant="caption" color="text.secondary">
                                {device.battery}%
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
              <Button variant="contained" startIcon={<EditIcon />}>Edit Patient</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

function App() {
  const [showDemo, setShowDemo] = useState(true);
  
  if (showDemo) {
    return <EnhancedPatientDashboard />;
  }
  
  return (
    <ThemeProvider theme={createAppTheme('light')}>
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