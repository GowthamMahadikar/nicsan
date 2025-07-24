
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mongo connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("✅ Connected to MongoDB"));

const FormSubmission = require("./models/FormSubmission");

// Routes
app.get("/", (_req, res) => {
  res.json({ status: "OK", message: "Health Cover API running" });
});

app.post("/api/submit", async (req, res) => {
  try {
    const doc = new FormSubmission(req.body);
    await doc.save();
    res.status(201).json({ message: "Form saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save form data" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
