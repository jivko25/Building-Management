//server\controllers\companies\getCompanyByIdController.js
const db = require("../../data/index.js");

const { Company } = db;

const getCompanyById = async (req, res, next) => {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
        return res.json([]);
    }

    res.json(company);
};

module.exports = {
    getCompanyById
};
