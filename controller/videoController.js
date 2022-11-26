const express = require("express");
const multer = require("multer");
const VideoDetails = require("../models/VideoDetail");
const Subject = require("../models/Subject")

const uploadVideo = (req, res, next) => {
  // console.log(req.userData);
  console.log("SubjectId",req.headers.uploader_name);
  const videoDetails = new VideoDetails({
    uploader_name: req.headers.uploader_name,
    upload_title: req.file.filename.replace(/ /g, "_"),
    video_path: `${req.protocol}://${req.get('host')}/videos/${req.file.filename.replace(/ /g, "_")}`,
      
    thumbnail_path: `${req.protocol}://${req.get('host')}/thumbnail/${req.headers.subname }.jpg`,
    subject: req.headers.subject
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

const videoShow = async(req, res) => {
  console.log("Request connected");
  console.log(req.user);
  let arr = []
  let a = req.user.teachingSubs ? req.user.teachingSubs : req.user.attendance
  for(let i=0;i<a.length;i++){
    arr.push(a[i].sub)
  }
  console.log(arr)
  let docs = []
  docs = await VideoDetails.find({subject: {$in: arr}}).populate("subject");
  console.log(docs)

  let subjectList = []

  for(let i=0;i<arr.length;i++){
    let s = await Subject.findOne({_id:arr[i]},{subName:1});
    subjectList.push(s.subName);
  }

  let videos = [];
  
  for(let i=0;i<subjectList.length;i++){
    let v =[];
    for(let j=0;j<docs.length;j++){
      if(docs[j].subject.subName === subjectList[i]){
        v.push(docs[j]);
      }
    }
    videos.push({
      subjectName: subjectList[i],
      videos:v
    })
  }

  res.status(200).json(videos); 
};

module.exports = {
  uploadVideo,
  videoShow,
};
