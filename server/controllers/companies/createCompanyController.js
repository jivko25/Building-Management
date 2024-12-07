const db = require('../../data/index.js');
const { Company } = db;
const ApiError = require('../../utils/apiError');

const createCompany = async (req, res, next) => {
    const { name, number, address, mol, email, phone, dds, status } = req.body;

    try {
        const existingCompany = await Company.findOne({ where: { name } });
        if (existingCompany) {
            throw new ApiError(400, `${name} already exists!`);
        }

        const newCompany = await Company.create({
            name, 
            number, 
            address, 
            mol, 
            email, 
            phone, 
            dds, 
            status
        });

        res.status(201).json({ 
            message: 'Company created successfully!', 
            company: newCompany 
        });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server Error!'));
        }
    }
};

module.exports = {
    createCompany
};