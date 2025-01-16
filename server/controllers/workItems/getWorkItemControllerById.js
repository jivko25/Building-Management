//server\controllers\workItems\getWorkItemControllerById.js
const db = require("../../data/index.js");
const { WorkItem } = db;

const getWorkItemById = async (req, res, next) => {
    const workItemId = req.params.id;

    const workItem = await WorkItem.findByPk(workItemId);

    if (!workItem) {
        return res.json([]);
    }

    res.json(workItem);
};

module.exports = {
    getWorkItemById
};
