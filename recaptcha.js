require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.RECAPTCHA_SECRET_KEY;
const PROJECT_ID = "citric-adviser-450518-b1"; // Varmista että tämä on oikea projekti-ID

// Tarkistetaan, että API_KEY on asetettu
if (!API_KEY) {
    console.error("❌ Virhe: RECAPTCHA_SECRET_KEY puuttuu ympäristömuuttujista!");
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
                siteKey: process.env.RECAPTCHA_SITE_KEY
            }
        });

        const data = response.data;
        console.log("🔹 reCAPTCHA vastaus:", JSON.stringify(data, null, 2));

        // Enterprise-version tarkistus
        if (data.tokenProperties?.valid && data.riskAnalysis?.score >= 0.5) {
            return { valid: true, score: data.riskAnalysis.score };
        } else {
            return { 
                valid: false, 
                reason: data.tokenProperties?.invalidReason || "Score too low",
                score: data.riskAnalysis?.score
            };
        }

    } catch (error) {
        console.error("❌ Virhe reCAPTCHA-validoinnissa:", error.response ? error.response.data : error.message);
        return { valid: false, reason: "API request failed" };
    }
}

module.exports = { verifyRecaptcha };

