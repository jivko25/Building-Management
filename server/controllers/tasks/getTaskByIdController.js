const pool = require("../../db");
const { getControllerNameById } = require('../../utils/getControllerNameById');

const getTaskById = async (req, res) => {
    const taskId = req.params.taskId;

    try {

        const [rows] = await pool.execute('SELECT * FROM tbl_tasks WHERE id = ?', [taskId])

        if (rows.length === 0) {
            return res.status(404).send('Task not found!')
        }

        const task = rows[0];
        const activityName = await getControllerNameById(task.activity_id, "tbl_activities", "name");
        const artisanName = await getControllerNameById(task.artisan_id, "tbl_artisans", "name");
        const measureName = await getControllerNameById(task.measure_id, "tbl_measures", "name");

        const taskWithNames = {
            ...task,
            activityName,
            artisanName,
            measureName,
        };

        console.log(taskWithNames);

        res.json(taskWithNames);

    } catch (error) {
        res.status(500).send('Internal server Error!');
    }
};

module.exports = {
    getTaskById
};