const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000/predict";

exports.receiveData = async (req, res) => {
  try {
    const { active_users, latency, throughput } = req.body;

    if (active_users === undefined || latency === undefined || throughput === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Get prediction from ML service
    let congestion_level = 0;
    try {
      const response = await axios.post(ML_SERVICE_URL, {
        active_users,
        latency,
        throughput
      });
      congestion_level = response.data.congestion_level;
    } catch (mlError) {
      console.error("ML Service Error:", mlError.message);
      // Fallback or default value if ML service is down
      congestion_level = 0; 
    }

    // 2. Save to database
    const newMetric = await prisma.networkMetric.create({
      data: {
        active_users: parseInt(active_users),
        latency: parseFloat(latency),
        throughput: parseFloat(throughput),
        congestion_level: parseInt(congestion_level)
      }
    });

    res.status(201).json({
      message: "Data received and stored",
      data: newMetric
    });
  } catch (error) {
    console.error("IoT Controller Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLatestMetrics = async (req, res) => {
  try {
    const metrics = await prisma.networkMetric.findMany({
      take: 20,
      orderBy: {
        timestamp: 'desc'
      }
    });
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching metrics" });
  }
};
