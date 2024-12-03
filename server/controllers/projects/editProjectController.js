const pool = require("../../db");
const { getControllerIdByName } = require("../../utils/getControllerIdByName");
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const editProject = async (req, res) => {

    const projectId = req.params.id;
    const { name, company_name, email, address, start_date, end_date, note, status } = req.body;
    
    try {
        const activity = await getCurrentId("tbl_projects", projectId);

        if (activity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_projects");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const companyId = await getControllerIdByName(company_name, "tbl_companies");

        const query = `
            UPDATE tbl_projects
            SET name = ?, company_id = ?, company_name = ?, email = ?, address = ?, start_date = ?, end_date = ?, note = ?, status = ?
            WHERE id = ?
        `;

        const values = [name, companyId, company_name, email, address, start_date, end_date, note, status, projectId];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found!' });
        }

        const updatedProject = {
            id: projectId,
            name,
            companyId,
            company_name,
            email,
            address,
            start_date,
            end_date,
            note,
            status
        };

        res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the project!', error });
    }
};

module.exports = {
    editProject
};
