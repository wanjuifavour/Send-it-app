const express = require("express")
const router = express.Router()
const { signup, login, createAdmin } = require("../controllers/userController")
const { validateSignup, validateLogin } = require("../middlewares/validation")

router.post("/signup", validateSignup, signup)
router.post("/login", validateLogin, login)
router.post("/admin/create", createAdmin)

module.exports = router