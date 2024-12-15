//server\utils\hashPassword.js
const bcrypt = require("bcrypt");

const hashPassword = async password => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

const plainPassword = "password";

hashPassword(plainPassword);

module.exports = hashPassword;
