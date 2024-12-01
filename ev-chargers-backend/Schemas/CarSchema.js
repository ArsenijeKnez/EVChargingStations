const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const carSchema = new mongoose.Schema({
  carId: { type: Number, required: true, unique: true },
  model: { type: String, required: true },
  chargerType: { type: String, required: true },
  batteryCapacity: { type: Number, required: true }, 
  batteryPercentage: { type: Number, required: true }, 
  yearOfProduction: { type: Number, required: true },
  averageConsumption: { type: Number, required: true }
});

carSchema.plugin(AutoIncrement, { inc_field: 'carId' })

module.exports = carSchema;
