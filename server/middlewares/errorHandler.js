//server\middlewares\errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error details:", err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      status: "error",
      message: "Validation error",
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  return res.status(500).json({
    success: false,
    status: "error",
    message: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err : undefined
  });
};

module.exports = errorHandler;
