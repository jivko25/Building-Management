//server\controllers\measures\editMeasureController.js
const db = require("../../data/index.js");
const { Measure } = db;
const ApiError = require("../../utils/apiError");

const editMeasure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if(id == 1) {
      throw new ApiError(400, "You cannot edit the default measure");
    }

    const measure = await Measure.findByPk(id);

    if (!measure) {
      throw new ApiError(404, "Measure not found");
    }

    if (name && name !== measure.name) {
      const existingMeasure = await Measure.findOne({
        where: { name, creator_id: req.user.id }
      });

      if (existingMeasure) {
        throw new ApiError(400, `Measure with name "${name}" already exists`);
      }
    }

    await measure.update({ name });

    res.json({
      success: true,
      message: "Measure updated successfully",
      data: measure
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  editMeasure
};
