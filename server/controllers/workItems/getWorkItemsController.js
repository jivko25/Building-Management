//server\controllers\workItems\getWorkItemsController.js
const db = require("../../data/index.js");
const { WorkItem, Task, Artisan, Project } = db;
const ApiError = require("../../utils/apiError");

const getWorkItems = async (req, res, next) => {
  const { task_id } = req.params;
  const { _page = 1, _limit = 4 } = req.query;

  const offset = (_page - 1) * _limit;
  const isAdmin = req.user.role === "admin";

  try {
    if (isAdmin) {
      const workItems = await WorkItem.findAll({
        where: {
          task_id
        },
        limit: parseInt(_limit),
        offset: offset,
        order: [["id", "DESC"]]
      });
      return res.json(workItems);
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

    const workItems = await WorkItem.findAndCountAll({
      where: { task_id: { [Op.in]: taskIds } },
      include: [
        {
          model: Task,
          as: "task",
          attributes: ["name", "total_price", "total_work_in_selected_measure", "status"],
          include: [
            {
              model: Artisan,
              as: "artisans",
              attributes: ["name"]
            }
          ]
        }
      ],
      limit: parseInt(_limit),
      offset: offset,
      order: [["id", "DESC"]]
    });

    res.json({
      workItems: workItems.rows,
      workItemsCount: workItems.count,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(workItems.count / parseInt(_limit))
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
  getWorkItems
};
