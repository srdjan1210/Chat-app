var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 
console.log(__dirname);
var storage = multer.diskStorage({ 
    destination: path.join(__dirname, '../public/uploads/imgs/'),
    filename: function (req, file, cb) {
      cb(null,  file.originalname);
    }
});

var upload = multer({ storage }).single('image');

module.exports = { upload };
