const mongoose = require('mongoose');

const Users = mongoose.model('User', new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    createUserToken: {type: String,select: false},
    active: {type: Boolean},
    passwordResetToken: {type: String,select: false},
    passwordResetExpires: {type: Date,select: false},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
}))

module.exports = Users