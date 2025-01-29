const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, Activity } = db;
const ApiError = require("../../utils/apiError");

const getManagerReports = async (req, res, next) => {
  const workItems = await WorkItem.findAll();

  if (!workItems || workItems.length === 0) {
    throw new ApiError(404, "Work items not found!");
  }

  const groupedData = {};

  await Promise.all(workItems.map(async (workItem) => {
    const { activity_id, project_id, quantity, total_manager_price, total_artisan_price, is_paid } = workItem;

    const activity = await Activity.findOne({
      where: { id: activity_id }
    });

    const activityKey = activity ? activity.name : "Unknown Activity";
    const projectKey = project_id;

    if (!groupedData[activityKey]) {
      groupedData[activityKey] = {};
    }

    if (!groupedData[activityKey][projectKey]) {
      groupedData[activityKey][projectKey] = {
        totalQuantity: 0,
        totalManagerPrice: 0,
        totalArtisanPrice: 0,
        totalArtisanPricePaid: 0
      };
    }

    groupedData[activityKey][projectKey].totalQuantity += parseInt(quantity);

    const totalArtisanPrice = parseFloat(total_artisan_price);
    const totalManagerPrice = parseFloat(total_manager_price);

    if (!isNaN(totalArtisanPrice)) {
      groupedData[activityKey][projectKey].totalArtisanPrice += totalArtisanPrice;
      if (is_paid) {
        groupedData[activityKey][projectKey].totalArtisanPricePaid += totalArtisanPrice;
      }
    }

    if (!isNaN(totalManagerPrice)) {
      groupedData[activityKey][projectKey].totalManagerPrice += totalManagerPrice;
    }
  }));

  const result = [];

  for (const activityKey in groupedData) {
    for (const projectKey in groupedData[activityKey]) {
      const data = groupedData[activityKey][projectKey];
      const totalProfit = data.totalManagerPrice + data.totalArtisanPrice;

      result.push({
        activity: activityKey,
        project_id: projectKey,
        totalQuantity: data.totalQuantity,
        totalManagerPrice: data.totalManagerPrice.toFixed(2),
        totalArtisanPrice: data.totalArtisanPrice.toFixed(2),
        totalArtisanPricePaid: data.totalArtisanPricePaid.toFixed(2),
        totalProfit: totalProfit.toFixed(2)
      });
    }
  }

  res.json(result);
};

module.exports = {
  getManagerReports
};