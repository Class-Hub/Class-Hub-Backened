const express = require("express");
const { authPass } = require("../controller/authController");
const { profile } = require("../controller/studentController");
const router = express.Router();

router.get("/", authPass, profile);

module.exports = router;
