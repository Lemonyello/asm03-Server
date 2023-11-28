const { Schema, default: mongoose } = require("mongoose");

const sessionSchema = new Schema({});

module.exports = mongoose.model("Session", sessionSchema);
