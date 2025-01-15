const { raw } = require("express");
const db = require("../../data/index.js");
const { Project, Company } = db;

const getMyProjects = async (req, res, next) => {
  const role = req.user.role;

  if (role !== "manager" && role !== "admin") {
    return res.status(403).json({ message: "You are not authorized to view this page" });
  }
  try {
    const managerId = req.user.id;
    const projects = await Project.findAll({
      attributes: ["id", "name"],
      where: {
        creator_id: managerId
      },
      include: [],
      raw: true
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error);
  }
};
module.exports = { getMyProjects };
