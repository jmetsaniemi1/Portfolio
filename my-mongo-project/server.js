require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const uri = process.env.MONGO_URI; 

async function testMongoConnection() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged MongoDB: Yhteys onnistui!");
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error);
  } finally {
    await client.close();
  }
}
testMongoConnection();

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
connectToDatabase();

async function createAdminUser() {
    try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

            const adminUser = new User({
                username: "admin",
                email: process.env.ADMIN_EMAIL,
                passwordHash: passwordHash,
                role: "admin",
                is_active: true
            });

            await adminUser.save();
            console.log("✅ Admin user created successfully.");
        } else {
            console.log("ℹ️ Admin user already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
    }
}
createAdminUser();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    console.log("🔹 Login request received:", req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "User not found" });
        }

        console.log("🔹 User found in database:", user.email);

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            console.log("❌ Invalid password for:", email);
            return res.status(400).json({ message: "Invalid password" });
        }

        console.log("✅ Password correct, generating JWT token");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend toimii!");
});
