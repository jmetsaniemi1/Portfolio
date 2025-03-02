require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');

const app = express(); // 🟢 Alustetaan `app` ennen käyttöä

app.use(express.json());

// ✅ CORS-asetukset oikeassa kohdassa
app.use(cors({
    origin: "https://www.johannesportfolio.space",
    credentials: true
}));



const uri = process.env.MONGO_URI; 
const SECRET_KEY = process.env.JWT_SECRET;

// MongoDB-yhteyden testaus
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


// MongoDB-yhteyden muodostus
async function connectToDatabase() {
  try {
    console.log(`🛠 Connecting to MongoDB with URI: ${process.env.MONGO_URI}`); // 🔥 Debug-tulostus
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected to: ${mongoose.connection.db.databaseName}`); // Muutettu varmistaakseni tietokannan nimen
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
connectToDatabase();




// Luo admin-käyttäjä, jos sitä ei ole
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

// Rekisteröinti
app.post("/register", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Tarkistetaan, että kaikki kentät on täytetty
      if (!email || !password) {
          return res.status(400).json({ message: "Sähköposti ja salasana ovat pakollisia." });
      }

      // Tarkistetaan, että sähköposti on validi
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Virheellinen sähköpostiosoite." });
      }

      // Tarkistetaan salasanan pituus
      if (password.length < 6) {
          return res.status(400).json({ message: "Salasanan on oltava vähintään 6 merkkiä pitkä." });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
          return res.status(400).json({ message: "Sähköposti on jo käytössä." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, passwordHash: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: "Rekisteröinti onnistui." });

  } catch (error) {
      console.error("❌ Rekisteröintivirhe:", error);
      res.status(500).json({ message: "Palvelinvirhe rekisteröinnissä." });
  }
});



// Kirjautuminen
app.post("/login", async (req, res) => {
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

        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET is not defined in environment variables!");
        }

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Pääsivun testireitti
app.get("/", (req, res) => {
  res.send("Backend toimii!");
});

// Palvelimen käynnistys
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

// JWT token verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Delete account endpoint
app.delete("/delete-account", verifyToken, async (req, res) => {
    console.log('🔹 Delete account request received');

    try {
        const userId = req.user.id; // Tokenista saatu käyttäjän ID
        console.log('🔹 Attempting to delete user with ID:', userId);

        // Tarkistetaan, että käyttäjä on olemassa
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found:', userId);
            return res.status(404).json({ message: "User not found" });
        }

        // Poistetaan käyttäjä PortfolioDatabase.Users -kokoelmasta
        console.log('🔹 Deleting user from database...');
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            console.log('❌ Failed to delete user:', userId);
            return res.status(500).json({ message: "Failed to delete user" });
        }

        console.log('✅ User deleted successfully:', userId);

        // (Valinnainen) Poistetaan käyttäjän mahdolliset muut tiedot muista tauluista
        console.log('🔹 Deleting related user data...');
        const deletedPosts = await UserPosts.deleteMany({ userId });
        console.log('🔹 Deleted user posts:', deletedPosts.deletedCount);

        const deletedSettings = await UserSettings.deleteMany({ userId });
        console.log('🔹 Deleted user settings:', deletedSettings.deletedCount);

        console.log('✅ All user data deleted successfully');
        res.json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("❌ Error in delete account process:", error);
        res.status(500).json({ message: "Server error while deleting account" });
    }
});



