const express = require('express');
const videoController = require('../controller/videoController')
const upload = require('../middleware/multer')

const router = express.Router();


router.post('/upload',upload.single('file'), videoController.uploadVideo)
router.get('/videoList',videoController.videoShow)

module.exports = router;
