//server\utils\generateTokenCookieSetter.js
const jwt = require("jsonwebtoken");

const generateTokenSetCookie = (res, user) => {
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict",
    maxAge: 180 * 60 * 60 * 1000
  });

  return token;
};

module.exports = {
  generateTokenSetCookie
};
