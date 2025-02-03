const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ReservationSchema = new mongoose.Schema({
  reservationId: {
    type: Number,
    unique: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  carId: {
    type: Number,
    required: true,
  },
  stationId: { type: Number, required: true },
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  timeOfReservation: {type: Date, default: Date.now,},
});

ReservationSchema.plugin(AutoIncrement, { inc_field: 'reservationId' })

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;