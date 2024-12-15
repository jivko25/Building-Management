//server\controllers\workItems\getWorkItemControllerById.js
const db = require("../../data/index.js");
const { WorkItem } = db;
const ApiError = require("../../utils/apiError");

const getWorkItemById = async (req, res, next) => {
  const workItemId = req.params.id;

  try {
    const workItem = await WorkItem.findByPk(workItemId);

    if (!workItem) {
      throw new ApiError(404, "Work item not found!");
    }

    res.json(workItem);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getWorkItemById
};
