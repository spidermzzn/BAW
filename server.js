const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/confessions", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
const PORT = 5005;
const DOMAIN = "blockingallwomen.com"; // Your domain name
app.listen(PORT, () => {
  console.log(`Server running on http://${DOMAIN}:${PORT}`);
});

// Deployment Notes:
// - Ensure your domain is configured to point to your server's IP address or hosting environment.
// - If using HTTPS, set up an SSL certificate for secure communication (e.g., with Let's Encrypt).
// - Update the frontend to use the appropriate domain for API calls if needed.
// - Consider using a reverse proxy like Nginx or Apache for better performance and routing with your domain name.
