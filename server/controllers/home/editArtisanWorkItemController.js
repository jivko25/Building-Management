//server\controllers\home\editArtisanWorkItemController.js
const db = require("../../data/index.js");
const { WorkItem } = db;
const ApiError = require("../../utils/apiError");
const editWorkItem = async (req, res, next) => {
  const workItemId = req.params.id;
  const taskId = req.params.taskId;
  const { name, start_date, end_date, note, finished_work, status } = req.body;

  try {
    const existingWorkItem = await WorkItem.findByPk(workItemId);

    if (!existingWorkItem) {
      throw new ApiError(404, "Work item not found!");
    }

    if (existingWorkItem.name !== name) {
      const duplicateName = await WorkItem.findOne({ where: { name } });
      if (duplicateName) {
        throw new ApiError(404, `${name} already exists!`);
      }
    }

    await existingWorkItem.update({
      task_id: taskId,
      name,
      start_date,
      end_date,
      note,
      finished_work,
      status
    });

    res.status(200).json({
      message: "Work item updated successfully!",
      project: existingWorkItem
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Error updating the work item!", error));
    }
  }
};

module.exports = {
  editWorkItem
};
