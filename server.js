require("dotenv").config();
console.log("Ladattu API-avain:", process.env.RECAPTCHA_SECRET_KEY);

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000; // 🔹 Käyttää ympäristömuuttujaa tai oletuksena porttia 3000
const API_KEY = process.env.RECAPTCHA_SECRET_KEY;

app.post("/verify-recaptcha", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: "Token puuttuu" });
    }

    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/citric-adviser-450518-b1/assessments?key=${API_KEY}`;

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

        const isValid = data.tokenProperties?.valid || false;
        res.json({ valid: isValid });

    } catch (error) {
        console.error("Virhe reCAPTCHA:n tarkistuksessa:", error);
        res.status(500).json({ success: false, message: "Sisäinen palvelinvirhe" });
    }
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Testireitti
app.get("/", (req, res) => {
    res.send("Server is running!");
});
