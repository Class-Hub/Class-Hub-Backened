const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
      cb(null, 'Lectures');
    },
    filename: (req, file, cb) => {
      cb(null,  file.originalname.replace(/ /g, '_'))
    },
  });

const upload = multer({
    storage,
    limits: {
        fileSize:524288000
        },
        fileFilter(req, file, cb) {
          if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
             return cb(new Error('Please upload video only'))
          }
          cb(undefined, true)
       }
})

module.exports = upload