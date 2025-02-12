require("dotenv").config();  // Lataa ympäristömuuttujat .env-tiedostosta
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json()); // Sallii JSON-pyyntöjen käsittelyn
app.use(cors()); // Sallii frontendin ja backendin väliset pyynnöt

const PORT = 3000;
const API_KEY = process.env.RECAPTCHA_SECRET_KEY; // Haetaan ympäristömuuttuja

// ✅ 2️⃣ Reitti reCAPTCHA:n validointiin
app.post("/verify-recaptcha", async (req, res) => {
    const { token } = req.body; // Haetaan token frontendista

    if (!token) {
        return res.status(400).json({ success: false, message: "Token puuttuu" });
    }

    // 🔹 Google reCAPTCHA API-kutsu
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/YOUR_PROJECT_ID/assessments?key=${API_KEY}`;
    
    const requestBody = {
        event: {
            token: token,
            expectedAction: "submit",
            siteKey: "6Lfru9MqAAAAAHLMCch59VAR51mQEMLpyh5Xms_a"
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("reCAPTCHA verification response:", data);

        // Tarkistetaan onko reCAPTCHA validi
        const isValid = data.tokenProperties?.valid || false;
        res.json({ valid: isValid });

    } catch (error) {
        console.error("Virhe reCAPTCHA:n tarkistuksessa:", error);
        res.status(500).json({ success: false, message: "Sisäinen palvelinvirhe" });
    }
});

// ✅ 3️⃣ Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
