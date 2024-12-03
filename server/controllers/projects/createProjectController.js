const pool = require("../../db");
const { getControllerIdByName } = require("../../utils/getControllerIdByName");
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createProject = async (req, res) => {

    const { name, company_name, email, address, start_date, end_date, note, status } = req.body;
    
    try {
        const isUnique = await uniqueChecker("name", name, "tbl_projects");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const companyId = await getControllerIdByName(company_name, "tbl_companies");

        const query = `
            INSERT INTO tbl_projects (name, company_id, company_name, email, address, start_date, end_date, note, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [name, companyId, company_name, email, address, start_date, end_date, note, status];

        const [result] = await pool.query(query, values);

        const newProject = {
            id: result.insertId,
            name,
            companyId,
            email,
            address,
            start_date,
            end_date,
            note,
            status
        };

        res.status(201).json({ message: 'Project created successfully!', project: newProject });

    } catch (error) {
        res.status(500).json({ message: 'Error creating the project!', error });
    };
};

module.exports = {
    createProject
};