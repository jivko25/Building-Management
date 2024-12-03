const pool = require('../../db');
const { getControllerIdByName } = require('../../utils/getControllerIdByName');

const editArtisan = async (req, res) => {

    const userId = req.params.id;
    const { name, note, number, email, company, artisanName, status } = req.body;

    try {
        const companyId = await getControllerIdByName(company, "tbl_companies");

        const user_id = await getControllerIdByName(artisanName, "tbl_users");

        const query = `UPDATE tbl_artisans
        SET name = ?, note = ?, number = ?, email = ?, company_id = ?, user_id = ?, status = ?
        WHERE id = ?`;

        const values = [name, note, number, email, companyId, user_id, status, userId];

        const [result] = await pool.execute(query, values);

        const updatedArtisan = {
            id: userId,
            name,
            note,
            number,
            email,
            company,
            companyId,
            user_id,
            status,
        };

        res.status(201).json({ message: 'Artisan updated successfully!', artisan: updatedArtisan });

    } catch (error) {
        res.status(500).json({ message: 'Error updating the artisan!', error });
    }
};

module.exports = {
    editArtisan
};