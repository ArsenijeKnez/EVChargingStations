const mongoose = require('mongoose');
const carSchema = require('./CarSchema'); 

const Car = mongoose.model('cars', carSchema);

module.exports = Car;
