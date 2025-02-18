const express = require('express');
const User = require('../Schemas/User');
const Car = require('../Schemas/Car');
const EventLog = require('../Schemas/EventLog');
const router = express.Router();
const verifyAny = require('./JWTverification/VerifyAny');
const verifyUser = require('./JWTverification/VerifyUser');

router.put('/updateProfile', verifyAny, async (req, res) => {
  try {
    const { Id: userId, Name: name, Lastname: lastName, Email: email } = req.body;

    if (!userId || !name || !lastName || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    user.name = name;
    user.lastName = lastName;
    user.email = email;
    await user.save();

    await EventLog.create({
      description: `User profile updated successfully - ${name} ${lastName}`,
      eventType: 'info',
      userId: req.user.id,
      email: req.user.email
    });

    res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        userId: user.userId,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/changePassword', verifyAny, async (req, res) => {
    try {
      const { Email: email, OldPassword: oldPassword, NewPassword: newPassword } = req.body;
  
      if (!oldPassword || !newPassword || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if(user.password != oldPassword){
        return res.status(401).json({ message: 'wrong old password' });     
      }
  
      user.password = newPassword;
      await user.save();

      await EventLog.create({
        description: `Password changed successfully for user ${email}`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });
  
      res.status(200).json({
        message: 'User profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/addCar', verifyUser, async (req, res) => {
    try {
      
      const {Model: model, ChargerType: chargerType, BatteryCapacity: batteryCapacity, YearOfProduction: yearOfProduction, AverageConsumption: averageConsumption, UserId: userId} = req.body;
  
      if ( !model || !chargerType || !batteryCapacity || !yearOfProduction || !averageConsumption || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newCar = new Car({
        model,
        chargerType,
        batteryCapacity,
        batteryPercentage:100,
        yearOfProduction,
        averageConsumption
      });

      const user = await User.findOne({ userId });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      await newCar.save();

      user.cars.push(newCar.carId);
      await user.save();

      await EventLog.create({
        description: `Car added successfully for user ${userId} - Model: ${model}`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });

      res.status(201).json({
        message: 'Car added successfully',
        car: newCar
      });
    } catch (err) {
      await EventLog.create({
        description: `Error adding car - ${err.message}`,
        eventType: 'error',
        userId: req.user.id,
        email: req.user.email
      });
      console.error('Error adding car:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete('/removeCar', verifyAny, async (req, res) => {
    try {
      const { CarId: carId} = req.body;
  
      if ( !carId) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const car = await Car.findOne({ carId });

      if (!car) {
        return res.status(400).json({ message: 'Car not found' });
      }
      
      await Car.deleteOne({ carId });

      await EventLog.create({
        description: `Car with ID ${carId} removed successfully`,
        eventType: 'info',
        userId: req.user.id,
        email: req.user.email
      });

      res.status(200).json({
        message: 'Car removed successfully',
      });
    } catch (err) {
      console.error('Error removing car:', err);

      await EventLog.create({
        description: `Error removing car - ${err.message}`,
        eventType: 'error',
        userId: req.user.id,
        email: req.user.email
      });
      
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/getCars', verifyAny, async (req, res) => {
    try {
      
      const {Id : userId} = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'User id is missing' });
      }

      const user = await User.findOne({userId})
      const carIDs = user.cars;

      const cars = await Car.find({ carId: { $in: carIDs } });
      res.status(200).json({
        message: 'Car fetched successfully',
        cars: cars
      });
    } catch (err) {
      console.error('Error fetching cars:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.put('/changeBattery', verifyUser, async (req, res) => {
    try {
      const {CarId: carId, BatteryPercentage: batteryPercentage} = req.body;
  
      if ( !carId || !batteryPercentage) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const car = await Car.findOne({ carId });

      if (!car) {
        return res.status(400).json({ message: 'Car not found' });
      }
      
      car.batteryPercentage = batteryPercentage;
      await car.save();

      res.status(200).json({
        message: 'Car battery updated successfully'
      });
    } catch (err) {
      console.error('Error updating car:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
