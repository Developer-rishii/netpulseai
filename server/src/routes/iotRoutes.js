const express = require("express");
const router = express.Router();
const iotController = require("../controllers/iotController");

router.post("/data", (req, res) => {
  console.log("Incoming IoT Data:", req.body);
  res.json({ status: "ok" });
});

router.get("/metrics", iotController.getLatestMetrics);

module.exports = router;
