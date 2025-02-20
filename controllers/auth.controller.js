const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET, {
        expiresIn : "24h"
    })
}


module.exports.register = async (req, res) => {
    try{

        const {username  , email , password} = req.body;
        console.log(req.body)
        
        if(email === undefined || password === undefined || username === undefined){
            return res.status(400).json({
                message : "Please fill all the fields"
            });
        }
        
        if(password.length <= 6){
            return res.status(400).json({
                message : "password should be atleast 6 characters long"
            })
        }
        
        if(!email.includes("@") || !email.includes(".")){
            return res.status(400).json({
                message : "Invalid email"
            })
        }
        
        if(username > 30){
            return res.status(400).json({
                message : "username should be less than 30 characters"
            })
        }
        
        const user = await User.findOne({email , username});
        
        if(user){
            
            return res.status(409).json({
                
                message : "User or email already exists"
            })
        }
        
        //hashing the password
        
        const hashpassword = await bcrypt.hash(password,10);
            
        const userData = await User.create({
            username :username,
            email : email,
            password : hashpassword,
            
            
        });
        
        if(!userData){
            return res.status(400).json({
                message : "User not created"
            })
        }
        
        const token = generateToken(userData._id);
        userData.token = token;
        await userData.save();
        
        
        return res.status(200).json({
            status: 200,
            message : "User Registered Successfully"
        })
        
    }
    catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

module.exports.login = async (req, res) => {
    try {
        
        const {username, password} = req.body;

        if(username === undefined || password === undefined){
            return res.status(400).json({
                message : "Please fill all the fields"
            });
        }
        const user = await User.findOne({username : username});

        if(!user){
            return res.status(404).json({
                message : "Invalid username"
            })
        }
        
        const ispasswordCorrect = await bcrypt.compare(password,user.password);

        if(!ispasswordCorrect){
            return res.status(400).json({
                message : "Invalid password"
            })
        }
        const token = generateToken(user._id);

        user.token = token;

        await user.save();

        return res.status(200).json({
            status : 200,
            message : "User Logged In Successfully",
            userData : {
                _id : user._id,

                username : user.username,
                Email : user.email,

                token : user.token,

            }

        })

        
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}

module.exports.logout = async (req, res) => {
    try {
        const user = req.user;

        const findUser = await User.findById(user._id);
        findUser.token = "";
        await findUser.save();

        return res.status(200).json({
            message : "User Logged Out Successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}