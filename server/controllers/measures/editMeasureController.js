const pool = require("../../db");
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const editMeasure = async (req, res) => {

    const measureId = req.params.id;
    const name = req.body.name;

    try {
        const activity = await getCurrentId("tbl_measures", measureId);

        if (activity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_measures");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const query = 'UPDATE tbl_measures SET name = ? WHERE ID = ?';

        const values = [name, measureId];

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Measure not found!' });
        };

        const updatedMeasure = {
            id: measureId,
            name
        };

        res.status(200).json({ message: 'Measure updated successfully!', measure: updatedMeasure });

    } catch (error) {
        res.status(500).json({ message: 'Error updating the measure!', error });
    };
};

module.exports = {
    editMeasure
};