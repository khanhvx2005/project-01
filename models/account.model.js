const mongoose = require('mongoose');
const generate = require('../helpers/generate.helper')
const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,

        password: String,
        phone: String,
        avatar: String,
        token: {
            type: String,
            default: generate.generateRandomString(20)
        },
        role_id: String,
        status: String,

        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, { timestamps: true });
const Account = mongoose.model('Account', accountSchema, "account");
module.exports = Account;