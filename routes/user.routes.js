const { Router } = require("express");
const { createProfile, getusernames, getProfile } = require("../controllers/user.controller");
const Authentication = require("../middleware/auth.middleware");


const router = Router();

router.get('/profile', Authentication, createProfile);
router.get('/getprofile',Authentication,getProfile)
router.get("/getusername",Authentication, getusernames);

module.exports = router;




