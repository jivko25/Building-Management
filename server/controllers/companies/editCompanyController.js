const pool = require("../../db");
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const editCompany = async (req, res) => {

    const company_id = req.params.id;
    const { name, number, address, mol, email, phone, dds, status } = req.body;

    try {
        const activity = await getCurrentId("tbl_companies", company_id);

        if (activity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_companies");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const query = 
        `UPDATE tbl_companies
        SET name = ?, number = ?, address = ?, mol = ?, email = ?, phone = ?, dds = ?, status = ?
        WHERE id = ?;`;

        const values = [name, number, address, mol, email, phone, dds, status, company_id];

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found!' });
        }

        const updatedCompany = {
            id: company_id,
            name, 
            number, 
            address, 
            mol, 
            email, 
            phone, 
            dds, 
            status
        };

        res.status(200).json({ message: 'Company updated successfully!', company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the company!', error });
    }
};

module.exports = {
    editCompany
};
