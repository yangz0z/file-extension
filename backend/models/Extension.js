const mongoose = require("mongoose")

const extensionSchema = mongoose.Schema({
    value: {
        type: String,
        trim: true,
        unique: 1,
        minlength: 2,
        maxlength: 20,
        lowercase: true
    },
    fixed: {
        type: Boolean,
        default: false
    },
    used: {
        type: Boolean,
        default: true
    }
})

const Extension = mongoose.model('Extension', extensionSchema)

module.exports = { Extension }