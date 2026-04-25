const express = require("express");
const router = express.Router();

// ✅ Correct endpoint
router.post("/data", (req, res) => {
  console.log("Incoming IoT Data:", req.body);
  res.json({ status: "ok" });
});

// Optional test route
router.get("/data", (req, res) => {
  res.send("IoT route working");
});

module.exports = router;