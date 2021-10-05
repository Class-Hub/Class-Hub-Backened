const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if(err){
      return res.status(400).json({
        status: "error",
        message: "Some Error",
      });
    }else{
      if(user){
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
      let user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((user) => {
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

  User.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Some error occured",
          });
        }
        if (result) {
          var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
        message: "No user found",
      });
    }
  });
};

module.exports = {
  register,
  login,
};
