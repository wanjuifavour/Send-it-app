const Joi = require("joi")

exports.validateSignup = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(/^[a-zA-Z0-9]{3,30}$/)
            .required(),
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

exports.validateParcelCreation = (req, res, next) => {
    const schema = Joi.object({
        senderId: Joi.number().required(),
        receiverId: Joi.number().required(),
        senderLocation: Joi.string().required(),
        destination: Joi.string().required(),
        weight: Joi.number().positive().required(),
        adminId: Joi.number().required()
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

exports.validateSmsRequest =(req, res, next) => {
    const smsSchema = Joi.object({
        receiverPhone: Joi.string()
            .pattern(/^(?:254|\+254|0)?(7[0-9]{8})$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number error. Please provide a valid phone number'
            }),
        receiverName: Joi.string().required(),
        senderLocation: Joi.string().required(),
        destination: Joi.string().required()
    })

    const { error } = smsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false,
                message: error.details[0].message 
            });
        }
        next();
}