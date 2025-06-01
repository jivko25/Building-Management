// server/controllers/companies/getCompaniesController.js
const db = require("../../data/index.js");
const { Company, Project, Sequelize } = db;
const { Op } = Sequelize;
const ApiError = require("../../utils/apiError");

const getPaginatedCompanies = async (req, res, next) => {
  const { _page = 1, _limit = 10, q = "" } = req.query;
  const page = parseInt(_page, 10);
  const limit = parseInt(_limit, 10);
  const offset = (page - 1) * limit;
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  try {
    if (isAdmin) {
      // За админа: показваме всички компании (филтрираме само по име, ако e подадено q)
      const whereAdmin = q
        ? { name: { [Op.like]: `%${q}%` } }
        : {};

      const { count: totalCount, rows: companies } = await Company.findAndCountAll({
        where: whereAdmin,
        limit,
        offset,
        order: [["name", "ASC"]], // примерно сортиране по име
      });

      return res.json({
        companies,
        companiesCount: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      });
    }

    // Ако не е админ:  
    //  1) Изваждаме всички company_id-та от проекти, които този потребител е създал
    const projects = await Project.findAll({
      where: { creator_id: userId },
      attributes: ["company_id"],
      raw: true,
    });
    const companyIds = [...new Set(projects.map((p) => p.company_id))];

    //  2) Съставяме общия where, който трябва да отговаря на:
    //     (A) Company.creator_id = userId   OR   (B) Company.id IN (companyIds)
    //     и към това прибавяме (C) Company.name LIKE '%q%'   ако q !== ""
    //
    //    (A) и (B) се обединяват чрез [Op.or], а резултатът + (C) чрез [Op.and], ако има търсене.
    const orCondition = {
      [Op.or]: [
        { creator_id: userId }, // (A) компании, създадени от този потребител…
        ...(companyIds.length
          ? [{ id: { [Op.in]: companyIds } }] // (B) компании, в които има проекти на този потребител…
          : [])
      ],
    };

    // Ако няма крайни companyIds (т.е. companyIds.length === 0), пак оставяме
    // (A) условието, защото все пак може да е създал няколко компании, дори без
    // да има свързани проекти (или обратно).
    // Ако искате строг резултат „само компании, където има проекти“, махнете `{ creator_id: userId }` от [Op.or].
    // Тук оставяме и двете възможности.

    // Сега, ако има q, правим AND с филтъра по име:
    let whereUser = orCondition;
    if (q) {
      whereUser = {
        [Op.and]: [
          orCondition,
          { name: { [Op.like]: `%${q}%` } }
        ]
      };
    }

    // 3) Правим findAndCountAll с този whereUser:
    const { count: totalCount, rows: companies } = await Company.findAndCountAll({
      where: whereUser,
      limit,
      offset,
      order: [["id", "DESC"]], // или друг ред според нуждите
    });

    return res.json({
      companies,
      companiesCount: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(500, "Internal server error", error));
  }
};

module.exports = {
  getPaginatedCompanies,
};
