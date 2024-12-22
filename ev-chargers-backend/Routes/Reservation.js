const express = require('express');
const Reservation = require('../Schemas/Reservation');
const router = express.Router()

router.post('/reserveStation', async (req, res) => {
    const { Email: email , CarID: carId, StationID: stationId, Start: start, End: end, TimeOfReservation: timeOfReservation } = req.body;
  
    if ( !email || !carId || !stationId || !start || !end || !timeOfReservation) {
      return res.status(400).send('All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
    }
  
    try {
      const newReservation = new Reservation({ 
        email, 
        carId, 
        stationId, 
        start, 
        end, 
        timeOfReservation 
      });
      await newReservation.save();
      res.status(201).json(newReservation);
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send('Error saving station');
    }
  });

  router.get('/getReservations/SelectedPeriod', async (req, res) => {
    const {Start: start, End: end } = req.query;
  
    if (!start || !end) {
      return res.status(400).send('All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
    }
    try {
      const reservations = await Reservation.find({
          start: { $gte: new Date(start) },
          end: { $lte: new Date(end) }
      });
      res.status(200).json(reservations);
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send('Error saving station');
    }
  });

module.exports = router;