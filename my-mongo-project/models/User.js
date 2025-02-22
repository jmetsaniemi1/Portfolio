const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" },
    is_active: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
