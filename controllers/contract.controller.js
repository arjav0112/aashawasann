const Contract =  require('../models/contract.model');

module.exports.createContract = async (req , res) =>{
    try {
        const {
            title ,
            desc ,
            price,
            creatorId,
            projectDeadline,
    
    
        } = req.body;
    
        const userId = req.user;
    
        const contract = new Contract({
    
            title,
            desc,
            price,
            creatorId : creatorId || userId,
            projectDeadline,
        })
    
    
        if(!contract ){
            return res.status(400).json({
                message : "Contract Created Failed"
            })
        }
    
        await contract.save();
    
        return res.status(200).json({
            message : "Contract Created"
        })        
    } catch (error) {
        return res.status(400).json({
            message : "Internal Server Error"
        })
    }

}

module.exports.recieveContract = async (req , res) =>{
    try {
        const contractId = req.params.id;

        const contract = await Contract.findOne({sharingcode : contractId})

        if(!contract){
            return res.status(400).json({
                message : "Contract Not Found"
            })
        }

        return res.status(200).json({
            message : "Contract Found",
            data : contract
        })


    } catch (error) {
        return res.status(400).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.acceptContract = async () =>{
    try {

        const {
            isAccepted,


        } = req.body


        const contractId = req.params.id;

        const contract = await Contract.findOne({sharingcode : contractId})

        if(!contract){
            return res.status(400).json({
                message : "Contract Not Found"
            })


        }


        const updateContract = Contract.findOneAndUpdate({sharingcode : contractId},{isAcceptedTerms: isAccepted },{new:true})
        await updateContract.save()
        
        return res.status(200).json({
            message : "Contract Accepted",
            data : updateContract
        })

        
    } catch (error ) {
        return res.status(400).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.isPaid = async (req , res) =>{
    try {

        const {
            isPaid,
        } = req.body

        const contractId = req.params.id;

        const contract = await Contract
        .findOne({sharingcode : contractId})

        if(!contract){
            return res.status(400).json({
                message : "Contract Not Found"
            })
        }


        const updateContract = Contract.findOneAndUpdate({sharingcode : contractId},{isPaid: isPaid },{new:true})

        await updateContract.save()

        return res.status(200).json({
            message : "Contract Paid",
            data : updateContract
        })


        
    } catch (error) {
        return res.status(400).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.approveContract = async (req , res) =>{
    try {
        const {
            isApproved,
        } = req.body

        const contractId = req.params.id;

        const contract = await Contract.findOne({sharingcode : contractId})


        if(!contract){
            return res.status(400).json({
                message : "Contract Not Found"
            })
        }

        const updateContract = Contract.findOneAndUpdate({sharingcode : contractId},{isApproved: isApproved },{new:true})



        await updateContract.save()

        return res.status(200).json({
            message : "Contract Approved",
            data : updateContract
        })


        
    } catch (error) {
        return res.status(400).json({
            message : "Internal Server Error"
        })
        
    }
}