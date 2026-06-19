import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

export const verifyAdmin = requireRole("admin");
export const verifyWriter = requireRole("writer", "admin");
export const verifyUser = requireRole("user", "writer", "admin");

export async function optionalJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
  } catch {
    // Public routes continue without a user
  }
  next();
}
