const express = require("express");
const router = express.Router();
const iotController = require("../controllers/iotController");

router.post("/data", iotController.receiveData);
router.get("/metrics", iotController.getLatestMetrics);

module.exports = router;
