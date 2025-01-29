const db = require("../../data/index.js");
const { Task, WorkItem, Activity, Artisan } = db;

const getProjectSummary = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const workItems = await WorkItem.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: Task,
          as: 'task',
          include: [{ model: Activity, as: 'activity' }]
        },
        {
          model: Activity,
          as: 'activity',
        },
        {
          model: Artisan,
          as: 'artisan'
        }
      ]
    });

    const summary = workItems.reduce((acc, workItem) => {
      const activity = workItem.activity.name;
      const quantity = parseFloat(workItem.quantity || 0);
      const hours = parseFloat(workItem.hours || 0);
      const managerPrice = parseFloat(workItem.total_manager_price || 0);

      if (!acc[activity]) {
        acc[activity] = {
          activity,
          totalQuantity: 0,
          totalHours: 0,
          totalPrice: 0,
          isHourly: activity === "Hour"
        };
      }

      acc[activity].totalQuantity += quantity;
      acc[activity].totalHours += hours;
      acc[activity].totalPrice += managerPrice;

      return acc;
    }, {});

    res.json(Object.values(summary));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProjectSummary
}; 