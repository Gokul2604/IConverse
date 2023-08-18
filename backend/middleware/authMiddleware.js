const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.id).select("-password");

            next();
        } catch(err) {
            res.status(401);
            throw new Error('User not authorized! Token failed!');
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('User not authorized! No Token!');
    }
});

module.exports= { protect };