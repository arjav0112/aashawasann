const User =  require('../models/user.model');
const Profile = require('../models/profile.model');

const generateaashwasanId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => digits[Math.floor(Math.random() * digits.length)];

    let middlePart = '';

    for (let i = 0; i < 12; i++) {
        if (i === 4 || i === 11) { // Ensure 5th and 12th positions are digits
            middlePart += getRandomDigit();
        } else {
            middlePart += Math.random() < 0.5 ? getRandomLetter() : getRandomDigit();
        }
    }

    return `Aash${middlePart}VASH`;
};

module.exports.createProfile = async (req, res) => {
    try {
        
        const {
            fullname, 
            city,
            gender,
            dateofbirth,
            bio,
            paymentmethod,
            sociallinklanguage,
            phonenumber

        } = req.body;


        if(fullname === undefined
            || city === undefined
            ||  gender === undefined
            || dateofbirth === undefined
            || bio === undefined
            || paymentmethod === undefined
            || sociallinklanguage === undefined
            || phonenumber === undefined){
            return res.status(400).json({
                message : "Please fill all the fields"
            });
        }

        const userId = req.user._id;

        const profile = new Profile({
            userId,
            fullname,
            city,
            gender,
            dateofbirth,
            bio,
            paymentmethod,
            sociallinklanguage,
            phonenumber

        });


        const profileData = await profile.save();


        if(!profileData){
            return res.status(400).json({
                message : "Profile not created"
            })
        }


        return res.status(200).json({
            status: 200,
            message : "Profile Created Successfully"
        })



    } catch (error) {
        
        return res.status(500).json({
            message : error.message
        })

    }
}

module.exports.getusernames = async (req,res) => {
    let response = await User.find({});
    console.log("hello")
    if(!response){
        res.send("error")
    }

    console.log(response)
}