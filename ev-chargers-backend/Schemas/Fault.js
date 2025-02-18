const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const faultSchema = new mongoose.Schema({
    faultId: { type: Number, unique: true},
    description: { type: String, required: true },
    faultDate: { type: Date, default: Date.now },
    stationId: { type: Number, required: true },
    stationName: {type: String, required: true},
    email: {type: String, required: true}
  });

  faultSchema.plugin(AutoIncrement, { inc_field: 'faultId' })
  const Fault = mongoose.model('fault', faultSchema);
  
  module.exports = Fault;