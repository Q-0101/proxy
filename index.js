const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
const targetURL = 'http://arcduino.onrender.com/api/water-level';

app.post('/relay', async (req, res) => {
  console.log("Received data from ESP8266/curl:", req.body);

  if (req.body.level === undefined) 
  { return res.status(400).send('Missing level'); }

  try 
  {
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.text();
    console.log("Forwarded to backend, response:", data);

    res.json
    ({
      success: true,
      received: req.body,
      backendResponse: data
    });
  } catch (err) {
    console.error("Error forwarding to backend:", err);
    res.status(500).send(err.toString());
  }
});

app.get('/', (req, res) => {
  res.send('ESP8266 Proxy Online!');
});

const PORT = process.env.PORT || 6769;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

