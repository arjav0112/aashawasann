const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const Authentication = async (req, res, next) => {
    try{
        const token =  req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({status : "401" ,message: "Unauthorized", success: false});
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if(!verified){
            return res.status(401).json({message: "Unauthorized", success: false ,status : "401"});
        }

        const user = await User.findById(verified.id).select("-password");
        if(!user){
            return res.status(404).json({message: "User Not Found", success: false});
        }

        req.user = user;

        next();
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
};


module.exports = Authentication