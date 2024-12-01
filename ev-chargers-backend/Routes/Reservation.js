const express = require('express');
const Reservation = require('../Schemas/Reservation');
const router = express.Router()

router.post('/', async (req, res) => {
    const { Email: email , CarID: carId, StationID: stationId, Start: start, End: end, TimeOfReservation: timeOfReservation } = req.body;
  
    if ( !email || !carId || !stationId || !start || !end || !timeOfReservation) {
      return res.status(400).send('All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
    }
  
    try {
      const newStation = new Reservation({ 
        email, 
        carId, 
        stationId, 
        start, 
        end, 
        timeOfReservation 
      });
      await newStation.save();
      res.status(201).json(newStation);
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send('Error saving station');
    }
  });

module.exports = router;