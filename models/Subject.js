const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Teacher = require("./Teacher");
const Student = require("./Student");

const subjectSchema = new Schema({
  subName: String,
  noStudent: Number,
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Teacher,
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
