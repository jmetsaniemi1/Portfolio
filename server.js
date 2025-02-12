require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyRecaptcha } = require("./recaptcha"); // Importoidaan validointifunktio

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// reCAPTCHA-tarkistusreitti
app.post("/verify-recaptcha", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: "Token puuttuu" });
    }

    const isValid = await verifyRecaptcha(token);
    res.json({ valid: isValid });
});

// Testireitti
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
