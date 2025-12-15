const express = require('express');
const fetch = require('node-fetch'); // or built-in fetch if Node 18+
const app = express();

app.use(express.json());

// Target backend where you want the data
const targetURL = 'http://arcduino.onrender.com/api/water-level';

app.post('/relay', async (req, res) => {
  try {
    // Forward JSON to the target backend
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.text(); // get raw response
    res.send(data); // send back to ESP
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Optional root endpoint
app.get('/', (req, res) => {
  res.send('ESP8266 Proxy Online!');
});

const PORT = process.env.PORT || 6769; // Use your TCP port if needed
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
