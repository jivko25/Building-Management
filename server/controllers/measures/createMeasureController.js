const pool = require('../../db');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createMeasure = async (req, res) => {

    const name = req.body.name;

    try {
        const isUnique = await uniqueChecker("name", name, "tbl_measures");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const query = 'INSERT INTO tbl_measures(name) VALUES(?)';

        const values = [name];

        const [result] = await pool.execute(query, values);

        const newMeasure = {
            id: result.insertId,
            name
        };

        res.status(201).json({ message: 'Measure created successfully!', measure: newMeasure });

    } catch (error) {
        res.status(500).json({ message: 'Error creating the measure!', error });
    };
};

module.exports = {
    createMeasure
};