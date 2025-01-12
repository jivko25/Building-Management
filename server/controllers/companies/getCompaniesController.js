//server\controllers\companies\getCompaniesController.js
const db = require("../../data/index.js");
const { Company, Sequelize, Project } = db;
const ApiError = require("../../utils/apiError");
const { Op } = Sequelize;

const getPaginatedCompanies = async (req, res, next) => {
  try {
    const { _page = 1, _limit = 10, q = "" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const isAdmin = req.user.role === "admin";

    if(isAdmin){
      const whereClause = q
      ? {
          name: {
            [Op.like]: `%${q}%`
          }
        }
      : {};

      const companies = await Company.findAll({
        where: whereClause,
        limit: parseInt(_limit),
        offset: offset
      });

      return res.json({
        companies: companies,
        companiesCount: companies.length,
        page: parseInt(_page),
        limit: parseInt(_limit),
        totalPages: Math.ceil(companies.length / parseInt(_limit))
      });
    }

    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if(projects.length === 0){
      throw new ApiError(404, "No projects found for current user");
    }

    const whereClause = q
      ? {
          id: {
            [Op.in]: projects.map((project) => project.company_id)
          },
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

    res.json({
      companies: rows,
      companiesCount: count,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(count / parseInt(_limit))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

module.exports = {
  getPaginatedCompanies
};
