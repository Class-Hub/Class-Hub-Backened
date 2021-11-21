const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Class = require("../../models/class.model");
const { nanoid } = require("nanoid");
const { authPass } = require("../../controller/authController");

router.get("/get/class/:classId", (req, res) => {
  const classId = req.params.classId;
  Class.findById(classId)
    .then((_class) => res.json(_class))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/created/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ owner: user })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/taught/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ teacher: { $in: [user] } })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/studied/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ students: { $in: [user] } })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.post("/create", authPass, async (req, res) => {
  console.log("This is inside controller", req.user);
  const teacher = req.user;
  console.log("This is teacher", teacher);
  const { title, description } = req.body;
  console.log("This is body", req.body);
  try {
    if (!teacher) {
      return res.status(400).json("User not found");
    } else {
      const _class = new Class({
        title,
        description,
        owner: teacher._id,
        code: nanoid(11),
      });

      await _class.save();
      res.status(201).json({
        message: "Success",
        classId: _class._id,
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/students/register", authPass, async (req, res) => {
  const teacher = req.user;
  const { classId, studentId } = req.body;
  const student = await Student.findById(studentId);
  if (!teacher) {
    return res.status(403).json("U arent logged in.");
  }
  if (!student) {
    return res.status(500).json("Something went wrong.");
  } else {
    const CClass = await Class.findById(classId);
    if (!CClass) {
      res.status(400).json("Class not found.");
    } else {
      if (CClass.students.includes(student)) {
        return res
          .status(400)
          .json("The Student  already has a role in this class.");
      }
      CClass.students.push(student);
      await CClass.save();

      res.json({ message: "Success", class: CClass });
    }
  }
});

router.delete("/students/delete", authPass, async (req, res) => {
  const teacher = req.user;

  const { classId, studentId } = req.body;
  const student = await Student.findById(studentId);
  console.log(student);

  if (!student) {
    return res.status(403).json("Student not found");
  }

  const CClass = await Class.findById(classId);
  console.log(CClass);

  if (!CClass) {
    return res.status(400).json("Class not found.");
  }

  if (CClass.students.includes(student._id)) {
    console.log("Found Id");
    for (let i = 0; i < CClass.students.length; i++) {
      console.log(CClass.students[i]);
      console.log(student._id);
      if (CClass.students[i].equals(student._id)) {
        console.log("Inside If OF For Loop");
        CClass.students.splice(i, 1);
        i--;
      }
    }
  }
  await CClass.save();

  res.json({
    message: "Success",
    data: CClass,
  });
});

router.post("/students/remove", (req, res) => {
  const { token, owner, student, _class } = req.body;
  User.findOne({ _id: owner, token }, (err, user) => {
    if (err) res.status(500).json("Something went wrong.");
    else if (!user) res.status(403).json("Permission denied.");
    else {
      Class.findOne({ _id: _class }, (err, __class) => {
        if (err) res.status(500).json("Something went wrong");
        else if (!__class) res.status(400).json("Class not found.");
        else {
          if (__class.students.includes(student)) {
            for (let i = 0; i < __class.students.length; i++) {
              if (__class.students[i] === student) {
                __class.students.splice(i, 1);
                i--;
              }
            }
          }
          __class
            .save()
            .then(() => res.json("Success"))
            .catch((err) => res.status(400).json("Something went wrong."));
        }
      });
    }
  });
});

router.patch("/update", authPass, async (req, res) => {
  const teacher = req.user;
  const { classId, title, description } = req.body;
  console.log("Req.BOdy is", req.body);

  if (!teacher) {
    return res.status(403).json("Permission denied.");
  } else {
    const CClass = await Class.findById(classId);
    if (!CClass) {
      return res.status(400).json("Class not found.");
    } else {
      CClass.title = title;
      CClass.description = description;
      CClass.save()
        .then(() => res.json("Success."))
        .catch(() => res.status(400).json("Something went wrong."));
    }
  }
});

module.exports = router;
