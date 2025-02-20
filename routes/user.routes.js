const { Router } = require("express");
const { createProfile, getusernames } = require("../controllers/user.controller");
const Authentication = require("../middleware/auth.middleware");


const router = Router();

router.get('/profile', Authentication, createProfile);
router.get("/getusername",Authentication, getusernames);

module.exports = router;




