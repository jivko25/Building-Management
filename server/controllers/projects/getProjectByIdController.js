//server\controllers\projects\getProjectByIdController.js
const db = require("../../data/index.js");
const { Project, Artisan, TasksArtisan, Task } = db;
const { Op } = require("sequelize");

const getProjectById = async (req, res, next) => {
    const isAdmin = req.user.role === "admin";
    if (isAdmin) {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.json([]);
        }
        return res.json(project);
    }

    const artisan = await Artisan.findOne({ where: { user_id: req.user.id } });
    if (artisan) {
        const tasksArtisan = await TasksArtisan.findAll({ where: { artisan_id: artisan.id } });
        if (tasksArtisan.length === 0) {
            return res.json([]);
        }
        const taskIds = tasksArtisan.map(task => task.task_id);
        const tasks = await Task.findAll({ where: { id: { [Op.in]: taskIds } } });

        const project = tasks.find(task => task.project_id === Number(req.params.id));
        if (!project) {
            return res.json([]);
        }
        return res.json(project);
    }

    const project = await Project.findByPk(req.params.id, { where: { creator_id: req.user.id } });
    if (!project) {
        return res.json([]);
    }

    res.json(project);
}

module.exports = {
    getProjectById
};
