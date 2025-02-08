//server\controllers\activity\getActivitiesController.js
const db = require("../../data/index.js");
const { Activity, Task, Project } = db;
const ApiError = require("../../utils/apiError");
const { Op } = db.Sequelize;

const NO_PROJECTS_FOUND = "No projects found for current user";
const NO_TASKS_FOUND = "No tasks found for current user";
const NO_ACTIVITIES_FOUND = "No activities found for current user";

const getTasks = async (userId, isAdmin) => {
  console.log("Getting tasks for user:", userId);

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
  try {
    console.log("Getting paginated activities for user:", req.user.id);
    const { _page = 1, _limit = 10, q = "" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const isAdmin = req.user.role === "admin";

    console.log(q, "q");
    

    // Променяме where клаузата за да показва всички activities

    const whereClause = isAdmin
      ? { 
          [Op.and]: [
            {
              [Op.or]: [
                { id: 1 }, // Винаги включваме activity с id=1
                ...(q ? [{ name: { [Op.like]: `%${q}%` } }] : [])
              ]
            }
          ]
        }
      : {
          [Op.and]: [
            {
              [Op.or]: [
                { id: 1 }, // Винаги включваме activity с id=1
                { creator_id: req.user.id },
                { id: { [Op.in]: await getActivityIdsFromTasks(req.user.id) } }
              ]
            },
            ...(q ? [{ name: { [Op.like]: `%${q}%` } }] : [])
          ]
        };

    let { count: total, rows: data } = await Activity.findAndCountAll({
      where: whereClause,
      limit: parseInt(_limit),
      offset: offset,
      include: [
        {
          model: Task,
          as: "tasks",
          required: false
        }
      ]
    });

    res.json({
      data,
      total,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(total / parseInt(_limit))
    });
  } catch (error) {
    console.error("Error in getPaginatedActivities:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

const getActivities = async (req, res, next) => {
  try {
    console.log("Getting all activities for user:", req.user.id);
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
      const activities = await Activity.findAll({
        include: [
          {
            model: Task,
            as: "tasks",
            required: false
          }
        ]
      });
      return res.json(activities);
    }

    const tasks = await getTasks(req.user.id, isAdmin);

    // Променяме логиката за филтриране
    const activityIds = [...new Set(tasks.map(task => task.activity_id))];

    const activities = await Activity.findAll({
      where: {
        id: activityIds
      },
      include: [
        {
          model: Task,
          as: "tasks",
          required: false
        },
        {
          model: Project,
          as: "projects",
          through: { attributes: [] }
        }
      ]
    });

    if (activities.length === 0) {
      throw new ApiError(404, NO_ACTIVITIES_FOUND);
    }

    console.log(`Found ${activities.length} activities`);
    res.json(activities);
  } catch (error) {
    console.error("Error in getActivities:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

// Добавяме помощна функция
async function getActivityIdsFromTasks(userId) {
  const tasks = await getTasks(userId, false);
  return [...new Set(tasks.map(task => task.activity_id))];
}

module.exports = {
  getPaginatedActivities,
  getActivities
};
