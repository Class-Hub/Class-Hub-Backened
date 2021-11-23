const Conversation = require("../models/conversation");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = require("express").Router();

//new conv

router.get("/getTeachers", async (req, res) => {
  const teachers = await Teacher.find();
  if (teachers.length == 0) {
    return res.send("No Teacher Found");
  }
  res.json({
    message: "Success",
    data: teachers,
  });
});

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    if (!student) {
      const teacher = await Teacher.findById(id);
      return res.status(200).json({ teacher });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
