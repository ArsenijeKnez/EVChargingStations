const express = require('express');
const Reservation = require('../Schemas/Reservation');
const router = express.Router()

router.post('/reserveStation', async (req, res) => {
    let { Email: userEmail , CarID: carId, StationID: stationId, Start: start, End: end } = req.body;
  
    if ( !userEmail || !carId || !stationId ) {
      return res.status(400).send({ message: 'All fields are required'});
    }

    if(!start || !end){
      start = Date.now();
      end = Date.now() + 30 * 1000; //TO CHANGE?
    }
  
    try {

      const previousReservation = await Reservation.findOne({userEmail});
      if(previousReservation){
        return res.status(400).send({ message: 'User cannot have two reservations'});
      }

      const existing = await Reservation.findOne({stationId});
      if(existing && !(existing.start > end || existing.end < start)){
        return res.status(400).send({ message: 'Station is already reserved for that time'});
      }
  
      const newReservation = new Reservation({ 
        userEmail, 
        carId, 
        stationId, 
        start, 
        end, 
      });
      await newReservation.save();
      res.status(201).json({reservation: newReservation});
    } catch (err) {
      console.error('Error saving reservation:', err);
      res.status(500).send({ message: 'Error saving reservation' });
    }
  });

  router.get('/getReservations/SelectedPeriod', async (req, res) => {
    const {Start: start, End: end } = req.query;
  
    if (!start || !end) {
      return res.status(400).send({ message: 'All fields are required'});
    }
    try {
      const reservations = await Reservation.find({
          start: { $gte: new Date(start) },
          end: { $lte: new Date(end) }
      });
      res.status(200).json({reservations: reservations});
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send({ message: 'Error saving station'});
    }
  });

module.exports = router;