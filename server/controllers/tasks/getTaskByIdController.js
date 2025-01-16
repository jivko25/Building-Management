//server\controllers\tasks\getTaskByIdController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;

const getTaskById = async (req, res, next) => {
	const task = await Task.findByPk(req.params.taskId, {
		include: [
			{
				model: Artisan,
				as: "artisans",
				through: { attributes: [] }
			},
			{ model: Activity, as: "activity", attributes: ["name"] },
			{ model: Measure, as: "measure", attributes: ["name"] }
		]
	});

	if (!task) {
		return res.json([]);
	}
	res.json(task);
};

module.exports = {
	getTaskById
};
