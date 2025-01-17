//server\controllers\workItems\getWorkItemsController.js
const db = require("../../data/index.js");
const { WorkItem, Task, Artisan } = db;
const ApiError = require("../../utils/apiError");

const getWorkItems = async (req, res, next) => {
  const { task_id } = req.params;
  const { _page = 1, _limit = 4 } = req.query;

  const offset = (_page - 1) * _limit;

  try {
    console.log("Fetching work items for task_id:", task_id);

    const workItems = await WorkItem.findAndCountAll({
      where: { task_id },
      include: [
        {
          model: Task,
          as: "task",
          attributes: ["name", "price_per_measure", "total_price", "total_work_in_selected_measure", "status"],
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

    console.log("Successfully fetched work items:", workItems.count);

    res.json({
      workItems: workItems.rows,
      workItemsCount: workItems.count,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(workItems.count / parseInt(_limit))
    });
  } catch (error) {
    console.log("Error fetching work items:", error);
    next(new ApiError(500, "Internal server Error!"));
  }
};

module.exports = {
  getWorkItems
};
