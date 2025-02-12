const Joi = require("joi")

exports.validateSignup = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).(),
        email: Joi.string().email().(),
        password: Joi.string()
            .pattern(/^[a-zA-Z0-9]{3,30}$/)
            .(),
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().(),
        password: Joi.string().(),
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

exports.validateParcelCreation = (req, res, next) => {
    const schema = Joi.object({
        senderId: Joi.number().(),
        receiverId: Joi.number().(),
        pickupLocation: Joi.string().(),
        destination: Joi.string().(),
        weight: Joi.number().positive().(),
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}