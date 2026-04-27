const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: map integer congestion_level to status string
function getCongestionStatus(level) {
  if (level >= 70) return "High";
  if (level >= 30) return "Medium";
  return "Low";
}

// ✅ Receive IoT data from ESP32, save to DB, and broadcast via WebSocket
router.post("/data", async (req, res) => {
  console.log("Incoming IoT Data:", req.body);

  try {
    const { active_users, latency, throughput, congestion_level } = req.body;

    const resolvedCongestion = congestion_level != null
      ? congestion_level
      : Math.floor(Math.random() * 100);

    // Save to database
    const metric = await prisma.networkMetric.create({
      data: {
        active_users: active_users || 0,
        latency: latency || 0.0,
        throughput: throughput || 0.0,
        congestion_level: resolvedCongestion,
      }
    });

    // Build the payload we send to the dashboard
    const payload = {
      id: metric.id,
      active_users: metric.active_users,
      latency: metric.latency,
      throughput: metric.throughput,
      congestion_level: metric.congestion_level,
      congestionStatus: getCongestionStatus(metric.congestion_level),
      timestamp: metric.timestamp,
      time: new Date(metric.timestamp).toLocaleTimeString([], {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
    };

    // Emit to all connected WebSocket clients
    const io = req.app.get("io");
    if (io) {
      io.emit("new_metric", payload);
      console.log("Broadcasted metric to WebSocket clients:", metric.id);
    }

    console.log("Saved metric:", metric.id);
    res.json({ status: "ok", data: payload });
  } catch (error) {
    console.error("Error saving IoT data:", error);
    res.status(500).json({ status: "error", message: "Failed to save data" });
  }
});

// ✅ Fetch recent metrics for the dashboard (historical data on page load)
router.get("/metrics", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;

    const metrics = await prisma.networkMetric.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    // Reverse so oldest is first (for charts to render left-to-right)
    const formatted = metrics.reverse().map((m) => ({
      id: m.id,
      active_users: m.active_users,
      latency: m.latency,
      throughput: m.throughput,
      congestion_level: m.congestion_level,
      congestionStatus: getCongestionStatus(m.congestion_level),
      timestamp: m.timestamp,
      time: new Date(m.timestamp).toLocaleTimeString([], {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
    }));

    res.json({ status: "ok", data: formatted });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch metrics" });
  }
});

// Optional test route
router.get("/data", (req, res) => {
  res.send("IoT route working");
});

module.exports = router;