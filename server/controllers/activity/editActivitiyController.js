const pool = require('../../db');
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const editActivity = async (req, res) => {

    const activityId = req.params.id;
    const { name, status } = req.body;

    try {
        const activity = await getCurrentId("tbl_activities", activityId);

        if (activity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_activities");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const query = `UPDATE tbl_activities SET name = ?, status = ? WHERE id = ?`;

        const values = [name, status, activityId];

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Activity not found!' });
        };

        const updatedActivity = {
            id: activityId,
            name,
            status,
        };

        res.status(200).json({ message: 'Activity updated successfully!', activity: updatedActivity });

    } catch (error) {
        res.status(500).json({ message: 'Error updating the activity!', error });
    }
}

module.exports = {
    editActivity
}