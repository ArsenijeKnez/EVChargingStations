const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new Schema({
  userId: { type: Number, unique: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ["User", "Admin"] },
  accountCreationDate: { type: Date, default: Date.now },
  cars: { type: [Number], default: [], required: false },
  blocked: { type: Boolean, required: true },
});

userSchema.plugin(AutoIncrement, { inc_field: "userId" });
const User = mongoose.model("users", userSchema);

module.exports = User;
