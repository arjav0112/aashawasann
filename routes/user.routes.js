const { Router } = require("express");
const { Cashfree } = require("cashfree-pg"); 
const crypto = require('crypto');
const { createProfile, getusernames,getProfile } = require("../controllers/user.controller");
const Authentication = require("../middleware/auth.middleware");


const router = Router();

Cashfree.XClientId = process.env.XClientId;
Cashfree.XClientSecret = process.env.XClientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateorderid(){
    const uniqueid = crypto.randomBytes(16).toString("hex");

    const hash = crypto.createHash('sha256');
    hash.update(uniqueid);

    const orderId = hash.digest('hex');

    return orderId.substr(0,12)
}

router.post("/orders",async (req,res)=>{
    
    let request = {
      "order_amount": "1",
      "order_currency": "INR",
      "order_id": await generateorderid(),
      "customer_details": {
        "customer_id": "Arjav",
        "customer_name": "sachin sharma",
        "customer_email": "sachin@gmail.com",
        "customer_phone": "9090407368"
      },
    }
  
    Cashfree.PGCreateOrder("2023-08-01",request).then((response) => {
      var a = response.data;
      console.log(a)
    //   console.log("Current Environment:", Cashfree.XEnvironment);

      res.send(a);
    })
      .catch((error) => {
        // console.log("Current Environment:", Cashfree.XEnvironment);
        console.error('Error setting up order request:', error.response.data);
      });
  
})

router.post('/profile', createProfile);
router.post('/getprofile',getProfile)
router.get("/getusername", getusernames);

module.exports = router;




