const db = require('../../db');

const getArtisanTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const [artisanTasks] = await db.query(`
            SELECT tbl_tasks.*
            FROM tbl_tasks
            INNER JOIN tbl_artisans ON tbl_tasks.artisan_id = tbl_artisans.id
            WHERE tbl_artisans.user_id = ?
        `, [userId]);

        return res.status(200).json(artisanTasks);

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!'
        })
    }
};

module.exports = {
    getArtisanTasks
};
