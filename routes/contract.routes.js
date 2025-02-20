const { Router } = require("express");
const { createContract, acceptContract, isPaid, approveContract, recieveContract } = require("../controllers/contract.controller");
const Authentication = require("../middleware/auth.middleware");

const router = Router();

router.post('/create', Authentication , createContract);
router.post("/recieve/:id",Authentication , recieveContract)
router.post("/accept/:id", Authentication , acceptContract); //id : sharing code
router.post('/ispaid/:id',Authentication , isPaid);
router.post("/approve/:id",Authentication , approveContract);

module.exports = router;