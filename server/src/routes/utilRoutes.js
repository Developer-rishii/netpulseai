const express = require("express");
const router = express.Router();
const speedTestController = require("../controllers/speedTestController");

router.get("/speedtest", speedTestController.runSpeedTest);

module.exports = router;
