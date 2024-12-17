//server\middlewares\authenticateToken.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized token"
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token"
      });
    }

    req.user = {
      id: decodedToken.userId,
      role: decodedToken.role,
      username: decodedToken.username
    };

    console.log("Set user in request:", req.user);

    next();
  } catch (error) {
    console.log("Verification error", error);
    return res.status(401).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = authenticateToken;
