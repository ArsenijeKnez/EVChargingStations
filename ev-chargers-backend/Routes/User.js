const express = require('express');
const User = require('../Schemas/User');
const Car = require('../Schemas/Car');
const router = express.Router();

router.put('/updateProfile', async (req, res) => {
  try {
    const { Id: id, Name: name, Lastname: lastName, Email: email } = req.body;

    if (!id || !name || !lastName || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id);
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

    res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        id: user._id,
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

router.put('/changePassword', async (req, res) => {
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
  
      res.status(200).json({
        message: 'User profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
