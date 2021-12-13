const express = require("express");
const { authPass } = require("../controller/authController");
const { profile } = require("../controller/teacherController");
const Teacher = require("../models/Teacher");
const router = express.Router();

router.get("/", authPass, profile);

router.post("/getLink", async (req, res) => {
  const { link, yourName } = req.body;
  try {
    const teacher = await Teacher.findOne({ name: yourName });
    if (!teacher) {
      return res.status(404).send("NO Teacher Found");
    }
    teacher.link = link;
    teacher.save();
    res.status(200).json({
      msg: "Success",
      data: link,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
