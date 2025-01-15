//server\controllers\activity\getActivitiesController.js
const db = require("../../data/index.js");
const Activity = db.Activity;
const Task = db.Task;
const Project = db.Project;
const { Op } = db.Sequelize;
const ApiError = require("../../utils/apiError");

const NO_PROJECTS_FOUND = "No projects found for current user";
const NO_TASKS_FOUND = "No tasks found for current user";
const NO_ACTIVITIES_FOUND = "No activities found for current user";
const getTasks = async (userId, isAdmin) => {
  if (isAdmin) {
    const tasks = await Task.findAll();
    return tasks;
  }
  const projects = await Project.findAll({
    where: {
      creator_id: userId
    }
  });
  if (projects.length === 0) {
    throw new ApiError(404, NO_PROJECTS_FOUND);
  }
  // Get all tasks for these projects
  const tasks = await Task.findAll({
    where: {
      project_id: {
        [Op.in]: projects.map(project => project.id)
      }
    }
  });
  if (tasks.length === 0) {
    throw new ApiError(404, NO_TASKS_FOUND);
  }
  return tasks;
};
const getPaginatedActivities = async (req, res, next) => {
  const { _page = 1, _limit = 10, q = "" } = req.query;
  const offset = (parseInt(_page) - 1) * parseInt(_limit);
  const isAdmin = req.user.role === "admin";

  try {
    const tasks = await getTasks(req.user.id, isAdmin);
    const whereClause = {
      ...(q && { name: { [Op.like]: `%${q}%` } }),
      ...(!isAdmin && {
        id: {
          [Op.in]: tasks.map(task => task.activity_id)
        }
      })
    };
    // Get paginated activities for these tasks
    const { count: total, rows: data } = await Activity.findAndCountAll({
      where: whereClause,
      limit: parseInt(_limit),
      offset: offset
    });

    if (data.length === 0) {
      throw new ApiError(404, NO_ACTIVITIES_FOUND);
    }
    res.json({
      data,
      total,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(total / parseInt(_limit))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

const getActivities = async (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  try {
    if (isAdmin) {
      const activities = await Activity.findAll();
      return res.json(activities);
    }
    // Get all tasks for projects where user is creator
    const tasks = await getTasks(req.user.id, isAdmin);
    // Get all activities for these tasks
    const activities = await Activity.findAll({
      where: {
        id: {
          [Op.in]: tasks.map(task => task.activity_id)
        }
      }
    });
    if (activities.length === 0) {
      throw new ApiError(404, NO_ACTIVITIES_FOUND);
    }
    res.json(activities);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

module.exports = {
  getPaginatedActivities,
  getActivities
};
