const express = require('express');
const Station = require('../Schemas/Station');
const Fault = require('../Schemas/Fault');
const User = require('../Schemas/User');
const EventLog = require('../Schemas/EventLog');
const router = express.Router();
const verifyAny = require('./JWTverification/VerifyAny');
const verifyAdmin = require('./JWTverification/VerifyAdmin');
const verifyUser = require('./JWTverification/VerifyUser');

router.get('/', verifyAny, async (req, res) => {
    try {
      const stations = await Station.find();
      res.json(stations);
    } catch (err) {
      console.error('Error fetching stations:', err);
      res.status(500).send('Error fetching stations');
    }
  });
  
  router.get('/guest', async (req, res) => {
    try {
      const stations = await Station.find().select('id name coordinates');
      res.json(stations);
    } catch (err) {
      console.error('Error fetching stations:', err);
      res.status(500).send('Error fetching stations');
    }
  });
  
  router.post('/post', verifyAdmin, async (req, res) => {
    const { name, chargerType, chargerPower, chargerAvailability, coordinates } = req.body;

    if ( !name || !chargerType || !chargerPower || !chargerAvailability || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).send({message: 'All fields (id, name, chargerType, chargerPower, chargerAvailability, coordinates) are required'});
    }
  
    try {
      const newStation = new Station({ 
        name, 
        chargerType, 
        chargerPower, 
        chargerAvailability, 
        coordinates,  
      });
      await newStation.save();

      await EventLog.create({
        description: `Station created successfully - ${name}`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });
      
      res.status(201).json(newStation);
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send({message:'Error saving station'});
    }
  });

  router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id:stationId } = req.params;
   
    try {
      const station = await Station.findOne({stationId});
      if (!station) {
        return res.status(404).send({ message: 'Station not found' });
      }
      await Station.deleteOne({stationId});

      await EventLog.create({
        description: `Station with ID ${stationId} deleted successfully`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });

      res.status(200).send({ message: 'Station deleted successfully' });
    } catch (err) {
      console.error('Error deleting station:', err);
      res.status(500).send({ message: 'Error deleting station' });
    }
  });

  router.put('/put/availability', verifyAdmin, async (req, res) => {
    const { stationId, availability } = req.body;

    if (!stationId || !availability) {
      return res.status(400).send('Request must have station id and availability');
    }
  
    try {

      const updatedStation = await Station.findOneAndUpdate(
        { stationId },
        {
          $set: { chargerAvailability: availability },
        },
        { new: true }
      );
      if (updatedStation)
        res.status(200).json(updatedStation);
      else
        res.status(404).json({
          message: 'Station not found.'
        });
    } catch (err) {
      console.error('Error changing station availability:', err);
      res.status(500).send('Error changing station availability');
    }
  });

  router.post('/reportFault', verifyUser, async (req, res) => {
    const { stationId, description, email, stationName } = req.body;

    if (!stationId || !description || !email) {
      return res.status(400).send('Missing request parameters');
    }
    try {

      const station = await Station.findOne({ stationId });
  
      if (!station) {
        return res.status(404).send({ message: 'Station not found' });
      }

      const user = await User.findOne({email});
      if(!user){
        return res.status(404).send({ message: 'User not found'});
      }

      const newFault = new Fault({ 
        description,
        email,
        stationName,
        stationId
      });
      console.log(newFault);
      await newFault.save();

      await EventLog.create({
        description: `User with email ${email} reported fault in station with ID ${stationId}`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });

      res.status(201).json({message: 'Fault reported.'});
    } catch (err) {
      console.error('Error reporting fault:', err);
      await EventLog.create({
        description: `Error reporting fault in station with ID ${stationId}`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });
      res.status(500).send('Error reporting fault');
    }
  });
  

  module.exports = router;