const express = require("express");
const router = express.Router();
const { registerMember, login } = require("../controllers/authController");

router.post("/register", registerMember);
router.post("/login", login);

module.exports = router;
