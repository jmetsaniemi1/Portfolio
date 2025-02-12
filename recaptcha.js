require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RECAPTCHA_SECRET_KEY;
const SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const PROJECT_ID = "citric-adviser-450518-b1"; // Vaihda tarvittaessa oikeaan projektitunnukseen

// Tarkistetaan, että API_KEY ja SITE_KEY on asetettu
if (!API_KEY || !SITE_KEY) {
    console.error("❌ Virhe: RECAPTCHA_SECRET_KEY tai RECAPTCHA_SITE_KEY puuttuu ympäristömuuttujista!");
    process.exit(1); // Lopetetaan prosessi virheen takia
}

const URL = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${API_KEY}`;

async function verifyRecaptcha(token) {
    if (!token) {
        console.error("❌ Virhe: reCAPTCHA-token puuttuu!");
        return { valid: false, reason: "Token missing" };
    }

    try {
        const response = await axios.post(URL, {
            event: {
                token: token,
                expectedAction: "submit",
                siteKey: SITE_KEY
            }
        });

        const data = response.data;
        console.log("🔹 reCAPTCHA vastaus:", JSON.stringify(data, null, 2));

        // Tarkistetaan, onko token validi
        if (data.tokenProperties?.valid) {
            return { valid: true, reason: "Success" };
        } else {
            return { valid: false, reason: data.tokenProperties?.invalidReason || "Unknown error" };
        }

    } catch (error) {
        console.error("❌ Virhe reCAPTCHA-validoinnissa:", error.response ? error.response.data : error.message);
        return { valid: false, reason: "API request failed" };
    }
}

module.exports = { verifyRecaptcha };

