require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Reservation = require('./Schemas/Reservation');

const authRoutes = require('./Routes/Authentification');
const userRoutes = require('./Routes/User');
const stationRoutes = require('./Routes/Stations');
const reservationRoutes = require('./Routes/Reservation');
const adminRoutes = require('./Routes/Admin');

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
app.use('/reservation', reservationRoutes);
app.use('/admin', adminRoutes);


const deleteExpiredReservations = async () => {
  try {
    const result = await Reservation.deleteMany({ end: { $lt: new Date() } });
    console.log(`Deleted ${result.deletedCount} expired reservations`);
  } catch (err) {
    console.error('Error deleting expired reservations:', err);
  }
};

setInterval(deleteExpiredReservations, 10000);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
