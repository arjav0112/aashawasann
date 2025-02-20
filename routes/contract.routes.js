const { Router } = require("express");
const { createContract } = require("../controllers/contract.controller");
const Authentication = require("../middleware/auth.middleware");

const router = Router();

router.post('/create', Authentication ,createContract);
router.get("/recieve/:id",Authentication,) //id : sharing code
router.post("/accept/:id", Authentication,); //id : sharing code
router.post('/ispaid/:id',Authentication)
router.post("/approve/:id",Authentication , )
module.exports = router;




