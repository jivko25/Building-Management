const pool = require("../../db");

const getWorkItemById = async (req, res) => {
    const workItemId = req.params.itemId;

    try {
        
        const [rows] = await pool.execute('SELECT * FROM tbl_workItems WHERE id = ?', [workItemId])

        if (rows.length === 0) {
            return res.status(404).send('Work item not found!')
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).send('Internal server Error!');
    }
};

module.exports = {
    getWorkItemById
};