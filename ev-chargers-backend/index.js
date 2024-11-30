require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./Routes/Authentification');
const userRoutes = require('./Routes/User');
const stationRoutes = require('./Routes/Stations');

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

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/stations', stationRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
