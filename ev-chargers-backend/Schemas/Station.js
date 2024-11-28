const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  chargerType: { type: String, required: true },
  chargerPower: { type: Number, required: true },
  chargerAvailability: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  currentUserInfo: { type: String, required: false }
});

const Station = mongoose.model('stations', stationSchema);

module.exports = Station;
