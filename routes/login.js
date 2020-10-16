const express = require('express');
const router = express.Router();
const { loginGet, loginPost, loginChat, logout } = require('../controllers/loginController');
const { checkTokenValidity } = require('../controllers/webTokenAuth');


router.get('/', loginGet);
router.post('/', loginPost);
router.get('/chat', checkTokenValidity, loginChat);
router.get('/chat/logout', checkTokenValidity, logout);


module.exports = router;