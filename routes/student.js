const express = require("express");
const { authPass } = require("../controller/authController");
const {
  profile,
  passwordUpdate,
  getStudentBySubjectId,
} = require("../controller/studentController");
const router = express.Router();
const { markAttendance, dayTotal } = require("../controller/attendance");

router.get("/", authPass, profile);
router.post("/updatePassword", authPass, passwordUpdate);
router.post("/mark", authPass, markAttendance);
router.post("/dayTotal", authPass, dayTotal);
router.post("/getStudent/:subjectId", authPass, getStudentBySubjectId);

module.exports = router;
