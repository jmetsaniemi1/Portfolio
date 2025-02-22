const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" },
    is_active: { type: Boolean, default: true }
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String,
    role: String
  }, { collection: 'Users' }); // Pakotetaan käyttämään 'Users' kokoelmaa

const User = mongoose.model('User', userSchema);

module.exports = User;
