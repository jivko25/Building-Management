const pool = require("../../db");
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const editWorkItem = async (req, res) => {

    const workItemId = req.params.id;
    const taskId = req.params.task_id;

    const { name, start_date, end_date, note, finished_work, status } = req.body;

    try {
        const activity = await getCurrentId("tbl_workItems", workItemId);

        if (activity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_workItems");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const query = `
            UPDATE tbl_workItems
            SET task_id = ?, name = ?, start_date = ?, end_date = ?, note = ?, finished_work = ?, status = ?
            WHERE id = ?
        `;

        const values = [taskId, name, start_date, end_date, note, finished_work, status, workItemId];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Work item not found!' });
        }

        const updatedWorkItem = {
            id: workItemId,
            taskId,
            name,
            start_date,
            end_date,
            note,
            finished_work,
            status
        };

        res.status(200).json({ message: 'Work item updated successfully!', project: updatedWorkItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the work item!', error });
    }
};

module.exports = {
    editWorkItem
};
