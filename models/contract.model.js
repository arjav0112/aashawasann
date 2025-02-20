const mongoose =  require("mongoose");


const contract = new mongoose.Schema({

    sharingcode : {
        type: String,
    },
    title : {
        type : String
    },
    desc : {
        type : String
    },
    price : {
        type : Number
    },
    projectDeadline : {
        type : Date
    },
    pdfLink : {
        type : String
    },
    creatorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    acceptorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    contractStatus : {
        type : Boolean
    },
    isPaid : {
        type :  Boolean,
        default : false
    },
    paidAmount : {
        type : Number
    },
    isAcceptedTerms : {
        type : Boolean,
        default : false
    },
    isApproved : {
        type : Boolean,
        default : false
    }
    


}, { timestamps: true })



const Contract = mongoose.model("Contract", contract);

module.exports = Contract


