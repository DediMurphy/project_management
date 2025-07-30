import { verifyAccessToken } from "../utils/jwt.js";

function authMiddleware(req, res, next) {
  let token = null;

  // Ambil dari Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Atau fallback ke cookie (jika kamu gunakan)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // Jika token tidak ditemukan
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verifikasi token
  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    console.log("Token decode error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
    
  }
}

export default authMiddleware;