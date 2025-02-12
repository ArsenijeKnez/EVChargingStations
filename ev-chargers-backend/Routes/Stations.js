const express = require('express');
const Station = require('../Schemas/Station');
const router = express.Router();
const verifyAny = require('./JWTverification/VerifyAny');
const verifyAdmin = require('./JWTverification/VerifyAdmin');

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
      res.status(201).json(newStation);
    } catch (err) {
      console.error('Error saving station:', err);
      res.status(500).send({message:'Error saving station'});
    }
  });
  
  
  router.post('/post/bulk', verifyAdmin, async (req, res) => {
    const stations = req.body;
  
    if (!Array.isArray(stations) || stations.length === 0) {
      return res.status(400).send('Request body must be an array of stations');
    }
  
    for (let station of stations) {
      const { name, chargerType, chargerPower, chargerAvailability, coordinates } = station;
      if (!name || !chargerType || !chargerPower || !chargerAvailability || !coordinates || !coordinates.lat || !coordinates.lng) {
        return res.status(400).send('All fields (name, chargerType, chargerPower, chargerAvailability, coordinates) are required');
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

  router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id:stationId } = req.params;
   
    try {
      const station = await Station.findOne({stationId});
      if (!station) {
        return res.status(404).send({ message: 'Station not found' });
      }
      await Station.deleteOne({stationId});
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
  

  module.exports = router;