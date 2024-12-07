const db = require('../../data/index.js');
const { WorkItem } = db;
const ApiError = require('../../utils/apiError');

const createWorkItem = async (req, res, next) => {
    const taskId = req.params.taskId;
    const { name, start_date, end_date, note, finished_work, status } = req.body;

    try {
        const existingWorkItem = await WorkItem.findOne({ where: { name } });
        
        if (existingWorkItem) {
            throw new ApiError(404, `${name} already exists!`);
        }

        const newWorkItem = await WorkItem.create({
            task_id: taskId,
            name,
            start_date,
            end_date,
            note,
            finished_work,
            status
        });

        res.status(201).json({ 
            message: 'Work item created successfully!', 
            workItem: newWorkItem 
        });
        
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error creating the work item!', error));
        }
    }
};

module.exports = {
    createWorkItem
};