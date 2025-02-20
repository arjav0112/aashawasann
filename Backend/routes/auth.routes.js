const { Router } = require("express");
const { login, logout, register } = require("../controllers/auth.controller");
const Authentication = require("../middleware/auth.middleware");

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout',Authentication ,logout);


module.exports = router;