const express = require("express");
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require("axios");

// Helper: map integer congestion_level to status string
function getCongestionStatus(level) {
  if (level >= 70) return "High";
  if (level >= 30) return "Medium";
  return "Low";
}

// ✅ Receive IoT data from ESP32, get ML prediction, and broadcast
router.post("/data", async (req, res) => {
  console.log("Incoming IoT Data:", req.body);

  try {
    const { active_users, latency, throughput, packet_loss, signal_strength } = req.body;

    // 1. Get prediction from ML service
    let predicted_congestion = 0;
    let predicted_future_congestion = null;
    
    try {
      const mlResponse = await axios.post("http://localhost:8000/predict", {
        active_users: active_users || 0,
        latency: latency || 0,
        throughput: throughput || 0,
        packet_loss: packet_loss || 0,
        signal_strength: signal_strength || 0
      });
      predicted_congestion = mlResponse.data.congestion_level;
      predicted_congestion = predicted_congestion * 40 + 10; // Simple mapping: 0->10, 1->50, 2->90
      
      try {
        const forecastResponse = await axios.post("http://localhost:8000/predict/forecast", {
          active_users: active_users || 0,
          latency: latency || 0,
          throughput: throughput || 0,
          packet_loss: packet_loss || 0,
          signal_strength: signal_strength || 0
        });
        predicted_future_congestion = forecastResponse.data.future_congestion_level;
        predicted_future_congestion = predicted_future_congestion * 40 + 10;
      } catch (forecastError) {
        console.error("Forecast ML Service Error:", forecastError.message);
      }
    } catch (mlError) {
      console.error("ML Service Error:", mlError.message);
      predicted_congestion = Math.floor(Math.random() * 30); // Default to low random if ML is down
    }

    // 2. Save to database
    const metric = await prisma.networkMetric.create({
      data: {
        active_users: active_users || 0,
        latency: latency || 0.0,
        throughput: throughput || 0.0,
        congestion_level: predicted_congestion,
        future_congestion: predicted_future_congestion,
        // If your prisma schema doesn't have packet_loss/signal_strength yet, 
        // they won't be saved but they ARE used for prediction.
      }
    });

    // Build the payload we send to the dashboard
    const payload = {
      id: metric.id,
      active_users: metric.active_users,
      latency: metric.latency,
      throughput: metric.throughput,
      congestion_level: metric.congestion_level,
      future_congestion: metric.future_congestion,
      congestionStatus: getCongestionStatus(metric.congestion_level),
      futureCongestionStatus: metric.future_congestion !== null ? getCongestionStatus(metric.future_congestion) : null,
      timestamp: metric.timestamp,
      time: new Date(metric.timestamp).toLocaleTimeString([], {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
    };

    // Emit to all connected WebSocket clients
    const io = req.app.get("io");
    if (io) {
      io.emit("new_metric", payload);
    }

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
      future_congestion: m.future_congestion,
      congestionStatus: getCongestionStatus(m.congestion_level),
      futureCongestionStatus: m.future_congestion !== null ? getCongestionStatus(m.future_congestion) : null,
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