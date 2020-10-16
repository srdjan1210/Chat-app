const express = require('express');
const router = express.Router();
const { registerPost, registerGet } = require('../controllers/registerController');
const { upload } = require('../controllers/imageUploadController');


router.get('/', registerGet);
router.post('/', upload, registerPost);


module.exports = router;