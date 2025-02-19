const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const stationSchema = new mongoose.Schema({
  stationId: { type: Number, unique: true },
  name: { type: String, required: true },
  chargerType: { type: String, required: true },
  chargerPower: { type: Number, required: true },
  chargerAvailability: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  currentUserInfo: { type: String, required: false },
});

stationSchema.plugin(AutoIncrement, { inc_field: "stationId" });

const Station = mongoose.model("stations", stationSchema);

module.exports = Station;
