const { Router } = require("express");
const { createProfile, getusernames,getProfile } = require("../controllers/user.controller");
const Authentication = require("../middleware/auth.middleware");


const router = Router();

router.post('/profile', createProfile);
router.post('/getprofile',getProfile)
router.get("/getusername", getusernames);

module.exports = router;




