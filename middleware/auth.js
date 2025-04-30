import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token =
    req.headers["authorization"] || req.body.token || req.query.token;

  if (!token) {
    return res.status(403).json({ success: false, msg: "Token is required" });
  }

  try {
    let bearerToken = token;
    if (typeof token === "string" && token.toLowerCase().startsWith("bearer")) {
      const tokenMatch = token.match(/bearer\s+(.*)/i);
      bearerToken = tokenMatch ? tokenMatch[1] : null;
    }

    if (!bearerToken) {
      throw new Error("Token format invalid");
    }

    const decoded = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded.user) {
      throw new Error("Invalid token structure");
    }

    // Pass the complete decoded user object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};

export default verifyToken;
