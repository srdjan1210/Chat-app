const { validateLogin, loginUser, getAllActiveUsers, setUserStatus, getUserUsingId, getAllOfflineUsers} = require('../models/user');
const { signData, checkTokenValidity } = require('../controllers/webTokenAuth');
const _ = require('lodash');
const path = require('path');



const loginGet = (req, res, next) => {
    console.log("login get has been hit");
    if(req.query.valid == 'true'){
        res.render('login', { message: 'You \'ve succesfully registered! Now login!'});
        return;
    }
    res.render('login', { message: 'Login!' });
};
 


const loginPost = (req, res, next) => {
    console.log("Login post has been hit");
    const user = _.pick(req.body, ['email', 'password']);
    const validation = validateLogin(user);

    if(validation.error){
        res.status(400).json({ error: validation.error.details[0] });
        return;
    }

    loginUser(user).then(async (result) => {
        if(!result.error){
                res.header('auth-token', signData(_.pick(result.data, ['_id', 'username', 'email'])))
                .json({data: "Login succesfull", erorr: null});
                return;
            } 
        res.status(400).json({ error: result.error });
    }); 
};


const loginChat = async (req, res) => {
    const user = req.user;
    await setUserStatus(user, true);
    const users = await getAllActiveUsers(user);
    const offUsers = await getAllOfflineUsers(user);
    const owner = await getUserUsingId(user._id);
    res.render('chat', { users, owner, offUsers });
};

const logout = async (req, res) => {
    const user = req.user;
    await setUserStatus(user, false);
    res.cookie('auth-token', '');
    res.redirect('/login');
    
};


module.exports.loginGet = loginGet;
module.exports.loginPost = loginPost;
module.exports.loginChat = loginChat;
module.exports.logout = logout;