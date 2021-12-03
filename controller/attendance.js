const Student = require("../models/Student");
const Subject = require("../models/Subject");

exports.daysTotal = async (req, res) => {
  try {
    const subjectId = req.body.subjectId;
    const student = await Student.find({});

    for (let i = 0; i < student.length; i++) {
      student[i].attendance.forEach((subject) => {
        if (subject.sub.equals(subjectId)) {
          subject.totalDays++;
          subject.isActive = true;
          subject.isMarked = false;
          expDate = Date.now() + 10000;
        }
      });
      await student[i].save();
    }
    res.json({ message: "attendence updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.markAttendance = async (req, res) => {
  try {
    console.log("INside route");

    const student = req.user;
    const subjectId = req.body.subjectId;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).send("Subject Not Found");
    }
    student.attendance.forEach((subject) => {
      console.log(subject.sub.equals(subjectId));
      if (subject.sub.equals(subjectId)) {
        console.log("INside if");
        subject.totalPresent++;
        subject.isMarked = true;
      }
    });
    await student.save();
    res.json({
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};
