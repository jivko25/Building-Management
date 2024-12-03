const db = require('../../db');

const getTaskWithProject = async (req, res) => {
    const { taskId } = req.params;

    try {
        const [taskProjectData] = await db.query(
            `SELECT tbl_tasks.*, 
                tbl_projects.name AS project_name, 
                tbl_projects.company_name AS project_company_name,
                tbl_projects.address as project_address,
                tbl_projects.start_date AS project_start_date,
                tbl_projects.end_date AS project_end_date,
                tbl_projects.status AS project_status
            FROM tbl_tasks 
            INNER JOIN tbl_projects ON tbl_tasks.project_id = tbl_projects.id
            WHERE tbl_tasks.id = ?`,
            [taskId]
        );

        if (!taskProjectData.length) {
            return res.status(404).json({
                message: "Task not found!"
            });
        }

        const [workItemsData] = await db.query(
            `SELECT * FROM tbl_workItems where task_id = ?`, [taskId]
        );

        const data = {
            taskProjectData: taskProjectData[0],
            workItemsData
        };

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!'
        });
    }
};

module.exports = {
    getTaskWithProject
};


