// server/controllers/user/getUsersController.js
const db = require("../../data/index.js");
const User = db.User;
const { Op } = db.Sequelize;
const ApiError = require("../../utils/apiError");

const getUsers = async (req, res, next) => {
  const { _page = 1, _limit = 10, q = "" } = req.query;
  const offset = (parseInt(_page) - 1) * parseInt(_limit);
  const searchTerm = q ? `%${q}%` : null;
  const currentUserId = req.user.id;

  try {
    const whereClause = buildWhereClause(req.user.role, currentUserId, searchTerm);

    const { count: usersCount, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["hashedPassword"] },
      limit: parseInt(_limit),
      offset: offset,
      order: [
        ["status", "ASC"],
        ["username", "ASC"]
      ]
    });

    res.status(200).json({
      users,
      usersCount,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(usersCount / parseInt(_limit))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error", error));
    }
  }
};

function buildWhereClause(role, currentUserId, searchTerm) {
  // Нека съберем всички подусловия в един обект чрез Op.and
  const clauses = [];

  // 1) Ако е "manager", показваме само потребители, които
  //    - са създадени от текущия (creator_id = currentUserId) ИЛИ
  //    - самия текущ потребител (id = currentUserId)
  if (role === "manager") {
    clauses.push({
      [Op.or]: [
        { creator_id: currentUserId },
        { id: currentUserId }
      ]
    });
  }

  // 2) Ако има търсене (searchTerm ≠ null), искаме да филтрираме по full_name или по username
  if (searchTerm) {
    clauses.push({
      [Op.or]: [
        { full_name: { [Op.like]: searchTerm } },
        { username: { [Op.like]: searchTerm } }
      ]
    });
  }

  // Ако няма нито едно подусловие, връщаме празен обект (няма допълнителен WHERE)
  if (clauses.length === 0) {
    return {};
  }

  // Ако имаме 1 условие, го връщаме директно:
  if (clauses.length === 1) {
    return clauses[0];
  }

  // Ако имаме 2 (или повече), комбинираме ги с Op.and:
  return {
    [Op.and]: clauses
  };
}

module.exports = {
  getUsers
};
