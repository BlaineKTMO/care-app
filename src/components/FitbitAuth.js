import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';

// Get Fitbit configuration values from environment variables
const FITBIT_CONFIG = {
  clientId: process.env.REACT_APP_FITBIT_CLIENT_ID || '23Q53D',
  redirectUri: process.env.REACT_APP_FITBIT_REDIRECT_URI || `${window.location.origin}/callback`,
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  scope: 'heartrate profile activity',
};

function FitbitAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if we have a token already
    const accessToken = sessionStorage.getItem('fitbitAccessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    }
    
    // Check for authorization code in URL after redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('fitbitState');
    
    if (code) {
      // Verify state parameter to prevent CSRF attacks
      if (state !== storedState) {
        setError('State mismatch - possible security risk');
        return;
      }
      
      // Exchange code for token
      getAccessToken(code);
      
      // Clean up URL and state
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('fitbitState');
    }
  }, []);

  const login = () => {
    setIsLoading(true);
    
    // Create state parameter for security
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('fitbitState', state);

    // Construct authorization URL
    const authUrl = `${FITBIT_CONFIG.authorizationUri}?` +
      `response_type=code` +
      `&client_id=${FITBIT_CONFIG.clientId}` +
      `&redirect_uri=${encodeURIComponent(FITBIT_CONFIG.redirectUri)}` +
      `&scope=${encodeURIComponent(FITBIT_CONFIG.scope)}` +
      `&state=${state}`;
    
    // Redirect to Fitbit authorization page
    window.location.href = authUrl;
  };

  const getAccessToken = async (code) => {
    try {
      setIsLoading(true);
      
      // Use the server-side proxy endpoint to exchange code for token
      const response = await fetch('/api/fitbit/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          redirectUri: FITBIT_CONFIG.redirectUri,
          grantType: 'authorization_code'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      
      // Store tokens securely in session storage
      sessionStorage.setItem('fitbitAccessToken', data.access_token);
      sessionStorage.setItem('fitbitRefreshToken', data.refresh_token);
      sessionStorage.setItem('fitbitTokenExpiry', Date.now() + (data.expires_in * 1000));
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error getting Fitbit token:', err);
      setError(err.message || 'Failed to authenticate with Fitbit');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('fitbitAccessToken');
    sessionStorage.removeItem('fitbitRefreshToken');
    sessionStorage.removeItem('fitbitTokenExpiry');
    setIsAuthenticated(false);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Fitbit Integration
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box my={3}>
            {isAuthenticated ? (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Successfully connected to Fitbit!
                </Alert>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={logout}
                >
                  Disconnect Fitbit Account
                </Button>
              </>
            ) : (
              <>
                <Typography paragraph>
                  Connect your Fitbit account to enable heart rate monitoring in the CairTaker app.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={login}
                >
                  Connect Fitbit Account
                </Button>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default FitbitAuth;