require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyRecaptcha } = require("./recaptcha");

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://www.johannesportfolio.space'],
    methods: ['GET', 'POST'],
    credentials: true
}));

const PORT = process.env.PORT || 3000;

// reCAPTCHA-tarkistusreitti
app.post("/verify-recaptcha", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ 
                valid: false, 
                message: "Token puuttuu" 
            });
        }

        const result = await verifyRecaptcha(token);
        res.json(result);

    } catch (error) {
        console.error("Virhe reCAPTCHA validoinnissa:", error);
        res.status(500).json({ 
            valid: false, 
            message: "Validointi epäonnistui" 
        });
    }
});

// Testireitti
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
