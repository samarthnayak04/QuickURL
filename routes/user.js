const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user"); // Ensure this path is correct

const router = express.Router();

// POST route to handle signup
router.post("/", handleUserSignup);

router.post("/login", handleUserLogin);

module.exports = router;
