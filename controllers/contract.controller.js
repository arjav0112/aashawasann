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