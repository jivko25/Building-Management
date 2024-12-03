const pool = require("../../db");
const { getCurrentId } = require('../../utils/getCurrentId');
const { uniqueChecker } = require('../../utils/uniqueChecker');
const { getControllerIdByName } = require("../../utils/getControllerIdByName");

const editTask = async (req, res) => {
    const projectId = req.params.id;
    const taskId = req.params.taskId;
    
    const { name, artisan, activity, measure, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;
    
    try {
        const currentActivity = await getCurrentId("tbl_tasks", taskId);

        if (currentActivity.name !== name) {
            const isUnique = await uniqueChecker("name", name, "tbl_tasks");

            if (isUnique.length > 0) {
                return res.status(404).send(`${name} already exists!`)
            };
        };

        const artisanId = await getControllerIdByName(artisan, "tbl_artisans");
        const activityId = await getControllerIdByName(activity, "tbl_activities");
        const measureId = await getControllerIdByName(measure, "tbl_measures");

        const query = `
            UPDATE tbl_tasks
            SET name = ?, artisan_id = ?, activity_id = ?, measure_id = ?, price_per_measure = ?, total_price = ?, total_work_in_selected_measure = ?, start_date = ?, end_date = ?, note = ?, status = ?
            WHERE id = ?
        `;

        const values = [name, artisanId, activityId, measureId, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status, taskId];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found!' });
        }

        const updatedTask = {
            id: taskId,
            projectId,
            name,
            artisanId,
            activityId,
            measureId,
            price_per_measure,
            total_price,
            total_work_in_selected_measure,
            start_date,
            end_date,
            note,
            status
        };

        res.status(200).json({ message: 'Task updated successfully!', project: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the task!', error });
    }
};

module.exports = {
    editTask
};
