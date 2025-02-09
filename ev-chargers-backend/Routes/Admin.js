const express = require('express');
const EventLog = require('../Schemas/EventLog');
const User = require('../Schemas/User');
const router = express.Router();
const verifyAdmin = require('./JWTverification/VerifyAdmin');

router.get('/logs', verifyAdmin, async (req, res) => {
  try {
    const logs = await EventLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.post('/logs/filter', verifyAdmin, async (req, res) => {
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

router.get('/getUsers', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ type: 'User' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/unBlockUser', verifyAdmin, async (req, res) => {
  try {
    const { UserId: userId } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      message: user.blocked ? 'User blocked' : 'User unblocked',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
