const express = require("express");
const { authPass } = require("../controller/authController");
const { profile } = require("../controller/teacherController");
const router = express.Router();

router.get("/", authPass, profile);

router.post("/getLink", async (req, res) => {
  const { link, id } = req.body;
  try {
    const teacher = await Teacher.findById(id);
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
