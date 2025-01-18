//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Artisan, TasksArtisan } = db;
const { Op } = require("sequelize");

const getProjects = async (req, res, next) => {
  let whereClause = {};
  const isAdmin = req.user.role === "admin";

  if (isAdmin) {
    const projects = await Project.findAll();

    if (projects.length === 0) {
      return res.json([]);
    }

    return res.json(projects);
  }

  if (req.user.role === "user") {
    const artisan = await Artisan.findOne({ where: { user_id: req.user.id } });
    if (artisan) {
      const tasks = await TasksArtisan.findAll({ where: { artisan_id: artisan.id } });
      if (tasks.length === 0) {
        return res.json([]);
      }
      const taskIds = tasks.map(task => task.task_id);
      const projects = await Project.findAll({ where: { id: { [Op.in]: taskIds } } });
      if (projects.length === 0) {
        return res.json([]);
      }
      return res.json(projects);
    }
  }

  if (req.query.search) {
    whereClause = {
      ...whereClause,
      [Op.or]: [{ name: { [Op.like]: `%${req.query.search}%` } }, { company_name: { [Op.like]: `%${req.query.search}%` } }]
    };
  }

  whereClause.creator_id = req.user.id;

  const projects = await Project.findAll({
    attributes: ["id", "name", "company_id", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id"],
    where: whereClause,
    order: [["id", "DESC"]]
  });

  if (projects.length === 0) {
    return res.json([]);
  }

  res.json(projects);
};

module.exports = {
  getProjects
};
