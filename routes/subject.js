const express = require("express");
const Subject = require("../models/Subject.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await Subject.find()
    .populate("students")
    .populate("teachers");
  res.json({ subjects });
});

router.post("/getSubject", async (req, res) => {
  const subjectId = req.body.subjectId;
  const subject = await Subject.findById(subjectId).populate("students").populate("teachers");
  if(subject) {
    res.json({ subject });
  }
  else{
    res.json({ message: "Subject not found" });
  }
})

module.exports = router;
