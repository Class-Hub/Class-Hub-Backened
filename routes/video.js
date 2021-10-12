const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController')
const upload = require('../middleware/multer')


router.post('/upload',upload.single('file'), videoController.uploadVideo)
router.get('/videoList',videoController.videoShow)

module.exports = router;
