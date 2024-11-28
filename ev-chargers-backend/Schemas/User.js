const mongoose = require('mongoose');
const { Schema } = mongoose;
const carSchema = require('./CarSchema'); 

const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  password: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['User', 'Admin'] },
  accountCreationDate: { type: Date, default: Date.now },
  cars: { type: [carSchema], default: [] }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
