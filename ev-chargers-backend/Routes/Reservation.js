const express = require('express');
const Reservation = require('../Schemas/Reservation');
const Station = require('../Schemas/Station');
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

    start = new Date(start);
    end = new Date(end);
  
    const maxDuration = 12 * 60 * 60 * 1000;
    if (end - start > maxDuration) {
      return res.status(400).send({ message: 'Reservation period cannot exceed 12 hours' });
    }
  
  
    try {
      const station = await Station.findOne({stationId});
      if(!station){
        return res.status(400).send({ message: 'Station does not exist'});
      }

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

      res.status(201).json({
        reservation: newReservation,
        stationChargerPower: station.chargerPower, 
      });
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

  router.get('/getReservations/SelectedUser', async (req, res) => {
    const {Email: userEmail } = req.query;
  
    if (!userEmail) {
      return res.status(400).send({ message: 'User email is required'});
    }
    try {
      const reservation = await Reservation.findOne({userEmail});
      res.status(200).json({reservation: reservation});
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send({ message: 'Error saving station'});
    }
  });

  router.put('/activateReservation', async (req, res) => {
    const { Email: userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).send({ message: 'User email is required' });
    }
  
    try {
      const reservation = await Reservation.findOne({ userEmail });
  
      if (!reservation) {
        return res.status(404).send({ message: 'Reservation not found' });
      }
  
      const stationId = reservation.stationId;
  
      const station = await Station.findOne({ stationId });
  
      if (!station) {
        return res.status(404).send({ message: 'Station not found' });
      }
      station.currentUserInfo = userEmail;
      station.chargerAvailability = "Occupied";
      await station.save();

      res.status(200).send({ message: 'Reservation activated' });
    } catch (err) {
      console.error('Error activating reservation:', err);
      res.status(500).send({ message: 'Error activating reservation' });
    }
  });
  

  router.delete('/endReservation', async (req, res) => {
    const { Email: userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).send({ message: 'User email is required' });
    }
    try {
      const reservation = await Reservation.findOne({ userEmail });
  
      if (!reservation) {
        return res.status(404).send({ message: 'Reservation not found' });
      }
  
      const stationId = reservation.stationId;
      const station = await Station.findOne({ stationId });
  
      if (!station) {
        return res.status(404).send({ message: 'Station not found' });
      }
      if(station.currentUserInfo === userEmail){
        const updatedStation = await Station.findOneAndUpdate(
          { stationId },
          {
            $unset: { currentUserInfo: '' }, 
            $set: { chargerAvailability: "Available" },
          },
          { new: true }
        );

        if (!updatedStation) {
          return res.status(500).send({ message: 'Failed to update station' });
        }  
      }
  
      await Reservation.deleteOne({ userEmail });
  
      res.status(200).json({
        message: 'Reservation ended successfully',
      });
    } catch (err) {
      console.error('Error ending and deleting reservation:', err);
      res.status(500).send({ message: 'Error ending and deleting reservation' });
    }
  });
  
module.exports = router;