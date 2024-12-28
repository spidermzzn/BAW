const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Use Helmet to configure Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "style-src-elem": ["'self'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Confession Schema
const confessionSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Confession = mongoose.model("Confession", confessionSchema);

// API routes
app.get("/api/confessions", async (req, res) => {
  const confessions = await Confession.find().sort({ timestamp: -1 });
  res.json(confessions);
});

app.post("/api/confessions", async (req, res) => {
  const { content, timestamp } = req.body;
  const newConfession = new Confession({ content, timestamp });
  await newConfession.save();
  res.status(201).json(newConfession);
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
