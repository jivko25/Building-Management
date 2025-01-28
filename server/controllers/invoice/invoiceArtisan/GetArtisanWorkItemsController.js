const db = require("../../../data/index.js");
const { WorkItem, Project, Activity, Measure } = db;

exports.getArtisanWorkItems = async (req, res) => {
  try {
    const { company_id, artisan_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (company_id) whereConditions.company_id = company_id;
    if (artisan_id) whereConditions.artisan_id = artisan_id;

    const { count, rows } = await WorkItem.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Project,
          attributes: ["id", "name", "location"]
        },
        {
          model: Activity,
          attributes: ["id", "name"]
        },
        {
          model: Measure,
          attributes: ["id", "name"]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]]
    });

    res.status(200).json({
      success: true,
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Error fetching artisan work items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch work items"
    });
  }
};
