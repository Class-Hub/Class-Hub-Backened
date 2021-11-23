const Student = require("../models/Student");
const Subject = require("../models/Subject");

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
        subject.totalDays++;
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
