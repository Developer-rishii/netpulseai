const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Attempting to save test metric...");
    const metric = await prisma.networkMetric.create({
      data: {
        active_users: 35,
        latency: 21.6,
        throughput: 94.5,
        congestion_level: 50
      }
    });
    console.log("Success! Metric saved:", metric);
  } catch (error) {
    console.error("FAILED to save metric:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
