const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  model: { type: String, required: true },
  chargerType: { type: String, required: true },
  batteryCapacity: { type: Number, required: true }, 
  batteryPercentage: { type: Number, required: true }, 
  yearOfProduction: { type: Number, required: true },
  averageConsumption: { type: Number, required: true }
});

module.exports = carSchema;
