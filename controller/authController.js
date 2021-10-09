const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  Student.findOne({ email: req.body.email }).exec((err, student) => {
    if(err){
      return res.status(400).json({
        status: "error",
        message: "Some Error",
      });
    }else{
      if(student){
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      }
      else{     
      bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Failed",
          });
        }
      let student = new Student({
        email: req.body.email,
        password: hashedPassword,
      });
      student
        .save()
        .then((student) => {
          res.status(200).json({
            status: "success",
            message: "Successfully registered",
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: "error",
            message: "Failed to register",
          });
        });
      })
      }
    }
})
}


const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Student.findOne({ email: email }).then((student) => {
    if (student) {
      bcrypt.compare(password, student.password, (err, result) => {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Some error occured",
          });
        }
        if (result) {
          var token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
            expiresIn: "2h",
          });
          res.status(200).json({
            status: "success",
            message: "Logged In successfully",
            token,
          });
        } else {
          res.status(400).json({
            status: "error",
            message: "Credentials Not Correct",
          });
        }
      });
    } else {
      res.json({
        message: "No student found",
      });
    }
  });
};

module.exports = {
  register,
  login,
};
