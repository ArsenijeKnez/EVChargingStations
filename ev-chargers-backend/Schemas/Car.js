const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const carSchema = new mongoose.Schema({
  carId: { type: Number, unique: true },
  model: { type: String, required: true },
  chargerType: { type: String, required: true },
  batteryCapacity: { type: Number, required: true },
  batteryPercentage: { type: Number, required: true },
  yearOfProduction: { type: String, required: true },
  averageConsumption: { type: Number, required: true },
});

carSchema.plugin(AutoIncrement, { inc_field: "carId" });
const Car = mongoose.model("cars", carSchema);

module.exports = Car;
