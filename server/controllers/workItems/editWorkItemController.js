//server\controllers\workItems\editWorkItemController.js
const db = require("../../data/index.js");
const { WorkItem } = db;
const ApiError = require("../../utils/apiError");

const editWorkItem = async (req, res, next) => {
  const workItemId = req.params.id;
  const taskId = req.params.task_id;
  const { name, start_date, end_date, note, finished_work, status } = req.body;

  try {
    const workItem = await WorkItem.findByPk(workItemId);
    if (!workItem) {
      throw new ApiError(404, "Work item not found!");
    }

    if (workItem.name !== name) {
      const existingWorkItem = await WorkItem.findOne({ where: { name } });
      if (existingWorkItem) {
        throw new ApiError(400, `${name} already exists!`);
      }
    }

    const updatedWorkItem = await workItem.update({
      task_id: taskId,
      name,
      start_date,
      end_date,
      note,
      finished_work,
      status
    });

    res.json({
      message: "Work item updated successfully!",
      workItem: updatedWorkItem
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
  editWorkItem
};
