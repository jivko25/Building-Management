//server\controllers\user\getUsersController.js
const db = require("../../data/index.js");
const User = db.User;
const { Op } = db.Sequelize;
const ApiError = require("../../utils/apiError");

const getUsers = async (req, res, next) => {
  console.log("Fetching users with role:", req.user.role);
  const { _page = 1, _limit = 10, q = "" } = req.query;
  const offset = (parseInt(_page) - 1) * parseInt(_limit);
  const searchTerm = q ? `%${q}%` : null;
  const currentUserId = req.user.id;

  try {
    const whereClause = buildWhereClause(req.user.role, currentUserId, searchTerm);
    console.log("Where clause:", whereClause);

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

    console.log("Found users count:", usersCount);
    res.status(200).json({
      users,
      usersCount,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(usersCount / parseInt(_limit))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(new ApiError(500, "Internal server error", error));
  }
};

function buildWhereClause(role, currentUserId, searchTerm) {
  const whereClause = {};

  if (role === "manager") {
    whereClause[Op.or] = [{ creator_id: currentUserId }, { id: currentUserId }];
  }

  if (searchTerm) {
    whereClause[Op.or] = [{ full_name: { [Op.like]: searchTerm } }, { username: { [Op.like]: searchTerm } }];
  }

  return whereClause;
}

module.exports = {
  getUsers
};
