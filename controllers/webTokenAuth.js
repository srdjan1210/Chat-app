const jsonwebtoken = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;


const checkTokenValidity = (req, res, next) => {
    
    let token = req.header('auth-token');
    if(!token) token = req.cookies['auth-token'];
    if(!token) res.json({ error: { message : 'Access denied!'}});

    try {
        const payload = jsonwebtoken.verify(token, secret);
        console.log(payload);
        req.user = payload;
        next();
    }catch(err) {
        res.json({error: { message: 'Access denied!' }});
    }
};

const signData = (data) => {
    const signed = jsonwebtoken.sign(data, secret);
    return signed;
};

module.exports.checkTokenValidity = checkTokenValidity;
module.exports.signData = signData;