const pool = require('../../db');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createWorkItem = async (req, res) => {

    const taskId = req.params.task_id;
    
    const { name, start_date, end_date, note, finished_work, status } = req.body;

    try { 
        const isUnique = await uniqueChecker("name", name, "tbl_workItems");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const query = 'INSERT INTO tbl_workItems(task_id, name, start_date, end_date, note, finished_work, status) VALUES(?, ?, ?, ?, ?, ?, ?)';

        const values = [taskId, name, start_date, end_date, note, finished_work, status];

        const [result] = await pool.execute(query, values);

        const newWorkItem = {
            id: result.insertId,
            taskId,
            name,
            start_date,
            end_date,
            note,
            finished_work,
            status
        };

        res.status(201).json({ message: 'Work item created successfully!', workItem: newWorkItem });
        
    } catch (error) {
        res.status(500).json({ message: 'Error creating the work item!', error });
    }
};

module.exports = {
    createWorkItem
};