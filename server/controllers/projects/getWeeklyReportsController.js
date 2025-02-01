const db = require("../../data/index.js");
const { Task, WorkItem, Activity, Artisan } = db;
const { Op } = require('sequelize');

const getWeeklyReports = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { weekNumber } = req.query;
    
    // Валидация
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Изчисляваме началната и крайната дата на седмицата
    const startDate = getWeekStartDate(weekNumber);
    const endDate = getWeekEndDate(weekNumber);

    const workItems = await WorkItem.findAll({
      where: {
        project_id: projectId,
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            { 
              model: Activity,
              as: 'activity'
            }
          ]
        },
        {
          model: Activity,
          as: 'activity',
        },
        {
          model: Artisan,
          as: 'artisan'
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Първо групираме по дни и активити
    const dailyActivitySummary = workItems.reduce((acc, workItem) => {
      const date = workItem.created_at.toISOString().split('T')[0];
      const activity = workItem.activity.name;
      const quantity = parseFloat(workItem.quantity || 0);
      const managerPrice = parseFloat(workItem.total_manager_price || 0);

      if (!acc[date]) {
        acc[date] = {};
      }

      if (!acc[date][activity]) {
        acc[date][activity] = {
          totalQuantity: 0,
          totalPrice: 0,
          totalHours: 0,
          artisans: new Set(),
          tasks: new Set()
        };
      }

      acc[date][activity].totalQuantity += quantity;
      acc[date][activity].totalPrice += managerPrice;
      acc[date][activity].totalHours += parseFloat(workItem.hours || 0);
      acc[date][activity].artisans.add(workItem.artisan.name);
      acc[date][activity].tasks.add(workItem.task.name);

      return acc;
    }, {});

    // Форматираме резултата
    const result = {
      weekNumber,
      dailyActivities: Object.entries(dailyActivitySummary).map(([date, activities]) => ({
        date,
        activities: Object.entries(activities).map(([activity, data]) => ({
          activity,
          totalQuantity: data.totalQuantity,
          totalHours: data.totalHours,
          price: data.totalPrice / data.totalQuantity,
          total: data.totalPrice,
          artisans: Array.from(data.artisans),
          tasks: Array.from(data.tasks)
        })),
        totalPrice: Object.values(activities).reduce((sum, data) => 
          sum + data.totalPrice, 0)
      })),
      totalPrice: Object.values(dailyActivitySummary).reduce((sum, activities) => 
        sum + Object.values(activities).reduce((daySum, data) => 
          daySum + data.totalPrice, 0), 0)
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Помощни функции за изчисляване на дати
const getWeekStartDate = (weekNumber) => {
  const date = new Date();
  date.setDate(date.getDate() + (weekNumber - getWeekNumber(date)) * 7);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
};

const getWeekEndDate = (weekNumber) => {
  const date = getWeekStartDate(weekNumber);
  date.setDate(date.getDate() + 6);
  return date;
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - firstDayOfYear) / 86400000) + firstDayOfYear.getDay() + 1) / 7) - 1;
};

module.exports = {
  getWeeklyReports
}; 