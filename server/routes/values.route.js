const express = require('express');
const router = express.Router();

const ValuesController = require('../controllers/values.controller');

router.get('/getEventTypes', ValuesController.get_event_types);

module.exports = router;
