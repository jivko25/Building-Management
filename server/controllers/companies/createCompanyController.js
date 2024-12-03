const pool = require('../../db');
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createCompany = async (req, res) => {

    const { name, number, address, mol, email, phone, dds, status } = req.body;

    try {
        const isUnique = await uniqueChecker("name", name, "tbl_companies");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const query = 
        `INSERT INTO 
        tbl_companies(name, number, address, mol, email, phone, dds, status)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [name, number, address, mol, email, phone, dds, status];
        const [result] = await pool.execute(query, values);

        const newCompany = {
            id: result.insertId,
            name, 
            number, 
            address, 
            mol, 
            email, 
            phone, 
            dds, 
            status
        };

        res.status(201).json({ message: 'Company created successfully!', company: newCompany  });

    } catch (error) {
        res.status(500).json({ message: 'Error creating the company!', error });
    }
};

module.exports = {
    createCompany
};