const { validateUser, registerUser } = require('../models/user');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const registerPost = (req, res, next) => {
    console.log(req.file.filename);
    console.log(req.file);
    const userObj = _.pick(req.body, ['username', 'password', 'email']);
    userObj.img = {
            data: fs.readFileSync(path.join(__dirname, '../public/uploads/imgs/' + req.file.filename)), 
            contentType: 'image/png'
    };
    const validation = validateUser(userObj);


    if(validation.error){
        res.status(400).send({error: validation.error.message});
        return;
    }

    registerUser(userObj).then((resp) => {
        if(resp){
            res.send({error: null, data: { message: "Register succesfull!"}});
        }
    }).catch((err) => {
        res.status(400).send({error: err.message});
    });
}



const registerGet = (req, res, next) => {
    res.render('register', {err: undefined});
}


module.exports.registerPost = registerPost;
module.exports.registerGet = registerGet;