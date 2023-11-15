const jwt = require('jsonwebtoken');
const footballModel = require('../models/register');


const auth = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        // authorization from db
        const user = await footballModel.findOne({_id : verifyUser});
        // console.log(user); //this will show logged in user's info 
        console.log(`${user.username} is currently logged in`);

        req.token = token;
        req.user = user;

        next();

    } catch (error) {
        res.status(404).send(error);
    }
}

module.exports = auth ; 