//server\controllers\activity\editActivitiyController.js
const db = require("../../data/index.js");
const Activity = db.Activity;
const ApiError = require("../../utils/apiError");

const editActivity = async (req, res, next) => {
  const activityId = req.params.id;
  const { name, status } = req.body;

  if(activityId == 1) {
    throw new ApiError(400, "You cannot edit the default activity");
  }

  try {
    const activity = await Activity.findByPk(activityId);

    if (!activity) {
      throw new ApiError(404, "Activity not found!");
    }

    if (activity.name !== name) {
      const existingActivity = await Activity.findOne({ where: { name, creator_id: req.user.id } });
      if (existingActivity) {
        throw new ApiError(404, `${name} already exists!`);
      }
    }

    await activity.update({ name, status });

    res.status(200).json({
      message: "Activity updated successfully!",
      activity: activity.toJSON()
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Error updating the activity!", error));
    }
  }
};

module.exports = {
  editActivity
};
