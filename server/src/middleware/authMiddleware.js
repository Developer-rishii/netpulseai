const jwt = require("jsonwebtoken");
const prisma = require("../lib/db");

const JWT_SECRET = process.env.JWT_SECRET || "netpulse_secret_key";


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, company: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
