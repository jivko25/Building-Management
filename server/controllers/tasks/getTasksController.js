const pool = require("../../db");

const getTasks = async (req, res) => {

    const projectId = req.params.id;

    try {
        const query = `
        SELECT 
            task.id, 
            task.name AS name, 
            task.price_per_measure AS price_per_measure, 
            task.total_price AS total_price, 
            task.total_work_in_selected_measure AS total_work_in_selected_measure,
            task.start_date AS start_date,
            task.end_date AS end_date,
            task.note AS note,
            task.status AS status,
            artisan.name AS artisan, 
            activity.name AS activity, 
            measure.name AS measure
        FROM tbl_tasks task
        LEFT JOIN tbl_artisans artisan ON task.artisan_id = artisan.id
        LEFT JOIN tbl_activities activity ON task.activity_id = activity.id
        LEFT JOIN tbl_measures measure ON task.measure_id = measure.id
        WHERE task.project_id = ?;
    `;
        const [rows] = await pool.query(query, [projectId]);
        res.json(rows);

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    getTasks
};