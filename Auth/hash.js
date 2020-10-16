const bcrypt = require('bcrypt');



const hashPassword = async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password =  await bcrypt.hash(user.password, salt);
    return user;
};

const checkPasswordValidity = async (providedPassword, hashedPassword) => {
    const result = await bcrypt.compare(providedPassword, hashedPassword);
    return result;
}


module.exports.hashPassword = hashPassword;
module.exports.checkPasswordValidity = checkPasswordValidity;
