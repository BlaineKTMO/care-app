import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Card,
  CardContent,
  CardHeader,
  ToggleButtonGroup,
  ToggleButton,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const POLLING_INTERVAL = 60000; // Poll every 60 seconds (1 minute)

function FitbitHeartRateMonitor({ patientId }) {
  const [heartRateData, setHeartRateData] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [timeRange, setTimeRange] = useState('1d'); // '1d', '7d', '30d'
  const [currentHeartRate, setCurrentHeartRate] = useState(null);
  
  // Check for Fitbit token
  const accessToken = sessionStorage.getItem('fitbitAccessToken');
  const isAuthenticated = !!accessToken;
  
  // Function to fetch heart rate data from API
  const fetchHeartRateData = async () => {
    if (!isAuthenticated) {
      setError("Not authenticated with Fitbit");
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the server proxy endpoint to avoid CORS issues
      const response = await fetch(`/api/fitbit/heartrate/${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch heart rate data: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.activities && data.activities.heart) {
        // Process the heart rate data
        setHeartRateData(processHeartRateData(data));
        
        // Get the most recent heart rate value
        const latestData = getLatestHeartRate(data);
        if (latestData) {
          setCurrentHeartRate(latestData.value);
        }
        
        setLastUpdateTime(Date.now());
        setError(null);
      } else {
        throw new Error('Invalid data format received from Fitbit API');
      }
    } catch (err) {
      console.error('Error fetching heart rate data:', err);
      setError(err.message || 'Failed to fetch heart rate data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process heart rate data for the chart
  const processHeartRateData = (data) => {
    if (!data.activities || !data.activities.heart) {
      return [];
    }

    // Process the heart rate data based on Fitbit API response format
    if (data.activities.heart[0]?.heartRateZones) {
      // Get intraday time series if available
      if (data['activities-heart-intraday']?.dataset) {
        return data['activities-heart-intraday'].dataset.map(item => ({
          time: item.time,
          value: item.value
        }));
      }
      
      // Otherwise use the daily summary
      return data.activities.heart.map(day => ({
        date: day.dateTime,
        value: day.value.restingHeartRate || 0
      }));
    }
    
    return [];
  };
  
  // Get the latest heart rate reading
  const getLatestHeartRate = (data) => {
    if (data['activities-heart-intraday']?.dataset) {
      const dataset = data['activities-heart-intraday'].dataset;
      if (dataset.length > 0) {
        return dataset[dataset.length - 1];
      }
    }
    return null;
  };

  // Start polling when monitoring is turned on
  useEffect(() => {
    let intervalId = null;
    
    if (isMonitoring && isAuthenticated) {
      // Fetch immediately
      fetchHeartRateData();
      
      // Then set up polling
      intervalId = setInterval(fetchHeartRateData, POLLING_INTERVAL);
    }
    
    // Clean up interval when component unmounts or monitoring stops
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, isAuthenticated, timeRange]);

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };
  
  const getLastUpdateText = () => {
    if (!lastUpdateTime) return '';
    
    const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    if (seconds < 60) return `Last updated ${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Last updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    return `Last updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  if (!isAuthenticated) {
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography sx={{ mb: 2 }} variant="h6">Fitbit Heart Rate Monitor</Typography>
          <Alert severity="warning">
            You need to authenticate with Fitbit to use this feature
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => window.location.href = '/fitbit-auth'}
            >
              Connect Fitbit Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader 
        avatar={
          <FavoriteIcon 
            sx={{ 
              color: 'error.main',
              animation: isMonitoring ? 'pulse 1s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' }
              }
            }} 
          />
        }
        title="Fitbit Heart Rate Monitor"
        action={
          <Button 
            size="small" 
            variant={isMonitoring ? "contained" : "outlined"} 
            color={isMonitoring ? "error" : "primary"}
            onClick={() => setIsMonitoring(!isMonitoring)}
            disabled={!!error && !isAuthenticated}
          >
            {isMonitoring ? 'Stop' : 'Start'} Monitoring
          </Button>
        }
      />
      <CardContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        
        {isLoading && !heartRateData.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {currentHeartRate ? (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="error.main">
                  {currentHeartRate} BPM
                </Typography>
                {lastUpdateTime && (
                  <Typography variant="caption" color="text.secondary">
                    {getLastUpdateText()}
                  </Typography>
                )}
              </Box>
            ) : isMonitoring ? (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body1">Waiting for data...</Typography>
              </Box>
            ) : null}
            
            {heartRateData.length > 0 && (
              <>
                <Box sx={{ height: 200, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={heartRateData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[60, 180]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#e91e63"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ToggleButtonGroup
                    color="primary"
                    value={timeRange}
                    exclusive
                    onChange={handleTimeRangeChange}
                    size="small"
                  >
                    <ToggleButton value="1d">Today</ToggleButton>
                    <ToggleButton value="7d">Week</ToggleButton>
                    <ToggleButton value="30d">Month</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default FitbitHeartRateMonitor;