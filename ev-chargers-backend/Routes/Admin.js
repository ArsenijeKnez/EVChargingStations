const express = require('express');
const EventLog = require('../Schemas/EventLog');
const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    const logs = await EventLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.post('/logs/filter', async (req, res) => {
  const { eventType, userId, startDate, endDate } = req.body;
  
  const filter = {};
  if (eventType) filter.eventType = eventType;
  if (userId) filter.userId = Number(userId);
  if (startDate || endDate) {
    filter.eventDate = {};
    if (startDate) filter.eventDate.$gte = new Date(startDate);
    if (endDate) filter.eventDate.$lte = new Date(endDate);
  }

  try {
    const logs = await EventLog.find(filter);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filtered logs' });
  }
});

module.exports = router;
