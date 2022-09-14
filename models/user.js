const mongoose = require('mongoose');
const Joi = require('joi');
const { hashPassword, checkPasswordValidity } = require('../Auth/hash');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        maxlength: 20,
        unique: true
    }, 
    password: {
        type: String, 
        minlength: 8,
        required: true
    },
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    active: {
        type: Boolean,
        default: false
    },
    img: {
        data: Buffer,
        contentType: String
    }


});

const userModel = mongoose.model('User', UserSchema);

const validateUser = (user) => {
    user.username = user.username.trim();
    user.password = user.password.trim();
    user.email = user.email.trim();

    var schema = Joi.object({
        username: Joi.string().max(20).required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().email().required(),
        img: Joi.required()
    });

    return schema.validate(user);
}


const validateLogin = (user) => {
    user.password = user.password.trim();
    var schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

const registerUser = async (user) => {
    user = await hashPassword(user);
    const usr = new userModel(user);
    return usr.save();
}

const loginUser = async (user) => {
    const savedUser = await userModel.findOne({email: user.email});
    if(!savedUser)return {error: { message: 'Username not valid!'}};

    const result = await checkPasswordValidity(user.password, savedUser.password);
    
    if(result) return { data: savedUser, error: null };
    return { data: null, error: { message : 'Email or password not correct!'}}
}

const getAllActiveUsers = async({ email }) => {
    const users = userModel.find({active: true, email: { $ne: email}});
    return users;
}

const getAllOfflineUsers = async({ email }) => {
    const users = userModel.find({active: false, email: { $ne: email}});
    return users;
}

const setUserStatus = async ({ email }, status) => {
    const savedUser = await userModel.findOne({ email });
    savedUser.active = status;
    savedUser.save();
}

const getUserUsingId = async(_id) => {
    const user = await userModel.findOne({_id});
    return user;
}


module.exports = { validateUser, registerUser, validateLogin, loginUser, getAllActiveUsers, setUserStatus, getUserUsingId, getAllOfflineUsers };