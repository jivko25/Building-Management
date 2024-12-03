const pool = require("../../db");

const getWorkItems = async (req, res) => {
    const { task_id } = req.params;
    const { _page = 1, _limit = 4 } = req.query;

    const offset = (_page - 1) * _limit;

    try {
        const query = `
            SELECT 
                workItem.id AS id, 
                workItem.name AS name, 
                workItem.start_date AS start_date, 
                workItem.end_date AS end_date, 
                workItem.note AS note, 
                workItem.finished_work, 
                workItem.status AS status,
                task.name AS task_name, 
                artisan.name AS artisan_name, 
                task.price_per_measure, 
                task.total_price, 
                task.total_work_in_selected_measure,
                task.status AS task_status,
                task.id AS task_id
            FROM tbl_workitems workItem
            JOIN tbl_tasks task ON workItem.task_id = task.id
            LEFT JOIN tbl_artisans artisan ON task.artisan_id = artisan.id
            WHERE workItem.task_id = ?
            LIMIT ? OFFSET ?
        `;

        const [rows] = await pool.query(query, [task_id, parseInt(_limit), offset]);

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    getWorkItems
};