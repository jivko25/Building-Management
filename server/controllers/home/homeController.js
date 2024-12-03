const pool = require('../../db');

const homePage = async (req, res) => {
    const userId = req.user.id;

    try {
        // Step 1: Fetch the artisan based on user_id
        const [artisan] = await pool.execute('SELECT * FROM tbl_artisans WHERE user_id = ?', [userId]);
        if (artisan.length === 0) {
            return res.status(404).json({ message: 'Artisan not found' });
        }
        const artisanId = artisan[0].id;

        // Step 2: Fetch all tasks for the artisan
        const [assignedTasks] = await pool.execute('SELECT * FROM tbl_tasks WHERE artisan_id = ?', [artisanId]);
        if (assignedTasks.length === 0) {
            return res.json({ message: 'No tasks assigned to this artisan' });
        }

        // Step 3: Fetch all projects associated with those tasks
        const projectIds = assignedTasks.map(task => task.project_id); // Extract project IDs
        const [assignedProjects] = await pool.execute(
            `SELECT * FROM tbl_projects WHERE id IN (${projectIds.join(',')})`
        );

        // Step 4: For each task, fetch the associated activity and work items
        const tasksWithDetails = await Promise.all(assignedTasks.map(async (task) => {
            const [activity] = await pool.execute('SELECT * FROM tbl_activities WHERE id = ?', [task.activity_id]);

            const [workItems] = await pool.execute('SELECT * FROM tbl_workItems WHERE task_id = ?', [task.id]);

            return {
                ...task,
                activity: activity[0] || null, // If no activity, return null
                workItems: workItems || [] // If no work items, return an empty array
            };
        }));

        // Step 5: Structure the result as a hierarchy: Project > Tasks > Activity > Work Items
        const result = assignedProjects.map(project => {
            return {
                ...project,
                tasks: tasksWithDetails.filter(task => task.project_id === project.id)
            };
        });

        // Step 6: Send the structured response to the frontend
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    homePage
};
