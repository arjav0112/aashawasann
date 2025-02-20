const mongoose =  require("mongoose");
const User =  require("./user.model");


const profileSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
        
    },
    fullname : {
        type : String,
        required : true
    },

    city : {
        type : String,
        required : true

    },
    gender : {
        type : String,
        required : true
    },
    dateofbirth:{
        type : Date,
        required : true
    },
    bio : {
        type : String,
        required : true
    },
    paymentmethod : {
        type : String,
        required : true
    },
    sociallinklanguage : {
        type : String,
        required : true
    },
    phonenumber : {
        type : Number,
        required : true
    }

});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile