const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const mariadb = require("mariadb");

const dbUrl = new URL(process.env.DATABASE_URL);

// Explicitly parse credentials to avoid system user fallback on Windows
const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username || "root",
  password: dbUrl.password || "",
  database: dbUrl.pathname.substring(1),
  // Configuration to ensure it doesn't use environment variables like USERNAME
  noConfig: true,
  compress: false, // Sometimes helps with local connections
};

console.log(`[DB] initializing connection to ${dbConfig.host}:${dbConfig.port} as user "${dbConfig.user}"`);

const pool = mariadb.createPool(dbConfig);
const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({ 
  adapter,
  // Optional: add logging to help debug
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
