const express = require('express');
const fetch = require('node-fetch'); // or built-in fetch if Node 18+
const app = express();

// Parse JSON in incoming requests
app.use(express.json());

// Target backend
const targetURL = 'https://arcduino.onrender.com/api/water-level';

app.post('/relay', async (req, res) => {
  // Debug: log what ESP8266/curl sent
  console.log("Received data from ESP8266/curl:", req.body);

  if (req.body.level === undefined) {
    return res.status(400).send('Missing level');
  }

  try {
    // Forward data to your backend
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
      console.log("Forwarded to backend, response:", data);
    });

    const data = await response.text();

    // Respond to ESP8266/curl with success and received value
    res.json({
      success: true,
      received: req.body,
      backendResponse: data
    });
  } catch (err) {
    console.error("Error forwarding to backend:", err);
    res.status(500).send(err.toString());
  }
});

// Optional root endpoint
app.get('/', (req, res) => {
  res.send('ESP8266 Proxy Online!');
});

// Start server on Railway port
const PORT = process.env.PORT || 6769;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));


