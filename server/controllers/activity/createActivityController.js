const pool = require('../../db');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createActivity = async (req, res) => {

    const { name, status } = req.body;

    try {
        const isUnique = await uniqueChecker("name", name, "tbl_activities");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const query = 'INSERT INTO tbl_activities(name, status) VALUES (?, ?)';

        const values = [name, status];
        const [result] = await pool.execute(query, values);

        const newActivity = {
            id: result.insertId,
            name,
            status,
        };

        res.status(201).json({ message: 'Activity created successfully!', activity: newActivity });

    } catch (error) {
        res.status(500).json({ message: 'Error creating the activity!', error });
    }
};

module.exports = {
    createActivity
};