const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const targetURL = 'https://arcduino.onrender.com/api/water-level';

app.post('/relay', async (req, res) => {
  try {
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get('/', (req, res) => {
  res.send('ESP8266 Proxy Online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
