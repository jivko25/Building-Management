//server\controllers\workItems\getWorkItemsController.js
const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, Task, Artisan, Project, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const getWorkItems = async (req, res, next) => {
  const { task_id } = req.params;
  const isAdmin = req.user.role === "admin";

  try {
    if (isAdmin) {
      const workItems = await WorkItem.findAll({
        where: {
          task_id
        },
        include: [
          { model: Artisan, as: "artisan" }
        ],
        order: [["id", "DESC"]]
      });

      const task = await Task.findOne({
        where: {
          id: task_id
        }
      })

      return res.json({
        workItems: workItems,
        task
      });
    }
    
    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id,
        id: req.params.project_id
      },
    });

    if (projects.length === 0) {
      throw new ApiError(404, "No projects found for current user");
    }

    const taskIds = projects.map(project => project.task_id);
    if (taskIds.length === 0) {
      throw new ApiError(404, "No tasks found for current user");
    }

    const workItems = await WorkItem.findAll({
      where: { task_id },
      include: [
        {
          model: Task,
          as: "task",
          attributes: ["name", "total_price", "total_work_in_selected_measure", "status"],
        },
        { model: Activity, as: "activity" },
        { model: Measure, as: "measure" },
        { model: Artisan, as: "artisan" }
      ],
      order: [["id", "DESC"]]
    });

    const task = await Task.findOne({
      where: {
        id: task_id
      },
      include: [
        {
          model: Artisan,
          as: "artisans",
          through: { attributes: [] }
        },
      ],
    })

    res.json({
      workItems: workItems,
      task
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getWorkItems
};
