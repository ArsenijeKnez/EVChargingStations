const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const eventLogSchema = new mongoose.Schema({
  logId: { type: Number, unique: true },
  description: { type: String, required: true },
  eventType: {
    type: String,
    enum: ["reservation", "error", "info"],
    required: true,
  },
  eventDate: { type: Date, default: Date.now },
  userId: { type: Number, required: true },
  email: { type: String, required: true },
});

eventLogSchema.plugin(AutoIncrement, { inc_field: "logId" });
const EventLog = mongoose.model("eventlog", eventLogSchema);

module.exports = EventLog;
