const express = require("express");
const { authPass } = require("../controller/authController");
const { profile } = require("../controller/studentController");
const router = express.Router();
const { markAttendance } = require("../controller/attendance");

router.get("/", authPass, profile);
router.post("/mark", authPass, markAttendance);

module.exports = router;
