const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/ev-charging', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const stationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  chargerType: { type: String, required: true },
  chargerPower: { type: Number, required: true },
  chargerAvailability: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  currentUserInfo: { type: String, required: false }
});

const Station = mongoose.model('Station', stationSchema);


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend Running!');
});

app.get('/stations', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).send('Error fetching stations');
  }
});

app.post('/stations', async (req, res) => {
  const { id, name, chargerType, chargerPower, chargerAvailability, coordinates, currentUserInfo } = req.body;

  if (!id || !name || !chargerType || !chargerPower || !chargerAvailability || !coordinates || !coordinates.lat || !coordinates.lng) {
    return res.status(400).send('All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
  }

  try {
    const newStation = new Station({ 
      id, 
      name, 
      chargerType, 
      chargerPower, 
      chargerAvailability, 
      coordinates, 
      currentUserInfo 
    });
    await newStation.save();
    res.status(201).json(newStation);
  } catch (err) {
    console.error('Error saving station:', err);
    res.status(500).send('Error saving station');
  }
});


app.post('/stations/bulk', async (req, res) => {
  const stations = req.body;

  if (!Array.isArray(stations) || stations.length === 0) {
    return res.status(400).send('Request body must be an array of stations');
  }

  for (let station of stations) {
    const { id, name, chargerType, chargerPower, chargerAvailability, coordinates } = station;
    if (!id || !name || !chargerType || !chargerPower || !chargerAvailability || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).send('All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
    }
  }

  try {
    const savedStations = await Station.insertMany(stations);
    res.status(201).json(savedStations);
  } catch (err) {
    console.error('Error saving bulk stations:', err);
    res.status(500).send('Error saving stations');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
