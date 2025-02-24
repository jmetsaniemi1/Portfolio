const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const hashedPassword = await bcrypt.hash("VahvaSalasana123", 10); // 🔹 Hashataan salasana

        const admin = new User({
            email: "jmetsaniemi@me.com",
            passwordHash: hashedPassword, // 🔹 Tallennetaan hashattu versio!
            role: "admin"
        });

        await admin.save();
        console.log("✅ Admin user created successfully.");
    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        mongoose.connection.close();
    }
}

createAdminUser();

