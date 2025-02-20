require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Yhteys MongoDB:hen onnistui!");
  } catch (error) {
    console.error("❌ Yhteys epäonnistui:", error);
  }
}
run();

app.get('/test-connection', (req, res) => {
  res.json({ message: "Yhteys tietokantaan toimii!" });
});

app.listen(port, () => {
  console.log(`🌍 Serveri käynnissä portissa ${port}`);
});
