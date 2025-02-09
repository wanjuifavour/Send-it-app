const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { executeStoredProcedure } = require("../config/database")
const { sendWelcomeEmail } = require("../services/emailService")

exports.signup = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await executeStoredProcedure("sp_CreateUser", {
            username,
            email,
            password: hashedPassword,
        })

        const userId = result.recordset[0].id

        // Send welcome email
        await sendWelcomeEmail(email, username)

        res.status(201).json({ message: "User created successfully", userId })
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await executeStoredProcedure("sp_GetUserByEmail", { email })
        const user = result.recordset[0]

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.json({ token })
        } else {
            res.status(401).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message })
    }
}