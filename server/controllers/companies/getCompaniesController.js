//server\controllers\companies\getCompaniesController.js
const db = require("../../data/index.js");
const { Company, Sequelize, Project } = db;
const ApiError = require("../../utils/apiError");
const { Op } = Sequelize;

const getPaginatedCompanies = async (req, res, next) => {
  try {
    console.log("Getting paginated companies for user:", req.user.id);
    const { _page = 1, _limit = 10, q = "" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
      const whereClause = q
        ? {
            name: {
              [Op.like]: `%${q}%`
            }
          }
        : {};

      const { count, rows } = await Company.findAndCountAll({
        where: whereClause,
        limit: parseInt(_limit),
        offset: offset,
        order: [["id", "DESC"]]
      });

      console.log(`Admin: Found ${count} companies`);
      return res.json({
        companies: rows,
        companiesCount: count,
        page: parseInt(_page),
        limit: parseInt(_limit),
        totalPages: Math.ceil(count / parseInt(_limit))
      });
    }

    // For non-admin users
    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if (projects.length === 0) {
      console.log("No projects found for user");
      return res.json({
        companies: [],
        companiesCount: 0,
        page: parseInt(_page),
        limit: parseInt(_limit),
        totalPages: 0
      });
    }

    const whereClause = q
      ? {
          id: {
            [Op.in]: projects.map(project => project.company_id)
          },
          name: {
            [Op.like]: `%${q}%`
          }
        }
      : {
          id: {
            [Op.in]: projects.map(project => project.company_id)
          }
        };

    const { count, rows } = await Company.findAndCountAll({
      where: whereClause,
      limit: parseInt(_limit),
      offset: offset,
      order: [["id", "DESC"]]
    });

    console.log(`Found ${count} companies for user`);
    res.json({
      companies: rows,
      companiesCount: count,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(count / parseInt(_limit))
    });
  } catch (error) {
    console.error("Error in getPaginatedCompanies:", error);
    next(new ApiError(500, "Internal server error"));
  }
};

module.exports = {
  getPaginatedCompanies
};
