//server\controllers\home\getArtisanTaskProjectController.js
const db = require("../../data/index.js");
const { Task, Project, WorkItem, Company } = db;
const ApiError = require("../../utils/apiError");

const getTaskWithProject = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const taskProjectData = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Project,
          as: "project",
          include: [
            {
              model: Company,
              as: "company",
              attributes: ["name"]
            }
          ],
          attributes: [
            ["name", "project_name"],
            ["address", "project_address"],
            ["start_date", "project_start_date"],
            ["end_date", "project_end_date"],
            ["status", "project_status"]
          ]
        }
      ]
    });

    if (!taskProjectData) {
      throw new ApiError(404, "Task not found!");
    }

    const workItemsData = await WorkItem.findAll({
      where: { task_id: taskId }
    });

    return res.status(200).json({
      taskProjectData,
      workItemsData
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error.message);
    } else {
      console.log(error);
      next(new ApiError(500, "Internal server error!"));
    }
  }
};

module.exports = {
  getTaskWithProject
};
