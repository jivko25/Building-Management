const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, Activity, Task, Artisan, Project } = db;
const ApiError = require("../../utils/apiError");

const getManagerReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = {
      ...(startDate && endDate ? {
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      } : {})
    };

    const workItems = await WorkItem.findAll({
      where: whereClause,
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            { 
              model: Activity,
              as: 'activity'
            },
            {
              model: Project,
              as: 'project'
            }
          ]
        },
        {
          model: Activity,
          as: 'activity'
        }
      ]
    });

    // Групиране по проект и активити
    const reportsByActivity = workItems.reduce((acc, workItem) => {
      const activity = workItem.activity.name;
      const projectId = workItem.task.project.id;
      const projectName = workItem.task.project.name;
      const key = `${projectId}-${activity}`;

      if (!acc[key]) {
        acc[key] = {
          activity,
          project_id: projectId,
          project_name: projectName,
          totalQuantity: 0,
          totalManagerPrice: 0,
          totalArtisanPriceUnpaid: 0,
          totalArtisanPricePaid: 0,
          workItems: []
        };
      }

      acc[key].totalQuantity += parseFloat(workItem.quantity || 0);
      acc[key].totalManagerPrice += parseFloat(workItem.total_manager_price || 0);
      
      if (workItem.is_paid) {
        acc[key].totalArtisanPricePaid += parseFloat(workItem.total_artisan_price || 0);
      } else {
        acc[key].totalArtisanPriceUnpaid += parseFloat(workItem.total_artisan_price || 0);
      }

      return acc;
    }, {});

    // Форматиране на резултата
    const reports = Object.values(reportsByActivity).map(report => ({
      activity: report.activity,
      project_id: report.project_id,
      project_name: report.project_name,
      totalQuantity: report.totalQuantity,
      totalManagerPrice: report.totalManagerPrice.toFixed(2),
      totalArtisanPrice: report.totalArtisanPriceUnpaid.toFixed(2),
      totalArtisanPricePaid: report.totalArtisanPricePaid.toFixed(2),
      totalProfit: (report.totalManagerPrice - report.totalArtisanPricePaid).toFixed(2)
    }));

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getManagerReports
};