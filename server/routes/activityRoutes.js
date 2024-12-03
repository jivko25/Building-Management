const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { getPaginatedActivities, getActivities } = require('../controllers/activity/getActivitiesController');
const { getActivityById } = require('../controllers/activity/getActivityByIdController');
const { createActivity } = require('../controllers/activity/createActivityController');
const { editActivity } = require('../controllers/activity/editActivitiyController');


const router = express.Router();

router.get('/activities', authenticateToken, getPaginatedActivities);
router.get('/activities', authenticateToken, getActivities);
router.get('/activities/:id', authenticateToken, getActivityById);
router.post('/activities/create', authenticateToken, createActivity);
router.put('/activities/:id/edit', authenticateToken, editActivity);


module.exports = router;