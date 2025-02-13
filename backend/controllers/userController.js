const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { executeStoredProcedure } = require("../config/database")
const { sendWelcomeEmail } = require("../services/emailService")

exports.signup = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const existingUser = await executeStoredProcedure("sp_GetUserByEmail", { email })
        if (existingUser.recordset.length > 0) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await executeStoredProcedure("sp_CreateUser", {
            username,
            email,
            password: hashedPassword,
            isAdmin: false
        })

        const userId = result.recordset[0].id
        const isAdmin = result.recordset[0].isAdmin

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: userId,
                email,
                username,
                isAdmin: isAdmin
            }
        })

        await sendWelcomeEmail(email, username)
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await executeStoredProcedure("sp_GetUserByEmail", { email })
        const user = result.recordset[0]

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message })
    }
}

exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const existingUser = await executeStoredProcedure("sp_GetUserByEmail", { email })
        if (existingUser.recordset.length > 0) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await executeStoredProcedure("sp_CreateUser", {
            username,
            email,
            password: hashedPassword,
            isAdmin: true
        })

        const userId = result.recordset[0].id
        const isAdmin = result.recordset[0].isAdmin

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(201).json({
            message: "Admin created successfully",
            token,
            user: {
                id: userId,
                email,
                username,
                isAdmin: isAdmin
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 100;
        
        const result = await executeStoredProcedure("sp_GetAllUsers", {
            page,
            pageSize
        });
        
        res.json({
            users: result.recordset,
            totalUsers: result.recordset[0]?.totalUsers || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}