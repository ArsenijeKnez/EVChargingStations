require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Schemas/User');
const Car = require('./Schemas/Car');
const Station = require('./Schemas/Station');
const cors = require('cors');
const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/ev-charging', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend Running!');
});


app.post('/login', async (req, res) => {
  try {
    const { Email: email, Password: password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
      },
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/register', async (req, res) => {

  try {
    const {
      Name: name,
      Lastname: lastName,
      Password: password,
      Email: email,
      UserType: type
    } = req.body;

    if (!name || !lastName || !password || !email || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastName,
      password: hashedPassword,
      email,
      type,
      cars: []
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        type: newUser.type,
        accountCreationDate: newUser.accountCreationDate,
        cars: newUser.cars,
      },
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
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

app.get('/stationsGuest', async (req, res) => {
  try {
    const stations = await Station.find().select('id name coordinates');
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).send('Error fetching stations');
  }
});

app.post('/stationsPost', async (req, res) => {
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


app.post('/stationsPost/bulk', async (req, res) => {
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
