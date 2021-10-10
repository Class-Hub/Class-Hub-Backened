const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  Student.findOne({ email: req.body.email }).exec((err, student) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Some Error",
      });
    } else {
      if (student) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      } else {
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
        });
      }
    }
  });
};

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

/* ----------------------- DashBoard Protection Route ----------------------- */

const authPass = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("Inside If of auth Pass");
    console.log(req.headers.authorization);
    console.log(req.headers.authorization.startsWith("Bearer"));

    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(400).json({
      message: "You aren't Logged In",
    });
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await Student.findById(decoded.id);
  console.log(currentUser);
  if (!currentUser) {
    return res.status(400).json({
      message: "You aren't Logged In",
    });
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

module.exports = {
  register,
  login,
  authPass,
};
