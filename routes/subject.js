const express = require("express");
const Subject = require("../models/Subject.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await Subject.find()
    .populate("students")
    .populate("teachers");
  res.json({ subjects });
});

module.exports = router;
