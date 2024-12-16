//server\controllers\companies\editCompanyController.js
const db = require('../../data/index.js');
const { Company } = db;
const ApiError = require('../../utils/apiError');

const editCompany = async (req, res, next) => {
    const companyId = req.params.id;
    const { name, number, address, mol, email, phone, dds, status } = req.body;

    try {
        const company = await Company.findByPk(companyId);
        
        if (!company) {
            throw new ApiError(404, 'Company not found!');
        }

        if (company.name !== name) {
            const existingCompany = await Company.findOne({ where: { name } });
            if (existingCompany) {
                throw new ApiError(400, `${name} already exists!`);
            }
        }

        const updatedCompany = await company.update({
            name, 
            number, 
            address, 
            mol, 
            email, 
            phone, 
            dds, 
            status
        });

        res.json({ 
            message: 'Company updated successfully!', 
            company: updatedCompany 
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
    editCompany
};