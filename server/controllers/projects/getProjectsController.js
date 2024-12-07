const db = require('../../data/index.js');
const { Project, Company } = db;

const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.findAll({
            include: [{
                model: Company,
                as: 'company',
                attributes: ['name', 'id']
            }],
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: projects
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects
};