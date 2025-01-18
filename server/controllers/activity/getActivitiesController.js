//server\controllers\activity\getActivitiesController.js
const db = require("../../data/index.js");
const Activity = db.Activity;
const Task = db.Task;
const Project = db.Project;
const { Op } = db.Sequelize;

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
    return [];
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
    return [];
  }

  return tasks;
};

const getPaginatedActivities = async (req, res, next) => {
  const { _page = 1, _limit = 10, q = "" } = req.query;
  const offset = (parseInt(_page) - 1) * parseInt(_limit);
  const isAdmin = req.user.role === "admin";

  const whereClause = isAdmin
    ? {
        ...(q && { name: { [Op.like]: `%${q}%` } })
      }
    : {
        ...(q && { name: { [Op.like]: `%${q}%` } }),
        creator_id: req.user.id
      };

  // Get paginated activities for these tasks
  const { count: total, rows: data } = await Activity.findAndCountAll({
    where: whereClause,
    limit: parseInt(_limit),
    offset: offset
  });

  if (data.length === 0) {
    return res.json([]);
  }

  res.json({
    data,
    total,
    page: parseInt(_page),
    limit: parseInt(_limit),
    totalPages: Math.ceil(total / parseInt(_limit))
  });
};

const getActivities = async (req, res, next) => {
  const isAdmin = req.user.role === "admin";

  if (isAdmin) {
    const activities = await Activity.findAll();
    return res.json(activities);
  }

  // Get all activities for these tasks
  const activities = await Activity.findAll({
    where: {
      id: {
        [Op.in]: tasks.map(task => task.activity_id)
      }
    }
  });

  if (activities.length === 0) {
    return res.json([]);
  }

  res.json(activities);
};

module.exports = {
  getPaginatedActivities,
  getActivities
};
