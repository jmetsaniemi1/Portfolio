const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    is_active: { type: Boolean, default: true }
}, { collection: 'Users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;

