const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roll: String,
  batch: String,
  course: String,
  dob: String,
  phn: String,
  photo: String,
});

const User = mongoose.model("Student", studentSchema);

module.exports = User;
