//server\controllers\home\getArtisanTaskProjectController.js
const db = require("../../data/index.js");
const { Task, Project, WorkItem, Company } = db;

const getTaskWithProject = async (req, res, next) => {
    const { taskId } = req.params;

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
                    ["location", "project_location"],
                    ["start_date", "project_start_date"],
                    ["end_date", "project_end_date"],
                    ["status", "project_status"]
                ]
            }
        ]
    });

    if (!taskProjectData) {
        return res.json([]);
    }

    const workItemsData = await WorkItem.findAll({
        where: { task_id: taskId }
    });

    return res.status(200).json({
        taskProjectData,
        workItemsData
    });
};

module.exports = {
    getTaskWithProject
};
