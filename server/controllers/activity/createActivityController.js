//server\controllers\activity\createActivityController.js
const db = require("../../data/index.js");
const { Activity } = db;
const ApiError = require("../../utils/apiError");

const createActivity = async (req, res, next) => {
  try {
    const { name, status } = req.body;

    const existingActivity = await Activity.findOne({
      where: { name, creator_id: req.user.id }
    });

    if (existingActivity) {
      throw new ApiError(400, `Activity with name "${name}" already exists`);
    }

    const newActivity = await Activity.create({
      name,
      status,
      creator_id: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Activity created successfully!",
      data: newActivity
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!"));
    }
  }
};

module.exports = {
  createActivity
};
