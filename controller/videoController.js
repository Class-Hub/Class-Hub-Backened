const express = require("express");
const multer = require("multer");
const VideoDetails = require("../models/VideoDetail");

const uploadVideo = (req, res, next) => {
  console.log(req.userData);
  const videoDetails = new VideoDetails({
    uploader_name: req.headers.uploader_name,
    upload_title: req.file.filename.replace(/ /g, "_"),
    video_path:
      "http://localhost:" +
      process.env.PORT +
      "/videos/" +
      req.file.filename.replace(/ /g, "_"),
    thumbnail_path:
      "http://localhost:" + process.env.PORT + "/thumbnail/" + req.headers.subname + ".jpg"
  });
  videoDetails
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).json({
    message: "Video upload successful",
  });
};

const videoShow = (req, res) => {
  console.log("Request connected");
  VideoDetails.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  uploadVideo,
  videoShow,
};
