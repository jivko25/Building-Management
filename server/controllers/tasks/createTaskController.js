const db = require('../../db');
const { getControllerIdByName } = require('../../utils/getControllerIdByName');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createTask = async (req, res) => {

    const projectId = req.params.id;
    const { name, artisan, activity, measure, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;

    try { 
        const isUnique = await uniqueChecker("name", name, "tbl_tasks");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const artisanId = await getControllerIdByName(artisan, "tbl_artisans");
        const activityId = await getControllerIdByName(activity, "tbl_activities");
        const measureId = await getControllerIdByName(measure, "tbl_measures");

        const query = 'INSERT INTO tbl_tasks(project_id, name, artisan_id, activity_id, measure_id, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        const values = [projectId, name, artisanId, activityId, measureId, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status];


        const [result] = await db.execute(query, values);

        const newTask = {
            id: result.insertId,
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
            status,
        };

        res.status(201).json({ message: 'Task created successfully!', task: newTask });

    } catch (error) {
        res.status(500).json({ message: 'Error creating the task!', error });
    }
};

module.exports = {
    createTask
};