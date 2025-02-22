require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// 🔹 Haetaan käyttäjämalli
const User = require('./models/User');

// 🔹 Haetaan ympäristömuuttujista MongoDB:n URI
const uri = process.env.MONGO_URI; 

// 🔹 Testataan yhteys MongoDB:hen
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

// 🔹 Yhdistetään MongoDB-tietokantaan (päivitetty ilman vanhentuneita asetuksia)
async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Lopetetaan ohjelma, jos yhteys epäonnistuu
  }
}
connectToDatabase();

// 📌 **Funktio admin-käyttäjän luomiseen**
async function createAdminUser() {
    try {
        // Tarkistetaan, onko admin-käyttäjä jo olemassa
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (!existingAdmin) {
            // Luodaan suolattu hash-salasana
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

            // Lisätään admin-käyttäjä tietokantaan
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

// 🔹 Kutsutaan funktiota palvelimen käynnistyessä
createAdminUser();

// 🔹 Luodaan Express-palvelin
const app = express();
app.use(express.json());
app.use(cors());

// 📌 **Kirjautumisreitti**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Haetaan käyttäjä tietokannasta
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // 🔹 Tarkistetaan salasana
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        // 🔹 Luodaan JWT-token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Käynnistetään palvelin
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// Login modal send data to database for check up

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, role: user.role });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});


// test backend
app.get("/", (req, res) => {
  res.send("Backend toimii!");
});
