const express = require("express")
const router = express.Router()
const { signup, login, createAdmin, getAllUsers, deleteUser } = require("../controllers/userController")
const { validateSignup, validateLogin } = require("../middlewares/validation")

router.post("/signup", validateSignup, signup)
router.post("/login", validateLogin, login)
router.post("/create/admin", createAdmin)
router.get("/getusers", getAllUsers)
router.delete("/:userId", deleteUser)

module.exports = router