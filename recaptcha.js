const axios = require("axios");

const API_KEY = "AIzaSyDYXon8COmACykBJlTfKEF8jOieaSCfMmg"; // Korvaa tämä omalla API-avaimellasi
const URL = `https://recaptchaenterprise.googleapis.com/v1/projects/citric-adviser-450518-b1/assessments?key=${API_KEY}`;

async function verifyRecaptcha(token) {
    try {
        const response = await axios.post(URL, {
            event: {
                token: token, // Vaihda tähän oikea frontendin luoma token
                expectedAction: "USER_ACTION",
                siteKey: "6Lfru9MqAAAAAHLMCch59VAR51mQEMLpyh5Xms_a"
            }
        });

        console.log("reCAPTCHA vastaus:", response.data);
    } catch (error) {
        console.error("Virhe reCAPTCHA-validoinnissa:", error.response ? error.response.data : error.message);
    }
}

// Testaa tätä kutsumalla verifyRecaptcha('YOUR_TEST_TOKEN')
verifyRecaptcha("YOUR_TEST_TOKEN"); // Vaihda tähän testitoken
