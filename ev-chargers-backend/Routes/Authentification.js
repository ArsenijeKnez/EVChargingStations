const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Schemas/User');
const router = express.Router();


router.post('/login', async (req, res) => {
    try {
      const { Email: email, Password: password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user.userId, email: user.email, user_role: user.type },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.userId,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          type: user.type,
        },
      });
    } catch (err) {
      console.error('Error logging in user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  router.post('/register', async (req, res) => {
  
    try {
      const {
        Name: name,
        Lastname: lastName,
        Password: password,
        Email: email,
        UserType: type
      } = req.body;
  
      if (!name || !lastName || !password || !email || !type) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        name,
        lastName,
        password: hashedPassword,
        email,
        type,
        cars: []
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: 'User registered successfully'
      });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
