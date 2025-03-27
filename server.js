const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint for Fitbit token proxy (to avoid exposing client secret in browser)
app.post('/api/fitbit/token', async (req, res) => {
  try {
    const { code, redirectUri, grantType } = req.body;
    const clientId = process.env.REACT_APP_FITBIT_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_FITBIT_CLIENT_SECRET;
    
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: grantType,
        code: code,
        redirect_uri: redirectUri,
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying Fitbit token request:', error);
    res.status(500).json({ error: 'Failed to get token from Fitbit' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});