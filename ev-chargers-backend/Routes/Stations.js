const express = require('express');
const Station = require('../Schemas/Station');
const router = express.Router()

router.get('/', async (req, res) => {
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
  
  router.post('/post', async (req, res) => {
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
  
  
  router.post('/post/bulk', async (req, res) => {
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
  

  module.exports = router;